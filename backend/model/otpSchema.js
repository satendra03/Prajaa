const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

    otp:{
        type:Number,
        required:true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 600 }, // OTP expires after 10 minutes
    },

})

const OTP=mongoose.model('OTP',otpSchema);


module.exports=OTP;