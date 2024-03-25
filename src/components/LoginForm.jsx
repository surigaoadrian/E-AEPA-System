import React from "react";
import Button from "@mui/material/Button";

function LoginForm(props) {
  return (
    <form
      action=""
      style={{
        width: "90%",
        minHeight: "200px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input style={props.loginStyles} type="text" placeholder="ID Number" />

      <input
        style={props.loginStyles}
        type={props.showPassword ? "text" : "password"}
        placeholder="Password"
        onChange={props.handleInputPassword}
      />

      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          id="showpass"
          type="checkbox"
          onChange={props.handleShowPassword}
        />
        <label
          htmlFor="showpass"
          style={{
            fontSize: "14px",
            fontWeight: "400",
            color: "#636E72",
            marginLeft: "5px",
          }}
        >
          Show Password
        </label>
      </div>

      <Button
        fullWidth
        variant="contained"
        size="small"
        sx={{
          marginTop: "20px",
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
