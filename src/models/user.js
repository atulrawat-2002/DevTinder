const mongoose = require('mongoose');
const validator = require("validator");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid email!" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: value => validator.isStrongPassword(value)
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate: {
            validator: function (value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Enter a valid value!")
                }
            },
        },
    },
    about: {
        type: String,
        default: "This is a default about for this user"
    },
    skills: {
        type: [String],
        validate: {
            validator: arr => arr.length < 5,
        }
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4DOwclUzayE37CAsCl_54FNRmeEuxES-2CQ&s",
        validate: url => validator.isURL(url)
    }
}, {
    timestamps: true
})

const User = mongoose.model('user', userSchema)

module.exports = User;