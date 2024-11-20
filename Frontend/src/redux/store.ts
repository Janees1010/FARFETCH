import  { configureStore } from "@reduxjs/toolkit"
import  userSlice  from "./slices/userSlicer"
import  productSlice  from "./slices/productSlicer"
import  cartSlice  from "./slices/cartSlicer"

export  const store = configureStore({
    reducer:{
        userDetails:userSlice,
        products:productSlice,
        cart:cartSlice
        
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore["dispatch"]