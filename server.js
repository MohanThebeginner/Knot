const express = require('express');
const app = express();

const router = express.Router({mergeParams: true});

const mongoose = require("mongoose");
const multer = require("multer");

require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI =process.env.MONGO_URI;

const userRouter = require("./routes/user.js");
const postRouter = require("./routes/post.js");
const commRouter = require("./routes/comment.js");

const {limiter,authLimiter} = require("./middleware/rateLimiter");

app.use(express.json());

//cors
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Multer error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err && err.message) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});


//mongoose connection
main()
.then(()=>(console.log("Connected to db")))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

//ratelimiter
app.use(limiter);
 
//root
app.get("/",(req,res)=>{
    res.send("I am root");
})

//routes
app.use("/",userRouter);
app.use("/posts",postRouter);
app.use("/posts/:id/comments",commRouter);

//Central error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});


//port 8080
 app.listen(PORT,()=>{
    console.log("Port listening on 8080");
 });
