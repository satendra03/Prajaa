const express=require('express');

const app=express();

require('dotenv').config();

const db=require('./db');

const passport=require('./middleware/jwtAuthMiddleware');

//ROUTES
const userRoutes=require('./routes/userRoutes');
const authRoutes=require('./routes/userRoutes');

app.use('/',authRoutes);

app.use('/user',userRoutes);


const PORT=process.env.PORT||8000;

app.listen(PORT,()=>{
    console.log('server is live');
})