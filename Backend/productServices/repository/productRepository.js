const Product = require("../models/product")
const clearCache = require("../services/clearCacheService")

const insertProduct = async(product)=>{
    try {
        const newProduct = new Product({
            productName: product.productName,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            offerPrice: product.offerPrice,
            category: product.category,
            size: product.size, 
            color: product.color,
            images: product.images 
        });
        const response  = await newProduct.save()
        if(response){
            return response
        }
    } catch (error) {
        throw new Error("error adding product to Database")
    }   
 }

 const findAllProducts = async(currentPage,category)=>{
    try {
        if(currentPage === null && category === null){
            const products = await Product.find()
            return products
        }
        const limit = 8;
        const skip = (currentPage - 1) * limit  
        const products = await Product.find({category:category}).skip(skip).limit(limit) 
        const TotalLength = await Product.find({category}).countDocuments()
        const dataToSend = {products,TotalLength}

        return dataToSend   
    } catch (error) {
        throw new Error("error while fetching products from databse")
    }
 }

 const findProductById = async(id)=>{
    try {
      const product = await Product.findById(id)
      
      return product
    } catch (error) {
      throw new Error("err while geting product")
    }
 }

 const findProductAndEdit = async(editedProduct,id)=>{
    try {
        const response = await Product.findByIdAndUpdate(id,editedProduct)
        clearCache()
        return response 
    } catch (error) {
        return res.status(500).json("error editing product")
    }
 }

 const findProductAndDelete = async(id)=>{
    try {
        const response = await Product.findByIdAndDelete(id)
        clearCache()
        return response
    } catch (error) {
        throw new Err("error while deleting product")
    }
 }

 const findCartProducts = async(productIds)=>{
    try {
        const products = await Product.find({_id:{$in:productIds}})
        return products
    } catch (error) {
        throw new Error("error getting cart products","",error.message)
    }
 }

 const findSearchedProducts = async(query)=>{
   try {
      const products = await Product.find({productName:new RegExp(query,"i")})
      return products
   } catch (error) {
       throw new Error("error searching products " + " " + error.message) 
   }
 }

 const sortProducts = async(sort)=>{
  try {
    // let sortOption = {};
    const limit = 1;
    // const skip = (currentPage - 1) * limit
    // console.log(skip,"skip");
    if (sort === "latest")    sortOption = { createdAt: -1 }; // Newest first
    if (sort === "lowprice")  sortOption = { offerPrice: 1 }; // Low to high
    if (sort === "highprice") sortOption = { offerPrice: -1};
     const products = await Product.find().sort(sortOption).limit(limit)
     return products
  } catch (error) {
     throw new Error("error while sorting" + " " + error.message) 
  }
 }

 module.exports = {
    insertProduct,
    findAllProducts,
    findProductById,
    findProductAndEdit,
    findProductAndDelete,
    findCartProducts,
    findSearchedProducts,
    sortProducts
}