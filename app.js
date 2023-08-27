require('dotenv').config();
require('express-async-errors');
const authenticateUser=require('./middleware/authentication')
const express = require('express');
const app = express();

const connectDB=require('./db/connect')
//connectDB

app.use(express.json());
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
