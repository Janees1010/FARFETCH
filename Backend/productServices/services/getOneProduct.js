const {findProductById} = require("../repository/productRepository")


const getOneProductById = async(id)=>{
    try {
        const product = await findProductById(id)
        return product
    } catch (error) {
      throw new Error(error.message)   
    }
}

module.exports = getOneProductById   