const mongoose = require('mongoose');

const connectDb = async () => {
    try {
    await mongoose.connect('mongodb+srv://Initiation:oIbJe1jkQCYrsGIa@namastenodejs.ecrw1k1.mongodb.net/devTinder');
    } catch (err) {
        console.log(err);
    }
}   

module.exports = connectDb;