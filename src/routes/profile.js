const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../Middlewares/auth');
const { validateEditProfileData, validateEditPasswordData, isUpadtedPasswordStrong } = require('../utils/validation');
const bcrypt = require('bcrypt')

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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
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
    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }

})

profileRouter.patch("/password/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditPasswordData(req)) {
            throw new Error("Error Changing password");
        }
        const loggedInuser = req.user;
        const { old_password, new_password } = req.body;
        const isPasswordValid = await bcrypt.compare(old_password, loggedInuser.password)

        if (!isPasswordValid) {
            return res.status(400).send("Old password is incorrect");
        }

        if (!isUpadtedPasswordStrong(new_password)) {
            throw new Error("Passowrd is not strong");
        };

        const hashedPassword = await bcrypt.hash(new_password , 10);
        loggedInuser.password = hashedPassword;

        await loggedInuser.save();

        res.status(200).send("Password Updated Successfully")
    }
    catch (err) {
    res.status(400).send("ERR : " + err.message);
}
    // res.status(200).send("Your password was changed")
})
module.exports = profileRouter