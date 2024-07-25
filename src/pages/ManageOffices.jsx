import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faTrash,
	faSearch,
	faPenToSquare,
	faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
	Alert,
	Dialog,
	Divider,
	FormControl,
	Select,
	MenuItem,
	Snackbar,
	TextField,
	InputAdornment,
	Button,
	IconButton,
} from "@mui/material";
import axios from "axios";
import Animated from "../components/motion";

const ManageOffices = () => {
	const loggedId = sessionStorage.getItem("userID");
	const [departments, setDepartments] = useState([]);
	const [filteredDepartments, setFilteredDepartments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeRow, setActiveRow] = useState(null);
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
	const [departmentFormData, setDepartmentFormData] = useState({
		deptName: "",
		deptOfficeHead: "",
	});
	const [departmentToDelete, setDepartmentToDelete] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const pagesPerGroup = 5;
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	const showSnackbar = (message, severity) => {
		setSnackbar({ open: true, message: message, severity: severity });
	};
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingDepartment, setEditingDepartment] = useState(null);
	const [departmentOfficeHead, setDepartmentOfficeHead] = useState([]);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const displayedDepartments = filteredDepartments.slice(startIndex, endIndex);
	const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
	const [allUsers, setAllUsers] = useState([]);
	const [showDetailsDialog, setShowDetailsDialog] = useState(false);
	const [selectedDepartmentDetails, setSelectedDepartmentDetails] = useState({
		deptName: "",
		officeHead: "",
		secretary: "",
		staff: [],
	});
