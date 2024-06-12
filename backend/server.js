const express=require('express');

const app=express();

require('dotenv').config();

const db=require('./db');


//ROUTES
const userRoutes=require('./routes/userRoutes');



app.use('/',userRoutes);


const PORT=process.env.PORT||8000;

app.listen(PORT,()=>{
    console.log('server is live');
})