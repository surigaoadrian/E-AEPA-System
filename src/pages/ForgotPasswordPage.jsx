import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import logo from "../assets/e-AEPA-logo.png";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import ForgottenPassForm from "../components/ForgottenPassForm";

function ForgotPasswordPage() {
  const centerDiv = {
    minHeight: "95vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const loginStyles = {
    width: "100%",
    backgroundColor: "#f1f2f6",
    border: "none",
    borderRadius: "3px",
    padding: "10px",
    marginBottom: "10px",
  };

  const backToLoginBtn = {
    textDecoration: "none",
    background: "none",
    fontFamily: "poppins",
    color: "#757575",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      color: "333333",
    },
  };

  return (
    <div style={centerDiv}>
      <Card sx={{ width: "320px", height: "420px", borderRadius: "10px" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img style={{ width: "200px" }} src={logo} alt="e-aepa-logo" />

          <ForgottenPassForm loginStyles={loginStyles} />

          <NavLink style={backToLoginBtn} to={"/login"}>
            <span>
              <FontAwesomeIcon
                icon={faArrowLeftLong}
                style={{ fontSize: "15px", marginRight: "10px" }}
              />
            </span>
            Back to Login
          </NavLink>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
