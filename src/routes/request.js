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

        if(!toUser){
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
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })
    }
    catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})

//request review api 

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user;
        const { status , requestId } = req.params;
        // check allowed status 

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status is not allowed"})
        }

        // checking if connection Request is present in my db 

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection Request is not found"})
        }

        connectionRequest.status = status;

        //saving to the database
        await connectionRequest.save();

        res.status(200).json({message:"Connection Request " + status})
    }catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})
module.exports = requestRouter;