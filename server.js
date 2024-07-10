const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser=require("body-parser");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGOURI = process.env.MONGO_URI;

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("Database connected sucessfully");
  })
  .catch((error) => {
    console.log("Error", error);
  });

//Schema creation
const DemoSchema = new mongoose.Schema({
  // Firstname:String,required:true,
  // Lastname:String,
  // Email:String,
  // Password:String
  Firstname:{
    type:String,
    required:true,
  },
  Lastname:{
    type:String,
    required:true,
  },
  Email:{
    type:String,
    required:true,
    unique:true,
  },
  Password:{
    type:String,
    required:true,
  }
});

const collection = new mongoose.model("uses", DemoSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});
app.get("/login",(req,res)=>{
  res.sendFile(__dirname + "/login.html");
});
app.get("/home",(req,res)=>{
  res.sendFile(__dirname + "/home.html");
});


app.post("/",(req,res)=>{
    const Newdata = new collection({
        Firstname:req.body.Firstname,
        Lastname:req.body.Lastname,
        Email:req.body.Email,
        Password:req.body.Password,
    });
    Newdata.save();
    res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await collection.findOne({ Email: Email });

    if (!user) {
      return res.status(400).send("User not found.");
    }

    if (user.Password !== Password) {
      return res.status(400).send("Invalid password.");
    }

    // res.send("Login successful! Redirecting to main page...");

    // Redirect to the main page
    res.redirect("/home");
    
  } catch (err) {
    return res.status(500).send("Error occurred during login.");
  }
});


app.listen(PORT, () => {
  console.log(`Server connected sucessfully ${PORT}`);
});


