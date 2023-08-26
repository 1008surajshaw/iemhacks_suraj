const RatingAndReview =require("../models/RatingAndReview");
const Course =require("../models/Course");
const User =require("../models/User");
const { default: mongoose } = require("mongoose");

//createRating

exports.createRating =async (req,res) =>{
    try{
       const {courseId,review,rating} =req.body;
       const userid =req.user.id;
       const courseDetails =await Course.findOne(
                                                 {_id:courseId,
                                                studentsEnrolled:{$eleMatch: {$eq:userid}}
                                            } );

    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:"student is not enrolled",
        })
    }
    const alreadyReview =await RatingAndReview.findOne({
                                               user:userid,
                                               course:courseId,
    });

    if(alreadyReview){
        return res.status(403).json({
            success:false,
            message:"you are already review"
        })
    }

    const ratingReview =await RatingAndReview.create({
                                                rating,
                                                review,
                                                course:courseId,
                                                user:userid,
    });
   const updatedCourseDetails = await Course.findByIdAndUpdate(
                                   {_id:courseId},
                             {
                             $push:{
                                ratingAndReview:ratingReview._id,
                            }
                             },{new:true}
    )

    console.log(updatedCourseDetails);

    return res.status(200).json({
        success:true,
        message:"rating and review succesfully"
    })
    }
    catch(error){
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"come in catch block"
    })
    }
}

//getAllRating

//getAverageRating
exports.getAverageRating =async (req,res) =>{
    try{
     const courseId =req.body.courseId;
     const result =await RatingAndReview.aggregate([
         {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
            },
         },
         {
            $group:{
                _id:null,
                getAverageRating:{$avg :"rating"}
            }
         }
     ])
     if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating,
        })
     }
     return res.status(200).json({
        success:true,
        message:'Average rating is 0 rating not given yet',
        averageRating:0,
     })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"catch block could not find the Rating and review"
          })
    }
}

//getallrating
exports.getAllrating =async(re,res) =>{
    try{
      const allReview =await RatingAndReview.find({})
                                                  .sort({rating:"desc"})
                                                  .populate({
                                                    path:
                                                     "user",
                                                     select:"firstName lastName email image"
                                                    
                                                  })
                                                  .populate({
                                                    path:"course",
                                                    select:"courseName",
                                                  })
                                                  .exec();
    return res.status(200).json({
        success:true,
        message:"all review fetched successfully",
        allReview,
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"catch block could not find the allRating"
          })
    }
}