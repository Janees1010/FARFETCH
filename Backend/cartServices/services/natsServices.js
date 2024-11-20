const {deletUserCart} = require("../repository/cartRepository")

const subscribeMessage = async(nc)=>{
    try {
        const sub = nc.subscribe("delete.user.cart")
        for await (msg of sub){
           const userId = JSON.parse(msg.data)
           const response = await deletUserCart(userId)
           console.log(response);
           
        //    if(response){
        //       nc.publish("user.cart.deleted",JSON.stringify(response))
        //    }
        }
    } catch (error) {
        
    }
}

module.exports = subscribeMessage;