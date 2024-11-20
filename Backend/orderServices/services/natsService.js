const natsConnection = require("../natsConnections/connection")


const retrievingProducts = async(productIds)=>{
    try {
        const ns = await natsConnection()
        const requestSubject = `get.product.details`;
        const responseSubject = `get.product.response`; 

        const response = await nc.request(requestSubject, JSON.stringify(productIds), { timeout: 5000 });
        const products = JSON.parse(response.data);

        console.log(products);

        return products
        
        
    } catch (error) {
        
    }
}