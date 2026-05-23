const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    try {
        if (!req.foodPartner || !req.foodPartner.isApproved) {
            return res.status(403).json({ message: 'Your account is not approved to publish content yet.' });
        }

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No video file was uploaded.' });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        })
    } catch (error) {
        console.error('Create food upload failed:', error)
        res.status(500).json({
            message: 'Upload failed',
            error: error.message
        })
    }
}

async function getFoodItems(req, res) {
    // Only return items whose food partner account is approved
    const foodItems = await foodModel.find({}).populate('foodPartner')
    const visible = foodItems.filter(item => item.foodPartner && item.foodPartner.isApproved)
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: visible
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    // Ensure the food item exists and belongs to an approved partner
    const food = await foodModel.findById(foodId).populate('foodPartner')
    if (!food || !food.foodPartner || !food.foodPartner.isApproved) {
        return res.status(404).json({ message: 'Food not found' })
    }

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    // Ensure the food exists and is visible (partner approved)
    const food = await foodModel.findById(foodId).populate('foodPartner')
    if (!food || !food.foodPartner || !food.foodPartner.isApproved) {
        return res.status(404).json({ message: 'Food not found' })
    }

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    // Populate saved foods and ensure we only return items from approved partners
    const savedFoods = await saveModel.find({ user: user._id }).populate({
        path: 'food',
        populate: { path: 'foodPartner' }
    });

    const visible = savedFoods.filter(s => s.food && s.food.foodPartner && s.food.foodPartner.isApproved)

    if (!visible || visible.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods: visible
    });

}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}