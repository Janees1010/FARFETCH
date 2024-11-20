const Razorpay = require("razorpay")
require("dotenv").config()

const razorpay = new Razorpay({
    key_id: process.env.RZP_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RZP_SECRET_KEY // Your Razorpay Secret Key
  });
  

const createRazorpayOrder = async(amount)=>{
  try {
    const options = {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
    };
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
      throw new Error("error while creating order" + error.message)
  }
}


module.exports = createRazorpayOrder