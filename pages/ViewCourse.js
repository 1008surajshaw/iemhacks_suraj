import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setTotalNoOfLectures } from '../slices/viewCourseSlice'
import VideoDetails from '../components/core/ViewCourse/VideoDetails'
import ConfirmationModal from '../components/common/ConfirmationModal'
import VideoDetailsSlider from '../components/core/ViewCourse/VideoDetailsSlider'
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  
} from "../slices/viewCourseSlice"
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
export default function ViewCourse () {
    const { courseId } =useParams()
    //console.log("raj",courseId)


    const {token} = useSelector((state)=>state.auth)
   // console.log("ass",token)
    const dispatch = useDispatch()
    const [reviewModal,setReviewModal] = useState(false)
 //   console.log("mid")
    
    //
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("Fetching course data...");
        
  //       const courseData = await getFullDetailsOfCourse(courseId, token);
 
  //       console.log("Fetched course data:", courseData);

  //       dispatch(setCourseSectionsData(courseData?.data?.data?.courseDetails?.courseContent));
  //       dispatch(setEntireCourseData(courseData?.data?.data?.courseDetails));
  //       dispatch(setCompletedLectures(courseData?.data?.data?.completedVideos));
 
  //       let lectures = 0;
  //       courseData?.courseDetails?.courseContent.forEach((sec) => {
  //         lectures += sec.subsection.length;
  //       });
        
  //       dispatch(setTotalNoOfLectures(lectures));
        
  //       console.log("Data processing completed.");
  //     } catch (error) {
  //       console.error("Error fetching or processing data:", error);
  //     }
  //   };
    

  //   fetchData();

  // }, []);

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
       console.log("Course Data here... ", courseData.courseDetails)
      dispatch(setCourseSectionData(courseData?.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData?.courseDetails))
      dispatch(setCompletedLectures(courseData?.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent.forEach((sec) => {
        lectures += sec.subsection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    
  }, [])
  //  console.log("gaya")

 


    //
  return (
    <>
        <div className='reletive flex min-h-[calc(100vh-3.5rem)]'>
          <VideoDetailsSlider setReviewModal={setReviewModal}/>
          <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
            <div className='mx-6'>
              <Outlet/>
            </div>
          </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </>
  )
}
