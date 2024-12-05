import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { counsellorStore,persistor } from './store/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from "./socketProvider.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={counsellorStore}>
    <SocketProvider>
    <PersistGate loading={null} persistor={persistor}>
     <App />
    </PersistGate>
    </SocketProvider>
  </Provider>,
)
