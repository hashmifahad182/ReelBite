const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://fahad-hashmi-reelbite.netlify.app"
    ],
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.send("Hello World");
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', authRoutes);

app.use('/api/food', foodRoutes);

app.use('/api/food-partner', foodPartnerRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);

module.exports = app;