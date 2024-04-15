import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { borderRadius, display, textAlign } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function LoginForm(props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [props.message]);

  const messageStyle = {
    display: "flex",
    backgroundColor: "#FEDCE0",
    fontSize: "13px",
    color: "#8C383E",
    marginTop: "0px",
    marginBottom: "0px",
    width: "100%",
    height: "30px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "3px",
  };

  return (
    <form
      onSubmit={props.handleLogin}
      style={{
        width: "90%",
        minHeight: "90px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input
        onChange={props.handleInputUsername}
        style={props.loginStyles}
        type="text"
        placeholder="Username"
      />

      <div style={{ position: "relative", width: "100%" }}>
        <input
          style={{ ...props.loginStyles, paddingRight: "30px" }}
          type={props.showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={props.handleInputPassword}
        />
        <FontAwesomeIcon
          icon={props.showPassword ? faEyeSlash : faEye}
          onClick={props.handleShowPassword}
          style={{
            color: "#636E72",
            position: "absolute",
            right: "10px",
            top: "40%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        />
      </div>

      {props.message && visible && <p style={messageStyle}>{props.message}</p>}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="small"
        sx={{
          marginTop: "10px",
          backgroundColor: "#8C383E",
          "&:hover": {
            backgroundColor: "#7C2828",
          },
          fontFamily: "poppins",
        }}
      >
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
