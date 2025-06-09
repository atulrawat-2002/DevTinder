const express = require('express');
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connection");
const mongoose = require('mongoose');
const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const user = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = user._id;
        const isIdValid = mongoose.Types.ObjectId.isValid(toUserId);
        const doesRequestExist = connectionRequest.findOne({
            $or : [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if(doesRequestExist){
            throw new Error("Request already exists!");
        }        
        console.log(toUserId, fromUserId, doesRequestExist)
        if(toUserId === fromUserId){
            throw new Error("Cannot send request to yourself!")
        }
        if (!isIdValid) {
            throw new Error("Something went worong!");
        }
        const connection = new connectionRequest({
            toUserId,
            fromUserId,
            status
        });
        connection.save();
        res.json({
            "message": "request sent!",
            "data": connection
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err);
    }

})



module.exports = requestRouter;