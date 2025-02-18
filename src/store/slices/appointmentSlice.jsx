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
    detailsStore(state,action){
      Object.assign(state, action.payload);

    },

  },
});

export default appointmentSlice.reducer;
export const { appointmentDetails, resetAppointmentDetails,resetState,detailsStore} = appointmentSlice.actions;