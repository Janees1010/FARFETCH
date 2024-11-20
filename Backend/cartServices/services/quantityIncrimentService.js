const {quantityIncrement} = require("../repository/cartRepository")

const incrimentProductQuantity = async(userId,productId)=>{
  try {
     const response  = await quantityIncrement(userId,productId)
     return response
  } catch (error) {
     throw new Err(error.message)
  }
}

module.exports = {incrimentProductQuantity} 