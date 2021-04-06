const mongoose = require("mongoose");

// const crypto=require("crypto");
//  function generateOTP() {
          
//         var digits = '0123456789';
//         let OTP = '';
//         for (let i = 0; i < 4; i++ ) {
//             OTP += digits[Math.floor(Math.random() * 10)];
//         }
//         return OTP;
//     }
    
//     //var adminId=crypto.randomBytes(16).toString("hex");
//     var password=generateOTP();
    
  
  

const AdminSchema = new mongoose.Schema({
    
    adminId:{
        type:String,
        
    },
  
    password:{
        type:String,
        
       
    }
  });
 
  module.exports = mongoose.model('Admin',AdminSchema)


  