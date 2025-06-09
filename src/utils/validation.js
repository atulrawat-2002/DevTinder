const { Error } = require('mongoose');
const validator = require('validator');


const validateSignUp = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter a name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a valid password!")
    }


}

const validateProfileEdit = (req) => {
    const allowEdits = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];

    const areEditsAllowed = Object.keys(req.body).every(field => allowEdits.includes(field));

    return areEditsAllowed;
}


module.exports = {
    validateSignUp,
    validateProfileEdit,
};