const jwt=require('jsonwebtoken');

const jwtSecret='121sdsdf';

const jwtAuthMiddleware=(req,res,next)=>{
      
   try{
    const token=req.cookies.token;
    
    if(!token) res.redirect('/');

    const user=jwt.verify(token,jwtSecret);
    req.user=user;
    next(); 

   }
   catch(err)
   {
    console.log(err);
    res.redirect('/');
   }

}

const generateToken=(userData)=>{
    return jwt.sign(userData,jwtSecret);
}

module.exports={generateToken,jwtAuthMiddleware};

