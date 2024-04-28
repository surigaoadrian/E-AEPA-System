import React from "react";
import EmployeeData from "../components/EmployeeData";

function ManageEmployee() {
	const header = {
		fontSize: "25px",
		fontWeight: "bold",
		margin: "20px 0px 0px 15px",
		width: "15%",
		display: "flex",
		justifyContent: "center",
	};

 

	return (
		<div>
			<div style={header}>Employees</div>
			<div>
				<EmployeeData />
			</div>
		</div>
	);
}

export default ManageEmployee;
