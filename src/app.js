const express = require("express");
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile');
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());  

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



connectDb().then(() => {
    console.log("Connected to database");
    app.listen(5678, () => {
        console.log("server is listening on port no. 5678")
    })
}).catch((err) => {
    console.log(err);
}) 
