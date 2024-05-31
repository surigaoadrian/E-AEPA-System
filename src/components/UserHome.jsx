import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Container } from "@mui/material/";
import logo from "../assets/logo.png";
import Animated from "./motion";

function UserHome() {
	const [loggedUserData, setLoggedUserData] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userID = sessionStorage.getItem("userID");
				const response = await axios.get(
					`http://localhost:8080/user/getUser/${userID}`
				);

				setLoggedUserData(response.data);
				console.log(userID);
				console.log(response.data);
			} catch (error) {
				if (error.response) {
					// Not in 200 response range
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				} else {
					console.log(`Error: ${error.message}`);
				}
			}
		};

		fetchUser();
	}, []);

	// Function to format date as "May 27, 2024"
	const formatDate = (date) => {
		const options = { month: "long", day: "numeric", year: "numeric" };
		return new Date(date).toLocaleDateString("en-US", options);
	};

	const getWeekday = (date) => {
		const options = { weekday: "long" };
		return new Date(date).toLocaleDateString("en-US", options);
	};

	return (
		<Animated>
			{/* Main */}
			<Box
				sx={{
					backgroundColor: "white",
					borderRadius: "10px",
					width: "80vw",
					height: "85vh",
					margin: "25px 0px 0px 43px",
					boxShadow: "3px 4px 15px rgba(0, 0, 0, 0.3)",
				}}
			>
				<Box
					component="header"
					sx={{
						backgroundColor: "#8C383E",
						borderRadius: "10px 10px 0 0",
					}}
				>
					<Container sx={{ padding: 1 }}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column-row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Box>
								<Typography
									variant="h5"
									sx={{
										color: "white",
										fontWeight: 600,
										fontSize: "25px",
									}}
								>
									Hello, {loggedUserData ? loggedUserData.fName : "User"}!
								</Typography>
							</Box>

							<Box
								component="img"
								src={logo}
								alt="Logo"
								sx={{
									width: "80px",
									height: "auto",
								}}
							/>
							<Typography
								variant="body1"
								sx={{
									color: "white",
									fontWeight: 500,
									fontFamily: "Poppins",
									textAlign: "center",
								}}
							>
								{formatDate(new Date())} - {getWeekday(new Date())}
							</Typography>
						</Box>
					</Container>
				</Box>

				<Typography
					variant="body1"
					sx={{
						fontFamily: "Poppins",
						fontSize: "16.5px",
						mt: 2,
						textAlign: "justify",
						pl: "3%",
						pr: "4%",
					}}
				>
					Welcome to the{" "}
					<span style={{ fontWeight: 600, color: "#8C383E" }}>
						Expanded Administrative Employee Performance Appraisal (e-AEPA)
						System.
					</span>{" "}
					<br />
					<br /> At CIT-U, we are committed to enhancing the way we evaluate our
					team. The e-AEPA system is designed to modernize and streamline the
					employee evaluation process, transitioning from traditional manual
					Excel-based assessments to a comprehensive digital platform.
				</Typography>

				<Typography
					sx={{
						fontFamily: "Poppins",
						fontSize: "16.5px",
						mt: 1,
						textAlign: "justify",
						pl: "3%",
						pr: "4%",
					}}
				>
					With a focus on{" "}
					<span style={{ color: "#F8C720", fontWeight: 600 }}>
						efficiency, accuracy,
					</span>{" "}
					and
					<span style={{ color: "#F8C720", fontWeight: 600 }}>
						{" "}
						transparency,
					</span>{" "}
					e-AEPA serves as a vital tool in empowering our HR personnel to make
					well-informed decisions about employee development and retention.
					Embrace the future of employee evaluations with us, where technology
					drives organizational effectiveness and ensures a seamless evaluation
					workflow for all our probationary and regular employees.
				</Typography>
			</Box>
		</Animated>
	);
}

export default UserHome;
