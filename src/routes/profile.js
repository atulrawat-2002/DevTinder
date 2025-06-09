const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateProfileEdit } = require("../utils/validation");
const bcrypt = require('bcrypt');


const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    const user = req.user;
    try {
        res.send(user);
    } catch (err) {
        res.status(404).send('ERROR: ' + err);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;

        const isEditAllowed = validateProfileEdit(req);

        if (!isEditAllowed) {
            throw new Error("Invalid Edit!");
        }

        Object.keys(req.body).every(field => loggedInUser[field] = req.body[field]);
        await loggedInUser.save();
        
        // res.send("Edit successfull!");
        res.json({
            "message": "Edit successfull",
            "data": req.body
        })

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {

        const user = req.user;

        const { newPassword, currentPassword } = req.body;

        const isPassowrdCorrect = user.validatePassword(currentPassword);

        if(!isPassowrdCorrect){
            throw new Error("The entered password is incorrect!");
        }

        user.password = await bcrypt.hash(newPassword, 10);

        user.save();
         
        res.send("password editted successfully!")
    } catch (err) {
        res.status(400).send("ERROR: "+ err);
    }
})


module.exports = profileRouter;