const express = require('express')


const app = express ();

app.use("/",(req,res)=>{
    res.send("this is the home page..");
})

app.use("/student" , (req,res)=>{
    res.send("this is the student page..");
})
app.use("/test",(req,res)=>{
    res.send("Hello From the server");
})

app.listen(3000 , ()=>{
    console.log("Server is successfully listening on port 3000");
});