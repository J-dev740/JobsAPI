require('dotenv').config();
require('express-async-errors');
const authenticateUser=require('./middleware/authentication')
const express = require('express');
//for extra security 
const helmet = require ('helmet')
const cors= require('cors')
const xss= require('xss-clean')
const rateLimit= require('express-rate-limit')
const app = express();


const connectDB=require('./db/connect')
//connectDB
//since our app will be using a reverse proxy we will use trust proxy 

app.set('trust proxy',1)

app.use(rateLimit({

  windowMs:15*60*1000,//15 minutes
  max:100//limit each IP  to 100  requests per windowMs
}
))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

//router

const authRouter= require('./routes/auth')
const jobRouter=require('./routes/jobs')

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobRouter)
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log('connected to db')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
