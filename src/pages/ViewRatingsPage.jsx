import React, {useState, useRef, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/config";
import {
  Box,
  Button,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import AnnualFirstSemEval from "../modals/AnnualFirstSemEval";
import AnnualSecondSemEval from "../modals/AnnualSecondSemEval";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faGears } from "@fortawesome/free-solid-svg-icons";

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

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const NoResults = ({ message }) => (
  <div
    style={{
      height: "200px",
      width: "100%",
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
      <FontAwesomeIcon icon={faGears} style={{ fontSize: "30px", color: "#a8a7a9" }} />
      <p>{message}</p>
    </div>
  </div>
);



const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [filter, setFilter] = useState("overall");
  const userId = sessionStorage.getItem("userID");
  const contentRef = useRef(null);
  const [loggedUser, setLoggedUser] = useState({});
  const [dateHired, setDateHired] = useState("");
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [semesters, setSemesters] = useState(["First Semester", "Second Semester"]);
  const [selectedSemester, setSelectedSemester] = useState("First Semester");
  const [openYearDropdown, setOpenYearDropdown] = useState(false);
  const [openSemesterDropdown, setOpenSemesterDropdown] = useState(false);

  const handleTabChange = (event, newIndex) => {
    console.log('Current tab index:', newIndex);
    setTabIndex(newIndex);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setOpenYearDropdown(false);
  };

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    setOpenSemesterDropdown(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/getUser/${userId}`);
        setLoggedUser(response.data);
        console.log("dateHired: ", response.data.dateHired);
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

  // Fetch academic years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(`${apiUrl}academicYear/all-years`);
        setAcademicYears(response.data);
        console.log("AY: ",response.data);
        const activeYear = response.data.find(year => year.isActive);
        if (activeYear) {
          setSelectedYear(`${activeYear.startDate.slice(0, 4)}-${activeYear.endDate.slice(0, 4)}`);
         
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };
    fetchAcademicYears();
  }, []);

  // Extract the hire year from dateHired
  const hireYear = new Date(dateHired).getFullYear();

  // Filter academic years based on the hire year
  const filteredAcademicYears = academicYears.filter(
    (year) => new Date(year.startDate).getFullYear() >= hireYear
  );
  // Determine if the selected year matches the hire year
  const isHireYear = selectedYear && selectedYear.startsWith(hireYear.toString());

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="w-full mt-4 mb-4 flex justify-items-start">
      <div className="ml-14" style={{ width: '100%', display: "flex",  justifyContent: "flex-start", alignItems: "flex-start" }}>   
      <div className="flex gap-4 justify-start">
          <div className="relative">
    
            <button
              onClick={() => setOpenYearDropdown(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ backgroundColor: "#8C383E", color: "#FFF" }}
            >
              <span className="font-medium text-sm">
                {selectedYear || "Select Year"}
              </span>
              <motion.span animate={openYearDropdown ? "open" : "closed"} variants={iconVariants}>
              <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: "12px", color: "#FFF" }}
                />
              </motion.span>
            </button>
            
            <motion.ul
              initial={wrapperVariants.closed}
              animate={openYearDropdown ? "open" : "closed"}
              variants={wrapperVariants}
              className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg mt-2 overflow-hidden z-10"
            >
              {filteredAcademicYears.map((year) => (
                <motion.li
                  variants={itemVariants}
                  key={`${year.startDate}-${year.endDate}`}
                  onClick={() => handleYearChange(`${new Date(year.startDate).getFullYear()}-${new Date(year.endDate).getFullYear()}`)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                   {`${new Date(year.startDate).getFullYear()} - ${new Date(year.endDate).getFullYear()}`}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          {!isHireYear && (
          <div className="relative">
            <button
              onClick={() => setOpenSemesterDropdown(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ backgroundColor: "#8C383E", color: "#FFF" }}
            >
              <span className="font-medium text-sm">
                {selectedSemester || "Select Semester"}
              </span>
              <motion.span animate={openSemesterDropdown ? "open" : "closed"} variants={iconVariants}>
              <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: "12px", color: "#FFF" }}
                />
              </motion.span>
            </button>
            <motion.ul
              initial={wrapperVariants.closed}
              animate={openSemesterDropdown ? "open" : "closed"}
              variants={wrapperVariants}
              className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg mt-2 overflow-hidden z-10"
            >
              {semesters.map((semester, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  onClick={() => handleSemesterChange(semester)}
                  className="px-4 py-2 hover:bg-gray-200  cursor-pointer"
                >
                  {semester}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          )}
        </div>
      </div>

      <div className="mr-8">
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
      </div>
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
    width: { xs: "100vw", md: "79vw" }, 
    height: "80vh",
    overflowY: "auto",
  }}
>
  {isHireYear ? (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        className="ml-4"
        sx={tabStyle}
      >
        <Tab key="3rd-month" label="3rd Month" sx={tabStyle} />
        <Tab key="5th-month" label="5th Month" sx={tabStyle} />
      </Tabs>
      {loggedUser.is3rdEvalComplete ? (
      <TabPanel value={tabIndex} index={0}>
          <ThirdMonthEval userId={userId} filter={filter} selectedYear={selectedYear} selectedSemester={selectedSemester} />
      </TabPanel>
    ) : (
      <TabPanel value={tabIndex} index={0}>
      <NoResults message="There are no results for the third-month evaluation at this time." />
    </TabPanel>
  )}

  {loggedUser.is5thEvalComplete ? (
      <TabPanel value={tabIndex} index={1}>
        <FifthMonthEval userId={userId} filter={filter} selectedYear={selectedYear} selectedSemester={selectedSemester}/>
      </TabPanel>
       ) : (
        <TabPanel value={tabIndex} index={1}>
        <NoResults message="There are no results for the Fifth month evaluation at this time." />
      </TabPanel>
    )}
  
    </>
  ) : (
    // Non-hire year: Render the selected semester evaluation
    <Box sx={{ marginTop: '20px' }}>
      {selectedSemester === "First Semester" ? (
        <AnnualFirstSemEval userId={userId} filter={filter} selectedYear={selectedYear} selectedSemester="First Semester" />
      ) : (
        <AnnualSecondSemEval userId={userId} filter={filter} selectedYear={selectedYear} selectedSemester= "Second Semester" />
      )}
    </Box>

  )}
</Box>

    </div>
  );
};

export default ViewRatingsPage;
