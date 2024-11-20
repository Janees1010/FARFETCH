const createRazorpayOrder = require("../services/orderService")
const verifyRzpPayment = require("../services/verifyPayment")
const saveOrder = require("../services/saveOrderService")
const getOrders = require("../services/getOrdersService")
const getAllOrders = require("../services/getAllOrdersService")
const updateOrderStatusService = require("../services/changeOrderStatusService")


const createOrder = async(req,res)=>{
    try {
       const {amount} = req.body;
       if(!amount) return res.status(400).json({successs:false,error:"Amount is required"})
       const response  = await  createRazorpayOrder(amount)
       return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const verifyPayment = async(req,res)=>{
    try {
        const response  =  await verifyRzpPayment(req.body)
        return res.status(200).json(response)
    } catch (error) {
       return res.status(500).json(error.message)   
    }
}

const handlesaveOrder = async(req,res)=>{
    try {
        const response  =  await saveOrder(req.body)
        return res.status(200).json(response)  
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const fetchOrders = async(req,res)=>{
    try {
        const {id} = req.params;
        console.log(id);
        
        if(!id) return res.status(400).json({successs:false,error:"UserId is required"})
        const orders = await getOrders(id)
        return res.status(200).json({message:"orders fetched successfully",orders})
    } catch (error) {
       return res.status(500).json(error.message)  
    } 
}

const fetchAllOrders = async(req,res)=>{
  try { 
    const orders = await getAllOrders()
    return res.status(200).json({success:true,orders})
  } catch (error) {
     return res.status(500).json(error.message)
  }
}
      
const changeOrderStatus = async(req,res)=>{
    try { 
        const response = await updateOrderStatusService(req.body)
        console.log(response);
        
        return res.status(200).json({success:true,response})
    } catch (error) {
        return res.status(500).json(error.message)   
    } 
}
       
module.exports = {
    createOrder,
    verifyPayment,
    handlesaveOrder,
    fetchOrders,
    fetchAllOrders,
    changeOrderStatus
}