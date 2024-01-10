const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const  cookiepr= require("cookie-parser");
const cookieParser = require("cookie-parser");

dotenv.config({path:"./config/config.env"});
///middleware
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const users = [
    {username:"sujith",password:"123"},
    {username:"sunny",password:"324"}
]

app.get('/',(req,res) => {
    const {token} = req.cookies;
    if(token){
        jwt.sign(token,process.env.JWT_SECRET_KEY,function(err,result){
            if(result){
                res.redirect('/profile')
            }else{
                res.sendFile(__dirname + "login.html")
            }
        })
    }else{
    res.sendFile(__dirname + "/login.html")
}})

app.post('/login',(req,res) => {
    // console.log(req.body);
    const{username , password} = req.body
   ///checking
  const user = users.find((data) => data.username=== username && data.password === password);

     if(user){
        const data = {
            username,
            date:Date(),
        }
     
        const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
    
        // console.log(token); 
    
        res.cookie("token",token).redirect('/profile')
    }else{

    res.redirect('/')
}})

app.get('/profile',(req,res) => {
    const {token} =req.cookies;

   if(token){
    jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,result){
        if(err){
            res.redirect('/')
        }else{
            res.sendFile(__dirname +"/profile.html")
        }
    })
   }else{
    res.redirect('/')
   }
    
})

app.listen(process.env.PORT,(req,res)=>{
    console.log(`server is running at ${process.env.PORT}`);
})