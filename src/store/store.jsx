// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import userReducer from "./slices/userSlices";
// import storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from "redux-persist";
// import preAppointmentReducer from "./slices/preAppointmentSlice";
// import sessAppointmentReducer from "./slices/preAppointmentSlice";
// import appointmentReducer from "./slices/appointmentSlice";
// import groupSessationReducer from "./slices/groupsessationSlice";
// import smsReducer from "./slices/smsSlices";

// const rootReducer = combineReducers({
//   userDetails: userReducer,
//   preAppointmentDetails: preAppointmentReducer,
//   appointmentDetails: appointmentReducer,
//   groupSessationDetails: groupSessationReducer,
//   smsData: smsReducer,
// });

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
//   whitelist: [
//     "userDetails",
//     "smsData",
//     "appointmentDetails",
//     "preAppointmentDetails",
//   ],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const counsellorStore = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddlware) =>
//     getDefaultMiddlware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(counsellorStore);



import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";

// Import your reducers
import userReducer from "./slices/userSlices";
import preAppointmentReducer from "./slices/preAppointmentSlice";
import appointmentReducer from "./slices/appointmentSlice";
import groupSessationReducer from "./slices/groupsessationSlice";
import smsReducer from "./slices/smsSlices";

// Combine reducers
const rootReducer = combineReducers({
  userDetails: userReducer,
  preAppointmentDetails: preAppointmentReducer,
  appointmentDetails: appointmentReducer,
  groupSessationDetails: groupSessationReducer,
  smsData: smsReducer,
});

// Configure persist with encryption
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
  transforms: [
    encryptTransform({
      secretKey: "EnsoInnovationLab", // Replace with a strong key
      onError: function (error) {
        console.error("Encryption error:", error);
      },
    }),
  ],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const counsellorStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignore non-serializable warnings
    }),
});

// Create persistor
export const persistor = persistStore(counsellorStore);
