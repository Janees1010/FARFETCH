const express = require("express")
const { addToCart,quantityIncriment,quantityDecriment,getCartProducts } = require("../controller/cartController")
const router = express.Router()


router.post("/add",addToCart)
router.post("/incriment",quantityIncriment)
router.post("/decriment",quantityDecriment)
router.get("/:id",getCartProducts)


module.exports = router