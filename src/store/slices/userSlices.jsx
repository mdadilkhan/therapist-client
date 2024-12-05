import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    error: false,
    loading: false,
    email: "",
  },
  reducers: {
    userDetails(state, action) {
      Object.assign(state, action.payload);
    },
    setUserEmail(state, action) {
      state.email = action.payload;
    },
  },
});
export default userSlice.reducer;
export const { userDetails, setUserEmail } = userSlice.actions;
