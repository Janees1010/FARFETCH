const { findProductAndDelete } = require("../repository/productRepository")

const deleteProduct = async(id)=>{
  try {
     const response = await findProductAndDelete(id)
     return response
  } catch (error) {
      throw new Err(error.message)
  }
}

module.exports = deleteProduct;