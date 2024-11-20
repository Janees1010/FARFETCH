const {insertOrder} = require("../repositiry/orderRepository")


const saveOrder = async(order)=>{
  try {
     const response = await insertOrder(order)
     return response
  } catch (error) {
       throw new Error(error.message)
  }
}

module.exports = saveOrder;