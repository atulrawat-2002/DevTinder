const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
        default: "This is a default about for this user"
    },
    skill: {
        type: [String],
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4DOwclUzayE37CAsCl_54FNRmeEuxES-2CQ&s"
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User;