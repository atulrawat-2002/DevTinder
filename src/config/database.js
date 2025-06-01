const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://Initiation:oIbJe1jkQCYrsGIa@namastenodejs.ecrw1k1.mongodb.net/devTinder');
}

module.exports = connectDb;