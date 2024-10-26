const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const nocache = require("nocache");
const {v4:uuidv4}=require('uuid')
const path = require('path');
app.set('views',path.join(__dirname,"views"))

app.set("view engine", "ejs");  //setting the template engine

// Load ststic assets
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));


app.use(nocache());

//serialise date using this middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(session({
      secret: uuidv4(),
      resave: false,
      saveUninitialized: true,
    }));
///
const userRoute = require('./routes/userRoute')

const adminRoute = require('./routes/adminRoute')

const port=process.env.PORT ||8003;

mongoose.connect("mongodb://127.0.0.1:27017/6th_Project",{
}).then( ()=>{console.log("DB Connection Successful !");})  

app.use('/',userRoute);
app.use('/admin',adminRoute);

app.listen(port,()=>{
    console.log("Listening to the server on http://127.0.0.1:8003/");
})