const {getOrderByUserId} = require("../repositiry/orderRepository")

const getOrders = async(userId)=>{
   try {
      const  orders = await getOrderByUserId(userId)
      return orders
   } catch (error) {
      throw new Error(error.message)
   }
}

module.exports = getOrders;