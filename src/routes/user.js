const express = require('express')
const { userAuth } = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

USER_SAVE_DATA = "firstName lastName photoUrl age gender about"
//get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }
        ).populate("fromUserId", USER_SAVE_DATA);

        res.status(200).json({ message: "Data fetched Successfully", data: connectionRequest })
    } catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})

//get all the connections that comes after accepting the request 

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAVE_DATA)
            .populate("toUserId", USER_SAVE_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.status(200).json({ message: "Matched Connection", data });
    } catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})


//feed API 

userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const pageNumber = parseInt(req.query.page) || 1;   //getting the page number for pagination
        let limit = parseInt(req.query.limit) || 10;      //getting the limit for pagination

        limit = limit>50 ? 50 : limit;  //setting limit to under50

        const skip = (pageNumber - 1) * limit;
        //Find all connection request that i have sent + recieved
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");


        //hide user from feed which have already sent or recived a connection request to loggedInUser

        const hideUsersFromFeed = new Set();
        //adding the users into the set for unique 
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        //finding the users from the db and then sending those users which are not in the set
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAVE_DATA).skip(skip).limit(limit);

        res.status(200).send(users);
    } catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})
module.exports = userRouter;