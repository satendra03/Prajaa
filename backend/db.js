const mongoose=require('mongoose');

URL='mongodb://localhost:27017/Prajaa'

mongoose.connect(URL);

const db=mongoose.connection;


db.on('connected',()=>{
    console.log('mongodb is connected');
})

db.on('disconnected',()=>{
    console.log('mongodb is disconneted');
})

db.on('error',(err)=>{
    console.log(err);
})

module.exports=db;