const {findAllOrders} = require("../repositiry/orderRepository")

const getAllOrders = async()=>{
    try {
        const orders = await findAllOrders()
        return orders
    } catch (error) {
         throw new Error(error.message)
    }
}


module.exports = getAllOrders