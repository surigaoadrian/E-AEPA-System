import React, { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../index.css";
import LoginForm from "../components/LoginForm";
import logo from "../assets/e-AEPA-logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgottenBtn, setIsForgottenBtn] = useState(false);
  const navigate = useNavigate();
  // const signIn = useSignIn();

  const handleInputUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setIsForgottenBtn(!isForgottenBtn);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });
      // // Authenticate the token using isAuthenticated function

      const token = response.data.token;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      const userID = decodedToken.userID;

      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userID", userID);

      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
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

          <LoginForm
            loginStyles={loginStyles}
            handleInputUsername={handleInputUsername}
            handleInputPassword={handleInputPassword}
            handleShowPassword={handleShowPassword}
            showPassword={showPassword}
            handleLogin={handleLogin}
          />

          <NavLink style={forgotPassBtn} to={"/forgotPassword"}>
            Forgot Password?
          </NavLink>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
