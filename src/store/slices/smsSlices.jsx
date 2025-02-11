import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  phoneNumber: "",
  countryCode: "",
  email: "",
  role: "", // Store the role globally
}
const SmsSlice = createSlice({
  name: "SMS",
  initialState: {
    phoneNumber: "",
    countryCode: "",
    email: "",
    role: "", // Store the role globally
  },
  reducers: {
    setMobileSignIn(state, action) {
      (state.phoneNumber = action.payload.phoneNumber),
        (state.countryCode = action.payload.countryCode);
    },
    setEmailSignIn(state, action) {
      state.email = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload; 
    },
    resetStaterole: () => initialState,
  },
});

export const { setMobileSignIn, setEmailSignIn, setRole,resetStaterole } = SmsSlice.actions;
export default SmsSlice.reducer;
