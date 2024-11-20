const {addProductToCart} =  require("../services/addToCartService")
const {incrimentProductQuantity} =  require("../services/quantityIncrimentService")
const {dicrimentProductQuantity} =  require("../services/quantityDecrementService")
const { getUserCart } = require("../services/getCartService")
const natsConnection = require("../natsConnection/connection")
const { logout } = require("../../userServices/controller/userController")

const addToCart = async(req,res)=>{
   try {

    // const {userId,productId,quantity,color,size} = req.body
    const response = await addProductToCart(req.body)
    console.log(response);
    
    return res.status(200).json({message:"product added to cart successfully",response})
   } catch (error) {
      return res.status(500).json(error.message)
   }
}

const quantityIncriment = async(req,res)=>{
    try {
        const {userId,productId} = req.body
        const response = await incrimentProductQuantity(userId,productId)
        return res.status(200).json({message:"quantity incrimented",response})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const quantityDecriment = async(req,res)=>{
    try {
        const {userId,productId} = req.body;
        const response  = await dicrimentProductQuantity(userId,productId)
        return res.status(200).json({message:"quantity decrimented",response})
    } catch (error) {
        return res.status(500).json(error.message)
    }
} 

const getCartProducts = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id) return res.status(200).json({error:"id not found"})
        const cart  = await getUserCart(id)
        console.log(cart,"ssss");             
        
        return res.status(200).json({message:"cart recieved successfully",cart})

    } catch (error) {
        return res.status(500).json(error.message)
    }        
}  
  
module.exports = {
    addToCart,
    quantityIncriment,
    quantityDecriment,
    getCartProducts
} 