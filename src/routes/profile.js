const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../Middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
// profile 

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send("Error : " + err);
    }
})

//profile edit 

profileRouter.patch("/profile/edit" , userAuth , async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            return res.status(400).send("Invalid Edit Request");
        }

        const loggedInuser = req.user;

        Object.keys(req.body).every(key => loggedInuser[key] = req.body[key]);
        //here object.keys will get all the keys from the request which are being sent
        //for each key of the request the loggedInuser of the key(which is the field)
        //will be changed with the key coming from the req.body

        await loggedInuser.save();
        res.status(200).send(`${loggedInuser.firstName}, your Profile Updated Successfully`);
    } 
    catch(err){
        res.status(400).send("ERR : " + err.message);
    }

})

module.exports = profileRouter