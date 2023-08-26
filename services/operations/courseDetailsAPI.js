import { toast} from "react-hot-toast"
import {apiConnector} from "../apiconnector"
//import {courseEndPoints} from "../apis"
const BASE_URL =process.env.REACT_APP_BASE_URL

export const getAllCourses = async () =>{
    const toastId =toast.loading("Loading...")
    let result = []
    try{

        const response = await apiConnector("GET",BASE_URL+"/course/getAllCourses")
        if(!response?.data?.success){
            throw new Error("Could Not Fetch Course Categories") 
        }
        result = response?.data?.data
    }
    catch(error){
        console.log("GET_ALL_COURSE_API API ERROR............", error)
         toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async (courseId) =>{
    const toastId =toast.loading("Loading...")
    let result =null
    console.log("joy",courseId);
    try{
      const response =await apiConnector("POST",BASE_URL + "/course/getCourseDetails",
        {courseId } ,
      )
      console.log("COURSE_DETAILS_API API RESPONSE............", response)
      
      // if(!response.data.success){
      //   throw new Error(response.data.message)

      // }
     // result =response.data
     result = response;
       console.log("line no 39 in courseDetails",result);
      // console.log("line no 39 in response courseDetails",response);
    }
    catch(error){
        console.log("COURSE_DETAILS_API API ERROR............", error)
        result = error.response.data
    }
    toast.dismiss(toastId)
     //   dispatch(setLoading(false));
     return result
}

export const fetchCourseCategories = async () =>{
    let result =[]
    try{
      const response =await apiConnector("GET",BASE_URL + "/course/showAllCategories")
      console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
      if( !response?.data?.success){
        throw new Error("Could Not Fetch Course Categories")
      }
      result = response?.data?.data
    }
    catch(error){
        console.log("COURSE_CATEGORY_API API ERROR............", error)
        toast.error(error.message)
    }
    return result
}

export const addCourseDetails = async (data,token) =>{
    let result = null
    const toastId =toast.loading("Loading..")
    try{
        console.log("one")
        const response = await apiConnector("POST",BASE_URL + "/course/createCourse",data,{
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`
        })
        console.log("CREATE COURSE API RESPONSE............", response)
        if (!response?.data?.success) {
        throw new Error("Could Not Add Course Details")
        }
        toast.success("Course Details added successfully")
        result = response?.data?.data
    }
    catch(error){
        console.log("CREATE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}
// BASE_URL+"/course/editCourse"
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  console.log(data)
  try {
    const response = await apiConnector("POST",BASE_URL+ "/course/editCourse" , data, {
       "Content-Type": "multipart/form-data",
      Authorization: `${token}`,
    })
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const createSection = async (data,token) =>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST", BASE_URL + "/course/addSection",data,
        {Authorization: `${token}`,})
        console.log("CREATE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could Not Create Section")
        }
        toast.success("Course Section Created")
        result = response?.data?.updatedCourse
    }
    catch(error){
        console.log("CREATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSubSection = async (formData,token) =>{
    let result =null
    const toastId = toast.loading("Loading..")
   

    try{
       
        const response = await apiConnector( "POST", BASE_URL + "/course/addSubSection",formData,
        {
         
          Authorization: `${token}`
        })
       
        
        console.log("CREATE SUB-SECTION API RESPONSE............", response)
        
        if (!response?.data?.success) {
        throw new Error("Could Not Add Lecture")
         }
         toast.success("Lecture Added")
         console.log("lol....",response?.data)
         result = response?.data?.data
    }
    catch(error){
        console.log("CREATE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async (data,token) =>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{
      const response = await apiConnector("POST", BASE_URL + "/course/updateSection",data,
      {Authorization : `${token}`})
      console.log("UPDATE SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
      throw new Error("Could Not Update Section")

     }
     toast.success("Course Section Updated")
     result = response?.data?.data

    }
    catch(error){
        console.log("UPDATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSubSection = async (data,token) =>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response  = await apiConnector("POST" ,BASE_URL + "/course/updateSubSection",data,
        {Authorization: `${token}`})
        console.log("UPDATE SUB-SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
        throw new Error("Could Not Update Lecture")
         }
         toast.success("Lecture Updated")
         result  = response?.data?.data
    }
    catch(error){
        console.log("UPDATE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSection = async (data,token) =>{
    let result =null
    const toastId = toast.loading("Loading...")
    
    try{
    console.log(data)
    console.log(token)
    const response = await apiConnector("POST", BASE_URL + "/course/deleteSection",data,
    {Authorization: ` ${token}`})
    console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("course Section Deleted")
    result = response?.data?.data
    }
    catch(error){
        console.log("DELETE SECTION API ERROR....",error)
        toast.error(error.message)

    }
    toast.dismiss(toastId)
    return result
}

export const deleteSubSection = async (data,token) =>{
    let result =null
    const toastId = toast.loading("Loading...")
    try{
      const response = await apiConnector("POST",BASE_URL + "/course/deleteSubSection" ,data,
      {Authorization: `${token}`})
      console.log("DELETE SUB-SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
        throw new Error("Could Not Delete Lecture")
      }
      toast.success("Lecture Deleted")
      result = response?.data?.data
    }
    catch(error){
      console.log("DELETE SUB_SECTION API ERROR .....",error)
      toast.error(error.message)

    }
    toast.dismiss(toastId)
    return result
}

export const fetchInstructorCourse = async (token) =>{
    let result = []
    const toastId = toast.loading("Loading..")
    console.log("one")
    try{
      const response = await apiConnector(
        "GET",
        BASE_URL + "/course/getInstructorCourses",
        null,
        {
            Authorization: `${token}`
        }
      )
      console.log("INSTRUCTOR COURSES API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Instructor Courses")
    }
    result =  response?.data?.data

    }
    catch(error){
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async (data,token) =>{
    const toastId = toast.loading("Loading...")
    try{
      console.log(data);
      console.log(token);
      const response = await apiConnector("DELETE",BASE_URL + "/course/deleteCourse",data,
      {Authorization : `${token}`})

      console.log("DELETE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Course")
      }
      toast.success("Course Description")

    }
    catch(error){

        console.log("DELETE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export const getFullDetailsOfCourse = async (courseId,token) =>{
    const toastId = toast.loading("Loading")
    let result = null
    try{
        console.log("Hee heee ",courseId);
        console.log("ooo ooo",token);
        const response = await apiConnector(
            "POST",
            BASE_URL + "/course/getFullCourseDetails",
            {
                courseId,
            },
            {
                Authorization :` ${token}`
            }
        )
        console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response?.data?.data
        console.log("response?.data?.data",result)
    }
    catch(error){
      console.log("COURSE_FULL_DETAILS_API API ERROR............", error)  
      result = error.response.data
    }
    toast.dismiss(toastId)
    return result
}

export const markLectureAsComplete = async (data, token) => {
    let result = null
    console.log("mark complete data", data)
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST",BASE_URL + "/course/updateCourseProgress" , data, {
        Authorization: `Bearer ${token}`,
      })
      console.log(
        "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
        response
      )
  
      if (!response.data.message) {
        throw new Error(response.data.error)
      }
      toast.success("Lecture Completed")
      result = true
    } catch (error) {
      console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
      toast.error(error.message)
      result = false
    }
    toast.dismiss(toastId)
    return result
  }
  
  export const createRating = async (data, token) => {
    const toastId = toast.loading("Loading...")
    let success = false
    try {
      const response = await apiConnector("POST",BASE_URL + "/course/createRating" , data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE RATING API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Create Rating")
      }
      toast.success("Rating Created")
      success = true
    } catch (error) {
      success = false
      console.log("CREATE RATING API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return success
  }
