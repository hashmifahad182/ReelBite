const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const multer = require('multer');

const upload= multer({
    storage:multer.memoryStorage(),
})

// food routes /api/food
router.post("/",
    authMiddleware.authfoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// feed
router.get('/',authMiddleware.authUserMiddleware,foodController.getFoodItems);

module.exports=router;