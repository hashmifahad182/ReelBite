const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

// async function getFoodPartnerById(req, res) {

//     const foodPartnerId = req.params.id;

//     const foodPartner = await foodPartnerModel.findById(foodPartnerId)
//     const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

//     if (!foodPartner) {
//         return res.status(404).json({ message: "Food partner not found" });
//     }

//     res.status(200).json({
//         message: "Food partner retrieved successfully",
//         foodPartner: {
//             ...foodPartner.toObject(),
//             foodItems: foodItemsByFoodPartner
//         }

//     });
// }
async function getFoodPartnerById(req, res) {

    try {

        const foodPartnerId = req.params.id;

        console.log("Food Partner ID:", foodPartnerId);

        /*
        |--------------------------------------------------------------------------
        | Validate ID
        |--------------------------------------------------------------------------
        */

        if (!foodPartnerId) {
            return res.status(400).json({
                message: "Food partner ID is required"
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Find Partner
        |--------------------------------------------------------------------------
        */

        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        console.log("Food Partner:", foodPartner);

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Find Food Items
        |--------------------------------------------------------------------------
        */

        const foodItemsByFoodPartner = await foodModel.find({
            foodPartner: foodPartnerId
        });

        console.log("Food Items:", foodItemsByFoodPartner);

        /*
        |--------------------------------------------------------------------------
        | Success Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            message: "Food partner retrieved successfully",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner
            }
        });

    } catch (err) {

        console.error("Get Food Partner Error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

module.exports = {
    getFoodPartnerById
};