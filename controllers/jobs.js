const Job=require('../models/Job')
const{StatusCodes}=require('http-status-codes')
const{BadRequestError,NotFoundError}=require('../errors/index')


const getAllJobs=async (req,res)=>{
    // res.send('get all Jobs')
    // const jobs=await Job.find({createdBy:req.user.userId})
    const jobs=await Job.find({createdBy:req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})


}

const getJob=async (req,res)=>{
    // res.send('getJob')
    const{user:{userId},params:{id:jobId}}=req

    const job= await Job.findOne({
        _id:jobId,createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`no Job with id:${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
    
}
const createJob=async (req,res)=>{
    req.body.createdBy=req.user.userId
    const job=await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
    
}
const updateJob=async (req,res)=>{
    // res.send('updateJob')
    const {
        body:{company,position,status},
      user: { userId },
      params: { id: jobId },
    } = req;

    if(company==="" || position === ""){
        throw new BadRequestError('please provide company and position to update details')
    }
    const job= await Job.findOneAndUpdate({_id:jobId, createdBy:userId},req.body,{new:true,
    runValidators:true})
    if(!job){
        throw new NotFoundError(`no Job with id:${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
    
}
const deleteJob=async (req,res)=>{
    // res.send('deleteJob')
    const{user:{userId},params:{id:jobId}}=req

    const job= await Job.findOneAndRemove({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`no Job with id:${jobId}`)
    }
    // res.status(StatusCodes.OK).json({job})
    res.status(StatusCodes.OK).send()  //response depends on what is being coded on the front-end part parse accordingly


    
}




module.exports={
    updateJob,deleteJob,createJob,getAllJobs,getJob
}