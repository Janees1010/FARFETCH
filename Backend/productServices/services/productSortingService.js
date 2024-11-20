const {sortProducts} = require("../repository/productRepository")

const getSortedProducts = async(option)=>{
  try {
     const  products = await sortProducts(option)
     return products
  } catch (error) {
      throw new Error(error.message) 
  }
}

module.exports = getSortedProducts;