import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import {Link, useNavigate} from "react-router-dom"
import HighlightText from "../components/core/Homepage/HighlightText"
import {GoLightBulb} from "react-icons/go"
import CTAButton from "../components/core/Homepage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/Homepage/codeBlocks"
import {LuLightbulbOff} from "react-icons/lu"
import TimelineSection from "../components/core/Homepage/TimelineSection"
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection'
import InstructorSection from '../components/core/Homepage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/Homepage/ExploreMore'
import { useState } from 'react'


const Home = () => {
 const [light,setLight] =useState(false);
 const toggleLight = () => {
  setLight(prevLight => !prevLight); // Toggles the value of light
};
  return (
    <div>
        <div className='flex items-end' onClick={toggleLight}>
        {
          light ? (<GoLightBulb size={40} className='text-richblack-5'/>):(<LuLightbulbOff size={40} className="text-richblack-5"/>)
        }
        
        </div>
        {/* section 1 */}
        <div className='relative -translate-y-9 mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between'>

          <Link to={"/signup"}>
            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
              <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
              transition-all duration-200 group-hover:bg-richblack-900'>
                <p>Became a instructor</p>
                <FaArrowRight/>
              </div>
            </div>

          </Link>

          <div className='text-center text-4xl font-semibold mt-7'>
            Empower your Future with
            <HighlightText text={"cooding Skills"}/>
          </div>

          <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            with our online coding courses,you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
          </div>

          <div className='flex flex-row gap-7 mt-8'>

            <CTAButton active={true} linkto={"/singup"}>
               learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}>
               Book a Demo
            </CTAButton>
          </div>
          
          {/* <div className='mx-3 my-12 shadow-blue-200'>
             <video
             muted
             loop
             autoPlay>
              <source src={Banner} type="video/mp4"/>
             </video>

          </div> */}
          
          {/* code section 1 */}
           
          <div>
            <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
                codeColor={"text-yellow-25"}
            />
        </div>

                {/* Code Section 2 */}
        <div>
            <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
                codeColor={"text-white"}
            />
        </div>

          <ExploreMore/>

        </div>
        
        {/* section 2 */}
       <div className='bg-pure-greys-5 text-richblack-700'>
         <div className='homepage_bg h-[310px]'>

          <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
            <div className='h-[150px]'></div>
            <div className='flex flex-row gap-7 text-white' >
               <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-3'>
                  Explore Full Category
                  <FaArrowRight/>
                </div>
               </CTAButton>
               <CTAButton active={false} linkto={"/signup"}>
                <div >
                   learn more
                </div>
               </CTAButton>
            </div>
          </div>
         </div>

         <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
            <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
              <div className='text-4xl font-semibold w-[45%]'>
                 Get the skill you need for a
                 <HighlightText text={"job that is in demand"}/>
              </div>
              <div className='flex flex-col gap-10 w-[40%] items-start'>
                <div className='text-[16px]'>
                  The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.              
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                </CTAButton>
              </div>

            </div>



            <TimelineSection/>

            <LearningLanguageSection/>


         </div>
         
       </div>
           
        {/* section 3 */}
        
        <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter: bg-richblack-900 text-white'>
          <InstructorSection/>

          <h2 className='text-center text-4xl font-semobold mt-10'>review from Other Learners</h2>

        </div>
        
        
        {/* footer */}
        <div>
          <Footer/>
        </div>

    </div>
  )
}

export default Home