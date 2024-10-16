import React from "react";
import Typography from "@mui/material/Typography";

function CurrentSchoolYear({ formattedDate, currentSchoolYear, currentSem }) {
  return (
    <div>
      <div
        style={{
          width: "100%",

          height: "40px",
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          Date:
        </Typography>
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          {formattedDate}
        </Typography>
      </div>
      <div
        style={{
          width: "100%",

          height: "40px",
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          Current School Year:
        </Typography>
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          {currentSchoolYear}
        </Typography>
      </div>
      <div
        style={{
          width: "100%",

          height: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          Current Semester:
        </Typography>
        <Typography
          sx={{ fontWeight: 500, width: "50%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          {currentSem}
        </Typography>
      </div>
    </div>
  );
}

export default CurrentSchoolYear;
