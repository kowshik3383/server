require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


mongoose.connect(process.env.DATABASE)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});
app.get('/' , (req , res)=>{
    res.send('hello ')
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const auth = require("./routes/auth")
app.use("/api", auth)

const port = 2000;

app.listen(port, () => {
    console.log(`app is running at port ${port}`)
});

