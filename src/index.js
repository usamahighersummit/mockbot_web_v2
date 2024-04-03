import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactGA from "react-ga4";
// Bringing in the GoogleOAuthProvider from the package


import AppState from "./context/AppState";
import amplitude from "amplitude-js";





ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);

const root = ReactDOM.createRoot(document.getElementById("root"));
amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY, null, {
  // optional configuration options
  includeUtm: true,
  includeGclid: true,
  includeReferrer: true,
});
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API}>


        <AppState>
          <App />
        </AppState>
 
   
  </GoogleOAuthProvider>
);



reportWebVitals();
