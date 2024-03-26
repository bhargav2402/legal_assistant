import React from "react";
// import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import "./index.css";

const AppWrapper = () => {
	return (
		// <Auth0Provider
		// 	domain={"dev-5jmtzlok7krwi77v.us.auth0.com"}
		// 	clientId={"vzUywLFt1sPUkg5mDeEplCLkbVW7cz83"}
		// 	authorizationParams={{
		// 		redirect_uri: window.location.origin,
		// 	}}
		// >
		<Router>
			<AppRoutes />
		</Router>
		// </Auth0Provider>
	);
};

const root = createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
