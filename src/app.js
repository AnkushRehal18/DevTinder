const express = require('express')

const app = express();

app.get("/user", (req, res, next) => {
    console.log("handling route of first user");
    next();

}, (req, res ,next) => {
    console.log("handling route user 2");
    // res.send("2nd reposne");
    next();
}, (req,res,next)=>{
    console.log("handling route user 3");
    // res.send("3rd reposne");
    // next();
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});