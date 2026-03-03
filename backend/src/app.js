// create server
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const cors = require('cors');

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/" , (req,res) =>{
    res.send("Hello World");
})

app.use("/api/auth",authRoutes);
app.use("/api/food",foodRoutes);

module.exports = app;