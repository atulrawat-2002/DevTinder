const express = require('express');
const { validateSignUp } = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    const { firstName, lastName, emailId, password } = req.body;

    try {
        validateSignUp(req);

        const passwordHash = await bcrypt.hash(password, 10);

        const newMail = emailId;
        if (await User.findOne({ emailId: newMail })) {
            res.status(400).send("Email already exist");
        } else {
            const user = new User({
                firstName,
                lastName,
                emailId,
                password: passwordHash,
            });
            await user.save();
            res.send("User added successfully")
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }


})

authRouter.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        
        const isPasswordValid = user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("INVALID PASSOWRD!!")
        }

            const token = await user.getJWT();

            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("Welcome " + user.firstName + " " + user.lastName);
        

    } catch (err) {
        res.status(404).send("Error : " + err);
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("logout successfull!")
})


module.exports = authRouter; 