const express = require('express')

const app = express();

const {adminAuth , userAuth} = require("./Middlewares/auth");

app.use("/admin",adminAuth);

app.get("/admin/getAllData",(req,res)=>{
    // check if the request is authorized
    // if not then send a response you are not the Admin
    res.send("All Data Sent");
    
});
app.get("/user", userAuth, (req,res)=>{
    res.send("User Data is here");
});
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});