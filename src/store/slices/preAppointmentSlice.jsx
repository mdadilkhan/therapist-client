import { createSlice } from "@reduxjs/toolkit";

const preAppointmentSlice = createSlice({
  name: "preAppointmentDetails",
  initialState: {},
  reducers: {
    // Updates the state with the payload
    preAppointmentDetails(state, action) {
      Object.assign(state, action.payload);
    },
    // Resets the state to the initial empty object
    resetPreAppointmentDetails() {
      return {};
    },
  },
});

export default preAppointmentSlice.reducer;
export const { preAppointmentDetails, resetPreAppointmentDetails } = preAppointmentSlice.actions;