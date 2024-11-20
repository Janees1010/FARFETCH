const {addProductService} = require("../services/addProductService");
const {getAllProducts} = require("../services/getAllProductsService")
const getOneProductById = require("../services/getOneProduct")
const editOneProduct = require("../services/editProductService")
const deleteProduct = require("../services/deleteProductService")
const searchProducts = require("../services/searchProductService")
const getSortedProducts = require("../services/productSortingService")


const addProductImage = (files)=>{
   return files.map((img)=> img.location)
}

const addProduct = async (req, res) => {    
  try { 
    const productData = req.body;
    productData.size = JSON.parse(req.body.size);
    productData.color = JSON.parse(req.body.color); 
    productData.images = addProductImage(req.files)
 
    
    const savedProduct = await addProductService(productData);
    
    return res.status(201).json({
        message: 'Product added successfully',
        product: savedProduct,
    });

  } catch (error) {
    return res.status(500).json(error.message);
  }
};
   
const getProducts = async(req,res)=>{
  try {
    let products;
    if(req.params.currentPage && req.params.category){
      const {currentPage,category} = req.params;
      products = await getAllProducts(currentPage,category)
      return res.status(200).json({message:"Products retreievd successfully",...products})
    }else{
      products = await getAllProducts()
      return res.status(200).json(products)
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const getProductById = async(req,res)=>{
   try {
     const id = req.params.id;
     console.log(id);
     
     const product = await getOneProductById(id)     
     console.log(product);
     
     return res.status(200).json(product)
   } catch (error) {  
      return res.status(500).json(error.message)
   }        
}

const editProduct = async(req,res)=>{       
   try {
     const editedProduct = req.body;
     
     editedProduct.size = JSON.parse(req.body.size);
     editedProduct.color = JSON.parse(req.body.color);

     if(req.files.length > 0){
       editedProduct.images = await addProductImage(req.files) 
     }
     
     const {id} = req.params 

     const response = await editOneProduct(editedProduct,id)
     return res.status(200).json({message:"product edited successfuly",editedProduct:response})
   } catch (error) {
      return res.status(500).json(error.message)
   }
}

const deleteProdudct = async(req,res)=>{
   try {
     const {id} = req.params
     const repsonse  = await deleteProduct(id)
     return res.status(200).json({message:"product deleted successfully"})
   } catch (error) {
       return res.status(500).json(error.message)
   }
}

const productSearchHandler = async(req,res)=>{
  try {  
    const {query} = req.params;
    if(!query) return
    const response =  await searchProducts(query)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const productSortHandler = async(req,res)=>{
   try {
      const {option} = req.params
      const response = await getSortedProducts(option)
      return res.status(200).json(response)
   } catch (error) {
    return res.status(500).json(error.message)
   }
}

module.exports = { 
  addProduct,
  getProducts,
  getProductById, 
  editProduct,
  deleteProdudct,
  productSearchHandler,
  productSortHandler
};
    

