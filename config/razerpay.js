const Razerpay =require("razorpay");

exports.instance =new Razerpay({
    key_id:process.env.RAZER_KEY,
    key_secret:process.env.RAZERPAY_SECRET,
})