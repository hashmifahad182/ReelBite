const userModel=require('../models/user.model');
const foodPartnerModel=require('../models/foodpartner.model');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function registerUser(req,res){
    const {fullName,email,password}=req.body;

    const isUserAlreadyExists= await userModel.findOne({
        email
    });

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        });
    }

    const hashedPassword= await bcrypt.hash(password,10);   

    const user= await userModel.create({
        fullName,
        email,
        password:hashedPassword
    });

    const token=jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    })

    res.status(201).json({
        message:"User registered successfully",
        user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        }
    })
    
}
async function loginUser(req,res){
    const {email,password}=req.body;

    const user= await userModel.findOne({
        email
    });

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }

    const isPasswordValid= await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email orpassword"
        });
    }

    const token=jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    })

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
        }
    })
}

function logoutUser(req,res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    res.status(200).json({
        message:"User logged out successfully"
    });
}

async function registerFoodPartner(req,res){
    const {name,contactName,phone,address,email,password}=req.body;

    const isFoodPartnerAlreadyExists= await foodPartnerModel.findOne({
        email
    });

    if(isFoodPartnerAlreadyExists){
        return res.status(400).json({
            message:"Food Partner account already exists"
        });
    }

    const hashedPassword= await bcrypt.hash(password,10);   

    const { image } = req.body;

    const foodPartner= await foodPartnerModel.create({
        name,
        email,
        contactName,
        phone,
        address,
        password:hashedPassword,
        isApproved: false,
        image: image || null
    });

    res.status(201).json({
        message:"Food Partner registered successfully. Please wait for admin approval.",
        foodPartner:{
            _id:foodPartner._id,
            name:foodPartner.name,
            email:foodPartner.email,
            address:foodPartner.address,
            phone:foodPartner.phone,
            contactName:foodPartner.contactName,
            isApproved:foodPartner.isApproved
        }
    })
}

async function loginFoodPartner(req,res){
    const {email,password}=req.body;

    const foodPartner= await foodPartnerModel.findOne({
        email
    });

    if(!foodPartner){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }

    if(!foodPartner.isApproved){
        return res.status(403).json({
            message:"Your account is pending admin approval. Please try again later."
        });
    }

    const isPasswordValid= await bcrypt.compare(password,foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }

    const token=jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    })

    res.status(200).json({
    message:"Food Partner logged in successfully",
    foodPartner
})
}

function logoutFoodPartner(req,res){    
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    res.status(200).json({
        message:"Food Partner logged out successfully"
    });
}

async function getCurrentUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (user) {
            return res.status(200).json({
                type: 'user',
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email
            });
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            return res.status(200).json({
                type: 'partner',
                id: foodPartner._id.toString(),
                name: foodPartner.name,
                email: foodPartner.email
            });
        }

        return res.status(401).json({ message: 'Invalid token' });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function verifyToken(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ authenticated: true });
    } catch (err) {
        return res.status(401).json({ authenticated: false });
    }
}

async function getPendingPartners(req, res) {
    try {
        const pendingPartners = await foodPartnerModel.find({ isApproved: false }).select('-password');
        res.status(200).json({
            message: "Pending partners retrieved",
            partners: pendingPartners
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving pending partners",
            error: err.message
        });
    }
}

async function approveFoodPartner(req, res) {
    try {
        const { partnerId } = req.params;
        
        const foodPartner = await foodPartnerModel.findByIdAndUpdate(
            partnerId,
            { isApproved: true },
            { new: true }
        ).select('-password');

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        res.status(200).json({
            message: "Food partner approved successfully",
            partner: foodPartner
        });
    } catch (err) {
        res.status(500).json({
            message: "Error approving food partner",
            error: err.message
        });
    }
}

async function rejectFoodPartner(req, res) {
    try {
        const { partnerId } = req.params;
        
        const result = await foodPartnerModel.findByIdAndDelete(partnerId);

        if (!result) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        res.status(200).json({
            message: "Food partner registration rejected and deleted"
        });
    } catch (err) {
        res.status(500).json({
            message: "Error rejecting food partner",
            error: err.message
        });
    }
}

async function getAllPartners(req, res) {
    try {
        const allPartners = await foodPartnerModel.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            message: "All partners retrieved",
            partners: allPartners,
            total: allPartners.length
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving all partners",
            error: err.message
        });
    }
}

async function deleteFoodPartner(req, res) {
    try {
        const { partnerId } = req.params;
        
        const result = await foodPartnerModel.findByIdAndDelete(partnerId);

        if (!result) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        res.status(200).json({
            message: "Food partner deleted successfully",
            deletedPartner: result.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting food partner",
            error: err.message
        });
    }
}

module.exports={
        registerUser,
        loginUser,
        logoutUser,
        registerFoodPartner,
        loginFoodPartner, 
        logoutFoodPartner,
        verifyToken,
        getCurrentUser,
        getPendingPartners,
        approveFoodPartner,
        rejectFoodPartner,
        getAllPartners,
        deleteFoodPartner
    }