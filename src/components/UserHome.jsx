import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material/";
import logo from "C:/Users/Zan/Documents/GitHub/E-AEPA-System/src/assets/cit.png";

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

	return (
		<Box
			sx={{
				position: "relative", // Position relative to allow positioning of the maroon border
				zIndex: 0, // Set zIndex to ensure the main box is below the border
			}}
		>
			{/* Maroon border design */}
			<Box
				sx={{
					position: "absolute", // Position absolute to overlay on the main box
					top: 0,
					left: 26,
					width: "1.5%",
					height: "100%",
					backgroundColor: "#8C383E",
					borderRadius: "10px 0px 0px 10px", // Add borderRadius to match the main box
					zIndex: 1, // Set higher zIndex to ensure the border appears in front
				}}
			/>

			{/* Main content */}
			<Box
				sx={{
					backgroundColor: "white",
					borderRadius: "10px",
					width: "82vw",
					height: "86vh",
					margin: "1.5% 17px 0px 2%",
					boxShadow: "3px 4px 10px rgba(0, 0, 0, 0.3)",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}
				>
					<img
						src={logo}
						alt="CIT"
						style={{
							width: "30%",
							height: "auto",
						}}
					/>
				</Box>

				{loggedUserData && (
					<Typography
						variant="h4"
						sx={{
							fontFamily: "Poppins",
							fontSize: "1.5em",
							width: "20%",
							ml: 2,
							mt: 1,
							bgcolor: "#F8C720",
                            borderRadius: "0px 60px 60px 0px",
                            py: ".5%",
						}}
					>
						<span style={{marginLeft: "45px"}}>
							Hi,{" "}
							<span style={{ fontWeight: 600 }}>{loggedUserData.fName}</span>
						</span>
					</Typography>
				)}

				<Typography
					variant="body1"
					sx={{
						fontFamily: "Poppins",
						fontSize: "1em",
						maxWidth: "100%",
						mt: 1,
						textAlign: "justify",
						px: "5%",
					}}
				>
					Welcome to the{" "}
					<span style={{ fontWeight: 600, color: "#8C383E" }}>
						Expanded Administrative Employee Performance Appraisal (e-AEPA)
						System
					</span>{" "}
					at CIT-U, we are committed to enhancing the way we evaluate our team.
					The e-AEPA system is designed to modernize and streamline the employee
					evaluation process, transitioning from traditional manual Excel-based
					assessments to a comprehensive digital platform.
				</Typography>

				<Typography
					sx={{
						fontFamily: "Poppins",
						fontSize: "1em",
						mt: 1,
						textAlign: "justify",
						px: "5%", // Adjust padding for left and right spacing
					}}
				>
					With a focus on efficiency, accuracy, and transparency, e-AEPA serves
					as a vital tool in empowering our HR personnel to make well-informed
					decisions about employee development and retention. Embrace the future
					of employee evaluations with us, where technology drives
					organizational effectiveness and ensures a seamless evaluation
					workflow for all our probationary and regular employees.
				</Typography>
			</Box>
		</Box>
	);
}

export default UserHome;
