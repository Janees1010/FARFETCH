const { validateProductData } = require("./validationService");
const { insertProduct } = require("../repository/productRepository");

const addProductService = async (productData) => {
  const validationErrors = validateProductData(productData);
  console.log(validationErrors);
  
  try {
    if (validationErrors.length > 0) {
      throw new Error("validation failed");
    }
    const response = await insertProduct(productData);
    return response;
  } catch (error) {
     throw new Error(error.message)
  }

  
};  

module.exports = { addProductService }; 
