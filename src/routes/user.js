const express = require("express");
const ConnectionRequest = require("../models/connection");
const { userAuth } = require("../middlewares/auth");
const User = require('../models/user');


const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
    const loggedInUser = req.user; 
 try { 
    const allRequests = await ConnectionRequest.find(
        {
            toUserId: loggedInUser._id,
            status: "interested"
        }
    ).populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl"])

    res.json({
        "message": "All request",
        "data": allRequests
    }   
    )
} catch (err) {
    res.status(400).send('ERROR' + err);
}
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    try {
    const allConnections = await ConnectionRequest.find({
            $or : [
                { fromUserId: loggedInUser },
                { toUserId: loggedInUser }
            ],
            status: "accepted"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age"]).populate("toUserId", ["firstName", "lastName", "photoUrl", "age"]);
        if(allConnections.length === 0) {
             res.send("You don't have any connections yet");
             return;
        }

        const data = allConnections.map( ( row ) => {
            if( row.fromUserId._id.toString() === loggedInUser._id.toString() ) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        } )


    res.json(
        { 
            "message": "All connections" ,
            "data": data

        }
    )

} catch (err) {
    res.status(400).send("Not found");
}

})

userRouter.get("/user/feed", userAuth, async (req, res) => {

    try {
    let limit = parseInt( req.query.limit ) || 10; 
    const page =  parseInt( req.query.page ) || 1;
    const skip = ( page - 1 ) * limit;
    limit = limit > 10 ? 10 : limit ;

    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id }
        ]
    }).select(["fromUserId", "toUserId"])

    const userToBeHide = new Set();
    connections.map( (connection) => {
        userToBeHide.add(connection.toUserId.toString());
        userToBeHide.add(connection.fromUserId.toString());
    })

    const feed = await User.find({
        $and: [
            { _id: { $nin: Array.from(userToBeHide) } },
            { _id: {$ne: loggedInUser._id} }
        ] 
    })
    .select(["-emailId", "-password"])
    .skip(skip)
    .limit(limit)


    res.json({
        "message": "feed",
        "data": feed
    })
} catch (err) {
    res.status(400).send("ERROR : " + err);
}

})

module.exports = userRouter;