const express=require('express');

const router=express.Router();

const {generateToken}=require('../jwt');

const USER=require('../model/userSchema');
const OTP=require('../model/otpSchema');

const {sendOtpEmail}=require('../utils/sendMail');


//GOOGLE AUTHENTICATION

router.get('/auth/google',passport.authenticate('google',{session:false,scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate('google',{session:false}),(req,res)=>{
      // payload for jwt
      const payload={
        id:req.user.id,
        profileImageUrl:req.user.profileImageUrl,
        name:req.user.name
    }
      //generate Token
      const token=generateToken(payload,{ httpOnly: true, maxAge: 3600000 });

      res.cookie('token',token);

      res.json({userProfile: req.user});

})


//Mannual SIGNUP
router.post('/signup',async (req,res)=>{
    try{
        //checking for existing user
        const {name,email,password}= req.body;

        const user=await USER.findOne({email});

       if(user) return res.json({error:'email already registered'});


       //saving user to the database
       const newuser=new USER({name,email,password});

       await newuser.save();

       const otp= Math.floor(Math.random()*100000);
       
       const otpEntry=new OTP({
        email,
        otp
       })
        await otpEntry.save();
        console.log('otp Schema Created Successfully');

        await sendOtpEmail(email,otp);

        console.log('otp sent successfully');

       res.json({message:'Signup sucessfull ,please verify your email'});

    }
    catch(err){
      console.log(err);
      res.status(500).json({error:"internal server error"});
    }
})

router.post('/otp-enter',async(req,res)=>{
    try{
        const {otp,email}=req.body;
        
        //checking for otp
        const otpEntry=await OTP.findOne({email,otp});
       
        if(!otpEntry)
         {
             console.log('wrong otp');
             return res.status(200).json({error:"Wrong OTP"});
         }
         console.log('otp verified');


         const user=await USER.findOne({email});
         user.isVerified=true;

         await user.save();
         
         await OTP.deleteOne({ email, otp });

         return res.json({message:"user Verified"});  
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }

})

router.post('/verify',async(req,res)=>{
    try{

        const {email}=req.body;
 
        const oldOtp=await OTP.findOne({email});
 
        if(oldOtp)
         {
         console.log('old otp deleted');
          oldOtp.deleteOne;
         }
             
        const user=await USER.find({email});
        
        if(!user) res.json({error:"user not registered"});
 
        const otp=Math.floor(Math.random()*100000);
      
     const otpEntry=new OTP({
         email,
         otp
     });
     
     await otpEntry.save();
 
     console.log('otp Schema Created Successfully');
 
     await sendOtpEmail(email,otp);
 
     console.log('otp sent successfully');
 
     res.json({message:'check for the otp and verify it'});
 
    }
    catch(err)
    {
       console.log(err);
       res.redirect('/verfiy?internal server error');
    }
   
})


//login
router.post('/login',async (req,res)=>{

    const {email,password}=req.body;
    try{

      const user=await USER.findOne({email:email});
      if(!user)
      return res.status(401).json({error:'Email not registered'});
      
      const iscompare= user.comparePassword(password);

      if(!iscompare) return res.status(401).json({error:'wrong password'});

        const payload={
            id:user.id,
            profileImageUrl:user.profileImageUrl,
            name:user.name
       }
     
       const token=generateToken(payload);

       console.log('login successfully');

       res.cookie('token',token);

       res.status(200).json({token:token});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})


module.exports=router;