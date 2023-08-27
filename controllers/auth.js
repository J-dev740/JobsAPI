
const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const{ BadRequestError,UnauthenticatedError}= require('../errors/index')
// const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')


const register = async (req,res)=>{
// res.json({msg:req.body})
    // const user= await User.create({name:"jithu",password:"indrajith",email:"jithu3@gmail.com"})
    const{name,email,password}=req.body

    //extra validation can be provided at the controller side 
    if(!name||!email || !password){
        throw new BadRequestError("provide essential credentials")
    }
    // const salt= await bcrypt.genSalt(10)//10 rounds of encryption
    // const hashedPassword= await bcrypt.hash(password,salt)
    // const tempUser={name,email,password:hashedPassword}
    const user= await User.create({...req.body})
    // const token=jwt.sign({userId:user._id, name:user.name},'jwtSecret',{expiresIn:'30d'})
    //calling instance methods on the schema
    const token= user.createJWT()
    //allkeysgenerator.com will generate secure keys for your jwtsecret or passwords or keys sort of stuff 


    console.log(user)
    // res.status(StatusCodes.CREATED).json({msg:`${user.name} registered`})
    res.status(StatusCodes.CREATED).json({user: {name:user.getName()},token})

}

const login=async (req,res)=>{
    // res.send('login user')
    console.log(req.body)
    const{email,password}=req.body
    if(!email || !password){
        throw new BadRequestError("please provide email and password")
    }
    const user= await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("not Authorized please signup/register")
    }
    //compare password
    const isPasswordCorrect= await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("invalid credentials")

    }
    const token=user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.getName()},token})
    
}

module.exports={
    register,login
}


