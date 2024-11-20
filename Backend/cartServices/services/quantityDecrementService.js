const {quantityDecrement} = require("../repository/cartRepository")

const dicrimentProductQuantity = async(userId,productId)=>{
  try {
     const response  = await quantityDecrement(userId,productId)
     return response
  } catch (error) {
     throw new Err(error.message)
  }
}

module.exports = {dicrimentProductQuantity} 