const {findProductAndEdit} = require("../repository/productRepository")

const editOneProduct = async(product,id)=>{
  try {
    const editedProduct = await findProductAndEdit(product,id)
    return editedProduct
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = editOneProduct