import { createSlice,PayloadAction } from "@reduxjs/toolkit";


// type productType = {

// }
export interface productType {
    _id?: string ;
    productName: string;
    price: number;
    offerPrice: number;
    category: string;
    quantity: number;
    size: string[];
    color: string[];
    images: string[];
    description: string; // Add this line to include description
  }

const initialState:productType[] = []

export const productSlice = createSlice({
    name:"product",
    initialState,
    reducers:{
      setProducts: (state, action: PayloadAction<productType[]>) => {
          return action.payload; // Replace state with new products
      },
        addProduct:(state,action:PayloadAction<productType>)=>{
            const exists = state.find(product => product._id === action.payload._id);
            if (!exists) {
              state.push(action.payload); // Only add if it doesn't exist
            }
        }
    }

})

export const { addProduct,setProducts } = productSlice.actions;
export default productSlice.reducer;

