import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { VscAdd } from "react-icons/vsc";
import { fetchInstructorCourse } from "../../../services/operations/courseDetailsAPI";
import CourseTable from "./InstructorCourses/CoursesTable"



export default function MyCourse (){
    const { token } = useSelector((state) =>state.auth)
    const navigate = useNavigate()
    const [courses,setCourses] = useState([])

    useEffect(() =>{
     const fetchCourses = async () =>{
        const result = await fetchInstructorCourse(token)
        if(result){
            setCourses(result)
        }
     }
     fetchCourses();
     //console.log("course is...",courses);
    },[])

    return(
      <div className="flex flex-col gap-3">     
        <div className="mb-14 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-richblack-5">
             MyCourses
          </h1>
          <IconBtn
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
         >
            <VscAdd className="text-richblack-5" />
         </IconBtn>
          
        </div>
        {courses &&<CourseTable courses={courses} setCourses={setCourses}/>}
       </div>
    )
}