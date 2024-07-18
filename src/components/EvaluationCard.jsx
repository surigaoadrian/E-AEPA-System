import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import EvaluationTypeTab from "./EvaluationTypeTab";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import zIndex from "@mui/material/styles/zIndex";
import Animated from "./motion";

function EvaluationCard({
	period,
	loggedUser,
	handleOpenForm,
	handleEvalTypeChange,
	evalType,
	handleOpenModal,
	openModal,
	handleCloseModal,
	handleConfirm,
	setEvalType,
}) {
	const [takeEval, setTakeEval] = useState(false);
	const [shouldDisplay, setShouldDisplay] = useState(true);

	const handleReturn = () => {
		setTakeEval(!takeEval);
		setEvalType("");
	};

	const handleTakeEvalChange = () => {
		setTakeEval(!takeEval);
	};

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 450,
		bgcolor: "background.paper",
		boxShadow: 24,
		borderTop: "30px solid #8C383E",
		borderRadius: "10px",
		padding: "20px",
		display: "flex",
		flexDirection: "column",
		textAlign: "left",
	};

	const cardContainer = {
		minHeight: "30vh",
		width: "100%",
		borderRadius: "10px",
		backgroundColor: "white",
		padding: "20px",
		marginBottom: "10px",
		zIndex: 3,
		position: "relative",
	};

	if (!shouldDisplay) {
		return null;
	}

	return (
    <Animated>
		<div style={cardContainer}>
			{/**Evaluation header */}
			<div
				style={{
					display: "flex",
					height: "30px",
					//   backgroundColor: "yellow",
					marginBottom: "25px",
				}}
			>
				<h3
					style={{
						fontWeight: "600",
						// backgroundColor: "lightblue",
						fontSize: "18px",
						width: "82%",
					}}
				>
					{period} Evaluation
				</h3>
				{/*  */}
				{takeEval ? (
					<>
						<div
							style={{
								display: "flex",

								width: "30%",
								justifyContent: "flex-end",
							}}
						>
							<Button
								sx={{
									width: "30%",
									height: "30px",
									color: "#8C383E",
									fontFamily: "Poppins",
									textTransform: "none",
									"&:hover": {
										backgroundColor: "transparent",
									},
								}}
								onMouseEnter={(e) => {
									e.target.style.textDecoration = "underline";
								}}
								onMouseLeave={(e) => {
									e.target.style.textDecoration = "none";
								}}
								variant="text"
								onClick={handleReturn}
							>
								<FontAwesomeIcon
									icon={faArrowLeftLong}
									style={{
										fontSize: "15px",
										marginRight: "10px",
									}}
								/>
								Return
							</Button>
						</div>
					</>
				) : (
					<>
						<div
							style={{
								display: "flex",
								// backgroundColor: "tomato",
								width: "18%",
								justifyContent: "space-between",
							}}
						>
							<p>Date:</p>
							<p>September 11, 2024</p>
						</div>
					</>
				)}
			</div>

			{takeEval ? (
				<>
					<div style={{ height: "18vh" }}>
						<div
							style={{
								width: "100%",
								display: "flex",
								marginBottom: "20px",
							}}
						>
							<p style={{ width: "20%" }}>Date:</p>
							<p>February 11, 2024</p>
						</div>
						<div
							style={{
								width: "100%",
								display: "flex",
								marginBottom: "20px",
							}}
						>
							<p style={{ width: "20%" }}>Department:</p>
							<p>{loggedUser.dept}</p>
						</div>
						<div
							className="select-box"
							style={{
								width: "100%",
								display: "flex",
								marginBottom: "20px",
							}}
						>
							<div style={{ width: "20%" }}>Evaluation for:</div>

							<FormControl sx={{ width: "25%", height: "35px" }} size="small">
								<Select
									sx={{
										height: "35px",
										".MuiSvgIcon-root ": {
											fill: "#8C383E !important",
										},
									}}
									labelId="demo-select-small-label"
									id="demo-select-small"
									value={evalType}
									onChange={handleEvalTypeChange}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={"SELF"}>Self Evaluation</MenuItem>
									{loggedUser.position !== "Secretary" && (
										<MenuItem value={"PEER"}>Peer Evaluation</MenuItem>
									)}
								</Select>
							</FormControl>
						</div>
					</div>
				</>
			) : (
				<>
					{/**Evaluation description */}
					<div style={{ width: "82%" }}>
						<p>
							As of February 11, 2024, the employee has completed his{" "}
							{period + " "}
							probationary period. During this e-AEPA, the employee will undergo
							evaluations by their Immediate Head, Self Evaluation, and Peer
							Evaluation.
						</p>
					</div>
					{/**Evaluation footer */}
					<div
						style={{
							//   backgroundColor: "#a29bfe",
							height: "70px",
							width: "100%",
							display: "flex",
							alignItems: "flex-end",
							justifyContent: "space-between",
						}}
					>
						<div
							style={{
								display: "flex",
								height: "55px",
								// backgroundColor: "#ffeaa7",
								alignItems: "flex-end",
								textAlign: "center",
							}}
						>
							<div
								style={{
									border: "2px solid #10AC84",
									padding: "5px 0px 5px 0px",
									height: "35px",
									width: "145px",
									marginRight: "20px",
									borderRadius: "5px",
									color: "#10AC84",
									fontWeight: "500",
								}}
							>
								<p>Self Evaluation</p>
							</div>
							{loggedUser.position !== "Secretary" && (
								<div
									style={{
										border: "2px solid #EE5253",
										padding: "5px 0px 5px 0px",
										height: "35px",
										width: "145px",
										borderRadius: "5px",
										color: "#EE5253",
										fontWeight: "500",
									}}
								>
									<p>Peer Evaluation</p>
								</div>
							)}
						</div>
						<Button
							sx={{
								width: "14%",
								height: "35px",
								textTransform: "none",
								backgroundColor: "#8C383E",
								"&:hover": {
									backgroundColor: "#7C2828",
								},
								fontFamily: "poppins",
							}}
							variant="contained"
							onClick={handleTakeEvalChange}
						>
							Take Evaluation
						</Button>
					</div>
				</>
			)}

			{/** Evaluation tab */}
			<EvaluationTypeTab
				period={period}
				evalType={evalType}
				handleOpenForm={handleOpenForm}
				handleOpenModal={handleOpenModal}
				setShouldDisplay={setShouldDisplay}
			/>

			{/**Confirmation Modal */}
			<Modal
				open={openModal}
				onClose={handleCloseModal}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box sx={modalStyle}>
					<Typography
						id="modal-title"
						sx={{ fontSize: "15px", fontFamily: "Poppins" }}
						component="h2"
					>
						Are you sure you want to start the assessment now?
					</Typography>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							width: "100%",
							marginTop: "20px",
						}}
					>
						<Button
							variant="outlined"
							sx={{
								marginRight: "10px",
								width: "20%",
								fontWeight: 600,
								borderColor: "#E0E0E0",
								color: "#1E1E1E",
								textTransform: "none",
								"&:hover": {
									backgroundColor: "#E9E9E9",
									color: "#1E1E1E",
                  borderColor: "#E0E0E0"
								},
							}}
							onClick={handleCloseModal}
						>
							No
						</Button>
						<Button
							sx={{
								width: "20%",
								height: "35px",
								backgroundColor: "#8C383E",
								textTransform: "none",
								"&:hover": {
									backgroundColor: "#7C2828",
								},
								fontFamily: "poppins",
							}}
							variant="contained"
							onClick={handleConfirm}
						>
							Yes
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
    </Animated>
	);
}

export default EvaluationCard;
