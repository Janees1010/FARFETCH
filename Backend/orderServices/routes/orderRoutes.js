const express = require("express")
const router = express.Router()
const {
    createOrder,
    verifyPayment,
    handlesaveOrder,
    fetchOrders,
    fetchAllOrders,
    changeOrderStatus
} = require("../controller/orderController")


router.post("/create-order",createOrder)
router.post("/save-order",handlesaveOrder)
router.post("/verify-payment",verifyPayment)
router.get("/orders",fetchAllOrders)
router.get("/orders/:id",fetchOrders)
router.post("/order/status-change",changeOrderStatus)

module.exports = router ;  