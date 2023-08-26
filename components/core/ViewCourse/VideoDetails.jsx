import "video-react/dist/video-react.css"
import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { Player, BigPlayButton } from "video-react"
import   IconBtn  from "../../common/IconBtn"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailsAPI'
const VideoDetails =() =>{
    
    const {courseId,sectionId,subsectionId} =useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const playerRef = useRef()
    const { token} = useSelector((state) =>state.auth)
    // console.log("totk",token)
    // console.log("hello")
    // const  plo = async() =>{
    //     const courseData = await getFullDetailsOfCourse(courseId, token);
 
    //     console.log("Fetched course data:", courseData);
    //     console.log("hello",courseData?.data?.courseDetails?.courseContent)
    // }
    
 
    const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)
  // console.log("tt",courseSectionData)
//    console.log("tt",courseEntireData)
//    console.log("tt",completedLectures)

    const [videoData,setVideoData] = useState([])
    const [previewSourse,setPreviewSourse] = useState("")
    const [videoEnded,setVideoEnded] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() =>{
        ;(async () =>{
            if (!courseSectionData.length) return
            if( !courseId && !sectionId && !subsectionId) {
                navigate(`/dashboard/enrolled-courses`)
            }
            else{
                const filteredData = courseSectionData.filter(
                    (course) =>course._id === sectionId
                )
                const filteredVideoData = filteredData?.[0]?.subsection.filter(
                    (data) =>data._id === subsectionId
                )
                setVideoData(filteredVideoData)
                setPreviewSourse(courseEntireData.thumbnail)
                setVideoEnded(false)
                console.log("la video data url",videoData)
            }
        })()
        
    },[courseSectionData,courseEntireData,location.pathname])

    const isFirstVideo =() =>{
        const currentSectionIndx = courseSectionData.findIndex(
            (data) =>data._id ===sectionId
        )
        const currentSubSectionIndex = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) =>data._id === subsectionId)

        if( currentSectionIndx === 0 && currentSectionIndx ===0) {
            return true
        }
        else {
            return false
        }
    }
    const goToNextVideo =() =>{
        const currentSectionIndx = courseSectionData.findIndex(
            (data) =>data._id === sectionId
        )

        const noOfSubSection =
        courseSectionData[currentSectionIndx].subsection.length

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) =>data._id === subsectionId)  

        if(currentSubSectionIndex !==  noOfSubSection -1) {
            const nextSubSectionId =
              courseSectionData[currentSectionIndx].subsection[currentSubSectionIndex+1]._id
              navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
              )
        }
        else{
            const nextSectionId = courseSectionData[currentSectionIndx+1]._id
            const nextSubSectionId = 
              courseSectionData[currentSectionIndx+1].subsection[0]._id
              navigate(
                `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
              )
        }
    }
    const isLastVideo =() =>{
        const currentSectionIndx = courseSectionData.findIndex(
            (data) =>data._id === sectionId
        )
        const noOfSubsections =
        courseSectionData[currentSectionIndx].subsection.length

        const currentSubSectionIndx = courseSectionData[
            currentSectionIndx
          ].subsection.findIndex((data) => data._id === subsectionId)
        if (
            currentSectionIndx === courseSectionData.length -1 && 
            currentSubSectionIndx === noOfSubsections -1
        ) {
            return true
        }
        return false
    }
    const goToPrevVideo = () =>{
        const currentSectionIndx  = courseSectionData.findIndex(
            (data) =>data._id === sectionId
        )
        const  currentSubSectionIndex = courseSectionData[
            currentSectionIndx
        ].subsection.findIndex((data) => data._id === subsectionId)

        if( currentSubSectionIndex !==0){
            const prevSubSectionId =
            courseSectionData[currentSectionIndx].subsection[currentSubSectionIndex -1]._id
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`

            )

        }
        else {
            const prevSectionId = courseSectionData[currentSectionIndx -1]._id
            const prevSubSectionLength = courseSectionData[currentSectionIndx -1].subsection.length
            const prevSubSectionId = courseSectionData[currentSectionIndx -1].subsection[
                prevSubSectionLength-1
            ]._id
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
              )
        }

    }
    const handleLectureCompletion = async () =>{
        setLoading(true)
        const res = await markLectureAsComplete(
            { courseId: courseId,subsectionId : subsectionId},
            token
        )
        if (res) {
            dispatch(updateCompletedLectures(subsectionId))
        }
        setLoading(false)
    }
    return (
        <div className="flex flex-col gap-5 text-white">
            {!videoData ? (
                <img
                    src={previewSourse}
                    alt="preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ): (
              <Player
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              onEnded={() =>setVideoEnded(true)}
              src={videoData?.videoUrl}
              >
               <BigPlayButton position="center"/>
               {videoEnded && (
                <div
                style={{
                    backgroundImage:
                     "linear-gradient(to top,rgb(0,0,0),rgba(0,0,0,0.7),rgba(0,0,0,0.5),rgba(0,0,0,0.1)",
                }}
                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                >{
                    !completedLectures.includes(subsectionId) && (
                        <IconBtn
                            disabled={loading}
                            onclick={() =>handleLectureCompletion()}
                            text={!loading ? "Mark as Completed":"loading..."}
                            customClasses="text-xl max-w-max px-4 mx-auto"
                        />
                    )
                }
                <IconBtn 
                    disabled={loading}
                    onclick={() =>{
                        if (playerRef?.current) {
                            playerRef?.current?.seek(0)
                            setVideoEnded(false)
                        }
                    }}
                    text="Rewatch"
                    customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                />
                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                 {
                    !isFirstVideo() &&(
                        <button
                        disabled={loading}
                        onClick={goToPrevVideo}
                        className="blackButton"
                        >
                         prev
                        </button>
                    )
                 }
                 {
                    !isLastVideo() && (
                        <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className="blackButton">
                        Next
                        </button>
                    )
                 }

                </div>

                </div>
               )}

              </Player>
            )}
            <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6">{videoData?.description}</p>
        </div>
    )
   
                }
export default VideoDetails