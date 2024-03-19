require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// MongoDB Atlas connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Server setup
const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
