const {insertProductToCart} = require("../repository/cartRepository")

const addProductToCart = async(product)=>{
  try {
    const response = await insertProductToCart(product)
    return response
  } catch (error) {
     throw new Error(error.message)
  }
}

module.exports = {addProductToCart}