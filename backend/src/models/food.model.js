const mongoose=require('mongoose');

// const foodPartnerModel= require('./foodpatner.model');

const foodSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video :{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodpartner",
        required:true
    }
})

const foodModel= mongoose.model("food",foodSchema);

module.exports=foodModel;