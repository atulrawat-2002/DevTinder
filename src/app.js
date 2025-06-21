const express = require("express");
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile');
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

const app = express();  

app.use(
  cors( 
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
   )
);
app.use(express.json());
app.use(cookieParser());  

app.use("/", authRouter);
app.use("/", profileRouter); 
app.use("/", requestRouter);
app.use("/", userRouter);

try {

connectDb().then(() => {
    console.log("Connected to database");
    app.listen(5678, () => {
        console.log("server is listening on port no. 5678")
    })
})

} catch (err) {
    console.log("ERROR: ", err);
}