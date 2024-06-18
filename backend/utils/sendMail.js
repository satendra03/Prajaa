const nodemailer = require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'shivamdevrani093@gmail.com',
        pass:process.env.APP
    }
})

const sendOtpEmail=async (email,otp)=>{
    const mailOptions={
        from:'Gojoservices@gmail.com',
        to:email,
        subject:'YOUR OTP CODE',
        text:`Thanks for Registration, Your Otp Code Is ${otp}`,
    };

    try{
       const info=await transporter.sendMail(mailOptions);
       
       console.log('Email sent: ' + info.response);

    }
    catch(err)
    {
        console.error('Error sending email: ' + err);
        throw new Error('Failed to send OTP email');
    }
}


module.exports=sendOtpEmail;