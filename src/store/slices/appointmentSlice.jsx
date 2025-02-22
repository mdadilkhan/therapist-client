import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: "appointmentType",
  initialState: {
    res:null
  },
  reducers: {
    appointmentDetails(state, action) {
      Object.assign(state, action.payload);
    },
    // Resets the state to the initial empty object
    resetAppointmentDetails() {
      return {};
    },
    detailsStore(state,action){
        console.log("hello details Store is dispatch");
        state.res=action.payload;
      // Object.assign(state, action.payload);

    },

  },
});

export default appointmentSlice.reducer;
export const { appointmentDetails, resetAppointmentDetails,resetState,detailsStore} = appointmentSlice.actions;