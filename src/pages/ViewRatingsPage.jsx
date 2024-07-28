import React, { useState } from "react";
import { Box, Tabs, Tab, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { styled } from '@mui/system';
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";

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
    backgroundColor: "#8C383E",
  },
  "&.Mui-selected": {
    color: "#8C383E",
  },
};

const menuItemStyles = {
  fontFamily: "Poppins",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#9D9D9D",
  "&:hover": {
    backgroundColor: "#f0f0f0", // Light background on hover for non-selected items
  },
};

const selectedMenuItemStyles = {
  ...menuItemStyles,
  backgroundColor: "#8C383E",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#8C383E", // Keep the same background color on hover for selected item
    color: "#fff", // Ensure text color stays white
  },
};

const CustomSelect = styled(Select)(({ theme }) => ({
  color: "#8C383E",
  fontWeight: "bold",
  fontFamily: "Poppins",
  border: "2px solid #8C383E",
  width: "120px",
  height: "40px",
  backgroundColor: "#fff",
  marginRight: "30px",
  '& .MuiSelect-icon': {
    color: "#8C383E",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: "transparent",
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: "transparent",
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: "transparent",
  },
  '&:after': {
    borderBottom: `2px solid #8C383E`,
  },
  '& .Mui-selected': {
    backgroundColor: "#8C383E !important",
    color: "#fff !important",
  },
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  ...menuItemStyles,
  '&.Mui-selected': {
    ...selectedMenuItemStyles,
  },
}));

const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");
  const userId = sessionStorage.getItem("userID");

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={evaluationHeaderStyles}>
        <h1
          style={{
            flex: 1,
            fontSize: "22px",
            fontWeight: "bold",
            marginLeft: "25px",
          }}
        >
          Results
        </h1>
        <FormControl sx={{ m: 1, minWidth: 120, marginRight: "45px" }}>
          <CustomSelect
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <CustomMenuItem value="overall">Overall</CustomMenuItem>
            <CustomMenuItem value="self">Self</CustomMenuItem>
            <CustomMenuItem value="peer">Peer</CustomMenuItem>
            <CustomMenuItem value="head">Head</CustomMenuItem>
          </CustomSelect>
        </FormControl>
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
          <ThirdMonthEval userId={userId} filter={filter} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <FifthMonthEval userId={userId} filter={filter} />
        </TabPanel>
      </Box>
    </div>
  );
};

export default ViewRatingsPage;
