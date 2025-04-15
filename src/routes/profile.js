const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../Middlewares/auth');
// profile 

profileRouter.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send("Error : " + err);
    }
})

module.exports = profileRouter