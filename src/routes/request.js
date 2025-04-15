const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../Middlewares/auth');

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    
    const user = req.user;

    console.log("sending Connection Request");

    res.status(200).send(user.firstname + "send a connection request");
})


module.exports = requestRouter;