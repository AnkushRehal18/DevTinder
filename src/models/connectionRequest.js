const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored" , "interested" , "accepted" , "rejected"],
            message : `{values} is of incorrect status type`
        }
    }
},{
    timestamps : true,
});

//creating a compound index for making the queries fast
connectionRequestSchema.index({fromUserId:1 , toUserId : 1})

// creating a pre method
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //check if fromUserId is same as toUserId

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("You cannot send connection request to yourself");
    }
    next()
})
const ConnectionRequestModel = new mongoose.model("ConnectionRequest" ,connectionRequestSchema )

module.exports = ConnectionRequestModel