const mongoose=require('mongoose')

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
        "please provide a valid mail",
    ],
    unique: true,//creates a unique index for the mail property
  },
  password:{
    type:String,
    required:[true,'please provide a password to continue'],
    minlength:6,
    maxlength:12,

  },
});


module.exports=mongoose.model("User",userSchema)
