const Course =require("../models/Course");
const Category =require("../models/Category");
const Section  = require("../models/Section")
const User =require("../models/User");
const { uploadImageToCloudinary } =require("../utils/imageUploder");
const SubSection = require("../models/SubSection")
const { convertSecondToDuraton } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress")

exports.createCourse = async (req, res) => {
	try {
	  // Get user ID from request object
	  const userId = req.user.id
  
	  // Get all required fields from request body
	  let {
		courseName,
		courseDescription,
		whatYouWillLearn,
		price,
		tag: _tag,
		category,
		status,
		instructions: _instructions,
	  } = req.body
	  // Get thumbnail image from request files
	  const thumbnail = req.files.thumbnailImage
	  console.log("1")
  
	  // Convert the tag and instructions from stringified Array to Array
	  const tag = JSON.parse(_tag)
	  const instructions = JSON.parse(_instructions)
      console.log("1")

	 
  
	  // Check if any of the required fields are missing
	  if (
		!courseName ||
		!courseDescription ||
		!whatYouWillLearn ||
		!price ||
		!tag.length ||
		!thumbnail ||
		!category ||
		!instructions.length
	  ) {
		return res.status(400).json({
		  success: false,
		  message: "All Fields are Mandatory",
		})
	  }
	  if (!status || status === undefined) {
		status = "Draft"
	  }
	  // Check if the user is an instructor
	  const instructorDetails = await User.findById(userId, {
		accountType: "Instructor",
	  })
  
	  if (!instructorDetails) {
		return res.status(404).json({
		  success: false,
		  message: "Instructor Details Not Found",
		})
	  }
  
	  // Check if the tag given is valid
	  const categoryDetails = await Category.findById(category)
	  if (!categoryDetails) {
		return res.status(404).json({
		  success: false,
		  message: "Category Details Not Found",
		})
	  }
	  // Upload the Thumbnail to Cloudinary
	  const thumbnailImage = await uploadImageToCloudinary(
		thumbnail,
		process.env.FOLDER_NAME
	  )
	  console.log(thumbnailImage)
	  // Create a new course with the given details
	  const newCourse = await Course.create({
		courseName,
		courseDescription,
		instructor: instructorDetails._id,
		whatYouWillLearn: whatYouWillLearn,
		price,
		tag,
		category: categoryDetails._id,
		thumbnail: thumbnailImage.secure_url,
		status: status,
		instructions,
	  })
  
	  // Add the new course to the User Schema of the Instructor
	  await User.findByIdAndUpdate(
		{
		  _id: instructorDetails._id,
		},
		{
		  $push: {
			courses: newCourse._id,
		  },
		},
		{ new: true }
	  )
	  // Add the new course to the Categories
	  const categoryDetails2 = await Category.findByIdAndUpdate(
		{ _id: category },
		{
		  $push: {
			courses: newCourse._id,
		  },
		},
		{ new: true }
	  )
	  console.log("HEREEEEEEEE", categoryDetails2)
	  // Return the new course and a success message
	  res.status(200).json({
		success: true,
		data: newCourse,
		message: "Course Created Successfully",
	  })
	} catch (error) {
	  // Handle any errors that occur during the creation of the course
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Failed to create course",
		error: error.message,
	  })
	}
  }

  exports.editCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const updates = req.body
	  console.log("edit course",updates)
	  const course = await Course.findById(courseId)
  
	  if (!course) {
		return res.status(404).json({ error: "Course not found" })
	  }
  
	  // If Thumbnail Image is found, update it
	   if (req.files) {
	 	console.log("thumbnail update")
	 	const thumbnail = req.files.thumbnailImage
	 	const thumbnailImage = await uploadImageToCloudinary(
	 	  thumbnail,
	 	  process.env.FOLDER_NAME
	 	)
	 	course.thumbnail = thumbnailImage.secure_url
	   }
  
	  // Update only the fields that are present in the request body
      console.log("edit course again",updates)
	  for (const key in updates) {
		if(updates.hasOwnProperty(key)){
		  if (key === "tag" || key === "instructions") {
			course[key] = JSON.parse(updates[key])
		  } else {
			course[key] = updates[key]
		  }
		}
	  }
      console.log("course  ka ",course)
	  await course.save()
  
	  const updatedCourse = await Course.findById({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subsection",
		  },
		})
		.exec()
  
	  res.json({
		success: true,
		message: "Course updated successfully",
		data: updatedCourse,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
	}
  }

exports.showAllCourses = async (req,res) =>{
  try{
   const allCourses =await Course.find({},{courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            ratingAndReview:true,
                                            instructor:true,
                                            studentsEnrolled:true,})
                                            .populate("Instrctor")
                                            .exec();

  return res.status(200).json({
       success:true,
        message:"data fectch succesfully",
        data:allCourses,
  })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"cannot fetch course data",
      error:error.message,
    })
  }

}


