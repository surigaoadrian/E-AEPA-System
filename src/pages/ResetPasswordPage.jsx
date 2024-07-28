import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import logo from "../assets/e-AEPA-logo.png";
import ResetPassForm from "../components/ResetPassForm";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from '../config/config';

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageInfo, setMessageInfo] = useState({ message: "", type: "" });
  const { token } = useParams();
  const navigate = useNavigate();

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessageInfo({ message: "", type: "" });

    if (newPassword === "" || confirmPassword === "") {
      setTimeout(
        () =>
          setMessageInfo({
            message: "Both fields are required.",
            type: "error",
          }),
        0
      );

      console.log(messageInfo.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setTimeout(
        () =>
          setMessageInfo({ message: "Passwords do not match.", type: "error" }),
        0
      );
      console.log(messageInfo.message);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("token", token);
      params.append("newPassword", newPassword);

      const response = await axios.post(
        `${apiUrl}auth/resetPassword`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setTimeout(
        () =>
          setMessageInfo({
            message:
              "Password successfully reset. You will be redirected to the login page shortly.",
            type: "success",
          }),
        0
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setTimeout(
        () =>
          setMessageInfo({
            message: "Failed to reset password",
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
    marginBottom: "10px",
  };

  return (
    <div style={centerDiv}>
      <Card
        sx={{
          width: "320px",
          height: "420px",
          borderRadius: "10px",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "80px" }}>
            <img style={{ width: "195px" }} src={logo} alt="e-aepa-logo" />
          </div>

          <ResetPassForm
            loginStyles={loginStyles}
            handleNewPassword={handleNewPassword}
            handleConfirmPassword={handleConfirmPassword}
            handleResetPassword={handleResetPassword}
            messageInfo={messageInfo}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
