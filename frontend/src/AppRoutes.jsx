import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Login from "./Login/Login";
import Docs from "./components/Docs";
import Navbar from "./components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";
import Search from "./Search";
import PredictionComponent from "./components/Prediction";
import ChatPage from "./ChatPage";

const AppRoutes = () => {
	const { isLoading } = useAuth0();

	useEffect(() => {
		const checkLoadingStatus = () => {
			if (isLoading) {
				setTimeout(checkLoadingStatus, 10);
			}
		};

		if (isLoading) {
			checkLoadingStatus();
		}
	}, [isLoading]);

	return !isLoading ? (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<ChatPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/login2" element={<Login />} />

				<Route path="/docs" element={<Docs />} />
				<Route path="/search" element={<Search />} />
				<Route
					path="/prediction"
					element={<PredictionComponent />}
				/>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</>
	) : (
		<Loading />
	);
};

export default AppRoutes;
