import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	Container,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Grid,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const theme = createTheme({
	palette: {
		secondary: {
			main: "#8C383E", // Maroon color
		},
	},
});

const tabs = [
	{ label: "3rd Month", value: "1" },
	{ label: "5th Month", value: "2" },
	{ label: "Annual", value: "3" },
];

const yearEvaluations = [
	{ value: " ", label: "Select Year" },
	{ value: "23-24", label: "23-24" },
	{ value: "22-23", label: "22-23" },
	// Add more evaluations here
];

const VerifiedIconWrapper = ({ verified }) => {
	const iconColor = verified ? "green" : "gray"; // Set the color based on the verified value
	return <VerifiedIcon htmlColor={iconColor} />;
};
function base64ToDataURL(base64String) {
	return `data:image/png;base64,${base64String}`;
}

function EmployeeProfile({ user, handleBack }) {
	const containerStyle = {
		borderTop: "1px solid transparent", // Invisible border for separation
		marginTop: "30px",
		padding: 0,
	};

	const [value, setValue] = useState("1");
	const [selectedYearEvaluation, setSelectedYearEvaluation] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [openSecondDialog, setOpenSecondDialog] = useState(false);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleYearEvaluationChange = (event) => {
		setSelectedYearEvaluation(event.target.value);
	};

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleConfirmSendResults = () => {
		// Handle sending results here
		console.log("Sending results...");
		setOpenDialog(false);
		setOpenSecondDialog(true);
	};

	const handleSecondDialogClose = () => {
		setOpenSecondDialog(false);
	};

	const TableComponent = () => {
		const tableHeaderStyle = {
			backgroundColor: "#8C383E",
			color: "white",
		};

		const viewDetailsStyle = {
			color: "maroon",
			textDecoration: "underline",
			cursor: "pointer",
		};

		const columnStyle = {
			width: "160px",
			textAlign: "center",
			backgroundColor: "#8C383E",
			color: "white",
		};

		const iconContainerStyle = {
			display: "flex",
			justifyContent: "center",
		};

		return (
			<TableContainer component={Paper} sx={{ width: "100%" }}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell style={tableHeaderStyle}></TableCell>
							<TableCell style={columnStyle}>
								<Box sx={iconContainerStyle}>Self</Box>
							</TableCell>
							<TableCell style={columnStyle}>
								<Box sx={iconContainerStyle}>Office Head</Box>
							</TableCell>
							<TableCell style={columnStyle}>
								<Box sx={iconContainerStyle}>Peer</Box>
							</TableCell>
							<TableCell style={tableHeaderStyle}></TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<Container
				style={{
					...containerStyle,
					display: "flex",
					justifyContent: "center",
					minWidth: "95%",
				}}
			>
				<Box
					sx={{
						p: 1,
						borderRadius: "5px",
						mb: 2,
						backgroundColor: "white",
						width: "98%",
					}}
				>
					<button
						onClick={handleBack}
						style={{
							color: "#8C383E",
							fontSize: "15px",
							border: "none",
							background: "none",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							margin: "10px 0 5px 20px",
						}}
						onMouseEnter={(e) => {
							e.target.style.textDecoration = "underline";
						}}
						onMouseLeave={(e) => {
							e.target.style.textDecoration = "none";
						}}
					>
						<FontAwesomeIcon
							icon={faArrowLeft}
							style={{ marginRight: "5px" }}
						/>
						Back
					</button>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							margin: "10px 10px 10px 14px",
							width: "97%",
							backgroundColor: "white",
							borderBottom: "2px solid #e0e0e0",
						}}
					>
						<Box sx={{ ml: 8, mb: 2 }}>
							<Avatar
								alt="Employee"
								src={
									user.profilePic
										? base64ToDataURL(user.profilePic)
										: "/user.png"
								}
								sx={{ width: "120px", height: "120px" }}
							/>
						</Box>
						<Box sx={{ ml: 5 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										fontSize="14px"
										color="#9D9D9D"
										mb={1}
									>
										Employee ID:
									</Typography>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										mb={2}
										fontWeight={500}
										fontSize="16px"
									>
										{user.workID}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										fontSize="14px"
										color="#9D9D9D"
										mb={1}
									>
										Name:
									</Typography>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										mb={2}
										fontWeight={500}
										fontSize="16px"
									>
										{`${user.fName} ${user.lName}`}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										mb={1}
										fontSize="14px"
										color="#9D9D9D"
									>
										Position:
									</Typography>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										mb={2}
										fontWeight={500}
										fontSize="16px"
									>
										{user.position}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										fontSize="14px"
										mb={1}
										color="#9D9D9D"
									>
										Department:
									</Typography>
									<Typography
										variant="body2"
										fontFamily="Poppins"
										mb={2}
										fontWeight={500}
										fontSize="16px"
									>
										{user.dept}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box sx={{ mr: 1 }}>
							<Typography
								variant="body2"
								fontFamily="Poppins"
								color="#9D9D9D"
								mb={0.2}
								ml={3}
							>
								Set Year Evaluation:{" "}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<FormControl
								sx={{ m: 1, mr: 94, minWidth: 100, minHeight: 10 }}
								size="small"
							>
								<Select
									id="year-evaluation"
									value={selectedYearEvaluation}
									onChange={handleYearEvaluationChange}
									style={{ padding: 1, fontSize: 12, textAlign: "left" }} // Apply custom styling here
								>
									{yearEvaluations.map((evaluation) => (
										<MenuItem value={evaluation.value} key={evaluation.value}>
											{evaluation.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Button
								variant="contained"
								color="secondary"
								sx={{
									textTransform: "none",
									fontSize: "12px",
									fontFamily: "Poppins",
									width: "140px",
								}}
							>
								View Evaluation
							</Button>
						</Box>
					</Box>
					<Box sx={{ width: "100%", typography: "body1" }}>
						<TabContext value={value}>
							<TabList
								onChange={handleChange}
								aria-label="lab API tabs example"
								indicatorColor="secondary"
								sx={{
									borderBottom: "none",
									marginLeft: "35px",
								}}
							>
								{tabs.map((tab) => (
									<Tab
										label={tab.label}
										value={tab.value}
										key={tab.value}
										sx={{
											textTransform: "none",
											fontFamily: "poppins",
											fontWeight: 500,
										}}
									/>
								))}
							</TabList>
							<TabPanel value="1">
								<TableComponent />
							</TabPanel>
							<TabPanel value="2">
								<TableComponent />
							</TabPanel>
							<TabPanel value="3">
								<TableComponent />
							</TabPanel>
						</TabContext>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<SendIcon sx={{ fontSize: "20px" }} />}
							sx={{
								textTransform: "none",
								fontFamily: "Poppins",
								fontSize: "12px",
								width: "145px",
								ml: 129,
							}}
							onClick={handleDialogOpen}
						>
							Send Results
						</Button>
					</Box>
				</Box>
			</Container>

			{/* Dialog Component */}
			<Dialog
				open={openDialog}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="xs"
				fullWidth
				style={{ margin: "24px 0", paddingBottom: "36px" }}
			>
				<DialogTitle
					id="alert-dialog-title"
					style={{
						textAlign: "center",
						backgroundColor: "#8b2500",
						padding: "40px 16px 0px 16px",
						borderBottom: "1px solid #e0e0e0",
						color: "white",
					}}
				></DialogTitle>
				<DialogContent style={{ textAlign: "center", padding: "24px" }}>
					<b
						style={{
							fontSize: "24px",
							color: "black",
							display: "block",
							margin: "16px 0",
						}}
					>
						Confirm Sending Results
					</b>
					<DialogContentText
						id="alert-dialog-description"
						style={{ color: "grey", textAlign: "center", fontSize: "1rem" }}
					>
						Would you like to forward the results to the head?
					</DialogContentText>
				</DialogContent>
				<DialogActions
					style={{ justifyContent: "center", padding: "10px 10px 16px 10px" }}
				>
					<Button
						variant="contained"
						onClick={handleDialogClose}
						sx={{
							textTransform: "capitalize",
							fontSize: "1rem",
							width: "129px",
							height: "37px",
							backgroundColor: "white",
							color: "black",
							border: "none",
							fontWeight: "600",
							"&:hover": { backgroundColor: "#f5f5f5" },
						}}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleConfirmSendResults}
						autoFocus
						sx={{
							textTransform: "capitalize",
							fontSize: "1rem",
							width: "129px",
							height: "37px",
							border: "none",
							fontWeight: "600",
						}}
					>
						Send
					</Button>
				</DialogActions>
			</Dialog>

			{/* Second Dialog Component - Added after clicking send in the first dialog */}
			<Dialog
				open={openSecondDialog}
				onClose={handleSecondDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="xs"
				fullWidth
				style={{ margin: "24px 0", paddingBottom: "36px" }}
			>
				<DialogTitle
					id="alert-dialog-title"
					style={{
						textAlign: "center",
						backgroundColor: "#8b2500",
						padding: "40px 16px 0px 16px",
						borderBottom: "1px solid #e0e0e0",
						color: "white",
					}}
				></DialogTitle>
				<DialogContent style={{ textAlign: "center", padding: "24px" }}>
					<VerifiedIcon htmlColor="green" sx={{ fontSize: "3rem", mr: 1 }} />
					<b
						style={{
							fontSize: "1.5rem",
							color: "green",
							display: "block",
							marginBottom: "16px",
						}}
					>
						SUCCESS
					</b>
					<DialogContentText
						id="alert-dialog-description"
						style={{ color: "grey", textAlign: "center", fontSize: "1rem" }}
					>
						Summary evaluation results successfully sent.
					</DialogContentText>
				</DialogContent>
				<DialogActions
					style={{ justifyContent: "center", padding: "10px 10px 16px 10px" }}
				>
					<Button
						variant="contained"
						onClick={handleSecondDialogClose}
						autoFocus
						sx={{
							textTransform: "capitalize",
							fontSize: "1rem",
							width: "129px",
							height: "37px",
							border: "none",
							fontWeight: "600",
							backgroundColor: "white",
							color: "black",
							"&:hover": {
								backgroundColor: "#800000", // Maroon color
								color: "white",
							},
						}}
					>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}

export default EmployeeProfile;
