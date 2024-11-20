const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: false, 
    },
    category: {
        type: String,
        required: true,
    },
    size: {
        type: [String],
        required: true,
    },
    color: {
        type: [String], 
        required: true,
    },
    images: {
        type: [String], 
        required: false, 
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    } 
}, { timestamps: true }); 


module.exports = mongoose.model('Product',productSchema)
