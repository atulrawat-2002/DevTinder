const express = require('express');
const { validateSignUp } = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const validator = require('validator');


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
            const newUser = await user.save();

            const token = await newUser.getJWT();

            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });

            res.json({
                "message": "User added successfully",
                "data": newUser
            })
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }


})

authRouter.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Please Enter a valid email id!");
        }
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("User Not Found!!")
        }

        const isPasswordValid = user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("INVALID PASSOWRD!!")
        }

        const token = await user.getJWT();

        res.cookie('token', token, {
            expires: new Date(Date.now() + 8 * 3600000)
        });
        res.json({
            "message": `Welcome ${user.firstName} ${user.lastName}`,
            "data": user
        });


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