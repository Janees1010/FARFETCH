const {updateOrderStatus} = require("../repositiry/orderRepository")

const updateOrderStatusService = async(data)=>{
    try {
        const response = await updateOrderStatus(data) 
        return response;
    } catch (error) {
      throw new Error(error.message)   
    }
}

module.exports = updateOrderStatusService