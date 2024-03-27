import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../index.css";
import LoginForm from "../components/LoginForm";
import ForgottenPassForm from "../components/ForgottenPassForm";
import logo from "../assets/e-AEPA-logo.png";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgottenBtn, setIsForgottenBtn] = useState(false);

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setIsForgottenBtn(!isForgottenBtn);
  };

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

  const forgotPassBtn = {
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
      <Card sx={{ width: "320px", height: "400px", borderRadius: "10px" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img style={{ width: "200px" }} src={logo} alt="e-aepa-logo" />

          {isForgottenBtn ? (
            <ForgottenPassForm loginStyles={loginStyles} />
          ) : (
            <LoginForm
              loginStyles={loginStyles}
              handleInputPassword={handleInputPassword}
              handleShowPassword={handleShowPassword}
              showPassword={showPassword}
            />
          )}

          <button style={forgotPassBtn} onClick={handleForgotPassword}>
            {isForgottenBtn ? "Back to Login" : "Forgot Password?"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
