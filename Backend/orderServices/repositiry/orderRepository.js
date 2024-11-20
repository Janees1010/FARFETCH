const Order = require("../models/orderModel")
const natsConnection = require("../natsConnections/connection")

const insertOrder = async(order)=>{
    try {
        const {user,products,paymentMethod,status,shippingAddress,totalAmount,checkoutType} = order
        const newOrder = new Order({
            user,
            items:products,
            status,
            paymentMethod,
            totalAmount,
            shippingAddress
        })
        if(checkoutType === "cartCheckout" ){
            const nc = await natsConnection()
            nc.publish("delete.user.cart",JSON.stringify(user))
        }
        const response  = await newOrder.save()
        return response
    } catch (error) {
        throw new Error("error saving order" + " " + error.message)
    }
}


const retrievingProducts = async(productIds)=>{
    try {
        const nc = await natsConnection()
        const requestSubject = `get.product.details`;
        const responseSubject = `get.product.response`; 

        nc.publish(requestSubject,JSON.stringify(productIds));
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Product service did not respond in time.'));
            }, 5000); 


            const sub = nc.subscribe(responseSubject, { max: 1 });
            (async () => {
                for await (const msg of sub) {
                    clearTimeout(timeout);
                    const products = JSON.parse(msg.data); 
                    resolve(products);
                }
            })().catch(err => reject(new Error(`Error in subscription: ${err}`)));
        });
    } catch (error) {
        throw new Error("error while geitng product details" + " " + error.message)   
    }
}

const getOrderByUserId = async(userId)=>{
    try {
        const orders = await Order.find({ user: userId });
        const productIds = orders.flatMap(order =>
            order.items.map(item => item.product)
        );
        const products = await retrievingProducts(productIds)  
        const getOrdersWithProducts = orders.flatMap(order => { 
            return order.items.map(item => {
                const productDetails = products.find( pro => pro._id === item.product.toString()); 
                return {
                    ...productDetails, // Spread product details into the new object
                    size: item.size, 
                    color: item.color, 
                    quantity: item.quantity,
                    status:order.status 
                };
            });
        });  
        return getOrdersWithProducts
        
    } catch (error) {
        throw new Error("error while fetching orders" + " " + error.message)
    }
}

const findAllOrders = async()=>{
    try {
        const orders = await Order.find()
        const productIds = orders.flatMap(order =>
            order.items.map(item => item.product)
        );
        const products = await retrievingProducts(productIds)
        const getOrdersWithProducts = orders.flatMap(order => { 
            return order.items.map(item => {
                const productDetails = products.find( pro => pro._id === item.product.toString()); 
                return {
                    ...productDetails, // Spread product details into the new object
                    size: item.size, 
                    color: item.color, 
                    quantity: item.quantity,
                    status:order.status ,
                    deliveryDetails:order.shippingAddress,
                    orderId:order._id
                };
            });
        });  
       
        return getOrdersWithProducts

    } catch (error) {
           throw new Error("error fetching orders" + " " + error.message)
    }
}

const updateOrderStatus = async(data)=>{
    try {
        const {orderId,status} = data
        console.log(orderId,status);
        
        const response  = await Order.updateOne({_id:orderId},{$set:{status}})
        console.log(response);
        
        return response
    } catch (error) {
       throw new Error("error changing status" + " " + error.message)      
    }
}    


module.exports = {
    insertOrder,
    getOrderByUserId,
    findAllOrders,
    updateOrderStatus
}