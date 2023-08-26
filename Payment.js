const User =require("../models/User");
const {instance} =require("../config/razerpay");
const Course =require("../models/Course");
const mailSender =require("../utils/mailSender");
const { courseEnrollmentEmail}= require("../mail/courseEnrollmentEmail");
const { mongoose } = require("mongoose");
const { paymentSuccessEmail} = require("../mail/paymentSuccessEmail")
const crypto = require("crypto")

const CourseProgress = require("../models/CourseProgress")
//capture the payment and initiate the razerpay

exports.capturePayment = async(req,res) =>{
    const {courses} = req.body;
    const userId = req.user.id;
    console.log("oonnn",userId);
    if(courses.length === 0){
        return res.json({success:false,message:"please provide course Id"});
    }
    console.log("iojfjkfsncksncknsfk");
    let totalAmount = 0;
   // console.log("okfoeoe",courses);
    for(const course_id in courses){
        let course;
        try{
           console.log("hello",courses[course_id]);
            course = await Course.findById(courses[course_id]);
          //  console.log("vriiovmv",course);
            if(!course){
                return res.status(200).json({success:false, message:"Could not find the course"});

            }
            console.log("kljklk",course)
            const uid =new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }
            totalAmount += course.price;
        }
        catch(error){
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }
    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message: paymentResponse,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }
}

exports.verifyPayment = async(req,res) =>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    //console.log("razerpay order id",razorpay_order_id)
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    //console.log("razerpay_paymentId",razorpay_payment_id)
    //const razorpay_signature = req.body?.razorpay_signature;
    console.log("razerpay sign",razorpay_signature);
    const courses = req.body?.courses;
    const userId = req.user.id;
     if(!razorpay_order_id ||
        !razorpay_signature ||
        !razorpay_payment_id ||
        !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
         }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const RAZORPAY_SECRET ="gc4hdPd7hpgB3IK421WDeR1v";
    console.log("hello bhai")
    const expectedSignature = crypto
                               .createHmac("sha256",RAZORPAY_SECRET)
                               .update(body.toString())
                               .digest("hex");
                               

    if(expectedSignature ===  razorpay_signature){
        console.log("match ho gaya ha ");
        await enrollStudent(courses,userId,res);

        return res.status(200).json({success:true, message:"Payment Verified"});       
    }
    return res.status(200).json({success:"false", message:"Payment Failed"});
}


exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }

  const enrollStudent = async (courses,userId,res) =>{
    if (!courses || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide Course ID and User ID" })
      }
      for (const courseId of courses){
        try{
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push: {studentsEnrolled:userId}},
            {new: true}
        )
        if(!enrolledCourse) {
            return res
              .status(500)
              .json({success:false, error: 'course not found'})
        }
        console.log("updated courses: ",enrolledCourse);

        const courseProgress = await CourseProgress.create(
            {
                courseId:courseId,
                userId:userId,
                completedVideos :[],
            }

        )
        const enrolledStudent = await User.findByIdAndUpdate(
            userId,
        {
            $push:{
                courses: courseId,
                courseProgress: CourseProgress._id,
            },
        },{new:true}
        )
        console.log("Enrolled student: ", enrolledStudent)
        const emailResponse  = await mailSender(
            enrolledStudent.email,
            `Sucess Errolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(
                enrolledCourse.courseName,
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
            )
        )
        console.log("Email sent successfully: ", emailResponse.response)

        }
        catch(error){
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
      }
  }