// fetch all users
useEffect(() => {
	const fetchData = async () => {
		try {
			const userResponse = await axios.get(
				"http://localhost:8080/user/getAllUser"
			);
			const deptResponse = await axios.get(
				"http://localhost:8080/department/getAllDepts"
			);

			const fetchedUsers = userResponse.data;
			const fetchedDepts = deptResponse.data;

			// Assign office heads to their departments
			const updatedDepts = fetchedDepts.map((dept) => {
				const officeHead = fetchedUsers.find(
					(user) =>
						(user.position === "Office Head" ||
							user.position === "Department Head") &&
						user.dept === dept.deptName
				);
				return {
					...dept,
					deptOfficeHead: officeHead
						? `${officeHead.fName} ${
								officeHead.mName ? officeHead.mName.charAt(0) + "." : ""
						  } ${officeHead.lName}`
						: "",
				};
			});

			// // Update the departments in the database
			// for (const dept of updatedDepts) {
			// 	await axios.put(
			// 		`http://localhost:8080/department/updateDept/${loggedId}/?deptID=${dept.deptID}`,
			// 		dept
			// 	);
			// }

			setDepartments(updatedDepts);
			setFilteredDepartments(updatedDepts);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	fetchData();
}, []);

	//fetch all users with "office head" position
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8080/user/getAllUser"
				);
				setAllUsers(response.data);
				const officeHeads = response.data
					.filter(
						(user) =>
							user.position === "Office Head" ||
							user.position === "Department Head" ||
							user.position === "Head"
					)
					.map((user) => ({
						id: user.id,
						name: `${user.fName} ${
							user.mName ? user.mName.charAt(0) + "." : ""
						} ${user.lName}`,
					}));
				setDepartmentOfficeHead(officeHeads);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	//fetch all departments
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8080/department/getAllDepts"
				);
				setDepartments(response.data);
				setFilteredDepartments(response.data);
			} catch (error) {
				console.error("Error fetching departments:", error);
			}
		};

		fetchDepartments();
	}, []);
	// delete department
	const toggleConfirmationDialog = (deptId = null) => {
		setDepartmentToDelete(deptId);
		setShowConfirmationDialog(!showConfirmationDialog);
	};

	const confirmDeleteDepartment = async () => {
		try {
			await axios.delete(
				`http://localhost:8080/department/deleteDept/${loggedId}/${departmentToDelete}`
			);
			const updatedUsers = await axios.get(
				"http://localhost:8080/department/getAllDepts"
			);
			setDepartments(updatedUsers.data);
			setFilteredDepartments(updatedUsers.data);
			showSnackbar("Department deleted successfully", "success");
			toggleConfirmationDialog();
		} catch (error) {
			showSnackbar("Failed to delete department due to an error", "error");
			console.error("Error deleting user:", error);
		}
	};

	const handleAddDepartment = () => {
		setShowAddDepartmentModal(true);
	};

	const handleDepartmentFormChange = (e) => {
		const { name, value } = e.target;
		setDepartmentFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleDeleteUser = (deptId) => {
		toggleConfirmationDialog(deptId);
	};
	//Department Mapping

	//View Department Details
	const handleRowDoubleClick = (department) => {
		const usersInDepartment = allUsers.filter(
			(user) => user.dept === department.deptName
		);
		const deptFullName = [department.deptName];
		const secretary = usersInDepartment.find(
			(user) => user.position === "Secretary" || user.position === "secretary"
		);
		const staffMembers = usersInDepartment.filter(
			(user) => user.role === "EMPLOYEE" && user.userID !== secretary?.userID
		);

		setSelectedDepartmentDetails({
			deptName: department.deptName || "N/A",
			officeHead: department.deptOfficeHead || "N/A",
			secretary: secretary
				? `${secretary.fName} ${
						secretary.mName ? secretary.mName.charAt(0) + "." : ""
				  } ${secretary.lName}`
				: "N/A",
			staff: staffMembers.map((staff) => ({
				id: staff.userID,
				name: `${staff.fName} ${
					staff.mName ? staff.mName.charAt(0) + "." : ""
				} ${staff.lName}`,
				status: staff.empStatus,
			})),
		});

		setShowDetailsDialog(true);
	};

	//Add Department
	const handleDepartmentFormSubmit = async (e) => {
		e.preventDefault();
		const existingDept = departments.find(
			(dept) =>
				dept.deptName.toLowerCase() ===
				departmentFormData.deptName.toLowerCase()
		);
		if (existingDept) {
			showSnackbar("Department already exists", "warning");
			return; // Prevent the form submission
		}
		try {
			await axios.post(
				`http://localhost:8080/department/addDept/${loggedId}`,
				departmentFormData
			);

			const updatedDepartments = await axios.get(
				"http://localhost:8080/department/getAllDepts"
			);
			setDepartments(updatedDepartments.data);
			setFilteredDepartments(updatedDepartments.data);
			showSnackbar("Department added successfully", "success");
			setShowAddDepartmentModal(false);
			setDepartmentFormData({
				deptName: "",
				deptOfficeHead: "",
			});
		} catch (error) {
			showSnackbar("Failed to add department due to an error", "error");
			console.error("Error adding department:", error);
		}
	};

	useEffect(() => {
		const filtered = departments.filter(
			(dept) =>
				dept.deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				dept.deptOfficeHead.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredDepartments(filtered);
	}, [searchTerm, departments]);

	//Handle search term change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const startPageGroup = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const endPageGroup = Math.min(startPageGroup + pagesPerGroup - 1, totalPages);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handlePrevPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
	};

	const hasData = departments.length > 0;

	const handleEditDepartment = (user) => {
		setEditingDepartment(user);
		setShowEditModal(true);
	};
	//Update Department
	const handleUpdateDepartment = async (editedDepartment) => {
		try {
			await axios.put(
				`http://localhost:8080/department/updateDept/${loggedId}/?deptID=${editedDepartment.deptID}`,
				editedDepartment
			);
			const updatedUsers = await axios.get(
				"http://localhost:8080/department/getAllDepts"
			);
			setDepartments(updatedUsers.data);
			setFilteredDepartments(updatedUsers.data);
			setShowEditModal(false);
			showSnackbar("Department updated successfully", "success");
		} catch (error) {
			console.error("Error updating department:", error);
			showSnackbar("Failed to update department due to an error", "error");
		}
	};

	// EditDepartmentModal component
	const EditDepartmentModal = ({ department, onClose, onUpdate }) => {
		const [editedDepartment, setEditedDepartment] = useState(department);
		const handleInputChange = (e) => {
			const { name, value } = e.target;
			setEditedDepartment((prevDepartment) => ({
				...prevDepartment,
				[name]: value,
			}));
		};

		const handleSubmit = (e) => {
			e.preventDefault();
			onUpdate(editedDepartment);
		};

		return (
			<Animated>
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
					<div
						className="bg-white rounded-lg shadow-md "
						style={{ width: "35%" }}
					>
						<div
							className="p-2 font-bold text-lg text-white rounded-t-lg"
							style={{ backgroundColor: "#8C383E", border: "none" }}
						>
							<FontAwesomeIcon
								icon={faPenToSquare}
								className="mr-2 ml-2"
								style={{
									color: "white",
									fontSize: "1.2rem",
									cursor: "pointer",
								}}
							/>
							Edit Department
						</div>
						<div className="p-4">
							<form onSubmit={handleSubmit}>
								<div className="mb-4">
									<label
										htmlFor="deptName"
										style={{ fontSize: "14px", color: "#515151" }}
									>
										Department Name
									</label>
									<input
										type="text"
										id="deptName"
										name="deptName"
										value={editedDepartment.deptName}
										onChange={handleInputChange}
										className="mt-1 p-2 border border-gray-300 rounded-md w-full"
										required
									/>
								</div>
								<Divider />

								<div className="mb-4 mt-5">
									<label
										htmlFor="deptOfficeHead"
										style={{ fontSize: "14px", color: "#515151" }}
									>
										Assigned Office Head:
										<span className="font-medium text-black ml-4">
											{" "}
											{editedDepartment.deptOfficeHead}{" "}
										</span>
									</label>
								</div>
								<div className="mt-2 flex justify-end">
									<Button
										type="button"
										variant="outlined"
										onClick={onClose}
										sx={{
											marginRight: "8px",
											borderColor: "#B4B4B4",
											color: "#1E1E1E",
											width: "18%",
											textTransform: "none",
											fontFamily: "Poppins",
											"&:hover": {
												backgroundColor: "#ECECEE",
												borderColor: "#ECECEE",
												color: "#1E1E1E",
											},
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										variant="contained"
										color="primary"
										sx={{
											backgroundColor: "#8C383E",
											width: "18%",
											borderRadius: "5px 5px",
											textTransform: "none",
											fontFamily: "Poppins",
											"&:hover": {
												backgroundColor: "#762F34",
											},
										}}
									>
										Add
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</Animated>
		);
	};

	return (
		<Animated>
			<div>
				<h1 className="text-2xl font-bold text-left ml-12 mt-6 mb-1">
					Department
				</h1>
				<label className="ml-12 text-sm text-gray-700">
					All Departments ({filteredDepartments.length})
				</label>
				<div className="ml-8 mt-2">
					<div className="mr-10 mb-4 flex items-center justify-between">
						<div className="ml-4 flex items-center justify-start">
							<TextField
								placeholder="Search Department..."
								value={searchTerm}
								onChange={handleSearchChange}
								sx={{
									"& .MuiOutlinedInput-root": {
										backgroundColor: "#ffffff", // Set the background color for the entire input area
									},
									"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
									minWidth: "110%",
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
						</div>

						<div className="flex items-center">
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#8C383E",
									"&:hover": { backgroundColor: "#732D32" },
									color: "white",
									fontFamily: "Poppins",
									textTransform: "none",
									borderRadius: "5px 5px",
								}}
								startIcon={
									<FontAwesomeIcon
										icon={faCirclePlus}
										style={{ fontSize: "1.2rem" }}
									/>
								}
								onClick={handleAddDepartment}
							>
								Add Department
							</Button>
						</div>
					</div>
					<div
						className="mr-10 ml-4 rounded-lg border border-gray-200"
						style={{ position: "relative", height: "26.25em", borderRadius: "5px 5px 0 0" }}
					>
						<div className="overflow-x-auto rounded-t-lg">
							<table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
								<thead
									className="text-left"
									style={{ backgroundColor: "#8C383E" }}
								>
									<tr>
										<th></th>
										<th
											className="whitespace-nowrap px-4 py-3 text-sm text-gray-50"
											style={{ fontWeight: 500 }}
										>
											Department
										</th>
										<th
											className="whitespace-nowrap px-4 py-3 text-sm text-gray-50"
											style={{ fontWeight: 500 }}
										>
											Office Head
										</th>
										<th
											className="whitespace-nowrap px-4 py-3 text-sm text-gray-50"
											style={{ fontWeight: 500 }}
										>
											Action
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{displayedDepartments.length === 0 ? (
										<tr>
											<td
												colSpan="4"
												style={{
													fontFamily: "Poppins",
													fontWeight: 500,
													textAlign: "center",
													padding: "1rem",
												}}
											>
												Oops! We couldn't find any results matching your search.
											</td>
										</tr>
									) : (
										displayedDepartments.map((dept, index) => (
											<tr
												key={dept.deptID}
												onDoubleClick={() => handleRowDoubleClick(dept)}
												className={`cursor-pointer ${
													activeRow === dept.deptID ? "bg-gray-200" : ""
												} no-select`}
												style={{
													backgroundColor:
														activeRow === dept.deptID
															? "#FFECA1"
															: "transparent",
													transition: "background-color 0.1s ease",
													fontFamily: "Poppins",
													fontWeight: 500,
												}}
												onMouseEnter={() => setActiveRow(dept.deptID)}
												onMouseLeave={() => setActiveRow(null)}
											>
												<td className="justify-center whitespace-nowrap px-4 py-2 text-gray-700">
													{index + 1 + (currentPage - 1) * itemsPerPage}
												</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">
													{dept.deptName}
												</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">
													{dept.deptOfficeHead}
												</td>
												<td>
													<div>
														<IconButton>
															<FontAwesomeIcon
																icon={faPenToSquare}
																style={{
																	color: "#8C383E",
																	fontSize: "1.3rem",
																	cursor: "pointer",
																}}
																onClick={() => handleEditDepartment(dept)}
															/>
														</IconButton>
														<IconButton>
															<FontAwesomeIcon
																icon={faTrash}
																style={{
																	color: "#8C383E",
																	fontSize: "1.3rem",
																	cursor: "pointer",
																}}
																onClick={(e) => {
																	e.stopPropagation(); // Prevent row click from triggering
																	handleDeleteUser(dept.deptID);
																}}
															/>
														</IconButton>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Pagination */}
					<div
						className="rounded-b-lg mt-2 border-gray-200 px-4 py-2"
						style={{
							position: "absolute",
							display: "flex",
							alignItems: "center",
						}}
					>
						<ol className="flex justify-end gap-1 text-xs font-medium">
							<li>
								<a
									href="#"
									className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
									onClick={handlePrevPage}
								>
									<span className="sr-only">Prev Page</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-3 w-3"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</li>

							{Array.from({ length: endPageGroup - startPageGroup + 1 }, (_, index) => (
								<li key={startPageGroup + index}>
									<a
										href="#"
										className={`block h-8 w-8 rounded border ${
											currentPage === startPageGroup + index
												? "border-pink-900 bg-pink-900 text-white"
												: "border-gray-100 bg-white text-gray-900"
										} text-center leading-8`}
										onClick={() => handlePageChange(startPageGroup + index)}
									>
										{startPageGroup + index}
									</a>
								</li>
							))}

							<li>
								<a
									href="#"
									className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
									onClick={handleNextPage}
								>
									<span className="sr-only">Next Page</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-3 w-3"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</li>
						</ol>
					</div>
				</div>
				{/* DeleteDepartmentModal */}
				{showConfirmationDialog && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
						<div className="bg-white rounded-lg shadow-md w-auto h-44">
							<div
								className="p-2 font-medium text-lg text-white rounded-t-lg"
								style={{ backgroundColor: "#8C383E", border: "none" }}
							>
								<FontAwesomeIcon
									icon={faTrash}
									className="mr-2 ml-2"
									style={{ color: "white", fontSize: "1rem" }}
								/>
								Delete Department
							</div>

							<div className="p-5">
								<p className="mt-1 mb-5">
									Are you sure you want to delete this department?
								</p>
								<Divider />
								<div className="mt-4 mb-4 flex justify-end">
									<Button
										type="button"
										variant="outlined"
										onClick={() => toggleConfirmationDialog()}
										sx={{
											marginRight: "8px",
											borderColor: "#B4B4B4",
											color: "#1E1E1E",
											width: "18%",
											textTransform: "none",
											fontFamily: "Poppins",
											"&:hover": {
												backgroundColor: "#ECECEE",
												borderColor: "#ECECEE",
												color: "#1E1E1E",
											},
										}}
									>
										Cancel
									</Button>
									<Button
										onClick={confirmDeleteDepartment}
										variant="contained"
										color="primary"
										sx={{
											backgroundColor: "#8C383E",
											width: "18%",
											borderRadius: "5px 5px",
											textTransform: "none",
											fontFamily: "Poppins",
											"&:hover": {
												backgroundColor: "#762F34",
											},
										}}
									>
										Yes
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* EditDepartmentModal */}
				{showEditModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="bg-white rounded-lg shadow-md w-auto h-auto">
							<EditDepartmentModal
								department={editingDepartment}
								onClose={() => setShowEditModal(false)}
								onUpdate={handleUpdateDepartment}
							/>
						</div>
					</div>
				)}
				{/* AddDepartmentModal */}
				{showAddDepartmentModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
						<div className="bg-white rounded-lg shadow-md w-1/3">
							<div
								className="p-2 font-bold text-lg text-white rounded-t-lg"
								style={{ backgroundColor: "#8C383E", border: "none" }}
							>
								<FontAwesomeIcon
									icon={faPlusCircle}
									className="mr-2 ml-2"
									style={{
										color: "white",
										fontSize: "1.2rem",
										cursor: "pointer",
									}}
								/>
								Add Department
							</div>
							<div className="p-4">
								<form onSubmit={handleDepartmentFormSubmit}>
									<div className="mb-4">
										<label
											htmlFor="deptName"
											className="block text-sm font-medium text-gray-700"
										>
											Department Name
										</label>
										<input
											type="text"
											id="deptName"
											name="deptName"
											value={departmentFormData.deptName}
											onChange={handleDepartmentFormChange}
											className="mt-1 p-3 border border-gray-300 rounded-md w-full text-sm"
											required
										/>
									</div>
									<FormControl fullWidth className="mb-4">
										<label
											htmlFor="deptOfficeHead"
											className="mb-2 block text-sm font-medium text-gray-900"
										>
											Assign Office Head
										</label>
										<Select
											id="deptOfficeHead"
											name="deptOfficeHead"
											value={departmentFormData.deptOfficeHead}
											onChange={handleDepartmentFormChange}
											className="h-12"
											displayEmpty
										>
											<MenuItem value="" disabled>
												<span
													className="text-gray-700"
													style={{ fontSize: "13px", color: "#B4B4B4" }}
												>
													Select an Office Head
												</span>
											</MenuItem>
											{departmentOfficeHead.map((head) => (
												<MenuItem
													key={head.id}
													value={head.name}
													style={{ fontFamily: "Poppins", fontWeight: 500 }}
												>
													{head.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<div className="mt-2 flex justify-end">
										<Button
											type="button"
											variant="outlined"
											onClick={() => setShowAddDepartmentModal(false)}
											sx={{
												marginRight: "8px",
												borderColor: "#B4B4B4",
												color: "#1E1E1E",
												width: "18%",
												textTransform: "none",
												fontFamily: "Poppins",
												"&:hover": {
													backgroundColor: "#ECECEE",
													borderColor: "#ECECEE",
													color: "#1E1E1E",
												},
											}}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											variant="contained"
											color="primary"
											sx={{
												backgroundColor: "#8C383E",
												width: "18%",
												borderRadius: "5px 5px",
												textTransform: "none",
												fontFamily: "Poppins",
												"&:hover": {
													backgroundColor: "#762F34",
												},
											}}
										>
											Add
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

				{/* Department Details Dialog */}
				{showDetailsDialog && (
					<Dialog
						open={showDetailsDialog}
						onClose={() => setShowDetailsDialog(false)}
						aria-labelledby="department-details-dialog-title"
						sx={{
							"& .MuiDialog-paper": {
								width: "66.666667%",
								maxWidth: "s",
							},
						}}
						PaperProps={{
							style: {
								borderRadius: 14,
							},
						}}
					>
						<div
							className="p-4 h-8"
							style={{ backgroundColor: "#8C383E", border: "none" }}
						></div>
						<div className="ml-2 mr-2 p-2">
							<h3
								className="text-lg font-semibold mt-2 mb-4"
								style={{ fontWeight: 500 }}
							>
								{selectedDepartmentDetails.deptName}
							</h3>
							<Divider />
						</div>
						<div className="-mt-2 p-4">
							<p>
								<strong>Office Head:</strong>{" "}
								{selectedDepartmentDetails.officeHead}
							</p>
							<p>
								<strong>Secretary:</strong>{" "}
								{selectedDepartmentDetails.secretary}
							</p>
							<div className="mt-4">
								<strong>Office Staff:</strong>
								<ul>
									{selectedDepartmentDetails.staff.map((staffMember) => (
										<li
											key={staffMember.id}
											className="flex items-center"
											style={{ gap: "10px" }}
										>
											<span className="ml-28 flex-1">{staffMember.name}</span>
											<span
												className="ml-14 flex-1 text-left"
												style={{
													color:
														staffMember.status === "Regular" ? "green" : "red",
												}}
											>
												{staffMember.status}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</Dialog>
				)}
				{/* Snackbar */}
				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				>
					<Alert
						variant="filled"
						elevation={6}
						severity={snackbar.severity}
						sx={{ width: "100%" }}
						style={{ fontFamily: "Poppins" }}
					>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</div>
		</Animated>
	);
};
export default ManageOffices;
