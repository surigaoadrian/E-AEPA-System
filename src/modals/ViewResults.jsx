import React, { useState} from 'react';
import { Modal, Box, Menu, MenuItem, IconButton, Tabs, Tab } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import GeneratePDF from '../components/GeneratePDF';  // Import the GeneratePDF function
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabPanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
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

const ViewResults = ({ open, onClose, employee }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");

  const [anchorEl, setAnchorEl] = useState(null);

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
    setTabIndex(newIndex);
  };

  const tabStyle = {
    textTransform: "none",
    color: "#9D9D9D",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 'bold',
    "& .MuiTabs-indicator": {
      backgroundColor: "#8C383E",
    },
    "&.Mui-selected": {
      color: "#8C383E",
    },
  };

  const handlePrint = () => {
    const printAreaId = `tabPanel-${tabIndex}`;
    const input = document.getElementById(printAreaId);
  
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
          pdf.save('download.pdf');
        }).catch(error => {
          console.error('Error capturing the PDF:', error);
        });
      }, 100); // Adjust delay as needed
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };
  

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
            height: '48px',
            borderBottom: '3px solid #F8C702',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          <Box sx={{ flex: 1 }} /> {/* Left spacer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
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
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Tabs className='ml-4' value={tabIndex} onChange={handleTabChange} sx={tabStyle}>
            <Tab label="3rd Month" sx={tabStyle} />
            <Tab disabled label="5th Month" sx={tabStyle} />
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
          
          <TabPanel value={tabIndex} index={0}>
            <ThirdMonthEval id="printArea" userId={employee.userID} employee={employee} filter={filter} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <FifthMonthEval userId={employee.userID} employee={employee} filter={filter} />
          </TabPanel>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewResults;
