const path=require('path');
const fs=require('fs');

const express = require('express');

const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');

require('dotenv').config(); 

const app=express();

const bodyParser=require('body-parser');


const mongoose=require('mongoose');

const userRouter=require('./routes/user');
const dailyStatusRouter=require('./routes/dailyStatus');

const accessLogStream=fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'})

// Adds security headers to protect the app from common attacks
app.use(helmet({ contentSecurityPolicy: false })); 

// Logs all API requests in detail and writes them to accessLogStream (file)
app.use(morgan('combined',{stream:accessLogStream})); 


// Allows backend to accept requests from other domains (frontend can access API)
app.use(cors());

//express.static() is a function that takes a path, and returns a middleware that serves all files in that path.
app.use(express.static(path.join(__dirname, 'public')));


//Parse incoming JSON requests and make data available in req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); // For form POST data in reset password form which makes data available in req.body.


app.use(userRouter);
app.use(dailyStatusRouter);



// Connects to the MongoDB database 'dtdexpense' using Mongoose
mongoose.connect('mongodb+srv://nirmal:6X4PCGjNhLBr1qzj@cluster0.qyfqoli.mongodb.net/student_productivity?appName=Cluster0')
.then((result)=>{
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
});