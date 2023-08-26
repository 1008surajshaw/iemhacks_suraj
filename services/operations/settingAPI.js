import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
//import { settingsEndpoints } from "../apis"
const BASE_URL =process.env.REACT_APP_BASE_URL



// const {
//   UPDATE_DISPLAY_PICTURE_API,
//   UPDATE_PROFILE_API,
//   CHANGE_PASSWORD_API,
//   DELETE_PROFILE_API,
// } = settingsEndpoints


export function updateDisplayPicture(token, formData) {

  return async (dispatch) => {
    const toastId =toast.loading("Loading")
    
    
    try{
     const response =await apiConnector("PUT",BASE_URL + "/profile/updateDisplayPicture",formData,
     {"Content-Type":"multipart/form-data" , Authorization:` ${token}`,});
     console.log("response is",response)

    //  const pre = localStorage.getItem("user")
    //  const preImg =pre.image
     console.log(response.data.data);
     toast.success("Profile picture updated successfully !");
     dispatch(setUser(response.data.data))
     //localStorage.u(response.data.data)
    //  localStorage.setItem()
    localStorage.setItem("user",JSON.stringify(response.data.data))
    }
    catch(error){
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............")
    }
    toast.dismiss(toastId)
    
  }
   
    }
  


export  function updateProfile(token, formData) {
  
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", BASE_URL + "/profile/updateProfile", formData, {
        Authorization: `${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)
      
    //  const newData = JSON.stringify(response.data.profile);
      //  const res = JSON.stringify(localStorage.getItem("user"))
    
    //  const result = newData + res
    //  console.log(result)
      // const result = {...obj1,...obj2}
      // const latestRes = JSON.stringify(result);

      // console.log(latestRes)
       
     dispatch(setUser(response.data.updatedUser))
     
    localStorage.setItem("user",JSON.stringify( response.data.updatedUser))
      // console.log("1")
     // const user =findByIdAndUpdate(re)
      // const userImage = response.data.profile.image
      //   ? response.data.updatedUserDetails.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      //   console.log("1")
      // dispatch(
      //   setUser({ ...response.data.updatedUserDetails, image: userImage })
      // )
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export function changePassword(token , data){
  return async (dispatch) => {
      const toastId = toast.loading("Changing password...")
      console.log("2")
      try {
          const response = await apiConnector("PUT" ,BASE_URL + "/auth/changepassword" , data , 
          {Authorization: ` ${token}`});
          console.log(response);
          if(!response.data.success){
              toast.error(response.data.message);
              throw new Error (response.data.message);
          }
        //  dispatch(setUser(response.data.data));
        //  localStorage.setItem("user" , JSON.stringify(response.data.data));
          toast.success("Password updated successfully!");
      } catch (error) {
          console.log(error);
          toast.error("Error updating password!");
      }
      toast.dismiss(toastId); 
  };
};



// export  function changePassword(token, formData) {
//   return async (dispatch) => {
//     console.log("2")
//     const toastId = toast.loading("Changing password...")
//     try {
//         const response = await apiConnector("PUT" , CHANGE_PASSWORD_API , formData , {Authorization: ` ${token}`});
//         console.log(response);
//         if(!response.data.success){
//             toast.error(response.data.message);
//             throw new Error (response.data.message);
//         }
//         dispatch(setUser(response.data.data));
//         localStorage.setItem("user" , JSON.stringify(response.data.data));
//         toast.success("Password updated successfully!");
//     } catch (error) {
//         console.log(error);
//         toast.error("Error updating password!");
//     }
//     toast.dismiss(toastId); 
// };
  
  
//}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    console.log(token)
    try{
      const response = await apiConnector("DELETE",BASE_URL + "/profile/deleteProfile",{},
      {Authorization: ` ${token}`})

      console.log(response)
      dispatch(setUser(null))
      toast.success("account deleted")
      dispatch(setToken(null))
      localStorage.removeItem("token")
      setToken.removeItem("user")
      navigate("/")
    }
    catch(error){
     console.log(error)
    }
    toast.dismiss(toastId);
  }
}