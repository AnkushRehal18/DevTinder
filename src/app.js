const express = require('express')
// const {userAuth} = require('./Middlewares/auth');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt')
const User = require('./models/user');
const app = express();
const validator = require('validator')
const { validateSignupData } = require("./utils/validation")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

//middlewares
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

    // with hardcoding language
    console.log(req.body)
    try {
        validateSignupData(req);

        const {firstName , lastName , emailId , password } = req.body
        // Encrypting the password 
        const passwordHash = await bcrypt.hash(password , 10 );
        console.log(passwordHash);

        // creating a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });

        await user.save();
        res.status(200).send("User added successfully");
    }
    catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`);
    }
});

// login path 

app.post("/login" , async (req,res) => {
    try{
        const {emailId , password}  =  req.body;

        // if(!validator.isEmail(emailId)){
        //     throw new Error("Please provide a valid email");
        // };

        // finding the user with the email he provided 

        const user = await User.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(isPasswordValid){
            // create a JWT token 
            const token = await jwt.sign({_id : user._id} , "Dev@Tinder$790");
            console.log(token);

            // Add the token to the cookie and send response back to the user
            res.cookie("token",token);
            res.status(200).send("Login Successfull");
        }
        else{
            throw new Error("Password is not correct");
        }
        
    }
    catch(err){
        res.status(400).send("Error : " + err );
    }
})

// profile 

app.get("/profile", async (req,res)=>{

    try{
        const cookies = req.cookies;

    const {token} = cookies;
    if(!token){
        throw new Error("Invalid Token");   
    }

    //validate token
    // validating the token
    const DecodedMessage = await jwt.verify(token , "Dev@Tinder$790" );

    //getting the id from the message
    const {_id} =  DecodedMessage;

    console.log("Logged In user is " + _id);
    // getting the user based on the login id
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    res.status(200).send(user);

    res.status(200).send("getting cookie");
    }
    catch(err){
        res.status(400).send("Error : " + err );
    }
})
// find user by email

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    console.log(userEmail)
    try {
        // use to find all the occurents of the document in the collection
        // const users = await User.find({emailId: userEmail}); 
        // if(users.length === 0){
        //     res.status(404).send("User not found");
        // }
        // else{
        //     res.status(200).send(users);
        // } 
        // to find only one 

        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send("Cannot find the user");
        }
        else {
            res.status(200).send(user);
        }

    }
    catch (err) {
        res.status(400).send("Something went wrong", err);
    }

})

// getting all the data from the db 

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch (err) {
        console.log("Cannot find all of the users", err);
    }


})

// deleting the user form the database

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.status(200).send("User Deleted successfully");
    }
    catch (err) {
        res.status(400).send("Cannot delete the user", err);
    }
})

// updating the user 

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body
    try {

        const ALLOWED_UPADTES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
    
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPADTES.includes(k)
        )
    
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }

        if(data?.skills.length > 10){
            throw new error("skills cannot be more than 10")
        };
        
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
            new: true
        });
        res.status(200).send("User updates successfully");
    }
    catch (err) {
        res.status(400).send("Data cannot be updated " + err.message);
    }
})

connectDB().then(() => {
    console.log("connected to database successfully");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("Database cannot be connected", err);
}) 