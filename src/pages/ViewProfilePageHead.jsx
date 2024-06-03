import {Alert as MuiAlert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, IconButton, MenuItem, Paper, Snackbar, TextField, Tooltip, Typography, Select,
 CircularProgress} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import axios from "axios";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

const CustomAlert = ({ open, onClose, severity, message }) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				severity={severity}
				style={{ fontFamily: "Poppins" }}
			>
				{" "}
				{message}{" "}
			</MuiAlert>
		</Snackbar>
	);
};

function ViewProfilePage() {
	const userID = sessionStorage.getItem("userID");
	const [openSeePictureDialog, setOpenSeePictureDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [originalUser, setOriginalUser] = useState({});
	const [saveDisabled, setSaveDisabled] = useState(false);
	const [updateFetch, setUpdateFetch] = useState(true);
	const [isPrsnlEditMode, setIsPrsnlEditMode] = useState(false);
	const [successAlert, setSuccessAlert] = useState({
		open: false,
		message: "",
	});
	const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
	const [msgInfo, setMsgInfo] = useState("");
	const isAvailable = msgInfo === "Username available";
	const inputRef = useRef(null);
	const [image, setImage] = useState("");
	const [profilePictureUrl, setProfilePictureUrl] = useState(null);
	const [prevProfilePictureUrl, setPrevProfilePictureUrl] = useState(null);
	const [loading, setLoading] = useState(false);

	const showSuccessAlert = (message) => {
		setSuccessAlert({ open: true, message });
	};

	const showErrorAlert = (message) => {
		setErrorAlert({ open: true, message });
	};

	const handlePrsnlEditClick = () => {
		setIsPrsnlEditMode(!isPrsnlEditMode);
	};

	const handlePrsnlEditClose = () => {
		setSelectedUser(originalUser);
		setIsPrsnlEditMode(false);
		setSaveDisabled(false);
	};

	const handleDetailsChange = (e) => {
		const { name, value } = e.target;
		const onlyLettersRegex = /^[A-Za-z]+$/;
		const onlyNumbersRegex = /^[0-9]+$/;

		let trimmedValue = value;

		if (name === "fName"  || name === "lName") {
			if (!onlyLettersRegex.test(value) && value !== "") return;
		} else if (name === "contactNum") {
			trimmedValue = value.slice(0, 11);
			if (trimmedValue !== "" ) {
				trimmedValue = trimmedValue;
			}
			if (!onlyNumbersRegex.test(trimmedValue) && trimmedValue !== "") return;
		}
		setSelectedUser((prevData) => ({
			...prevData,
			[name]: trimmedValue,
		}));
		if (
			trimmedValue.trim() === "" ||
			selectedUser.fName.trim() === "" ||
			selectedUser.lName.trim() === ""
		) {
			setSaveDisabled(false);
		} else {
			setSaveDisabled(true);
		}
	};

	//save edit personal details
	const handleSavePrsnlChanges = async (e, selectedUser) => {
		e.preventDefault();
		try {
			console.log("sending user data: ", selectedUser);
			if (selectedUser.contactNum.length !== 11) {
				showErrorAlert("Mobile number should be exactly 11 numbers.");
				return; // Prevent saving if the mobile number is not exactly 11 numbers long
			}
			const userPayload = {
				fName: selectedUser.fName,
				mName: selectedUser.mName,
				lName: selectedUser.lName,
				gender: selectedUser.gender,
				contactNum: selectedUser.contactNum,
			};
			await axios.patch(
				`http://localhost:8080/user/editPersonalDetails/${selectedUser.userID}`,
				userPayload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			setUpdateFetch((prev) => !prev);
			setOriginalUser(selectedUser);
			showSuccessAlert("User updated successfully");
			setIsPrsnlEditMode(false);
			setSaveDisabled(false);
		} catch (error) {
			showErrorAlert("Failed to update user. Please try again later.");
		}
	};

	//fetch the user data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/user/getUser/${userID}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				const data = await response.json();
				setSelectedUser(data);
				setOriginalUser(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [userID]);

	//CHANGING PROFILE PICTURE & FETCHING IMAGE
	const getImageUrl = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/user/image/${userID}`,
				{
					responseType: "arraybuffer", // Ensure response is treated as binary data
				}
			);
			const imageBlob = new Blob([response.data], {
				type: response.headers["content-type"],
			});
			const imageUrl = URL.createObjectURL(imageBlob);

			return imageUrl;
		} catch (error) {
			console.error("Error fetching profile picture:", error);
			throw error; // Propagate the error back to the caller
		}
	};
	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
				const imageUrl = await getImageUrl();
				setProfilePictureUrl(imageUrl);
			} catch (error) {
				// Error handling
			}
		};

		fetchProfilePicture();
	}, [userID]);
	const handleSeePictureDialog = async () => {
		setOpenSeePictureDialog(true);
	};
	const handleCancel = () => {
		setImage(null);
		if (prevProfilePictureUrl) {
			setProfilePictureUrl(prevProfilePictureUrl); // Restore the previous profile picture URL
		}
	};
	
	const handleImageClick = () => {
		inputRef.current.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setImage(file);
		setPrevProfilePictureUrl(profilePictureUrl);
		const imageUrl = URL.createObjectURL(file);
		setProfilePictureUrl(imageUrl);
	};
	const handleSavePicture = async () => {
		//SAVE THE PICTURE
		if (!image) return;
		setLoading(true);
		const formData = new FormData();
		formData.append("image", image);
		try {
			await axios.post(
				`http://localhost:8080/user/uploadImage/${userID}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			const imageUrl = await getImageUrl(); //FETCH THE IMAGE
			setProfilePictureUrl(imageUrl);
			setOpenSeePictureDialog(false);
			window.location.reload(); // Reload the page to reflect the changes
			setImage(null); //pra mobalik sa chnagepicture na button
			showSuccessAlert("Image uploaded successfully");
		} catch (error) {
			console.error("Error uploading image:", error);
            showErrorAlert("Failed to update picture. Please try again later.");
        } finally {
            setLoading(false); // Stop loading after the fetch request
        }
	};
	const handleCloseDialog = () => {
		setImage(null);
		if (prevProfilePictureUrl) {
			setProfilePictureUrl(prevProfilePictureUrl); // Restore the previous profile picture URL
		}
		setOpenSeePictureDialog(false);
	};

	return (
		<div>
			<Grid container>
				<Grid item xs={6}>
					<Typography
						ml={5}
						mt={4}
						sx={{
							fontFamily: "Poppins",
							fontWeight: "bold",
							fontSize: "1.5em",
						}}
					>
						User Profile
					</Typography>
				</Grid>
			</Grid>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					"& > :not(style)": { ml: 2, width: "97%" },
				}}
			>
				<Grid
					container
					spacing={1.5}
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
				>
					<Paper
						elevation={0}
						sx={{
							borderRadius: "5px",
							width: "100%",
							height: "10em",
							mt: 2.5,
							ml: 3,
						}}
					>
						<Grid container spacing={2}>
							<Grid item>
								<IconButton
									onClick={handleSeePictureDialog}
									size="small"
									sx={{ ml: 5, mt: 2 }}
									aria-controls={open ? "account-menu" : undefined}
									aria-haspopup="true"
									aria-expanded={open ? "true" : undefined}
								>
									<Tooltip title="Profile Picture" placement="top" arrow>
										{profilePictureUrl ? (
											<Avatar
												sx={{ width: 120, height: 120, objectFit: "cover" }}
												src={profilePictureUrl}
											/>
										) : (
											<Avatar alt="User" src="/user.png" sx={{ width: 110, height: 110 }} />
										)}
									</Tooltip>
								</IconButton>
							</Grid>
							<Grid item xs={12} sm container>
								<Grid
									item
									xs
									container
									direction="column"
									spacing={2}
									sx={{ ml: 2 }}
								>
									<Grid item xs sx={{ mt: 3 }}>
										<Typography
											gutterBottom
											component="div"
											sx={{
												fontFamily: "Poppins",
												fontWeight: "bold",
												fontSize: "1.3em",
											}}
										>
											{selectedUser.fName} {selectedUser.lName}
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", fontSize: ".9em" }}
										>
											Employee ID:{" "}
											<span style={{ color: "black", fontWeight: 500, }}>
												{selectedUser.workID}
											</span>
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 1, fontSize: ".9em" }}
										>
											Position:{" "}
											<span style={{ color: "black", fontWeight: 500, }}>
												{selectedUser.position}
											</span>
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 1, fontSize: ".9em" }}
										>
											Department:{" "}
											<span style={{ color: "black", fontWeight: 500, }}>
												{selectedUser.dept}{" "}
											</span>
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Grid item xs container direction="column" spacing={2}>
									<Grid item xs sx={{ mt: 7.8 }}>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", fontSize: ".9em" }}
										>
											Employment Status:{" "}
											<span
												style={{
													color:
														selectedUser.empStatus === "Regular"
															? "green"
															: "red",
                              fontWeight: 500,
												}}
											>
												{selectedUser.empStatus}
											</span>
										</Typography>
										{selectedUser.empStatus !== "Regular" && (
											<>
												<Typography
													color="text.secondary"
													sx={{
														fontFamily: "Poppins",
														mt: 1,
														fontSize: ".9em",
													}}
												>
													Probationary Status:{" "}
													<span style={{ color: "black", fontWeight: 500, }}>
														{selectedUser.probeStatus}
													</span>
												</Typography>
												<Typography
													color="text.secondary"
													sx={{
														fontFamily: "Poppins",
														mt: 1,
														fontSize: ".9em",
													}}
												>
													Probationary Date Started:{" "}
													<span style={{ color: "black", fontWeight: 500, }}>
														{selectedUser.dateStarted}
													</span>
												</Typography>
											</>
										)}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
					<Grid container spacing={0.9}>
						<Grid item xs={5.85} sx={{ mt: 1 }}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: "5px",
									width: "99%",
									height: "12.5em",
									ml: 3,
								}}
							>
								<Grid item xs={12} sm container>
									<Grid item xs container spacing={2} sx={{ ml: 2 }}>
										<Grid item xs>
											<Typography
												sx={{
													fontFamily: "Poppins",
													fontWeight: "bold",
													fontSize: "1.3em",
													color: "black",
													mt: 1,
												}}
											>
												Personal Details
											</Typography>
										</Grid>
										<Grid
											item
											xs
											sx={{
												display: "flex",
												justifyContent: "right",
												height: "3em",
												mr: "1em",
												mt: 0.5,
											}}
										>
											{!isPrsnlEditMode && (
												<Tooltip title="Edit Details" arrow>
													<IconButton onClick={handlePrsnlEditClick}>
														<BorderColorRoundedIcon
															sx={{
																fontSize: ".8em",
																color: "rgba(140, 56, 62, 0.5)",
																"&:hover": { color: "#8c383e" },
															}}
														/>
													</IconButton>
												</Tooltip>
											)}
										</Grid>
									</Grid>
								</Grid>
								{/* for edit  */}
								{isPrsnlEditMode ? (
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: ".8em",
													ml: 3,
													mt: 2,
												}}
											>
												First Name:
											</Typography>
											<TextField
												type="text"
												name="fName"
												value={selectedUser.fName}
												onChange={handleDetailsChange}
												variant="outlined"
												size="small"
												sx={{ ml: 3.2, mt: 1.5, width: "10em" }}
												InputLabelProps={{
													style: { fontFamily: "Poppins", fontSize: ".8em" },
												}}
												inputProps={{
													style: { fontSize: ".8em", fontFamily: "Poppins" },
												}}
											/>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: ".8em",
													ml: 9.2,
													mt: 2,
												}}
											>
												Gender:
											</Typography>
											<Select
												labelId="gender"
												id="gender"
												value={selectedUser.gender}
												name="gender"
												sx={{
													ml: 1,
													mt: 1.5,
													mr: 4,
													width: "10em",
													height: "2.5em",
													fontSize: ".9em",
													fontFamily: "Poppins",
												}}
												onChange={handleDetailsChange}
											>
												<MenuItem value={"Female"}>Female</MenuItem>
												<MenuItem value={"Male"}>Male</MenuItem>
												<MenuItem value={"Other"}>Other</MenuItem>
											</Select>
										</div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: ".8em",
													ml: 3,
													mt: 2,
												}}
											>
												Middle Name:
											</Typography>
											<TextField
												type="text"
												name="mName"
												value={selectedUser.mName}
												onChange={handleDetailsChange}
												variant="outlined"
												size="small"
												sx={{ ml: 1, mt: 1.5, width: "10em" }}
												InputLabelProps={{
													style: { fontFamily: "Poppins", fontSize: ".8em" },
												}}
												inputProps={{
													style: { fontSize: ".8em", fontFamily: "Poppins" },
												}}
											/>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: ".8em",
													ml: 3,
													mt: 2,
												}}
											>
												{" "}
												Mobile Number:{" "}
											</Typography>
											<TextField
												type="text"
												name="contactNum"
												value={selectedUser.contactNum}
												onChange={handleDetailsChange}
												variant="outlined"
												size="small"
												sx={{ ml: 1, mt: 1.5, width: "10em" }}
												InputLabelProps={{ style: { fontFamily: "Poppins" } }}
												inputProps={{
													style: { fontSize: ".8em", fontFamily: "Poppins" },
												}}
											/>
										</div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: ".8em",
													ml: 3,
													mt: 2,
												}}
											>
												Last Name:{" "}
											</Typography>
											<TextField
												type="text"
												name="lName"
												value={selectedUser.lName}
												onChange={handleDetailsChange}
												variant="outlined"
												size="small"
												sx={{ ml: 3.2, mt: 1.5, width: "10em" }}
												InputLabelProps={{ style: { fontFamily: "Poppins" } }}
												inputProps={{
													style: { fontSize: ".8em", fontFamily: "Poppins" },
												}}
											/>
											<Button
												variant="outlined"
												sx={{
													color: "#B4B4B4",
													height: "2.3em",
													width: "7em",
													mr: 2,
													mt: 2,
													ml: 10,
													fontFamily: "Poppins",
													backgroundColor: "transparent",
													borderColor: "#E0E0E0",
													padding: "1px 1px 0 0 ",
													"&:hover": {
														backgroundColor: "#E0E0E0",
														borderColor: "#E0E0E0",
														color: "#1E1E1E",
													},
												}}
												style={{ textTransform: "none" }}
												onClick={handlePrsnlEditClose}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												onClick={(e) => handleSavePrsnlChanges(e, selectedUser)}
												sx={{
													height: "2.3em",
													width: "7em",
													mr: 2,
													mt: 2,
													fontFamily: "Poppins",
													backgroundColor: "#8c383e",
													padding: "1px 1px 0 0 ",
													"&:hover": {
														backgroundColor: "#762F34",
														color: "white",
													},
												}}
												style={{ textTransform: "none" }}
												startIcon={<SaveAsRoundedIcon />}
												disabled={!saveDisabled}
											>
												Save{" "}
											</Button>
										</div>
									</div>
								) : (
									<>
										{/* for display only */}
										<Grid container spacing={2}>
											<Grid item xs={12} sm container>
												<Grid
													item
													xs
													container
													direction="column"
													spacing={2}
													sx={{ ml: 2 }}
												>
													<Grid item xs>
														<Typography
															color="text.secondary"
															sx={{
																fontFamily: "Poppins",
																mt: 2.5,
																fontSize: "1em",
															}}
														>
															First Name:{" "}
															<span style={{ color: "black", fontWeight: 500 }}>
																{selectedUser.fName}
															</span>
														</Typography>
														<Typography
															color="text.secondary"
															sx={{
																fontFamily: "Poppins",
																mt: 2.5,
																fontSize: "1em",
															}}
														>
															Middle Name:{" "}
															<span style={{ color: "black", fontWeight: 500 }}>
																{selectedUser.mName}
															</span>
														</Typography>
														<Typography
															color="text.secondary"
															sx={{
																fontFamily: "Poppins",
																mt: 2.5,
																fontSize: "1em",
															}}
														>
															Last Name:{" "}
															<span style={{ color: "black", fontWeight: 500 }}>
																{selectedUser.lName}
															</span>
														</Typography>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12} sm container>
												<Grid item xs container direction="column" spacing={2}>
													<Grid item xs sx={{ mt: 2.5 }}>
														<Typography
															color="text.secondary"
															sx={{ fontFamily: "Poppins", fontSize: "1em" }}
														>
															Gender:{" "}
															<span style={{ color: "black", fontWeight: 500 }}>
																{selectedUser.gender}
															</span>
														</Typography>
														<Typography
															color="text.secondary"
															sx={{
																fontFamily: "Poppins",
																mt: 2.5,
																fontSize: "1em",
															}}
														>
															Mobile Number:{" "}
															<span style={{ color: "black", fontWeight: 500 }}>
																{selectedUser.contactNum}
															</span>
														</Typography>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</>
								)}
							</Paper>
						</Grid>
						<Grid item xs={6} sx={{ mt: 1 }}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: "5px",
									width: "99%",
									height: "12.5em",
									ml: 2.7,
								}}
							>
								<Grid item xs={12} sm container>
									<Grid item xs container spacing={2} sx={{ ml: 1 }}>
										<Grid item xs>
											<Typography
												sx={{
													fontFamily: "Poppins",
													fontWeight: "bold",
													fontSize: "1.3em",
													mt: 1,
												}}
											>
												Account Details
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid sm container>
									<Grid item xs container spacing={2} sx={{ ml: 1 }}>
											<Typography
												color="text.secondary"
												sx={{
													fontFamily: "Poppins",
													fontSize: "1em",
													mt: 5,
													ml: 2,
												}}
											>
												Username:{" "}
												<span style={{ color: "black", fontWeight: 500 }}>
													{selectedUser.username}
												</span>
											</Typography>
										<Grid
											item
											xs
											sx={{
												display: "flex",
												justifyContent: "left",
												height: "3em",
												mr: "1em",
												mt: 2,
											}}
										>
										</Grid>
									</Grid>
								</Grid>
								<Grid item sm container>
										<Typography
											color="text.secondary"
											sx={{
												fontFamily: "Poppins",
												fontSize: "1em",
												mt: 3,
												ml: 3,
											}}
										>
											Password:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												**********
											</span>
										</Typography>
									<Grid
										item
										xs
										sx={{
											display: "flex",
											justifyContent: "left",
											height: "2em",
											ml: 2,
											mt: 2,
										}}
									>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
					<Paper
						elevation={0}
						sx={{
							borderRadius: "5px",
							width: "100%",
							height: "13em",
							mt: 0.8,
							ml: 3,
						}}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm container>
								<Grid
									item
									xs
									container
									direction="column"
									spacing={2}
									sx={{ ml: 2 }}
								>
									<Grid item xs>
										<Typography
											gutterBottom
											component="div"
											sx={{
												fontFamily: "Poppins",
												fontWeight: "bold",
												mt: 1,
												fontSize: "1.3em",
												color: "black",
											}}
										>
											Work Details
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 2, fontSize: "1em" }}
										>
											Employee ID:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												{selectedUser.workID}
											</span>
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 2, fontSize: "1em" }}
										>
											Department:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												{selectedUser.dept}
											</span>
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 2, fontSize: "1em" }}
										>
											Position:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												{selectedUser.position}
											</span>
										</Typography>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 2, fontSize: "1em" }}
										>
											Institutional Email:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												{selectedUser.workEmail}
											</span>
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sm container>
								<Grid
									item
									xs
									container
									direction="column"
									spacing={2}
									sx={{ ml: 2 }}
								>
									<Grid item xs sx={{ mt: 6.5 }}>
										<Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", fontSize: "1em" }}
										>
											Date Hired:{" "}
											<span style={{ color: "black", fontWeight: 500 }}>
												{selectedUser.dateHired}
											</span>
										</Typography>
										{/* <Typography
											color="text.secondary"
											sx={{ fontFamily: "Poppins", mt: 2, fontSize: "1em" }}
										>
											Signature:{" "}
											<span style={{ color: "black" }}>
												{selectedUser.signature}
											</span>
										</Typography> */}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Dialog
					open={openSeePictureDialog}
					onClose={handleCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<Box
						sx={{
							bgcolor: "#8c383e",
							height: "2em",
							width: "100%",
							display: "flex",
							justifyContent: "right",
						}}
					>
						<Grid
							container
							spacing={0.6}
							sx={{
								fontFamily: "Poppins",
								fontWeight: 500,
								color: "white",
								backgroundColor: "transparent",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Grid item sx={{ fontSize: "1em", mt: "4px", ml: 5 }}>
								Profile Picture
							</Grid>
						</Grid>
						<IconButton
							onClick={handleCloseDialog}
							sx={{ "&:hover": { color: "#F8C702" } }}
						>
							<HighlightOffOutlinedIcon
								sx={{ fontSize: "1em", color: "white" }}
							/>
						</IconButton>
					</Box>
					<DialogContent sx={{ width: "30em", height: "35em" }}>
						<DialogContentText id="alert-dialog-description">
							<Box
								sx={{
									width: "100%",
									height: "20em",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									mt: 5,
								}}
							>
								{profilePictureUrl ? (
									<Avatar
										sx={{ width: "15em", height: "15em" }}
										src={profilePictureUrl}
										onClick={handleImageClick}
									/>
								) : (
									<Avatar alt="User" src="/user.png"
										sx={{ width: "15em", height: "15em" }}
										onClick={handleImageClick}
									/>
								)}
							</Box>
						</DialogContentText>
						<DialogActions
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								mt: 5,
							}}
						>
							{!image && (
								<Button
									component="label"
									type="submit"
									sx={{
										borderRadius: "5px",
										fontSize: "1em",
										bgcolor: "#8c383e",
										color: "white",
										width: "80%",
										"&:hover": { backgroundColor: "#762F34", color: "white" },
									}}
									style={{ textTransform: "none", fontFamily: "Poppins" }}
									startIcon={<CameraAltOutlinedIcon />}
								>
									Upload Picture
									<input
										type="file"
										ref={inputRef}
										style={{ display: "none" }}
										onChange={handleImageChange}
									/>
								</Button>
							)}
							{image && (
									<Box
										sx={{
											display: "flex",
											width: "100%",
											gap: 2,
											flexDirection: "column",
										}}
									>
										<Button
											component="label"
											type="submit"
											sx={{
												borderRadius: "5px",
												bgcolor: "#8C383E",
												color: "white",
												fontSize: "1em",
												width: "100%",
												"&:hover": {
													backgroundColor: "#762F34",
													color: "white",
												},
											}}
											style={{ textTransform: "none", fontFamily: "Poppins" }}
											onClick={handleSavePicture}
										>
											Save Picture
										</Button>
										<Button
											component="label"
											variant="outlined"
											type="submit"
											sx={{
												borderRadius: "5px",
												borderColor: "#E0E0E0",
												fontSize: "1em",
												color: "#B4B4B4",
												width: "100%",
												"&:hover": {
													bgcolor: "#E0E0E0",
													color: "#1E1E1E",
													borderColor: "#E0E0E0",
												},
											}}
											style={{ textTransform: "none", fontFamily: "Poppins" }}
											onClick={handleCancel}
										>
											Cancel
										</Button>
									</Box>
							)}
						</DialogActions>
					</DialogContent>
				</Dialog>
			</Box>

			{/* render success alert */}
			<CustomAlert
				open={successAlert.open}
				onClose={() => setSuccessAlert({ ...successAlert, open: false })}
				severity="success"
				message={successAlert.message}
			/>
			{/* Render error alert */}
			<CustomAlert
				open={errorAlert.open}
				onClose={() => setErrorAlert({ ...errorAlert, open: false })}
				severity="error"
				message={errorAlert.message}
			/>

			{loading && (
				<Box display="flex" justifyContent="center" alignItems="center" position="absolute" top={0} left={0} width="100%" height="100%" bgcolor="rgba(0, 0, 0, 0.5)">
					<CircularProgress />
				</Box>
			)}

		</div>
	);
}

export default ViewProfilePage;
