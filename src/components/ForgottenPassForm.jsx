import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ForgottenPassForm(props) {
  return (
    <div
      style={{
        height: "240px",
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
        Forgot Password
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
        Enter the email address associated to this account and we will send you
        a code to reset your password.
      </Typography>

      <form
        action=""
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
          type="email"
          placeholder="Institutional Email"
        />

        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
          }}
        ></div>

        <Button
          fullWidth
          variant="contained"
          size="small"
          sx={{
            marginTop: "15px",
            backgroundColor: "#8C383E",
            "&:hover": {
              backgroundColor: "#7C2828",
            },
            fontFamily: "poppins",
          }}
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default ForgottenPassForm;
