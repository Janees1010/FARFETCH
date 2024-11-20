const {findCartProducts} = require("../repository/productRepository")


const subscribeMessage = async(nc) => {
    const sub = nc.subscribe('get.product.details');
   
    
    (async () => {     
        for await (const msg of sub) {
            const productIds = JSON.parse(msg.data) 
            const products = await findCartProducts(productIds)
            console.log(products,"pro");
            nc.publish('get.product.response',JSON.stringify(products))   
        }
    })().catch(err => { 
        console.error(`Error in subscriber: ${err.message}`);   
    });
  
};

module.exports = {subscribeMessage };

