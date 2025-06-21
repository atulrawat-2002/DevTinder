const jwt = require('jsonwebtoken');
const User = require("../models/user")


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if(!token) {
           return res.status(401).send("Please login!");
        }

        const decodedMessage = await jwt.verify(token, 'DEV@Tinder$790');
        const { _id } = decodedMessage;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found!");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(404).send("ERROR : " + err);
    }

}
module.exports = {
    userAuth,
}