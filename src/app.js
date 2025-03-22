const express = require('express')
// const {userAuth} = require('./Middlewares/auth');
const connectDB = require('./config/database');
const User = require('./models/user'); 
const app = express();

app.post("/signup", async (req,res)=>{
    const user = new User({
        firstName:"Virat",
        lastName:"Kohli",
        emailId:"Virat@Kohli.com",
        password:"Virat@123"
    });
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("error saving the user " , err.message);
    }
    
   
    // const user = new User(userObj);
})



connectDB().then(()=>{
    console.log("Database connection successfully");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err)=>{
    console.log("Database cannot be connected",err);
}) 