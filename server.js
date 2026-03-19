const express = require('express');
const app = express();

const router = express.Router({mergeParams: true});

const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI =process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const session = require("express-session");
const passport = require("passport");

require("./config/passport.js");

const userRouter = require("./routes/user.js");
const postRouter = require("./routes/post.js");


//session
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 *24 * 60 * 60 * 1000,
    maxAge: 7 *24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};

app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

//mongoose connection
main()
.then(()=>(console.log("Connected to db")))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

//root
app.get("/",(req,res)=>{
    res.send("I am root");
})

//routes
app.use("/",userRouter);
app.use("/posts",postRouter);

//port 8080
 app.listen(PORT,()=>{
    console.log("Port listening on 8080");
 });
