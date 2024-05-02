import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ForgottenPassForm(props) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (props.messageInfo.message) {
			setVisible(true);
			const timer = setTimeout(() => {
				setVisible(false);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [props.messageInfo.message]);

	const messageStyle = {
		display: "flex",
		backgroundColor:
			props.messageInfo.type === "success" ? "#DFF0D8" : "#FEDCE0",
		fontSize: "13px",
		color: props.messageInfo.type === "success" ? "#6ab04c" : "#8C383E",
		marginTop: "3px",
		width: "100%",
		minheight: "30px",
		alignItems: "center",
		padding: "10px",
		borderRadius: "3px",
	};

	return (
		<div
			style={{
				minHeight: "200px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography
				sx={{
					width: "90%",
					fontFamily: "poppins",
					fontWeight: 500,
					fontSize: "16px",
					color: "#757575",
					marginTop: "15px",
				}}
				variant="body2"
				gutterBottom
			>
				Forgot Password
			</Typography>
			<Typography
				sx={{
					width: "90%",
					fontFamily: "poppins",
					fontWeight: 400,
					fontSize: "13px",
					color: "#757575",
					marginBottom: "0px",
				}}
				variant="body2"
				gutterBottom
			>
				Enter your{" "}
				<span style={{ color: "#EFC800", fontWeight: 500 }}>
					institutional email
				</span>{" "}
				below to receive a password reset link.
			</Typography>

			<form
				onSubmit={props.handleSubmit}
				style={{
					width: "90%",
					marginTop: "20px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<input
					style={props.loginStyles}
					onChange={props.handleEmail}
					type="email"
					placeholder="Institutional Email"
				/>

				<div
					style={{
						alignSelf: "flex-start",
						display: "flex",
						alignItems: "center",
					}}
				></div>

				{props.messageInfo.message && visible && (
					<p style={messageStyle}>{props.messageInfo.message}</p>
				)}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					size="small"
					sx={{
						marginTop: "8px",
						backgroundColor: "#8C383E",
						"&:hover": {
							backgroundColor: "#7C2828",
						},
						fontFamily: "poppins",
					}}
				>
					Send
				</Button>
			</form>
		</div>
	);
}

export default ForgottenPassForm;
