import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
// import Login from "./Login/Login";
import Docs from "./components/Docs";
import Navbar from "./components/Navbar";
import Search from "./Search";
import PredictionComponent from "./components/Prediction";
import ChatPage from "./ChatPage";

const AppRoutes = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<ChatPage />} />
				{/* <Route path="/login" element={<Login />} /> */}
				{/* <Route path="/login2" element={<Login />} /> */}

				<Route path="/docs" element={<Docs />} />
				<Route path="/search" element={<Search />} />
				<Route
					path="/prediction"
					element={<PredictionComponent />}
				/>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</>
	);
};

export default AppRoutes;
