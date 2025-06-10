const express = require('express');
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const mongoose = require('mongoose');
const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = req.user._id;
        const isIdValid = mongoose.Types.ObjectId.isValid(toUserId);
        const doesRequestExist = await ConnectionRequest.findOne({
            $or : [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })
        if(doesRequestExist){
            throw new Error("Request already exists!");
        }        
        if (!isIdValid) {
            throw new Error("Something went worong!");
        }
        const connection = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });
        const data = await connection.save();
        res.json({
            "message": "request sent!",
            "data": data
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err);
    }

})

requestRouter.get("/request/received", userAuth, async (req, res) => {
    const loggedInUser = req.user; 
 try { 
    const allRequests = await ConnectionRequest.find({toUserId: loggedInUser._id, status: "interested"});

    res.json({
        "message": "All request",
        "data": allRequests
    }   
    )
} catch (err) {
    res.status(400).send('ERROR' + err);
}
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    
 try {
    if( !["accepted", "rejected"].includes(status) ){
        throw new Error("Invalid status type!")
    }

    const request = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedInUser, status: "interested"});
    request.status = status;

    request.save();

    res.json(
        { "message": `Request has been ${status}` },
        { "data": request }
    )

} catch (err) {
    res.status(400).send("ERROR: " + err);
}

})

requestRouter.get("/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    try {
    const allConnections = await ConnectionRequest.find({
            $or : [
                { fromUserId: loggedInUser },
                { toUserId: loggedInUser }
            ],
            status: "accepted"
        })

    res.json(
        { 
            "message": "All connections" ,
            "data": allConnections

        }
    )

} catch (err) {
    res.status(400).send("Not found");
}

})

module.exports = requestRouter;