import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: "appointmentType",
  initialState: {},
  reducers: {
    // Updates the state with the payload
    appointmentDetails(state, action) {
      Object.assign(state, action.payload);
    },
    // Resets the state to the initial empty object
    resetAppointmentDetails() {
      return {};
    },
  },
});

export default appointmentSlice.reducer;
export const { appointmentDetails, resetAppointmentDetails } = appointmentSlice.actions;