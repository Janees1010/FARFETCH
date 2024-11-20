import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    _id: string;
    productName: string;
    price: number;
    offerPrice: number;
    quantity: number;
    color: string[];
    size: string[];
    selctedSize:string,
    selectedColor:string,
    images: string[];
}

const initialState: CartItem[] = []; // Set as an array to hold multiple items

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action: PayloadAction<CartItem>) => {
            const exists = state.find(product => product._id === action.payload._id);
            if (!exists) {
              state.push(action.payload); 
            }
        },
        // addCartItemQuantity: (state, action) => {
        //     const item = state.find((item) => item._id === action.payload);
        //     if (item) {
        //         item.quantity += 1; // Directly mutating the item’s quantity
        //     }
        // },
        // reduceCartItemQuantity: (state, action) => {
           
            
        //     const item = state.find((item) => item._id === action.payload);
        //     console.log(item,"item");
        //     if (item) {
        //         item.quantity -= 1;
        //     }
        //     // Remove items with quantity <= 0
        //     return state.filter((it) => it.quantity > 0);
        // },
        
  }
});

export const { addItemToCart} = cartSlice.actions;
export default cartSlice.reducer; 
