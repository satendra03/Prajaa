const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    profileImageUrl:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:String,
        default:false,
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password'))
    return next();

    try{
        const salt=await bcrypt.genSalt(5);

        const hashedPassword=await bcrypt.hash(user.password,salt);

        user.password=hashedPassword;

        next();

    }
    catch(err)
    {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function (userPassword) {
    try {
      const isMatch = await bcrypt.compare(userPassword, this.password);
      return isMatch;
    } catch (err) {
      throw err; 
    }
  };

const USER=mongoose.model('USER',userSchema);

module.exports=USER;
