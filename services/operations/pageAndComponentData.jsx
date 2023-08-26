import {toast} from "react-hot-toast"
import { apiConnector } from "../apiconnector";
export const getCatalogaPageData = async(categoryId) =>{
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const toastId = toast.loading("loading");

    let result =[];
    try{

        const response = await apiConnector("POST", BASE_URL + "/course/getCategoryPageDetails",{categoryId:categoryId,});
        if(!response?.data?.success){
            throw new Error("Could not Fetch Category page data");  
        }
        result = response?.data
        console.log("olaa",result)

    }
    catch(error){
        console.log("CATALOG PAGE DATA API ERROR....", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}