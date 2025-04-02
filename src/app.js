const express = require('express')
// const {userAuth} = require('./Middlewares/auth');
const connectDB = require('./config/database');
const User = require('./models/user'); 
const app = express();


app.use(express.json());

app.post("/signup", async (req,res)=>{
    // with hardcoding language
    const user = new User(req.body);
    try{
        await user.save();
        res.status(200).send("User added successfully");
    }
    catch(err){
        res.status(400).send(`Error saving the user: ${err.message}`);
    }
});

// find user by email

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    console.log(userEmail)
    try{
        // use to find all the occurents of the document in the collection
        // const users = await User.find({emailId: userEmail}); 
         // if(users.length === 0){
        //     res.status(404).send("User not found");
        // }
        // else{
        //     res.status(200).send(users);
        // } 
        // to find only one 

        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("Cannot find the user");
        }
        else{
            res.status(200).send(user); 
        }
         
    }
    catch(err){
        res.status(400).send("Something went wrong",err);
    }

})

// getting all the data from the db 

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch(err){
        console.log("Cannot find all of the users", err);
    }
    
    
})

// deleting the user form the database

app.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.status(200).send("User Deleted successfully");
    }
    catch(err){
        res.status(400).send("Cannot delete the user",err);
    }
})

// updating the user 

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body

    try{
        const user = await User.findByIdAndUpdate({_id : userId} , data ,{
            returnDocument :"after",
            runValidators: true,
            new : true
        });
        res.status(200).send("User updates successfully");
    }
    catch(err){
        res.status(400).send("Data cannot be updated " + err.message);
    }
})

connectDB().then(()=>{
    console.log("Database connection successfully");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err)=>{
    console.log("Database cannot be connected",err);
}) 