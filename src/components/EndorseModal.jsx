import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";

function EndorseModal({ open, handleClose, handleEndorse }) {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="endorsement"
			aria-describedby="confirmation"

		>
			<Fade in={open}>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						backgroundColor: "white",
						padding: "20px",
						borderRadius: "5px",
						height: "25vh",
						width: "35%",
					}}
				>
					<div
						style={{
							backgroundColor: "#8C383E",
							borderTopLeftRadius: "5px",
							borderTopRightRadius: "5px",
							position: "absolute",
							top: "0",
							left: "0",
							right: "0",
							height: "23%",
						}}
					>
						<h2
							style={{
								marginTop: "10px",
								marginLeft: "23px",
								color: "white",
								fontFamily: "Poppins",
								fontSize: "15px",
								fontWeight: "400",
							}}
							id="endorsement"
						>
							Confirm Endorsement ?
						</h2>
					</div>
					<p
						style={{
							marginTop: "12%",
							textAlign: "center",
							marginRight: "25px",
							fontFamily: "Poppins",
							fontSize: "14px",
							color: "#1e1e1e",
						}}
						id="confirmation"
					>
						This action will formally endorse the employee to the Office Head.
					</p>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							marginTop: "30px",
						}}
					>
						<Button
							onClick={handleClose}
							variant="outlined"
							color="secondary"
							sx={{
                                fontSize: "14px",
								color: "#9D9D9D",
								fontFamily: "Poppins",
								textTransform: "none",
								border: "none",
								backgroundColor: "transparent",
								"&:hover": {
									backgroundColor: "#E9E9E9",
									color: "#1e1e1e",
									border: "none",
								},
								width: "10%",
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							sx={{
								marginLeft: "10px",
								color: "white",
								fontFamily: "Poppins",
								textTransform: "none",
								backgroundColor: "#8C383E",
								"&:hover": { backgroundColor: "#F8C702", color: "#1e1e1e" },
								width: "10%",
							}}
						>
							Send
						</Button>
					</div>
				</div>
			</Fade>
		</Modal>
	);
}

export default EndorseModal;