exports.getCoursedetails =async (req,res) =>{
  try{
    const { courseId } =req.body;
    console.log("hello world");
    const courseDetails =await Course.findById(
                                         courseId)

                                         .populate(
                                          {
                                            path:"instructor",
											select:"-courses",
                                            populate:{
                                              path:"additionalDetails",
											  
											  
                                            },
                                          }
                                         )
										// .populate({
										// 	path:"instructor",
										// 	populate:{
										// 		path: "additionalDetails",
										// 		select:"-courses"

										// 	},
										// })
                                        // .populate({ path :"category",
										//             // populate:{
										// 			// 	path :"courses"
														
										// 			// }
										// 			})
                                         .populate({path :"ratingAndReviews"})
                                         .populate(
											{
											path: "courseContent",
											populate: {
											  path: "subsection",
											  select: "-videoUrl",
											},
										  }
										   )
                                           .exec();

     console.log("baghi ya billi",courseDetails);
	if(!courseDetails){
		return res.status(400).json({
		  success:false,
		  message:"could not find the course Details"
		})
	  } 

	  if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

	let totalDurationInSecond = 0
	// courseDetails.courseContent.forEach((content) =>{
	// 	content.subsection.forEach((subsection) =>{
	// 		const timeDurationInSecond = parseInt(subsection.timeDuration);
	// 		totalDurationInSecond +=timeDurationInSecond
	// 	})
	// })

	// const totalDuration = convertSecondToDuraton(totalDurationInSecond)
     const totalDuration = 200;
    //validation 
    
    return res.status(200).json({
      success:true,
      message:"course Details fetched succesfully",
	  courseDetails,
	  totalDuration,
    })                                  
                                         
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"catch block could not find the course Details"
    })
  }
}

exports.getFullCourseDetails = async (req,res) =>{
	try{
        
		const { courseId } = req.body
		
		const userId = req.user.id
		console.log("instructor ka >>>",userId)
		const courseDetails = await Course.findOne({_id: courseId})
		.populate({
			path:"instructor",
			populate:{
				path:"additionalDetails",
			},
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
			path: "courseContent",
			populate: {
			  path: "subsection",
			},
		  })
		  .exec()
		console.log("lkjo",courseDetails)
        
		let courseProgressCount = await CourseProgress.findOne({courseId,userId})

		console.log("courseProgressCount",courseProgressCount)

		if (!courseDetails) {
			return res.status(400).json({
			  success: false,
			  message: `Could not find course with id: ${courseId}`,
			})
		  }
		let totalDurationInSecond = 1000
		courseDetails?.courseContent.forEach((content) =>{
			content?.subsection.forEach((subSection) => {
				const timeDurationInSecond = parseInt(subSection.timeDuration)
				totalDurationInSecond +=timeDurationInSecond
			})
		})

		const totalDuration = convertSecondToDuraton(totalDurationInSecond)
         console.log("courseDuration>>>>",totalDuration)
		return res.status(200).json({
			success:true,
			data:{
				courseDetails,
				totalDuration,
				completedVideos : courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
			},
		})
	   
		
	  
	}
	catch(error){

		return res.status(500).json({
			success: false,
			message: error.message,
		  })
		}
}

exports.deleteCourse = async (req,res) =>{
	try{

		const { courseId } =req.body
		console.log("course:)")
		const course = await Course.findById(courseId)
		console.log(course)
		if (!course) {
			return res.status(404).json({message:"Course not found"})
		}

		const studentsEnrolled = course.studentsEnrolled
		console.log(studentsEnrolled);
		for (const studentId of studentsEnrolled) {
			await User.findOneAndUpdate(
				{ _id:studentId},{
				$pull: { course: courseId},
			})
		}

		const courseSections = course.courseContent
		for(const sectionId of courseSections) {
			const section =await Section.findById(sectionId)
			if(section){
				const subSections = section.subsection
				for(const subSectionId of subSections){
					await SubSection.findByIdAndDelete(subSectionId)
				}
			}
			await Section.findByIdAndDelete(sectionId)
		}
		await Course.findByIdAndDelete(courseId)

		return res.status(200).json({
			success:true,
			message:"course deleted succcessfully"
		})

	}
	catch(error){
		console.error(error)
		return res.status(500).json({
		  success: false,
		  message: "Server error",
		  error: error.message,
		})	
	}
}

exports.getInstructorCourses = async (req,res) =>{
	try{

		const instructorId = req.user.id
		console.log(instructorId);
        console.log("One")
		const instructorCourses = await Course.find({
			instructor:instructorId,
		}).sort({createdAt: -1})

		res.status(200).json({
			success:true,
			
			data:instructorCourses,
		})
	}
	catch(error){

		console.error(error)
		res.status(500).json({
		  success: false,
		  message: "Failed to retrieve instructor courses",
		  error: error.message,
		})
	}
}

