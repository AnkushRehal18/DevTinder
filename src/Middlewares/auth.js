const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    //Read the token from the request cookies

    try {
        const cookies = req.cookies;

        const { token } = cookies;
        console.log("Token from cookies:", token);

        if (!token) {
            throw new Error("Token is not Valid!!!!!!!!1")
        }
        const decodedObj = await jwt.verify(token,"Dev@Tinder$790")

        const { _id } = decodedObj;

        //Find the user
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next();

    }
    catch (err) {
        res.status(400).send("Err" + err.message);
    }

};
module.exports = {
    userAuth
}