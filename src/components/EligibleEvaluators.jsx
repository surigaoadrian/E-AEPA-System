import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Button, InputAdornment, TextField, FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from '../config/config';

function EligibleEvaluators() {
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [evaluationFilter, setEvaluationFilter] = useState("All");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				let response;
				if (evaluationFilter === "3rd Month") {
					response = await axios.get(`${apiUrl}/user/thirdMonthEligibleEvaluators`);
				} else if (evaluationFilter === "5th Month") {
					response = await axios.get(`${apiUrl}/user/fifthMonthEligibleEvaluators`);
				} else {
					const thirdMonthResponse = await axios.get(`${apiUrl}/user/thirdMonthEligibleEvaluators`);
					const fifthMonthResponse = await axios.get(`${apiUrl}/user/fifthMonthEligibleEvaluators`);
					response = { data: [...thirdMonthResponse.data, ...fifthMonthResponse.data] };
				}
				setUsers(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, [evaluationFilter]);

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleEvaluationFilterChange = (e) => {
		setEvaluationFilter(e.target.value);
	};

	const filteredUsers = users.filter((user) => {
		const fullName = `${user.fName} ${user.lName}`.toLowerCase();
		return (
			user.workID.toString().includes(searchQuery) ||
			fullName.includes(searchQuery.toLowerCase())
		);
	});

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
		fontSize: "22px",
		fontFamily: "Poppins",
		fontWeight: 600,
		margin: "20px 0px 0px 45px",
		maxWidth: "19%",
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
			<div>
				<div style={header}>Eligible Evaluators</div>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<TableContainer component={Paper} sx={{ maxHeight: 550, ...tableStyle }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ borderBottom: "0 solid #8C383E" }}>
										<TextField
											placeholder="Search ID or Name..."
											value={searchQuery}
											onChange={handleSearchChange}
											sx={{
												"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
													borderWidth: "1px",
													borderColor: "#e0e0e0",
												},
												"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
											<InputLabel>Filter Evaluation</InputLabel>
											<Select
												value={evaluationFilter}
												onChange={handleEvaluationFilterChange}
												label="Evaluation"
												sx={{
													"& .MuiSelect-select": {
														fontFamily: "Poppins",
														fontSize: "13px",
                                            
													},
												}}
											>
												<MenuItem value="All">All</MenuItem>
												<MenuItem value="3rd Month">3rd Month</MenuItem>
												<MenuItem value="5th Month">5th Month</MenuItem>
											</Select>
										</FormControl>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell style={headStyle}>Employee ID</TableCell>
									<TableCell style={headStyle}>Name</TableCell>
									<TableCell style={headStyle}>Position</TableCell>
									<TableCell style={headStyle}>Department</TableCell>
									<TableCell style={headStyle}>Date Hired</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredUsers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											style={{
												textAlign: "center",
												fontFamily: "Poppins",
												fontSize: "15px",
												color: "#1e1e1e",
												fontWeight: 500,
												padding: "25px",
											}}
										>
											Oops! We couldn't find any results matching your search.
										</TableCell>
									</TableRow>
								) : (
									filteredUsers.map((user) => (
										<TableRow key={user.userID} sx={rowStyle}>
											<TableCell style={cellStyle}>{user.workID}</TableCell>
											<TableCell style={cellStyle}>{`${user.fName} ${user.lName}`}</TableCell>
											<TableCell style={cellStyle}>{user.position}</TableCell>
											<TableCell style={cellStyle}>{user.dept}</TableCell>
											<TableCell style={cellStyle}>{formatDate(user.dateHired)}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
		</div>
	);
}

export default EligibleEvaluators;