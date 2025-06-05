const express = require("express");
const connectDb = require('./config/database')
const User = require('./models/user');
const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {

    // try {
    //     const userEmail = req.body.emailId;
    //     const user = await User.findOne({ emailId: userEmail });
    //     if (user) {
    //         res.send(user)
    //     } else {
    //         res.status(404).send("User not found!")
    //     }
    // } catch(err) {
    //     console.log(err)
    // }

    try {
        emailId = req.body.emailId;
        const users = await User.find({ emailId: emailId });
        if (users) {
            res.send(users);
        } else {
            res.status(404).send("User not found!")
        }
    } catch (err) {
        console.log(err)
    }
})

app.get(("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users)
        res.send(users);

    } catch (err) {
        console.log("sonething went wrong")
    }

}))

app.delete("/user", async (req, res) => {
    const userId = req.body._id;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted !");
    } catch (err) {
        console.log(err)
        res.status(404).send("Something went wrong!")
    }
})

app.patch("/user/:userId", async(req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    const ALLOW_UPDATES = [ "userId", "photoUrl", "age", "about", "gender", "skills"];
    const isAllowUpdate = Object.keys(data).every(key => ALLOW_UPDATES.includes(key));
    try{
        if(!isAllowUpdate){
            throw new Error("Update is not allowed!");
        }
        const user1 = await User.findByIdAndUpdate({ _id: userId }, data, {returnDocument: "before", runValidators: true});
        // const user = User.findOne({_id: userId});
        console.log(user1);
        res.send("user updated successfully"); 
    } catch(err){
        res.status(400).send("Something went wrong!" + err);
    }
})

app.post("/signup", async (req, res) => {

    // console.log(req.body);
    const { emailId } = req.body;
    const newMail = emailId;
    if(await User.findOne({emailId: newMail})){
        res.status(400).send("Email already exist");
    } else {
        const user = new User(req.body); 

    await user.save();
    res.send("User added successfully")
    }
    
})

connectDb().then(() => {
    console.log("Connected to database");
    app.listen(5678, () => {
        console.log("server is listening on port no. 5678")
    })
}).catch((err) => {
    console.log(err);
}) 
