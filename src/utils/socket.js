const socket = require('socket.io');
const { Chat } = require('../models/chat');

const intializeScoket = (server)=>{
    const socket = require('socket.io');

const io = socket(server , {
    cors:{
        origin:"http://localhost:5173",
    },
});

//all the events will be handled here that will do for real time messages
io.on("connection",(socket)=>{

    socket.on("joinChat",({userId, targetUserId })=>{
        const roomId = [userId, targetUserId].sort().join("_");
        console.log("joining to room with id " + roomId);
        socket.join(roomId);
    });

    socket.on("sendMesage",async ({firstName, userId, targetUserId, text})=>{
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(firstName + " " + text);

        //saving messages to the database

        try{
            //checking if chat exists or not
            let chat = await Chat.findOne({
                participants :{$all : [
                    userId, targetUserId
                ]}
            });

            //new chat 
            if(!chat){
                chat = new Chat({
                    participants : [userId , targetUserId],
                    messages: [],
                })
            };

            chat.messages.push({
                senderId: userId,
                text
            });

            await chat.save();
            io.to(roomId).emit("messageReceived",{firstName , text, senderId: userId})    
        }catch(err){
            res.status(400).json({message:"Something Went Wrong"});
        }

    });

    socket.on("disconnect",()=>{

    });


});
}

module.exports = intializeScoket