import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./app/App";
import { StoreProvider } from "./app/providers/StoreProvider";
import { RouterProvider } from "./app/providers/RouterProvider";
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <StoreProvider>
            <RouterProvider>
                <App />
            </RouterProvider>
        </StoreProvider>
    </React.StrictMode>
);

// Métricas de rendimiento
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Registrar Service Worker para cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/depositoDW_v2/sw.js')
      .then((registration) => {
        console.log('✅ SW registrado: ', registration);
      })
      .catch((registrationError) => {
        console.log('⚠️ SW registro falló (esto es normal en desarrollo): ', registrationError);
      });
  });
}
