import React, { useState, useEffect } from "react";
import axios from "axios";
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
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import EmployeeProfile from "../pages/EmployeeProfile";
import Animated from "../components/motion";

function EmployeeData() {
	const [tab, setTab] = useState(0);
	const [isViewed, setViewed] = useState(false);
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [statusFilter, setStatusFilter] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8080/user/getAllUser"
				);
				const sortedUsers = response.data
					.filter((user) => user.role === "EMPLOYEE")
					.sort((a, b) => b.userID - a.userID);
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

	const changeTab = (event, newTab) => {
		setTab(newTab);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
	};

	const filteredUsers = users.filter((user) => {
		const fullName = `${user.fName} ${user.lName}`.toLowerCase();
		const searchUser =
			user.workID.toString().includes(searchQuery) ||
			fullName.includes(searchQuery.toLowerCase());
		const userStatus = statusFilter ? user.empStatus === statusFilter : true;
		return searchUser && userStatus;
	});

	const tabStyle = {
		//marginLeft: "25px",
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
		fontWeight: "bold",
		margin: "20px 0px 0px 45px",
		maxWidth: "11%",
		display: "flex",
		justifyContent: "center",
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
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
							sx={{ ml: 5.5, width: "93%", ...tabStyle }}
						>
							<Tab
								label={`All Employees (${filteredUsers.length})`}
								sx={tabStyle}
							/>
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
										sx={{ maxHeight: 550, ...tableStyle }}
									>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell sx={{ borderBottom: "0 solid #8C383E" }}>
														<TextField
															placeholder="Search ID or Name..."
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
													<TableCell sx={{ borderBottom: "0 solid #8C383E" }}>
														<FormControl
															variant="outlined"
															size="small"
															sx={{
																marginLeft: 2,
																minWidth: 120,
																"& .MuiInputLabel-root": {
																	fontFamily: "Poppins",
																	colot: "#e0e0e0",
																	fontSize: "12px",
																	margin: "2px 0 0 0",
																},
																"& .MuiSelect-root": {
																	fontFamily: "Poppins",
																	fontSize: "13px",
																},
																"& .MuiOutlinedInput-notchedOutline": {
																	borderColor: "#e0e0e0",
																},
																"&:hover .MuiOutlinedInput-notchedOutline": {
																	borderColor: "#8C383E",
																},
															}}
														>
															<InputLabel>Filter Status</InputLabel>
															<Select
																value={statusFilter}
																onChange={handleStatusFilterChange}
																label="Status"
																sx={{
																	"& .MuiSelect-select": {
																		fontFamily: "Poppins",
																		fontSize: "13px",
																	},
																}}
															>
																<MenuItem value="">All Employee</MenuItem>
																<MenuItem value="Probationary">
																	Probationary
																</MenuItem>
																<MenuItem value="Regular">Regular</MenuItem>
															</Select>
														</FormControl>
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
																{formatDate(user.dateHired)}
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
