import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ResetPassForm(props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.messageInfo.message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [props.messageInfo.message]);

  const messageStyle = {
    display: "flex",
    backgroundColor:
      props.messageInfo.type === "success" ? "#DFF0D8" : "#FEDCE0",
    fontSize: "13px",
    color: props.messageInfo.type === "success" ? "#6ab04c" : "#8C383E",
    marginBottom: "5px",
    width: "100%",
    minheight: "30px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "3px",
  };

  return (
    <div
      style={{
        height: "215px",
        width: "290px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          width: "90%",
          fontFamily: "poppins",
          fontWeight: 500,
          fontSize: "16px",
          color: "#757575",
          marginTop: "15px",
        }}
        variant="body2"
        gutterBottom
      >
        Reset Password
      </Typography>
      <Typography
        sx={{
          width: "90%",
          fontFamily: "poppins",
          fontWeight: 400,
          fontSize: "13px",
          color: "#757575",
          marginBottom: "0px",
        }}
        variant="body2"
        gutterBottom
      >
        Set your new password.
      </Typography>

      <form
        onSubmit={props.handleResetPassword}
        style={{
          width: "90%",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          style={props.loginStyles}
          type="password"
          placeholder="Password"
          onChange={props.handleNewPassword}
        />
        <input
          style={props.loginStyles}
          type="password"
          placeholder="Confirm Password"
          onChange={props.handleConfirmPassword}
        />

        {props.messageInfo.message && visible && (
          <p style={messageStyle}>{props.messageInfo.message}</p>
        )}

        <Button
          fullWidth
          variant="contained"
          size="small"
          type="submit"
          sx={{
            marginTop: "4px",
            backgroundColor: "#8C383E",
            "&:hover": {
              backgroundColor: "#7C2828",
            },
            fontFamily: "poppins",
          }}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassForm;
