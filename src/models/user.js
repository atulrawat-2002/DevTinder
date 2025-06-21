const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



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
         validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `Please enter a valid email! You entered: ${props.value}`
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
                if (!["male", "female", "other"].includes(value)) {
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

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: '1d',
    })

    return token;
}

userSchema.methods.validatePassword = async function(password) {
    const user = this;
    isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid;
}  

// const User = mongoose.model('user', userSchema)

module.exports = mongoose.model('User', userSchema);