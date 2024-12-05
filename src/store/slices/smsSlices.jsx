import { createSlice } from "@reduxjs/toolkit";

const SmsSlice = createSlice({
  name: "SMS",
  initialState: {
    phoneNumber: "",
    countryCode: "",
    email: "",
  },
  reducers: {
    setMobileSignIn(state, action) {
      (state.phoneNumber = action.payload.phoneNumber),
        (state.countryCode = action.payload.countryCode);
    },
    setEmailSignIn(state, action) {
      state.email = action.payload;
    },
  },
});
export const { setMobileSignIn, setEmailSignIn } = SmsSlice.actions;
export default SmsSlice.reducer;
