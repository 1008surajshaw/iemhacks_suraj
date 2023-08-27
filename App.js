import "./App.css";
import {Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRouter from "./components/core/Auth/OpenRouter";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import { useDispatch, useSelector } from "react-redux";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourse from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse"
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import { InstructorPage } from "./pages/InstructorPage";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instrutor from "./components/core/Dashboard/InstructorDashboard/Instructor"
function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)
 // const { token } =useSelector((state)=>state.auth)


  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="catalog/:catalogName" element={<Catalog/>}/>
      <Route path="courses/:courseId" element={<CourseDetails/>}/>
      <Route path="instructor/:instructorId" element={<InstructorPage/>}/>
      <Route
          path="signup"
          element={
            <OpenRouter>
              <Signup />
            </OpenRouter>
          }
        />
    <Route
          path="login"
          element={
            <OpenRouter>
              <Login />
            </OpenRouter>
          }
        />

    <Route
          path="forgot-password"
          element={
            <OpenRouter>
              <ForgotPassword />
            </OpenRouter>
          }
        />  

      <Route
          path="verify-email"
          element={
            <OpenRouter>
              <VerifyEmail />
            </OpenRouter>
          }
        />  

    <Route
          path="update-password/:id"
          element={
            <OpenRouter>
              <UpdatePassword />
            </OpenRouter>
          }
        />  

    <Route
          path="about"
          element={
            <OpenRouter>
              <About />
            </OpenRouter>
          }
        />
    <Route path="/contact" element={<Contact />} />

    <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/Settings" element={<Settings />} />
      

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }

      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
            <Route path="dashboard/instructor" element={<Instrutor/>}/>
            <Route path="dashboard/add-course" element={<AddCourse/>}/>
            <Route path="/dashboard/my-courses"  element={<MyCourse/>}/>
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />

          </>
        )
      }
      


    </Route>
    <Route 
     element={
      <PrivateRoute>
        <ViewCourse/>
      </PrivateRoute>
     }
     >
     {
      user?.accountType ===ACCOUNT_TYPE.STUDENT && (
        <>
          <Route
            path="view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
            element={<VideoDetails/>}
          />

        </>
      )
     }

    </Route>

    
      <Route path="*" element={<Error />} />


    </Routes>

   </div>
  );
}

export default App;
