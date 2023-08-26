import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import rzpLogo from "../../assets/Logo/ssproject.png"
import { resetCart } from "../../slices/cartSlice";
const BASE_URL = process.env.REACT_APP_BASE_URL

function loadScript(src){
    return new Promise((resolve) =>{
        const script = document.createElement("script")
        script.src = src;

        script.onload =() =>{
            resolve(true)
        }
        script.onerror = () =>{
            resolve(false)
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...");
    console.log("stdf 25",courses);
    console.log("userDetails",userDetails);
    try{

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("RazerPay SDK failed to load");
            return;
        }
        const orderResponse = await apiConnector("POST",BASE_URL + "/payment/capturePayment",
                                          {courses},
                                          {
                                            Authorization:`${token}`,
                                          }) 
        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("Printing orderResponse",orderResponse);
        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount : `${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"ScholarSync",
            description:"Thanks you for Purchasing the Course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response){
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token )
                verifyPayment({...response, courses}, token, navigate, dispatch);

            }
        }
        console.log("option",options);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    }
    catch(error){
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        await apiConnector("POST", BASE_URL + "/payment/sendPaymentSuccessEmail", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: ` ${token}`
        })

    }
    catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);

    }
}

async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    try{
        const response  = await apiConnector("POST", BASE_URL + "/payment/verifyPayment", bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(error){
 
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}