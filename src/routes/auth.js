//this file will manage route related to Authentication

const express = require('express');
const authRouter = express.Router();
const validator = require('validator')
const { validateSignupData } = require("../utils/validation")
const User = require('../models/user');
const bcrypt = require('bcrypt')


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body
        // Encrypting the password 
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();
        const token = await user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
        res.status(200).json({message :"User added Successfully" , data : savedUser})
    }
    catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`);
    }
});

// login path 

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // if(!validator.isEmail(emailId)){
        //     throw new Error("Please provide a valid email");
        // };

        // finding the user with the email he provided 

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            res.status(401).json({message:"Invalid Credentials"})
        }
        const isPasswordValid = await user.ValidatePassword(password);

        if (isPasswordValid) {
            // create a JWT token 
            const token = await user.getJWT();

            // Add the token to the cookie and send response back to the user
            res.cookie("token", token);
            res.status(200).send(user);
        }
        else {
            res.status(401).json({message:"Invalid Credentials"})
        }
    }
    catch (err) {
        res.status(400).send("Error : " + err);
    }
})

//logout path 

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token" , null , {
        expires: new Date(Date.now()),
    })

    res.status(200).json({message : "Logged Out Successfully"});
})
module.exports = authRouter;