import React, { useState } from "react";
import { Box, Tabs, Tab, IconButton, Menu, MenuItem } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
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

const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");
  const [anchorEl, setAnchorEl] = useState(null);
  const userId = sessionStorage.getItem("userID");

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (value) => {
    setFilter(value);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          }}
        >
          Results
        </h1>
        <IconButton
          onClick={handleFilterButtonClick}
          sx={{ marginRight: "45px" }}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => handleMenuItemClick("overall")}
            sx={filter === "overall" ? selectedMenuItemStyles : menuItemStyles}
          >
            Overall
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("self")}
            sx={filter === "self" ? selectedMenuItemStyles : menuItemStyles}
          >
            Self
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("peer")}
            sx={filter === "peer" ? selectedMenuItemStyles : menuItemStyles}
          >
            Peer
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("head")}
            sx={filter === "head" ? selectedMenuItemStyles : menuItemStyles}
          >
            Head
          </MenuItem>
        </Menu>
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
