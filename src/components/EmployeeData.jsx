import React, { useState, useEffect } from "react";
import axios from "axios";
import EndorseModal from "./EndorseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import {
	Button,
	InputAdornment,
	TextField,
	backdropClasses,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import { faCheckCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import EmployeeProfile from "../pages/EmployeeProfile";
import Animated from "../components/motion";

function EmployeeData() {
	const [tab, setTab] = useState(0);
	const [isViewed, setViewed] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8080/user/getAllUser"
				);
				const sortedUsers = response.data.filter(
					(user) => user.role === "EMPLOYEE"
				);
				setUsers(sortedUsers);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);
	console.log(users);

	const handleBack = () => {
		setViewed(!isViewed);
	};

	const handleViewDetails = (user) => {
		setSelectedUser(user);
		setViewed(!isViewed);
	};
	console.log(setSelectedUser);
	const handleModal = () => {
		setOpenModal(true);
	};

	const closeModal = () => {
		setOpenModal(false);
	};

	const changeTab = (event, newTab) => {
		setTab(newTab);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const filteredUsers = users.filter((user) => {
		const fullName = `${user.fName} ${user.lName}`.toLowerCase();
		return (
			user.workID.toString().includes(searchQuery) ||
			fullName.includes(searchQuery.toLowerCase())
		);
	});

	const approvedCellStyle = {
		display: "flex",
		justifyContent: "center",
		textAlign: "center",
		fontFamily: "Poppins",
		fontSize: "12px",
		padding: "2px",
		color: "green",
	};

	const tabStyle = {
		marginLeft: "25px",
		textTransform: "none",
		color: "#9D9D9D",
		fontFamily: "Poppins",
		fontSize: "13px",
		fontWeight: 500,
		"& .MuiTabs-indicator": {
			backgroundColor: "#8C383E", //nig click makita maroon
		},
		"&.Mui-selected": {
			color: "#8C383E", //kung unsa selected
		},
	};

	const tableStyle = {
		borderRadius: "5px 5px 0 0",
		width: "93%",
		marginTop: "5px",
		boxShadow: "2px 2px 5px rgba(157, 157, 157, 0.5)",
	};

	const cellStyle = {
		textAlign: "center",
		color: "#464646",
		fontFamily: "Poppins",
		fontWeight: 500,
		fontSize: "14px",
		padding: "10px",
	};

	const headStyle = {
		backgroundColor: "#8C383E",
		textAlign: "center",
		color: "white",
		fontFamily: "Poppins",
		fontSize: "13px",
		padding: "6px",
		width: "10%",
	};

	const rowStyle = {
		"&:hover": {
			backgroundColor: "#FFECA1",
			cursor: "pointer",
		},
		transition: "background-color 0.1s ease",
	};

	const header = {
		fontSize: "25px",
		fontFamily: "Poppins",
		fontWeight: 600,
		margin: "20px 0px 0px 45px",
		maxWidth: "11%",
		display: "flex",
		justifyContent: "center",
	};

	return (
		<div>
			{!isViewed ? (
				<div>
					<Animated>
						<div style={header}>Employees</div>
						<Tabs
							value={tab}
							onChange={changeTab}
							aria-label="Tabs"
							sx={tabStyle}
						>
							<Tab
								label={`All Employees (${filteredUsers.length})`}
								sx={tabStyle}
							/>
							<Tab label="Office Head Recommendation" sx={tabStyle} />
							<Tab label="For Approval" sx={tabStyle} />
						</Tabs>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{tab === 0 && (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										minWidth: "100%",
									}}
								>
									<TableContainer
										component={Paper}
										sx={{ maxHeight: 550, overflowY: "auto", ...tableStyle }}
									>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell sx={{ borderBottom: "0 solid #8C383E" }}>
														<TextField
															placeholder="Search by ID or Name"
															value={searchQuery}
															onChange={handleSearchChange}
															sx={{
																"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
																	{
																		borderWidth: "1px",
																		borderColor: "#e0e0e0",
																	},
																"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
																	{
																		borderColor: "#e0e0e0",
																	},
																"&:focus-within": {
																	"& fieldset": {
																		borderColor: "#8C383E !important",
																		borderWidth: "1px !important",
																	},
																},
																"& .MuiInputBase-input": {
																	padding: "10px 10px",
																	fontSize: "13px",
																	fontFamily: "Poppins",
																},
																width: "125%",
															}}
															InputProps={{
																startAdornment: (
																	<InputAdornment>
																		<FontAwesomeIcon
																			icon={faSearch}
																			style={{ fontSize: "13px", padding: "0" }}
																		/>
																	</InputAdornment>
																),
															}}
														/>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell style={headStyle}>Employee ID</TableCell>
													<TableCell style={headStyle}>Name</TableCell>
													<TableCell style={headStyle}>Position</TableCell>
													<TableCell style={headStyle}>Date Hired</TableCell>
													<TableCell style={headStyle}>Status</TableCell>
													<TableCell style={headStyle}> </TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{filteredUsers.length === 0 ? (
													<TableRow>
														<TableCell
															colSpan={6}
															style={{
																textAlign: "center",
																fontFamily: "Poppins",
																fontSize: "15px",
																color: "#1e1e1e",
																fontWeight: 500,
																padding: "25px",
															}}
														>
															Oops! We couldn't find any results matching your
															search.
														</TableCell>
													</TableRow>
												) : (
													filteredUsers.map((user) => (
														<TableRow key={user.userID} sx={rowStyle}>
															<TableCell style={cellStyle}>
																{user.workID}
															</TableCell>
															<TableCell
																style={cellStyle}
															>{`${user.fName} ${user.lName}`}</TableCell>
															<TableCell style={cellStyle}>
																{user.position}
															</TableCell>
															<TableCell style={cellStyle}>
																{user.dateHired}
															</TableCell>
															<TableCell
																style={{
																	...cellStyle,
																	color:
																		user.empStatus === "Probationary"
																			? "red"
																			: "#16B50B",
																}}
															>
																{user.empStatus}
															</TableCell>
															<TableCell style={cellStyle}>
																<Button
																	variant="outlined"
																	onClick={() => handleViewDetails(user)}
																	sx={{
																		color: "#8C383E",
																		display: "flex",
																		left: "5px",
																		border: "none",
																		fontFamily: "Poppins",
																		textTransform: "none",
																		fontSize: "13px",
																		padding: "3px 17px",
																		"&:hover": {
																			textDecoration: "underline",
																			borderStyle: "none",
																			backgroundColor: "transparent",
																		},
																	}}
																>
																	View Details
																</Button>
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							)}
							{tab === 1 && (
								<TableContainer component={Paper} sx={tableStyle}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell style={headStyle}>Employee ID</TableCell>
												<TableCell style={headStyle}>Name</TableCell>
												<TableCell style={headStyle}>Position</TableCell>
												<TableCell style={headStyle}>Immediate Head</TableCell>
												<TableCell style={headStyle}>Status</TableCell>
												<TableCell style={headStyle}> </TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell sx={cellStyle}>{1969}</TableCell>
												<TableCell sx={cellStyle}>Ryan Musa</TableCell>
												<TableCell sx={cellStyle}>Programmer</TableCell>
												<TableCell sx={cellStyle}>
													Larmie S. Feliscuzo
												</TableCell>
												<TableCell
													sx={{
														...cellStyle,
														color: "#16B50B",
														fontWeight: "600",
													}}
												>
													Probitionary
												</TableCell>
												<TableCell sx={cellStyle}>
													<Button
														variant="contained"
														onClick={handleModal}
														sx={{
															backgroundColor: "#8C383E",
															display: "flex",
															left: "30px",
															fontFamily: "Poppins",
															textTransform: "none",
															fontSize: "13px",
															padding: "5px 17px",
															"&:hover": {
																backgroundColor: "#F8C702",
																color: "#1e1e1e",
															},
														}}
													>
														Endorse
													</Button>
													<EndorseModal
														open={openModal}
														handleClose={closeModal}
														handleEndorse={handleModal}
													/>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							)}
							{tab === 2 && (
								<TableContainer component={Paper} sx={tableStyle}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell style={headStyle}>Employee ID</TableCell>
												<TableCell style={headStyle}>Name</TableCell>
												<TableCell style={headStyle}>Office Head</TableCell>
												<TableCell style={headStyle}>HR-Head</TableCell>
												<TableCell style={headStyle}>Vice President</TableCell>
												<TableCell style={headStyle}>President </TableCell>
												<TableCell style={headStyle}> </TableCell>
											</TableRow>
										</TableHead>
									</Table>
								</TableContainer>
							)}
						</div>
					</Animated>
				</div>
			) : (
				<Animated>
					<div>
						<EmployeeProfile user={selectedUser} handleBack={handleBack} />
					</div>
				</Animated>
			)}
		</div>
	);
}

export default EmployeeData;
