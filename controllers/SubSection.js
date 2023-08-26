const Section =require("../models/Section");
const SubSection =require("../models/SubSection");
const cloudinary =require("cloudinary");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
const { response } = require("express");

//create subsection

exports.createSubSection = async (req,res) =>{

    try{
      //fetch data from req body
      const {sectionId,title,description} =req.body;

      //extract file/video
      const video =req.files.video;
      //validation
      if(!sectionId || !title || !description ){
        return res.status(400).json({
            success:false,
            message:'all fiels are require',
        });
      }
      
      //uplode video in cloudinary 
      const uploadDetails =await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
      console.log(uploadDetails)
      //create a subsectio
      const SubSectionDetails =await SubSection.create({
        title:title,
        timeDuration:`${uploadDetails.duration}`,
        description:description,
        videoUrl:uploadDetails.secure_url,
      })
      //subsection id to be push in section
      const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},
                                                             {
                                                              $push: {
                                                                subsection:SubSectionDetails._id,
                                                             },
                                                            },
                                                             {new:true})
                                                             .populate("subsection")
                                                             

      //return response

      return res.status(200).json({
        success:true,
        data:updatedSection,
        
    })
    }
    catch(error){
      console.log(error);
        return res.status(500).json({

            success:false,
            message:"come in catch block in subsection"
        }) 
    }
}

//update sub section

exports.updateSubSection = async (req,res) =>{

   try{
    const { sectionId,subSectionId,title,description } = req.body
    const subSection =  await SubSection.findById(subSectionId)

    if(!subSection){
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }
    if (title !== undefined){
      subSection.title = title
    }
    if (description !== undefined) {
      subSection.description = description
    }
    if(req.files && req.files.video !== undefined ){
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timmeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    const updatedSection = await Section.findById(sectionId).populate("subSection")

    return res.json({
      success: true,
      data:updatedSection,
      message: "Section updated successfully",
    })
   }
   catch(error){
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
   }
}

//delete subsection

exports.deleteSubSection = async (req,res) =>{
  try{
   const {sectionId,subSectionId} =req.body
   await Section.findByIdAndUpdate(
    { _id: sectionId},
    {
      $pull:{
        subsection: subSectionId,
      },

    }
   )

   const subSection = await SubSection.findByIdAndDelete({
    _id:subSectionId
   })

   if (!subSection) {
    return res
      .status(404)
      .json({ success: false, message: "SubSection not found" })
   }
  // const deletedSubSection =await SubSection.findByIdAndDelete(sectionId,{secure_url},{new:true});

  const updateSection = await Section.findById(sectionId).populate('subSection')
  
   return res.status(200).json({
    success:true,
    message:"Deleted succesfully",
    data: updateSection,
   })

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"come in catch block in updatesubsection"
  }) 
  }
}