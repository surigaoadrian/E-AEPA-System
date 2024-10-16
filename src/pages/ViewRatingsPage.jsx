import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/config";
import {
  Box,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";

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
  fontsize: "13px",
  border: "1px solid #8C383E",
  width: "120px",
  height: "40px",
  marginRight: "30px",
  "& .MuiSelect-icon": {
    color: "#8C383E",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&:after": {
    borderBottom: `2px solid #8C383E`,
  },
  "& .Mui-selected": {
    backgroundColor: "#8C383E !important",
    color: "#fff !important",
  },
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  ...menuItemStyles,
  "&.Mui-selected": {
    ...selectedMenuItemStyles,
  },
}));

const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");
  const userId = sessionStorage.getItem("userID");
  const contentRef = useRef(null);
  const [loggedUser, setLoggedUser] = useState({});
  const [dateHired, setDateHired] = useState("");

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const exportToPDF = () => {
    const input = contentRef.current;

    html2canvas(input, { useCORS: true, scrollX: 0, scrollY: -window.scrollY })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4", true);
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Use canvas dimensions

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  //adi codes
  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/getUser/${userId}`);
        setLoggedUser(response.data);
        setDateHired(response.data.dateHired);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    };
    fetchUser();
  }, []);

  //3rd
  const evaluationStartDate = new Date(dateHired);
  evaluationStartDate.setMonth(evaluationStartDate.getMonth() + 2);
  const today = new Date();

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
            marginLeft: "10px",
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
        {/* <Button variant="contained" onClick={exportToPDF} sx={{ backgroundColor: "#8C383E", color: "#fff" }}>
          Export
        </Button> */}
      </div>
      <Box
        ref={contentRef}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "79vw",
          height: "80vh",
          overflowY: "auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          className="ml-4"
          sx={tabStyle}
        >
          <Tab label="3rd Month" sx={tabStyle} />
          <Tab label="5th Month" sx={tabStyle} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          {today >= evaluationStartDate ? (
            <ThirdMonthEval userId={userId} filter={filter} />
          ) : (
            <div
              style={{
                height: "200px",
                width: "100%",
                //backgroundColor: "tomato",
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <div
                style={{
                  height: "75px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "#a8a7a9",
                }}
              >
                <FontAwesomeIcon
                  icon={faGears}
                  style={{ fontSize: "30px", color: "#a8a7a9" }}
                />
                <p>
                  There are no results for the third-month evaluation at this
                  time.
                </p>
              </div>
            </div>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <FifthMonthEval userId={userId} filter={filter} />
        </TabPanel>
      </Box>
    </div>
  );
};

export default ViewRatingsPage;
