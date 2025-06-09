const mongoose = require('mongoose');


const connectionSchema = mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    status: {
        type: String,
        enum: {
            values: [ "interested", "rejected", "accepted", "ignored"],
            message: '{VALUE} is not valid! '
        }
    }
})




module.exports = mongoose.model("connectionRequest", connectionSchema);