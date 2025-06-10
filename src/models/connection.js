const mongoose = require('mongoose');
const { applyTimestamps } = require('./user');


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
    },
}, {
    timestamps: true
})

connectionSchema.pre("save", function () {
    const connection = this;
    if( new mongoose.Types.ObjectId(this.toUserId).equals(this.fromUserId) ) {
        throw new Error("Request cannot be sent to yourself!!");
    }
})


module.exports = mongoose.model("connectionRequest", connectionSchema);