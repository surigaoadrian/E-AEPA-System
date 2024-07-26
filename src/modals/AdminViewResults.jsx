import React, { useState, useEffect } from "react";
import {
	Modal,
	Box,
	Menu,
	MenuItem,
	IconButton,
	Tabs,
	Tab,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from "@mui/icons-material/FilterList";
import Third from "../modals/3rdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import axios from "axios";
import GeneratePDF from "../components/GeneratePDF"; // Import the GeneratePDF function

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabPanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
};

const menuItemStyles = {
	fontFamily: "Poppins",
	fontSize: "13px",
	fontWeight: "bold",
	color: "#9D9D9D",
	"&:hover": {
		backgroundColor: "#f0f0f0",
	},
};

const selectedMenuItemStyles = {
	...menuItemStyles,
	backgroundColor: "#8C383E",
	color: "#fff",
	"&:hover": {
		backgroundColor: "#8C383E",
		color: "#ffffff",
	},
};

const AdminViewResults = ({ userId, open, onClose, employee, role }) => {
	const [tabIndex, setTabIndex] = useState(0);
	const [filter, setFilter] = useState("overall");
	const [selectedStaff, setSelectedStaff] = useState(employee);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleFilterButtonClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuItemClick = (value) => {
		setFilter(value);
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/user/getUser/${userId}`
				);
				setSelectedStaff(response.data);
			} catch (error) {
				if (error.response) {
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

	const handleTabChange = (event, newIndex) => {
		setTabIndex(newIndex);
	};

	const tabStyle = {
		textTransform: "none",
		color: "#9D9D9D",
		fontFamily: "Poppins",
		fontSize: "13px",
		fontWeight: "bold",
		"& .MuiTabs-indicator": {
			backgroundColor: "#8C383E",
		},
		"&.Mui-selected": {
			color: "#8C383E",
		},
	};

	const handlePrint = async () => {
		const printAreaId = `tabPanel-${tabIndex}`;
		const input = document.getElementById(printAreaId);

		if (!input) {
			console.error("Print area not found");
			return;
		}

		const htmlContent = input.outerHTML;
		await GeneratePDF(htmlContent); // Use the GeneratePDF function
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-title"
			sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Box
				sx={{
					backgroundColor: "white",
					borderRadius: 2,
					boxShadow: 24,
					width: "80vw",
					height: "90vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Header */}
				<Box
					sx={{
						backgroundColor: "#8C383E",
						color: "white",
						p: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "1.3rem",
						fontWeight: "bold",
						height: "48px",
						borderBottom: "3px solid #F8C702",
						position: "sticky",
						top: 0,
						zIndex: 1,
					}}
				>
					<Box sx={{ flex: 1 }} /> {/* Left spacer */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flex: 2,
						}}
					>
						View Results
						<IconButton onClick={handlePrint}>
							<PrintIcon style={{ color: "white" }} />
						</IconButton>
					</Box>
					<Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
						<IconButton onClick={handleFilterButtonClick}>
							<FilterListIcon sx={{ color: "white" }} />
						</IconButton>
					</Box>
				</Box>

				{/* Content */}
				<Box sx={{ flex: 1, overflowY: "auto" }}>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem
							onClick={() => handleMenuItemClick("overall")}
							sx={
								filter === "overall" ? selectedMenuItemStyles : menuItemStyles
							}
						>
							Overall
						</MenuItem>
						<MenuItem
							onClick={() => handleMenuItemClick("self")}
							sx={filter === "self" ? selectedMenuItemStyles : menuItemStyles}
						>
							Self
						</MenuItem>
						<MenuItem
							onClick={() => handleMenuItemClick("peer")}
							sx={filter === "peer" ? selectedMenuItemStyles : menuItemStyles}
						>
							Peer
						</MenuItem>
						<MenuItem
							onClick={() => handleMenuItemClick("head")}
							sx={filter === "head" ? selectedMenuItemStyles : menuItemStyles}
						>
							Head
						</MenuItem>
					</Menu>
					<Third userId={employee.userID} employee={employee} filter={filter} role={role}  />
				</Box>
			</Box>
		</Modal>
	);
};

export default AdminViewResults;
