const Cart = require("../models/cart");
const connectToNats = require("../natsConnection/connection")

const findCartByUserId = async (userId) => {  
    return await Cart.findOne({ userId });
};



const getProductsFromProductService = async (productIds) => {
    try {
        const nc = await connectToNats();
        const requestSubject = `get.product.details`;
        const responseSubject = `get.product.response`; 

        
        nc.publish(requestSubject, JSON.stringify(productIds));

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
    } catch (err) {
        throw new Error('Failed to connect or publish to NATS: ' + err.message);
    }
};

const findCartProducts = async (userId) => {
    try {
        console.log(userId,"userId");
        
        const cart = await findCartByUserId(userId);
        console.log(cart,"avv");
        
        if (!cart) throw new Error('Cart not found for user ID: ' + userId); 
        const productIds = cart.products.map((pro) => pro.productId);
        console.log(productIds);
        
        const products = await getProductsFromProductService(productIds);
        console.log(products,"product");
        
        const cartWithProductDetails = cart.products.map(cartItem => {
            const productDetail = products.find(prod => prod._id.toString() === cartItem.productId.toString());
            return {
                ...productDetail,
                quantity: cartItem.quantity,
                selectedColor:cartItem.color,
                selectedSize:cartItem.size 
            };
        }); 
        console.log(cartWithProductDetails);
        
        return cartWithProductDetails;

    } catch (error) {
        throw new Error("Error while finding cart products: " + error.message);
    }
};


const insertProductToCart = async (product) => {
    try {    
        const {userId,productId,quantity,color,size} = product
             
        let cart = await findCartByUserId(userId);
        // console.log(cart);
        
        if (cart) {
            const product = cart.products.find(p => p.productId.equals(productId)); 
            
            if (product && product.color === color && product.size === size ) {
                   product.quantity += 1;     
            } else {
                cart.products.push({ productId, quantity: 1,color,size });
            }
        } else {
            
            cart = new Cart({
                userId,
                products: [{ productId,quantity,color,size }],
            }); 
        }

        const response = await cart.save();
        return response;

    } catch (error) {
        throw new Error("Error while adding product to cart: " + error.message);
    }
};

const quantityIncrement = async(userId,productId)=>{
  try {
     const cart = await findCartByUserId(userId)

     if(!cart) throw new Error("cart not found")
     
        const response = await Cart.updateOne({userId,"products.productId":productId},{
            $inc:{"products.$.quantity":1}
        })

        return response
        
 
  } catch (error) {
      throw new Error("error incrimenting product quantity")
  }
}

const quantityDecrement = async(userId,productId)=>{
    try {
        
       const cart = await findCartByUserId(userId) 
       
       if(!cart) throw new Error("cart not found")

          const product = cart.products.find(p => p.productId.equals(productId));
          
          if(product.quantity > 1){
             const response  = await Cart.updateOne({userId,"products.productId":productId},{
                $inc:{"products.$.quantity":-1}
             })
             console.log(response);
             
             return response
          }else{
            const response = await Cart.updateOne({userId,"products.productId":productId},{
                $pull:{products:{productId}}
            })
           return response 
       }
    } catch (error) {
      throw new Error("error while decreasing product quantity"," " + error.message)
    }
}

const deletUserCart = async(userId)=>{
    try {
        const  response  = await Cart.deleteOne({userId})
        return response 
    } catch (error) {
         throw new Error("error deleting user cart" + " " + error.message)
    }
}

module.exports = {
    insertProductToCart,
    quantityIncrement,
    quantityDecrement,
    findCartByUserId,
    findCartProducts,
    deletUserCart
};
   