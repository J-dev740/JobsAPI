const User= require('../models/User')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const {UnauthenticatedError}=require('../errors/index')


const auth=async (req,res,next)=>{
    //check header

    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('unauthorized  and invalid token ')
    }
    const token=authHeader.split(' ')[1]
    try {
        const payload=await jwt.verify(token,process.env.JWT_SECRET)
        // const user=User.findById(payload.userId).select("-password")
        // req.user=user
        req.user={userId:payload.userId,name:payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("invalid user")
    }
    
}

module.exports=auth