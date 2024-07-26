import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Box, Grid, Tabs, Tab } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import Animated from "../components/motion";
import AdminViewResult from "../modals/AdminViewResults";

const theme = createTheme({
	palette: {
		secondary: {
			main: "#8C383E", // Maroon color
		},
	},
	typography: {
		fontFamily: "Poppins",
	},
});

const VerifiedIconWrapper = ({ verified }) => {
	const iconColor = verified ? "green" : "gray";
	return <VerifiedIcon htmlColor={iconColor} style={{ fontSize: 24 }} />;
};

function base64ToDataURL(base64String) {
	return `data:image/png;base64,${base64String}`;
}

function EmployeeProfile({ user, handleBack }) {
	const containerStyle = {
		borderTop: "1px solid transparent",
		marginTop: "30px",
		padding: 0,
	};

	const [selectedYearEvaluation, setSelectedYearEvaluation] = useState(" ");
	const [selectedTab, setSelectedTab] = useState(0);
	const [userData, setUserData] = useState([]);
	const [years, setYears] = useState([]);
	const [show3rd, setShow3rd] = useState(false);
	const [selectedEvaluationPeriod, setSelectedEvaluationPeriod] =
		useState("3rd Month");
	const [evaluationsData, setEvaluationsData] = useState([]);
	const role = sessionStorage.getItem("userRole");
	console.log(role);

	useEffect(() => {
		axios
			.get("http://localhost:8080/evaluation/getAllEvaluation")
			.then((response) => {
				console.log("Fetched Evaluations:", response.data);

				const filteredEvaluations = response.data.filter(
					(evalItem) =>
						evalItem.evalType === "HEAD" &&
						evalItem.peer?.userID === user.userID
				);

				console.log("Filtered Evaluations:", filteredEvaluations);
				setEvaluationsData(filteredEvaluations);
			})
			.catch((error) => {
				console.error("There was an error fetching the evaluations!", error);
			});
	}, [user.userID]);

	useEffect(() => {
		const fetchEvaluations = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8080/evaluation/getAllEvaluation"
				);
				const data = response.data;

				// Filter the evaluations based on user.userID
				const filteredEvaluations = data.filter(
					(evaluation) => evaluation.userId === user.userID
				);

				// Set the filtered evaluations to the state
				setUserData(filteredEvaluations);

				const evaluationYears = filteredEvaluations.map((evaluation) =>
					new Date(evaluation.dateTaken).getFullYear()
				);
				const distinctYears = [...new Set(evaluationYears)];
				setYears(distinctYears);

				console.log(userData);
			} catch (error) {
				console.error("Error fetching evaluations:", error);
			}
		};

		fetchEvaluations();
	}, []);
	console.log("user Data ", userData);

	const getUserDetails = (userId) => {
		return userData.find((user) => user.userId === userId) || {};
	};

	const userDetails = getUserDetails(user.userID);

	const fName = userDetails.fName;
	const lName = userDetails.lName;

	const handleYearEvaluationChange = (event) => {
		setSelectedYearEvaluation(event.target.value);
	};

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
		const period =
			newValue === 0 ? "3rd Month" : newValue === 1 ? "5th Month" : "Annual";
		setSelectedEvaluationPeriod(period);
	};

	const handleViewResultsClick = () => {
		setShow3rd(true);
	};

	const handleCloseModal = () => {
		setShow3rd(false); // Close the modal
	};

	const tabStyle = {
		textTransform: "none",
		fontFamily: "Poppins",
		fontSize: "14px",
	};

	const headStyle = {
		backgroundColor: "#8C383E",
		textAlign: "center",
		color: "white",
		fontFamily: "Poppins",
		fontSize: "13px",
		padding: "6px",
		width: "15%",
	};

	const tableStyle = {
		borderRadius: "5px 5px 5px 5px",
		marginTop: "5px",
		boxShadow: "2px 2px 5px rgba(157, 157, 157, 0.5)",
	};

	const renderEvaluationTable = () => {
		if (!selectedYearEvaluation || selectedYearEvaluation === " ") {
			return null;
		}

		// Filter evaluations
		const filteredEvaluations = userData.filter(
			(evaluation) =>
				new Date(evaluation.dateTaken).getFullYear() ===
					parseInt(selectedYearEvaluation) &&
				evaluation.userId === user.userID &&
				evaluation.period === selectedEvaluationPeriod
		);

		const headEval = evaluationsData.filter(
			(evaluation) =>
				new Date(evaluation.dateTaken).getFullYear() ===
					parseInt(selectedYearEvaluation) &&
				evaluation.peer.userID === user.userID &&
				evaluation.period === selectedEvaluationPeriod
		);

		// Check completion status for each evaluation stage
		const hasCompletedValuesSelf = filteredEvaluations.some(
			(evaluation) =>
				evaluation.stage === "VALUES" &&
				evaluation.evalType === "SELF" &&
				evaluation.status === "COMPLETED"
		);

		const hasCompletedValuesPeer = filteredEvaluations.some(
			(evaluation) =>
				evaluation.stage === "VALUES" &&
				evaluation.evalType === "PEER" &&
				evaluation.status === "COMPLETED"
		);

		const hasCompletedHeadValues = headEval.some(
			(evaluation) =>
				evaluation.stage === "VALUES" && evaluation.status === "COMPLETED"
		);

		const hasCompletedHeadJob = headEval.some(
			(evaluation) =>
				evaluation.stage === "JOB" && evaluation.status === "COMPLETED"
		);

		const hasCompletedJobSelf = filteredEvaluations.some(
			(evaluation) =>
				evaluation.stage === "JOB" &&
				evaluation.evalType === "SELF" &&
				evaluation.status === "COMPLETED"
		);

		// Determine if all stages for the selected year are completed for VALUES and JOB
		const allValuesStagesCompleted =
			hasCompletedValuesSelf &&
			hasCompletedValuesPeer &&
			hasCompletedJobSelf &&
			hasCompletedHeadValues;

		return (
			<TableContainer style={tableStyle}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center" style={{ backgroundColor: "#8C383E" }}>
								{" "}
							</TableCell>
							<TableCell align="center" style={headStyle}>
								Self
							</TableCell>
							<TableCell align="center" style={headStyle}>
								Head
							</TableCell>
							<TableCell align="center" style={headStyle}>
								Peer
							</TableCell>
							<TableCell align="center" style={{ backgroundColor: "#8C383E" }}>
								{" "}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* Render VALUES based evaluations */}
						<TableRow>
							<TableCell align="center" style={{ width: "20%" }}>
								Values Based
							</TableCell>
							<TableCell align="center">
								<VerifiedIconWrapper verified={hasCompletedValuesSelf} />
							</TableCell>
							<TableCell align="center">
								<VerifiedIconWrapper verified={hasCompletedHeadValues} />
							</TableCell>
							<TableCell align="center">
								<VerifiedIconWrapper verified={hasCompletedValuesPeer} />
							</TableCell>
							<TableCell align="center" style={{ width: "20%" }}>
								<Button
									sx={{
										color: "#8C383E",
										textTransform: "none",
										fontSize: "13px",
										"&:hover": {
											textDecoration: "underline",
											borderStyle: "none",
											backgroundColor: "transparent",
										},
									}}
									onClick={handleViewResultsClick}
									disabled={!allValuesStagesCompleted}
								>
									View Results
								</Button>
							</TableCell>
						</TableRow>

						{/* Render JOB based evaluations */}
						<TableRow>
							<TableCell align="center" style={{ width: "20%" }}>
								Job Based
							</TableCell>
							<TableCell align="center">
								<VerifiedIconWrapper verified={hasCompletedJobSelf} />
							</TableCell>
							<TableCell align="center">
								<VerifiedIconWrapper verified={hasCompletedHeadJob} />
							</TableCell>
							<TableCell align="center"></TableCell>
							<TableCell align="center" style={{ width: "20%" }}></TableCell>
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
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								margin: "10px 10px 10px 14px",
								width: "97%",
								backgroundColor: "white",
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
							<Box sx={{ ml: 8 }}>
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
											{user.fName} {user.lName}
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
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							ml: 1.8,
							mr: 2.5,
							mt: 2,
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography
								variant="body2"
								fontFamily="Poppins"
								color="#9D9D9D"
								mr={1}
							>
								Set Year Evaluation:
							</Typography>
							<FormControl sx={{ minWidth: 90 }} size="small">
								<Select
									id="year-evaluation"
									value={selectedYearEvaluation}
									onChange={handleYearEvaluationChange}
									style={{
										fontSize: 13,
										fontFamily: "Poppins",
										color: "#1a1a1a",
									}}
								>
									<MenuItem value=" ">Select Year</MenuItem>
									{years.map((year) => (
										<MenuItem value={year} key={year}>
											{year}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>

						{selectedYearEvaluation !== " " && (
							<Button
								variant="contained"
								sx={{
									height: "2.5em",
									width: "11em",
									fontFamily: "Poppins",
									backgroundColor: "#8c383e",
									padding: "1px 1px 0 0 ",
									"&:hover": { backgroundColor: "#762F34", color: "white" },
								}}
								style={{ textTransform: "none" }}
								startIcon={
									<FontAwesomeIcon
										icon={faUsers}
										style={{ fontSize: "15px" }}
									/>
								}
							>
								Manage Peer
							</Button>
						)}
					</Box>

					{console.log("si selected", selectedYearEvaluation)}
					{/* Display tabs and kung unsa year selected */}
					{selectedYearEvaluation != " " && (
						<Box sx={{ mt: 2, ml: 1.8, width: "97.1%" }}>
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								indicatorColor="secondary"
								textColor="secondary"
							>
								<Tab label="3rd Month" style={tabStyle} />
								<Tab label="5th Month" style={tabStyle} />
								<Tab label="Annual" style={tabStyle} />
							</Tabs>
							{selectedTab === 0 && (
								<Animated>
									<Box>
										<Typography
											variant="h6"
											sx={{
												fontSize: "20px",
												display: "flex",
												justifyContent: "center",
												padding: 1,
												color: "#1a1a1a",
												fontWeight: "bold",
											}}
										>
											3RD MONTH EVALUATION
										</Typography>
										{renderEvaluationTable()}
										{show3rd && (
											<AdminViewResult
												userId={user.userID}
												open={show3rd}
												onClose={handleCloseModal}
												employee={user}
												role={role}
											/>
										)}
									</Box>
								</Animated>
							)}
							{selectedTab === 1 && (
								<Animated>
									<Box>
										<Typography
											variant="h6"
											sx={{
												fontSize: "20px",
												display: "flex",
												justifyContent: "center",
												padding: 1,
												color: "#1a1a1a",
												fontWeight: "bold",
											}}
										>
											5TH MONTH EVALUATION
										</Typography>
										{renderEvaluationTable()}
									</Box>
								</Animated>
							)}
							{selectedTab === 2 && (
								<Animated>
									<Box>
										<Typography
											variant="h6"
											sx={{
												fontSize: "20px",
												display: "flex",
												justifyContent: "center",
												padding: 1,
												color: "#1a1a1a",
												fontWeight: "bold",
											}}
										>
											ANNUAL EVALUATION
										</Typography>
										{renderEvaluationTable()}
									</Box>
								</Animated>
							)}
						</Box>
					)}
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default EmployeeProfile;
