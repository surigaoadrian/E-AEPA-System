import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import logo from "../assets/e-AEPA-logo.png";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import ForgottenPassForm from "../components/ForgottenPassForm";
import axios from "axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [messageInfo, setMessageInfo] = useState({ message: "", type: "" });

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageInfo({ message: "", type: "" });
    try {
      const params = new URLSearchParams();
      params.append("email", email);

      const response = await axios.post(
        "http://localhost:8080/auth/forgotPassword",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setTimeout(
        () =>
          setMessageInfo({
            message: "Reset password link successfully sent to your email.",
            type: "success",
          }),
        0
      );
    } catch (error) {
      setTimeout(
        () =>
          setMessageInfo({
            message: "Failed to send the reset password link to your email.",
            type: "error",
          }),
        0
      );
    }
  };

  const centerDiv = {
    minHeight: "95vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const loginStyles = {
    fontSize: "14px",
    width: "100%",
    backgroundColor: "#f1f2f6",
    border: "none",
    borderRadius: "3px",
    padding: "10px",
    marginBottom: "5px",
  };

  const backToLoginBtn = {
    marginTop: "8px",
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
      <Card sx={{ width: "320px", minHeight: "410px", borderRadius: "10px" }}>
        <CardContent
          sx={{
            display: "flex",
            minHeight: "300px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "80px" }}>
            <img style={{ width: "195px" }} src={logo} alt="e-aepa-logo" />
          </div>

          <ForgottenPassForm
            handleEmail={handleEmail}
            handleSubmit={handleSubmit}
            loginStyles={loginStyles}
            messageInfo={messageInfo}
          />

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
