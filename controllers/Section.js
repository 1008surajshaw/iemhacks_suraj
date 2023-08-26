const Section =require("../models/Section");
const Course =require("../models/Course");
const SubSection = require("../models/SubSection");


exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		
		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}
       
		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			 .populate({
			 	path: "courseContent",
			 	populate: {
			 		path: "subsection",
			 	},
			 })
			 .exec();
			console.log(updatedCourse)
		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		console.log(error)
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};


exports.updateSection =async (req,res) =>{
    try{
          const {sectionName,sectionId,courseId} =req.body;
          const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName},
			{ new:true }
		  )
         const course = await Course.findById(courseId)
		 .populate({
			path: "courseContent",
			populate: {
				path: "subsection",
			},
		})
		.exec();

        return res.status(200).json({
            success:true,
            message:'section updated succesfully',
            data:course,
        })
    }

    
    catch(error){
        return res.status(500).json({
            success:false,
            message:"come in catch block in updatsection"
        })  
    }
}

exports.deleteSection =async(req,res) =>{
    try{
        const {sectionId,courseId} =req.body;
		console.log (sectionId)
		await Course.findByIdAndUpdate(courseId,{
			$pull:{
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		// console.log(sectionId, courseId);
         //data validation
      if( !section){
          return res.status(400).json({
              success:false,
              message:"section not found",
          });
      }
      await SubSection.deleteMany({_id: {$in: section.subsection}});
	  await Section.findByIdAndDelete(sectionId);

	  const course = await Course.findById(courseId)
	  .populate({
		path: "courseContent",
		populate: {
			path: "subsection",
		},
	})
	.exec();

      return res.status(200).json({
          success:true,
          message:'section deleted succesfully',
		  data: course      
      })
  }

  
  catch(error){
      return res.status(500).json({
          success:false,
          message:"come in catch block in Deletesection"
      })  
  }
}
