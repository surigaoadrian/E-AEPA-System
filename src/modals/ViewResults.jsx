import React, { useState, useEffect} from 'react';
import axios from "axios";
import { Modal, Box, Menu, MenuItem, IconButton, Tabs, Tab } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import AnnualFirstSemEval from "../modals/AnnualFirstSemEval";
import AnnualSecondSemEval from "../modals/AnnualSecondSemEval";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiUrl } from "../config/config";
import { motion } from "framer-motion";
import { faChevronDown, faGears } from "@fortawesome/free-solid-svg-icons";
import '../index.css';


const TabPanel = ({ children, value, index, ...props }) => {
  return (
    <div
      id={`tabPanel-${index}`} // Ensure the id matches the expected format
      role="tabpanel"
      hidden={value !== index}
      {...props}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};


const menuItemStyles = {
  fontFamily: "Poppins",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#9D9D9D",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
};

const selectedMenuItemStyles = {
  ...menuItemStyles,
  backgroundColor: "#8C383E",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#8C383E",
    color: "#ffffff",
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


const ViewResults = ({ open, onClose, employee }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [openYearDropdown, setOpenYearDropdown] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const isProbationary = employee?.empStatus === "Probationary";
  const isRegular = employee?.empStatus === "Regular";
  const [dateHired, setDateHired] = useState("");
  const userID = sessionStorage.getItem("userID");
  const fName = employee?.fName;
  const lName = employee?.lName;
  const userFullName = `${fName} ${lName}`;
  const formattedName = userFullName.replace(/\s+/g, '_'); 
  const fileName = `${formattedName}_e-eapa.pdf`;

  useEffect(() => {
    if (employee?.dateHired) {
      setDateHired(employee.dateHired);
    }
  }, [employee]);

  console.log("Date Hired:", dateHired);

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setOpenYearDropdown(false);
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

  const handleTabChange = (event, newIndex) => {
    console.log("Changing tab to:", newIndex);
    setTabIndex(newIndex);
  };

  const tabsContainerStyle = {
    "& .MuiTabs-indicator": {
      backgroundColor: "#8C383E",
    },
  };
  
  const tabStyle = {
    textTransform: "none",
    color: "#9D9D9D",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: "bold",
    "&.Mui-selected": {
      color: "#8C383E",
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

  const handlePrint = () => {
    const printAreaId = `tabPanel-${tabIndex}`;
    console.log("Searching for print area with ID:", printAreaId);
    const input = document.getElementById(printAreaId);
    console.log("Found element:", input);
  
    if (!input) {
      console.error("Print area not found");
      return;
    }
    // Ensure the image is fully loaded
    const images = input.getElementsByTagName('img');
    const promises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    });
  
    Promise.all(promises).then(() => {
      // Add a short delay to ensure everything is rendered properly
      setTimeout(() => {
        html2canvas(input, {
          backgroundColor: null,
          useCORS: true,
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(fileName);
        }).catch(error => {
          console.error('Error capturing the PDF:', error);
        });
      }, 100); // Adjust delay as needed
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };
  
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
  console.log("Hire Year:", hireYear);

  // Filter academic years based on the hire year
  const filteredAcademicYears = academicYears.filter(
    (year) => new Date(year.startDate).getFullYear() >= hireYear
  );


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          width: '80vw',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#8C383E',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            height: '50px',
            borderBottom: '3px solid #F8C702',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          {/* <Box sx={{ flex: 1 }} /> Left spacer */}
          <Box sx={{ flex: 1 }}>
          <div className="ml-2" style={{ width: '100%', display: "flex",  justifyContent: "flex-start", alignItems: "flex-start" }}>   
      <div className="flex gap-4 justify-start">
          <div className="relative">
    
            <button
              onClick={() => setOpenYearDropdown(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md h-8"
              style={{ backgroundColor: "#FFF", color: "#8C383E" }}
            >
              <span className="font-medium text-sm">
                {selectedYear || "Select Year"}
              </span>
              <motion.span animate={openYearDropdown ? "open" : "closed"} variants={iconVariants}>
              <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: "12px", color: "#8C383E" }}
                />
              </motion.span>
            </button>
            
            <motion.ul
              initial={wrapperVariants.closed}
              animate={openYearDropdown ? "open" : "closed"}
              variants={wrapperVariants}
              className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg mt-2 overflow-hidden z-10 text-base text-black font-normal"
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

        </div>
      </div>

          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 2}}>
            View Results
            <IconButton onClick={handlePrint}>
              <PrintIcon style={{ color: 'white' }} />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleFilterButtonClick}>
              <FilterListIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Tabs className="ml-4" value={tabIndex} onChange={handleTabChange} sx={tabsContainerStyle}>
            {isProbationary && [
              <Tab key="thirdMonth" label="3rd Month" sx={tabStyle} />,
              <Tab key="fifthMonth" label="5th Month" sx={tabStyle} />,
            ]}
            {isRegular && [
              <Tab key="annualFirst" label="Annual 1st" sx={tabStyle} />,
              <Tab key="annualSecond" label="Annual 2nd" sx={tabStyle} />,
            ]}
          </Tabs>


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

          {isProbationary && (
          <>
            {employee.is3rdEvalComplete ? (
              <TabPanel value={tabIndex} index={0}>
                <ThirdMonthEval 
                  headId={userID} 
                  userId={employee.userID} 
                  filter={filter} 
                  selectedYear={selectedYear} 
                  selectedSemester='First Semester' 
                />
              </TabPanel>
            ) : (
              <TabPanel value={tabIndex} index={0}>
                <NoResults message="There are no results for the third-month evaluation at this time." />
              </TabPanel>
            )}

            {employee.is5thEvalComplete ? (
              <TabPanel value={tabIndex} index={1}>
                <FifthMonthEval 
                  headId={userID} 
                  userId={employee.userID} 
                  filter={filter} 
                  selectedYear={selectedYear} 
                  selectedSemester='First Semester' 
                />
              </TabPanel>
            ) : (
              <TabPanel value={tabIndex} index={1}>
                <NoResults message="There are no results for the 5th month evaluation at this time." />
              </TabPanel>
            )}
          </>
        )}

          {isRegular && (
            <>
              <TabPanel value={tabIndex} index={0}>
              <AnnualFirstSemEval 
                    userId={employee.userID} 
                    headId={userID} 
                    filter={filter} 
                    selectedYear={selectedYear} 
                    selectedSemester='First Semester' 
                  />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <AnnualSecondSemEval 
                    headId={userID} 
                    userId={employee.userID} 
                    filter={filter} 
                    selectedYear={selectedYear} 
                    selectedSemester='Second Semester' 
                  />
                </TabPanel>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    );
  };

  export default ViewResults;
