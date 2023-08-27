const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "email required"],
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please provide a valid mail"
    ],
    unique: true,//creates a unique index for the mail property
  },
  password:{
    type:String,
    required:[true,'please provide a password to continue'],
    minlength:6,
    // maxlength:12,

  },
});

userSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.getName=function(){
    return this.name
}

userSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:'30d'})
}

userSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch= await bcrypt.compare(candidatePassword,this.password)
    return isMatch

}
module.exports=mongoose.model("User",userSchema)
