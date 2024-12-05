import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import preAppointmentReducer from "./slices/preAppointmentSlice";
import sessAppointmentReducer from "./slices/preAppointmentSlice";
import appointmentReducer from "./slices/appointmentSlice";
import groupSessationReducer from "./slices/groupsessationSlice";
import smsReducer from "./slices/smsSlices";

const rootReducer = combineReducers({
  userDetails: userReducer,
  preAppointmentDetails: preAppointmentReducer,
  appointmentDetails: appointmentReducer,
  groupSessationDetails: groupSessationReducer,
  smsData: smsReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "userDetails",
    "smsData",
    "appointmentDetails",
    "preAppointmentDetails",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const counsellorStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(counsellorStore);
