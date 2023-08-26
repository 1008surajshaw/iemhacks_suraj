const express =require("express");
const router =express.Router()

const{
    createCourse,
    showAllCourses,
    editCourse,
    getCoursedetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse,
    
} =require("../controllers/Course");

const {
    
    createCategory,
    categoryPageDetails,
    showAllCategories,
} =require("../controllers/Category")

const{
    createSection,
    updateSection,
    deleteSection,
} =require("../controllers/Section")

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} =require("../controllers/SubSection")

const {
    createRating,
    getAverageRating,
    getAllrating,
} =require("../controllers/RatingAndReview")

const { auth, isInstructor, isStudent,isAdmin  } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


// Courses can Only be Created by Instructors
router.post("/createCourse",auth,isInstructor,createCourse)

router.post("/updateSection",auth,isInstructor,updateSection)

router.post("/addSection", auth, isInstructor, createSection)
// Update a Section

router.post("/updateSection",auth,isInstructor,updateSection)
// Delete a Section

router.post("/deleteSection",auth,isInstructor,deleteSection)
// Edit Sub Section

router.post("/updateSubSection",auth,isInstructor,updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.post("/updateSubSection",auth,isInstructor,updateSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection",auth,createSubSection)
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Registered Courses
router.get("/getAllCourses",showAllCourses )
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCoursedetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllrating)

module.exports = router