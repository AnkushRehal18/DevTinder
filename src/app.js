const express = require('express')
const app = express();

const connectDB = require('./config/database');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

//middlewares
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB().then(() => {
    console.log("connected to database successfully");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("Database cannot be connected", err);
}) 