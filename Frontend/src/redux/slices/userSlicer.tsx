import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

interface initialStateType {
  _id:string | null,
  username: string | null;
  email: string | null;
  token?: string | null;
  role: String | null;
}

const initialState: initialStateType = {
  _id:null,
  username: null,
  email: null,
  token: null,
  role: null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<initialStateType>) => {
      state._id = action.payload._id
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.role = action.payload?.role
    },
  },
});

export const { addUser } = userSlice.actions;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default userSlice.reducer;
