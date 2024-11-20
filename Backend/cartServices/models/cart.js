const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
        },
        quantity: {
            type: Number,
            default: 1, 
            min: 1 
        },
        color:{
           type:String,
        //    required: true,
        },
        size:{
           type:String,
        //    required: true,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }
});


cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
