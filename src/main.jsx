import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./ReduxTemp/Store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-14mm067skp27pss.us.auth0.com"
      clientId="DAG3MTJb3IVLIqLxXodCroiqYddI4wXs"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
);
