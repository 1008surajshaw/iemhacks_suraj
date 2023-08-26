const jwt =require("jsonwebtoken");
require("dotenv").config();
const User =require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try{

        console.log("BEFORE ToKEN EXTRACTION");
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization").replace("Bearer ", "");
        console.log("AFTER ToKEN EXTRACTION");
        
        console.log(token)
        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode is....",decode);
           
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//student
exports.isStudent =async (req,res,next)=>{
    try{
      if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for student",   
        })
      }
      next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role connot be verified,plz try again",
        })
    }
}
//isInstructor
exports.isInstructor =async(req,res,next)=>{
    try{
      if(req.user.accountType !== "Instructor"){
         
        return res.status(401).json({

            success:false,
            message:"this is protected route for Instructor",   
        })
        
      }
      next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role connot be verified,plz try again",
        })
    }
}


//isAdmin
exports.isAdmin =async(req,res,next)=>{
    try{
      if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for Admin",   
        })
      }
      next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role connot be verified,plz try again",
        })
    }
}

//isInstructor

// isAdmin