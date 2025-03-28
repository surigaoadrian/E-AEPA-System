import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/config";
import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/system";
import ThirdMonthEval from "../modals/ThirdMonthEval";
import FifthMonthEval from "../modals/FifthMonthEval";
import AnnualFirstSemEval from "../modals/AnnualFirstSemEval";
import AnnualSecondSemEval from "../modals/AnnualSecondSemEval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

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

const ViewRatingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("overall");
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [semesters, setSemesters] = useState(["1st Semester", "2nd Semester"]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [openYearDropdown, setOpenYearDropdown] = useState(false);
  const [openSemesterDropdown, setOpenSemesterDropdown] = useState(false);
  const userId = sessionStorage.getItem("userID");
  const [dateHired, setDateHired] = useState("");

  const handleTabChange = (event, newIndex) => {
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

  // Fetch academic years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(`${apiUrl}academicYear/getAll`);
        setAcademicYears(response.data);
        const activeYear = response.data.find(year => year.is_active);
        if (activeYear) {
          setSelectedYear(`${activeYear.startDate.slice(0, 4)}-${activeYear.endDate.slice(0, 4)}`);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };
    fetchAcademicYears();
  }, []);

  const evaluationStartDate = new Date(dateHired);
  evaluationStartDate.setMonth(evaluationStartDate.getMonth() + 2);
  const today = new Date();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center w-full px-8 py-4">
        <h1 className="text-2xl font-bold">Results</h1>
        <div className="flex gap-4">
          <div className="relative">
            <button
              onClick={() => setOpenYearDropdown(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-colors"
            >
              <span className="font-medium text-sm">
                {selectedYear || "Select Year"}
              </span>
              <motion.span animate={openYearDropdown ? "open" : "closed"} variants={iconVariants}>
                <FiChevronDown />
              </motion.span>
            </button>
            <motion.ul
              initial={wrapperVariants.closed}
              animate={openYearDropdown ? "open" : "closed"}
              variants={wrapperVariants}
              className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg mt-2 overflow-hidden z-10"
            >
              {academicYears.map((year) => (
                <motion.li
                  key={year.id}
                  variants={itemVariants}
                  onClick={() => handleYearChange(`${year.startDate.slice(0, 4)}-${year.endDate.slice(0, 4)}`)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {`${year.startDate.slice(0, 4)}-${year.endDate.slice(0, 4)}`}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenSemesterDropdown(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-colors"
            >
              <span className="font-medium text-sm">
                {selectedSemester || "Select Semester"}
              </span>
              <motion.span animate={openSemesterDropdown ? "open" : "closed"} variants={iconVariants}>
                <FiChevronDown />
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
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {semester}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
      <Box sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3, width: "79vw", height: "80vh", overflowY: "auto" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="3rd Month" />
          <Tab label="5th Month" />
          <Tab label="Annual 1st" />
          <Tab label="Annual 2nd" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          {today >= evaluationStartDate ? <ThirdMonthEval userId={userId} filter={filter} /> : <div>No results for the third-month evaluation at this time.</div>}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <FifthMonthEval userId={userId} filter={filter} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <AnnualFirstSemEval userId={userId} filter={filter} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <AnnualSecondSemEval userId={userId} filter={filter} />
        </TabPanel>
      </Box>
    </div>
  );
};

const TabPanel = ({ children, value, index }) => {
  return <div>{value === index && <>{children}</>}</div>;
};

export default ViewRatingsPage;
