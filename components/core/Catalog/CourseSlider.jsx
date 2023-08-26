import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Pagination}  from 'swiper/modules'
import { FreeMode } from 'swiper/modules'
import CourseCard from "./CourseCard"
function CourseSlider ({Courses}) {

  return (
   <>
     {
      Courses?.length ?(
        <Swiper
          slidePerView={1}
          loop={true}
          spaceBetween={25}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidePerView :3,
            },
          }}
          className="max-h-[30rem]"
         >
         {
          Courses?.map((course,i) =>(
            <SwiperSlide key={i}>
              <CourseCard course={course} Height={"h-[250px]"}/>
            </SwiperSlide>
          ))
         }
         </Swiper>
      ) :(
        <p className="text-xl text-richblack-5">No Course Found</p>
      )
     }
   </>
  )
}

export default CourseSlider