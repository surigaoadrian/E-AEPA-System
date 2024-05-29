import React, { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../index.css";
import LoginForm from "../components/LoginForm";
import logo from "../assets/e-AEPA-logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isForgottenBtn, setIsForgottenBtn] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleInputUsername = (e) => {
		setUsername(e.target.value);
	};

	const handleInputPassword = (e) => {
		setPassword(e.target.value);
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleForgotPassword = () => {
		setIsForgottenBtn(!isForgottenBtn);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setMessage("");
		try {
			const response = await axios.post("http://localhost:8080/login", {
				username: username,
				password: password,
			});

			const token = response.data.token;
			localStorage.setItem("token", token);

			const decodedToken = jwtDecode(token);
			const role = decodedToken.role;
			const userID = decodedToken.userID;

			sessionStorage.setItem("userRole", role);
			sessionStorage.setItem("userID", userID);

			navigate("/");
		} catch (error) {
			setTimeout(() => setMessage("Invalid username or password."), 0);
			console.error("Login failed", error);
		}
	};

	const centerDiv = {
		minHeight: "95vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};

	const loginStyles = {
		fontSize: "14px",
		width: "100%",
		backgroundColor: "#f1f2f6",
		border: "none",
		borderRadius: "3px",
		padding: "10px",
		marginBottom: "10px",
	};

	const ForgotPassBtn = styled(NavLink)({
		marginTop: "20px",
		textDecoration: "none",
		background: "none",
		fontFamily: "poppins",
		color: "#757575",
		fontSize: "12px",
		border: "none",
		cursor: "pointer",
		"&:hover": {
			color: "#575757",
			textDecoration: "underline",
		},
	});

	return (
		<div style={centerDiv}>
			<Card
				sx={{
					width: "320px",
					minHeight: "410px",
					borderRadius: "10px",
				}}
			>
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }} 
					exit={{ opacity: 0, x: -100 }} 
					transition={{ duration: 0.2 }}
				>
					<CardContent
						sx={{
							display: "flex",
							minHeight: "300px",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div style={{ height: "80px" }}>
							<img style={{ width: "195px" }} src={logo} alt="e-aepa-logo" />
						</div>

						<LoginForm
							loginStyles={loginStyles}
							handleInputUsername={handleInputUsername}
							handleInputPassword={handleInputPassword}
							handleShowPassword={handleShowPassword}
							showPassword={showPassword}
							handleLogin={handleLogin}
							message={message}
						/>

						<ForgotPassBtn to={"/forgotPassword"}>
							Forgot Password?
						</ForgotPassBtn>
					</CardContent>
				</motion.div>
			</Card>
		</div>
	);
}

export default LoginPage;
