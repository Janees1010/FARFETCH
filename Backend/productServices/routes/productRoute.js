const express = require("express")
const router = express.Router()
const {
    addProduct,
    getProducts,
    getProductById,
    editProduct,
    deleteProdudct,
    productSearchHandler,
    productSortHandler
} =require("../controller/productController")
const {upload} = require("../middlewares/uploadImages")
   
              


router.get("/fetch-products/:currentPage/:category",getProducts)

router.get("/product/:id",getProductById)
router.get("/",getProducts)
router.get("/sort/:option",productSortHandler)
router.post("/addproduct", upload.array('images', 5), addProduct);
router.post("/editproduct/:id", upload.array('images', 5),editProduct)
router.get("/deleteproduct/:id",deleteProdudct)
router.get("/search/:query",productSearchHandler)

module.exports = router;                   