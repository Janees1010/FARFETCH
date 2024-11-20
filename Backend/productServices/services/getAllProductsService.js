const {findAllProducts} = require("../repository/productRepository")

const  getAllProducts = async(currentPage=null,category=null)=>{
    try {
       const products = await findAllProducts(currentPage,category)
       return products
    } catch (error) {
       throw new Error(error.message)
    }
}

module.exports = {getAllProducts}