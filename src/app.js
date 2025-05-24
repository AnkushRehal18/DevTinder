const express = require('express')
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const http = require('http')
const intializeScoket = require('./utils/socket');

require('dotenv').config();
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
app.use("/",chatRouter)

const server = http.createServer(app);
intializeScoket(server);

connectDB().then(() => {
    console.log("connected to database successfully");
    server.listen(process.env.PORT, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("Database cannot be connected", err);
}) 