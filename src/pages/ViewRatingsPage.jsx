import React, { useState, useEffect } from "react";
import {Box, Tabs, Tab } from "@mui/material";
import Chart from "react-apexcharts";
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import FifthMonthComments from "../modals/FifthMonthComments";
import axios from "axios";
import Animated from "../components/motion";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const evaluationHeaderStyles = {
  // backgroundColor: "lightblue",
  height: "8vh",
  width: "100%",
  alignItems: "center",
  display: "flex",
  paddingLeft: "45px",
};

const tabStyle = {
  textTransform: "none",
  color: "#9D9D9D",
  fontFamily: "Poppins",
  fontSize: "13px",
  fontWeight: "bold",
  "& .MuiTabs-indicator": {
    backgroundColor: "#8C383E", //nig click makita maroon
  },
  "&.Mui-selected": {
    color: "#8C383E", //kung unsa selected
  },
};



const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const userId = sessionStorage.getItem('userID');

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  return (
    <Animated>
    <div
      style={{
        //backgroundColor: "yellow",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={evaluationHeaderStyles}>
        <h1
          style={{
            //backgroundColor: "yellow",
            flex: 1,
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Results
        </h1>
      </div>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "79vw",
          height: "80vh",
          overflowY: "auto",
        }}
      >
     <Tabs value={tabIndex} onChange={handleTabChange} className="ml-4" sx={tabStyle}>
        <Tab label="3rd Month" sx={tabStyle} />
        <Tab label="5th Month" sx={tabStyle} />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <ThirdMonthEval userId={userId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <FifthMonthEval userId={userId} />
      </TabPanel>

      </Box>
    </div>
    </Animated>
  );
}

export default ViewRatingsPage;
