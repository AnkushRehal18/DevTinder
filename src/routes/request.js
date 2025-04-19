const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../Middlewares/auth');
const User = require("../models/user");

requestRouter.post("/request/send/:status/:touserId", userAuth, async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.touserId;
        const status = req.params.status;

        //checking about status
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Invalid Status type : " + status,
            })
        }

        //checking for if the userId exists in db or not 

        const toUser = await User.findById(toUserId);

        if(!toUserId){
            return res.status(404).json({
                message:"User Not Found"
            })
        }

        //check if user is sending request to himself


        const exisitingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}]
        })

        if(exisitingConnectionRequest){
            return res.status(400).send({
                message: "Connection request already exists!!!!"
            })
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        res.json({
            message:"Connection Request Sent Successfully!!!!",
            data
        })
    }
    catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})


module.exports = requestRouter;