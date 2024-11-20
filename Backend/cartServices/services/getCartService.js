const {findCartProducts} = require("../repository/cartRepository")


const getUserCart = async(userId)=>{
  try {
     const response  = await findCartProducts(userId)
     return response
  } catch (error) {
     throw new Err(error.message)
  }
}

module.exports = {getUserCart} 