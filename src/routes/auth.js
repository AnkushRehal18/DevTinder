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
        console.log(passwordHash);

        // creating a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.status(200).send("User added successfully");
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
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await user.ValidatePassword(password);

        if (isPasswordValid) {
            // create a JWT token 
            const token = await user.getJWT();

            // Add the token to the cookie and send response back to the user
            res.cookie("token", token);
            res.status(200).send("Login Successfull");
        }
        else {
            throw new Error("Password is not correct");
        }
    }
    catch (err) {
        res.status(400).send("Error : " + err);
    }
})

module.exports = authRouter;