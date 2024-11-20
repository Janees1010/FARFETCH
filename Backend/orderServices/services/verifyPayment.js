const crypto = require("crypto")
require("dotenv").config()

const verifyRzpPayment = (paymentDetails)=>{
    try {
        const {order_id,payment_id,payment_signature} = paymentDetails;
        const generatedSugnature = crypto.createHmac("sha256",process.env.RZP_SECRET_KEY)
        .update(order_id + "|" + payment_id)
        .digest("hex")

        if(payment_signature === generatedSugnature){
            return {message:"verified"}
        }else{
            return {message:"notverified"}
        }

    } catch (error) {
        throw new Error("payment not verified" + " " + error.message )
    }
}


module.exports = verifyRzpPayment