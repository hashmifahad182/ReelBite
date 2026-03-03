const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpatner.model");
const userModel = require("../models/user.models");

async function authfoodPartnerMiddleware(req,res,next){
    
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:" Please login to access this resource"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        
        req.foodPartner = foodPartner;
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
}

async function authUserMiddleware(req,res,next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:" Please login to access this resource"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

module.exports = {
    authfoodPartnerMiddleware,
    authUserMiddleware
};