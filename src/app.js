const express = require("express");

const app = express();

app.get(("/"), function(req, res){
    res.send("Namaste from the Dashboard!")
})
app.get(("/about"), function(req, res){
    res.send("Hello from is about us page!")
})

app.listen(5678, () => {
    console.log("server is listening on port no. 5678")
})