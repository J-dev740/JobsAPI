// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'something went wrong try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
//updated with user friendly msg from the generic error message more readable
if(err.name=='ValidationError'){
  customError.msg=Object.values(err.errors).map((item)=>item.message).join(',')
  customError.statusCode=400
}

  if(err.code && err.code===11000){
    customError.msg=`duplicate value for  ${Object.keys(err.keyValue)} please choose another valid value`
    customError.statusCode=400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg})

}

module.exports = errorHandlerMiddleware
