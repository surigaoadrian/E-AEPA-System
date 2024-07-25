import React, { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert as MuiAlert,
  ListItem,
  ListItemIcon,
  Chip,
  Tooltip,
  Skeleton,
  CircularProgress,
  Card,
  InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableRow from "@mui/material/TableRow";
import FormHelperText from "@mui/material/FormHelperText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTrash,
  faPenToSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; //password
import axios from "axios";
import Animated from "../components/motion";
import { BorderBottom } from "@mui/icons-material";

const CustomAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={severity}
        style={{ fontFamily: "Poppins" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

function ManageAccount() {
  const loggedId = sessionStorage.getItem("userID");
  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setopenDeleteDialog] = useState(false);
  const [empStatus, setempStatus] = useState("");
  const [probeStatus, setProbeStatus] = useState("");
  const [gender, setGender] = useState("");
  const [dept, setdept] = useState("");
  const [role, setRole] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
  });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordMsgInfo, setConfirmPasswordMsgInfo] = useState("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [checkUsername, setCheckUsername] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const [workID, setWorkID] = useState("");
  const [workIDInvalid, setWorkIDInvalid] = useState(false);
  const [position, setPosition] = useState("");
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dateHired, setDateHired] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [emailIsAvailable, setEmailIsAvailable] = useState(false);
  const [emailIsTaken, setEmailIsTaken] = useState(false);
  const [emailMsgInfo, setEmailMsgInfo] = useState("");
  const [workIDMsg, setWorkIDMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordStrong, setPasswordStrong] = useState(false);
  const [passwordContainNum, setPasswordContainNum] = useState(false);
  const [passwordContainUpperAndLower, setPasswordContainUpperAndLower] =
    useState(false);
  const [passwordContainSpecialChar, setPasswordContainSpecialChar] =
    useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  const loggedUserRole = sessionStorage.getItem("userRole");
  const [countAdmin, setCountAdmin] = useState(0);
  const [countEmployee, setCountEmployee] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this based on your needs
  const pagesPerGroup = 5;

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const startPageGroup = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPageGroup = Math.min(startPageGroup + pagesPerGroup - 1, totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [currentPage, rows]);

  const hasData = rows.length > 0;

  const modifyFirstLetter = (str, capitalize = true) => {
    if (capitalize) {
      const words = str.split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return capitalizedWords.join(" ");
    } else {
      const words = str.split(" ");
      const modifiedWords = words.map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toLowerCase() + word.slice(1);
        } else if (index === 1) {
          return word.charAt(0).toLowerCase() + word.slice(1);
        } else {
          return word;
        }
      });
      return modifiedWords.join("");
    }
  };
  const lowerCaseFirstName = modifyFirstLetter(firstname, false);
  const lowerCaseLastName = modifyFirstLetter(lastname, false);
  const emailChange = lowerCaseFirstName + "." + lowerCaseLastName + "@cit.edu";

  let modifiedUsername;
  if (role === "ADMIN") {
    modifiedUsername = "adm_" + lowerCaseFirstName + "." + lowerCaseLastName;
  } else {
    modifiedUsername = modifyFirstLetter(
      `${lowerCaseFirstName}.${lowerCaseLastName}`,
      false
    );
  }

  const handleFNameChange = (e) => {
    const value = e.target.value;
    const modifiedFirstName = modifyFirstLetter(value);
    setFirstName(modifiedFirstName);
  };

  const handleMNameChange = (e) => {
    const value = e.target.value;
    const modifiedMiddleName = modifyFirstLetter(value);
    setMiddleName(modifiedMiddleName);
  };

  const handleLNameChange = (e) => {
    const value = e.target.value;
    const modifiedLastName = modifyFirstLetter(value);
    setLastName(modifiedLastName);
  };

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleEmploymentStatus = (event) => {
    setempStatus(event.target.value);
    if (event.target.value !== "Probationary") {
      setProbeStatus("");
      setDateStarted("");
    }

    if (role === "HEAD") {
      setempStatus("Regular");
    }
  };

  const handleProbeStatus = (event) => {
    setProbeStatus(event.target.value);
  };

  const handledept = (event) => {
    setdept(event.target.value);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "HEAD") {
      setPosition("Department Head");
      setempStatus("Regular");
    } else {
      setPosition("");
      setempStatus("");
    }

    if (
      selectedRole === "EMPLOYEE" ||
      selectedRole === "ADMIN" ||
      selectedRole === "HEAD"
    ) {
      setWorkIDInvalid(false);
      setPasswordStrong(false);
      setPasswordContainNum(false);
      setPasswordContainUpperAndLower(false);
      setPasswordContainSpecialChar(false);
      setPasswordLength(false);
      setIsPasswordNotMatch(false);
      setEmailIsAvailable(true);
    }
  };

  const handleDateHiredChange = (e) => {
    setDateHired(e.target.value);
  };

  const handleDateStartedChange = (e) => {
    setDateStarted(e.target.value);
  };

  const handleWorkIdChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setWorkIDInvalid(false);
      setWorkID(value);
      setWorkIDMsg("");
    } else {
      setWorkIDInvalid(true);
      setWorkIDMsg("ID Number contains numbers only.");
      setWorkID("");
    }
  };

  const handlePositionChange = (e) => {
    const value = e.target.value;
    const modifiedPosition = modifyFirstLetter(value);
    setPosition(modifiedPosition);
  };

  const handleCheckUsername = (e) => {
    setMsgInfo("");
  };

  const handleEmailChange = (event) => {
    setEmailMsgInfo("");
  };

  const handlePassword = (e) => {
    const value = e.target.value;

    if (value.length >= 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
    const containsNumber = /\d/.test(value);
    if (containsNumber) {
      setPasswordContainNum(containsNumber);
    } else {
      setPasswordContainNum(false);
    }
    const containsSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      value
    );
    if (containsSpecialChar) {
      setPasswordContainSpecialChar(containsSpecialChar);
    } else {
      setPasswordContainSpecialChar(false);
    }
    const containsLowercaseAndUppercase =
      /[a-z]/.test(value) && /[A-Z]/.test(value);
    if (containsLowercaseAndUppercase) {
      setPasswordContainUpperAndLower(containsLowercaseAndUppercase);
    } else {
      setPasswordContainUpperAndLower(false);
    }
    const isStrongPassword =
      value.length >= 8 &&
      containsNumber &&
      containsSpecialChar &&
      containsLowercaseAndUppercase;
    if (isStrongPassword) {
      setPassword(value);
      setPasswordStrong(isStrongPassword);
      setPasswordMsg("Password is strong");
    } else {
      setPasswordStrong(false);
      setPasswordMsg("");
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    if (password !== value) {
      setConfirmPasswordMsgInfo("Passwords do not match");
      setIsPasswordNotMatch(true);
    } else {
      setIsPasswordNotMatch(false);
      setConfirmPasswordMsgInfo("");
      setConfirmPassword(e.target.value);
    }
  };

  const showSuccessAlert = (message) => {
    setSuccessAlert({ open: true, message });
  };

  const showErrorAlert = (message) => {
    setErrorAlert({ open: true, message });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentPage(1);
    setSelectedTab(newValue);
    setUpdateFetch((prev) => !prev);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedTab]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/getAllUser");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const filteredData = data
          .filter((item) => {
            if (selectedTab === 0) {
              return item.role !== "ADMIN" && item.role !== "SUPERUSER";
            } else if (selectedTab === 1) {
              return item.role === "ADMIN";
            }
          })
          .sort((a, b) => b.userID - a.userID);
        const processedData = filteredData.map((item) => ({
          ...item,
          name: `${item.fName} ${item.lName}`,
          userID: item.userID,
        }));

      // Columns to be considered for search
      const columnsToSearch = new Set(
        selectedTab === 0
          ? ["workID", "name", "workEmail", "dept"]
          : ["workID", "name", "username"]
      );

      // Apply search filter based on specific columns
      const searchFilteredData = processedData.filter((item) =>
        Object.entries(item).some(
          ([key, value]) =>
            columnsToSearch.has(key) &&
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

        setRows(searchFilteredData);
        const filterAdmin = processedData.filter(
          (row) => row.role === "ADMIN"
        ).length;
        const filterEmp = processedData.filter(
          (row) => row.role === "EMPLOYEE"
        ).length;
        setCountAdmin(filterAdmin);
        setCountEmployee(filterEmp);
        // setHasData(searchFilteredData.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateFetch, selectedTab, searchTerm]);

  useEffect(() => {
    const fetchDeptAndUsers = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:8080/department/getAllDepts"
        );
        const userResponse = await axios.get(
          "http://localhost:8080/user/getAllUser"
        );

        const fetchedDepartments = deptResponse.data;
        const fetchedUsers = userResponse.data;

        // Assign office heads to their departments
        const departmentsWithHeads = fetchedDepartments.map((dept) => {
          const officeHead = fetchedUsers.find(
            (user) =>
              (user.position === "Office Head" ||
                user.position === "Department Head") &&
              user.dept === dept.deptName
          );
          return {
            ...dept,
            deptOfficeHead: officeHead
              ? `${officeHead.fName} ${officeHead.mName ? officeHead.mName.charAt(0) + "." : ""
              } ${officeHead.lName}`
              : "",
          };
        });

        setDepartments(departmentsWithHeads);
        console.log(departmentsWithHeads);
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

    fetchDeptAndUsers();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.put(
          `http://localhost:8080/user/checkUsername/${modifiedUsername}`
        );
        const availability = response.data === "Username is available";
        setMsgInfo(response.data);
        setIsAvailable(availability);
        setIsTaken(!availability); // If available, not taken; if not available, taken
      } catch (error) {
        console.error("Error checking username:", error);
        setMsgInfo("Error checking username");
        setIsAvailable(false);
        setIsTaken(false);
      }
    };

    if (firstname && lastname) {
      fetchUsername();
    } else {
      setMsgInfo("");
      setIsAvailable(false);
      setIsTaken(false);
    }
  }, [firstname, lastname]);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.put(
          `http://localhost:8080/user/checkEmail/${emailChange}`
        );
        const emailAvailability =
          response.data === "Email Address is available";
        setEmailMsgInfo(response.data);
        setEmailIsAvailable(emailAvailability);
        setEmailIsTaken(!emailAvailability); // If available, not taken; if not available, taken
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailMsgInfo("Error checking email");
        setEmailIsAvailable(false);
        setEmailIsTaken(false);
      }
    };

    if (firstname && lastname) {
      fetchEmail();
    } else {
      setEmailMsgInfo("");
      setEmailIsAvailable(false);
      setEmailIsTaken(false);
    }
  }, [firstname, lastname]);

  const handleClickAddUserBtn = () => {
    setOpenRegistrationDialog(true);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Check if username and email are available before proceeding
    if (!isAvailable) {
      setMsgInfo("Username already exists");
      return;
    }

    if (role !== 'ADMIN' && !emailIsAvailable) {
      setEmailMsgInfo("Email already exists");
      return;
    }

    if (!passwordStrong) {
      setPasswordMsg(
        "Password is not strong enough. Please check the password requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordMsgInfo("Passwords do not match");
      return;
    }

    try {
      const userData = {
        empStatus: empStatus,
        probeStatus: probeStatus,
        dateStarted: dateStarted,
        dateHired: dateHired,
        username: modifiedUsername,
        workID: workID,
        fName: firstname,
        mName: middlename,
        lName: lastname,
        gender: gender,
        password: password,
        position: position,
        dept: dept,
        role: role,
      };

      if (role !== 'ADMIN') {
        userData.workEmail = emailChange;
      }

      const response = await fetch(`http://localhost:8080/register/${loggedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showSuccessAlert("User registered successfully");
        setempStatus("");
        setProbeStatus("");
        setDateStarted("");
        setDateHired("");
        setCheckUsername("");
        setWorkID("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setGender("");
        setPassword("");
        setConfirmPassword("");
        setPosition("");
        setdept("");
        setRole("");
        setUpdateFetch((prev) => !prev);
        setOpenRegistrationDialog(false);
      } else {
        showErrorAlert("Failed to register user.");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };


  const availableDepartments =
    role === "HEAD"
      ? departments.filter((dept) => !dept.deptOfficeHead)
      : departments;

  const handleClickEditBtn = async (userID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/getUser/${userID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setSelectedUser(userData);
      setOpenEditDialog(true);
      console.log("Selected User:", selectedUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;

    // Check if the name is 'workID' and if the value is not a number
    if (name === "workID" && isNaN(value)) {
      // Prevent updating the state
      return;
    }

    setSelectedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditUserSave = async (e, selectedUser) => {
    e.preventDefault();
    try {
      console.log("sending user data: ", selectedUser);

      const userPayload = {
        userID: selectedUser.userID,
        workID: selectedUser.workID,
        fName: selectedUser.fName,
        mName: selectedUser.mName,
        lName: selectedUser.lName,
        workEmail: selectedUser.workEmail,
        username: selectedUser.username,
        position: selectedUser.position,
        dept: selectedUser.dept,
        empStatus: selectedUser.empStatus,
        probeStatus: selectedUser.probeStatus,
        dateStarted: selectedUser.dateStarted,
      };
      await axios.patch(
        `http://localhost:8080/user/editUser/${loggedId}/${selectedUser.userID}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateFetch((prev) => !prev);
      showSuccessAlert("User updated successfully");
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorAlert("Failed to update user. Please try again later.");
    }
  };

  const handleClickDeleteBtn = (userID) => {
    console.log("delete user:", userID);
    const selectedUser = rows.find((user) => user.userID === userID);
    setSelectedUser(selectedUser);
    setopenDeleteDialog(true);
    setUpdateFetch(!updateFetch);
  };

  const handleYesDelBtn = async (userID) => {
    console.log("delete Yes user:", userID);
    try {
      const response = await fetch(
        `http://localhost:8080/user/delete/${loggedId}/${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      showSuccessAlert("User deleted successfully");
      setUpdateFetch((prev) => !prev);
      setopenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleClickCloseBtn = () => {
    setOpenRegistrationDialog(false);
    setempStatus("");
    setProbeStatus("");
    setDateStarted("");
    setDateHired("");
    setCheckUsername("");
    setWorkID("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setPosition("");
    setdept("");
    setRole("");
    setWorkIDInvalid(false);

    setopenDeleteDialog(false);
    setOpenEditDialog(false);
  };

  const tabStyle = {
    textTransform: "none",
    mb: 1,
    color: "#9D9D9D",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    "& .MuiTabs-indicator": {
      backgroundColor: "#8C383E", //nig click makita maroon
    },
    "&.Mui-selected": {
      color: "#8C383E", //kung unsa selected
    },
  };

  const columnsEmployees = [
    {
      id: "workID",
      label: "Employee ID",
      align: "center",
      minWidth: 80,
    },
    {
      id: "name",
      label: "Name",
      minWidth: 200,
      align: "center",
      format: (value) => formatName(value),
    },
    {
      id: "workEmail",
      label: "Email",
      minWidth: 250,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },
    {
      id: "dept",
      label: "Department",
      minWidth: 250,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      align: "center",
      format: (value, row) => {
        return (
          <div>
            <IconButton sx={{ width: "1.2em" }}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{
                  color: "#8C383E",
                  fontSize: ".9rem",
                  cursor: "pointer",
                }}
                onClick={() => handleClickEditBtn(row.userID)}
              />
            </IconButton>
            <IconButton sx={{ width: "1.2em" }}>
              <FontAwesomeIcon
                icon={faTrash}
                style={{
                  color: "#8C383E",
                  fontSize: ".9rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleClickDeleteBtn(row.userID);
                }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const columnsAdmins = [
    {
      id: "workID",
      label: "ID Number",
      align: "center",
      minWidth: 150,
    },
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
      format: (value) => (value ? `${value.fName} ${value.lName}` : ""),
    },
    {
      id: "username",
      label: "Username",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      align: "center",
      format: (value, row) => (
        <div>
          <IconButton sx={{ width: "1.2em" }}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                color: "#8C383E",
                fontSize: ".9rem",
                cursor: "pointer",
              }}
              onClick={() => handleClickEditBtn(row.userID)}
            />
          </IconButton>
          <IconButton sx={{ width: "1.2em" }}>
            <FontAwesomeIcon
              icon={faTrash}
              style={{
                color: "#8C383E",
                fontSize: ".9rem",
                cursor: "pointer",
              }}
              onClick={() => {
                handleClickDeleteBtn(row.userID);
              }}
            />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Animated>
        <Typography
          ml={6.5}
          mt={3}
          sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}
        >
          User Accounts
        </Typography>
        {loggedUserRole === "ADMIN" && (
          <label className="ml-12 text-sm text-gray-700">
            All Employees ({rows.length})
          </label>
        )}

        <div className="ml-8 mt-2">
          <div className="mr-10 mb-4 flex items-center justify-between">
            <div className="ml-4 flex items-center justify-start">
              <TextField
                placeholder="Search ..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{

                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff", // Set the background color for the entire input area
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "1px",
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#e0e0e0",
                  },
                  "&:focus-within": {
                    "& fieldset": {
                      borderColor: "#8C383E !important",
                      borderWidth: "1px !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "10px 10px",
                    fontSize: "13px",
                    fontFamily: "Poppins",
                  },
                  minWidth: "110%",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{ fontSize: "13px", padding: "0" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>


            <div className="flex items-center">
              <Button
                variant="contained"
                sx={{
                  display: 'flex-end',
                  height: "2.5em",
                  width: "9em",
                  fontFamily: "Poppins",
                  backgroundColor: "#8c383e",
                  padding: "1px 1px 0 0 ",
                  "&:hover": { backgroundColor: "#762F34", color: "white" },
                }}
                style={{ textTransform: "none" }}
                startIcon={<AddCircleIcon />}
                onClick={handleClickAddUserBtn}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": { ml: 6, mt: 0.1, width: "93%" },
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {loggedUserRole === "SUPERUSER" && (
              <Grid
                item
                xs={12}
                sx={{ height: "3em", display: "flex", mt: "-1em", mb: '.2em' }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={tabStyle}
                >
                  <Tab label={`All Employees (${countEmployee})`} sx={tabStyle} />
                  <Tab label={`All Admins (${countAdmin})`} sx={tabStyle} />
                </Tabs>
              </Grid>

            )}


            {/* <Card
              variant="outlined"
              sx={{
                borderRadius: '5.6px 5.6px 0 0',
                variant: "outlined",
                width: "100%",
                height: "29.55em",
                backgroundColor: "transparent",
                mt: ".2%",
                position: 'relative',
              }}
            > */}

            <TableContainer

              sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%", position: 'relative', border: '1px solid lightgray' }}
            >
              {loggedUserRole === "SUPERUSER" && loading ? (
                <div style={{
                  height: '29em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 500,
                }}>Loading... </div>
              ) : (
                <Table stickyHeader aria-label="a dense table" size="small">
                  <TableHead sx={{ height: '2.3em' }}>
                    <TableRow>
                      {(selectedTab === 0
                        ? columnsEmployees
                        : columnsAdmins
                      ).map((column) => (
                        <TableCell
                          component="th" scope="row"
                          sx={{
                            fontFamily: "Poppins",
                            bgcolor: "#8c383e",
                            color: "white",
                            fontWeight: 500,

                          }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {hasData ? (
                    <TableBody>

                      {paginatedRows.map((row) => (
                        <TableRow
                          sx={{
                            bgcolor: "white",
                            "&:hover": {
                              backgroundColor: "rgba(248, 199, 2, 0.5)",
                              color: "black",
                            },
                          }}
                          key={row.id}
                        >
                          {(selectedTab === 0
                            ? columnsEmployees
                            : columnsAdmins
                          ).map((column) => (
                            <TableCell
                              component="th" scope="row"
                              sx={{ fontFamily: "Poppins", fontWeight: 500, fontSize: '.8em' }}
                              key={`${row.id}-${column.id}`}
                              align={column.align}
                            >
                              {column.id === "name"
                                ? row.name
                                : column.id === "actions"
                                  ? column.format
                                    ? column.format(row[column.id], row)
                                    : null
                                  : column.format
                                    ? column.format(row[column.id])
                                    : row[column.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ bgcolor: 'white', height: '5em', }} colSpan={columnsEmployees.length || columnsAdmins.length} align="center">
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "17px",
                              color: "#1e1e1e",
                              fontWeight: 500,
                              padding: "25px",
                            }}
                          >
                            No user are currently registered
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              )}
            </TableContainer>

            {/* </Card> */}
          </Grid>
        </Box>
        {/* Pagination */}
        <div
          className="rounded-b-lg mt-2 border-gray-200 px-4 py-2 ml-9"
          style={{
            position: "absolute", // Change to relative to keep it in place
            bottom: 30,
            left: '21.5%',
            transform: "translateX(-50%",
            display: "flex",
            alignItems: "center",

            ml: '4em'
          }}
        >
          <ol className="flex justify-end gap-1 text-xs font-medium">
            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handlePrevPage}
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>

            {Array.from({ length: endPageGroup - startPageGroup + 1 }, (_, index) => (
              <li key={startPageGroup + index}>
                <a
                  href="#"
                  className={`block h-8 w-8 rounded border ${currentPage === startPageGroup + index
                    ? "border-pink-900 bg-pink-900 text-white"
                    : "border-gray-100 bg-white text-gray-900"
                    } text-center leading-8`}
                  onClick={() => handlePageChange(startPageGroup + index)}
                >
                  {startPageGroup + index}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handleNextPage}
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ol>
        </div>
        {/* dialog - REGISTRATION */}
        <Dialog
          maxWidth="xs"
          open={openRegistrationDialog}
          onClose={handleClickCloseBtn}
        >
          <Box
            sx={{
              bgcolor: "#8c383e",
              height: "2em",
              width: "100%",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={0.6}
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    color: "white",
                    backgroundColor: "transparent",
                    alignItems: "center",
                  }}
                >
                  <Grid item sx={{ height: "2.3em" }}>
                    <PersonRoundedIcon
                      sx={{
                        color: "white",
                        fontSize: "1.65em",
                        ml: ".2em",
                        mt: "0.1em",
                      }}
                    />
                  </Grid>
                  <Grid item>Register User Account</Grid>
                </Grid>
              </Grid>
            </Grid>
            <IconButton
              onClick={handleClickCloseBtn}
              sx={{ "&:hover": { color: "#F8C702" } }}
            >
              <HighlightOffOutlinedIcon
                sx={{ fontSize: "1em", color: "white" }}
              />
            </IconButton>
          </Box>
          <form onSubmit={handleCreateAccount}>
            <DialogContent sx={{ height: "33.em" }}>
              <Grid
                container
                sx={{ display: "flex", justifyContent: "left", width: "100%" }}
              >
                <Grid
                  container
                  sx={{ width: "30em", height: ".1em" }}
                  alignItems="center"
                >
                  <Grid item xs={2.5}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        color: "gray",
                        fontSize: ".9em",
                      }}
                    >
                      User Role:{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={9.3}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ fontFamily: "Poppins" }}
                    >
                      <Select
                        placeholder="Select Type of User"
                        labelId="roleLabel"
                        id="role"
                        value={role}
                        onChange={handleRoleChange}
                        size="small"
                        displayEmpty
                        sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Box sx={{ color: "gray" }}>
                                Select Type of User
                              </Box>
                            );
                          }
                          return selected;
                        }}
                      >
                        <MenuItem
                          disabled
                          style={{ fontFamily: "Poppins", fontSize: ".8em" }}
                          value=""
                        >
                          Select Type of User
                        </MenuItem>

                        {loggedUserRole === "SUPERUSER" ? (
                          <MenuItem
                            style={{ fontFamily: "Poppins", fontSize: ".8em" }}
                            value="ADMIN"
                          >
                            Admin
                          </MenuItem>
                        ) : null}

                        <MenuItem
                          style={{ fontFamily: "Poppins", fontSize: ".8em" }}
                          value="EMPLOYEE"
                        >
                          Employee
                        </MenuItem>
                        <MenuItem
                          style={{ fontFamily: "Poppins", fontSize: ".8em" }}
                          value="HEAD"
                        >
                          Department Head
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                sx={{
                  width: "100%",
                  mt: "2.5em",
                  mb: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {role === "ADMIN" && (
                  <>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                      <Typography
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "12.5px",
                          color: "#8C383E",
                          fontWeight: 500,
                        }}
                      >
                        Ensure all fields are filled correctly for successful
                        registration
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <TextField
                          placeholder="First Name"
                          size="small"
                          required
                          fullWidth
                          id="fName"
                          value={firstname}
                          onChange={handleFNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".9em" },
                          }}
                          inputProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <TextField
                          placeholder="Middle Name"
                          size="small"
                          fullWidth
                          id="mName"
                          value={middlename}
                          onChange={handleMNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <TextField
                          placeholder="Last Name"
                          size="small"
                          required
                          fullWidth
                          id="lName"
                          value={lastname}
                          onChange={handleLNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6.5}>
                      <Box>
                        <TextField
                          placeholder="ID Number"
                          size="small"
                          required
                          fullWidth
                          id="workId"
                          value={workID}
                          onChange={handleWorkIdChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                        />
                        {workIDInvalid && (
                          <FormHelperText style={{ color: "red" }}>
                            {workIDMsg}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={5.5}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          label="Admin Username"
                          id="username"
                          value={modifiedUsername}
                          onChange={handleCheckUsername}
                          InputLabelProps={{
                            style: {
                              fontFamily: "Poppins",
                              fontSize: ".8em",
                              color: "gray",
                            },
                          }}
                          inputProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                        />
                        {isTaken && (
                          <FormHelperText style={{ color: "red" }}>
                            {msgInfo}{" "}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <div style={{ position: "relative", width: "100%" }}>
                          <TextField
                            size="small"
                            required
                            fullWidth
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            onChange={handlePassword}
                            InputLabelProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                          />
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={handleShowPassword}
                            style={{
                              color: "#636E72",
                              position: "absolute",
                              right: "10px",
                              top: "47%",
                              transform: "translateY(-41%)",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          {passwordStrong ? (
                            <FormHelperText style={{ color: "green" }}>
                              {passwordMsg}{" "}
                            </FormHelperText>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: ".8em",
                                  padding: ".8em 1em 0 0",
                                }}
                              >
                                Password must contain:
                              </Typography>
                              {passwordLength ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  marginLeft="1em"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Minimum of 8 characters"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Minimum of 8 characters"
                                />
                              )}
                              {passwordContainNum ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Numbers"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "rgba(128, 128, 128, 0.5",
                                  }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Numbers"
                                />
                              )}
                              {passwordContainSpecialChar ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Special Character"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Special Characters"
                                />
                              )}
                              {passwordContainUpperAndLower ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Uppercase and Lowercase letters"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Uppercase and Lowercase letters"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ height: "100%" }}>
                        <div style={{ position: "relative", width: "100%" }}>
                          <TextField
                            required
                            size="small"
                            fullWidth
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmpassword"
                            onChange={handleConfirmPassword}
                            InputLabelProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontSize: ".8em",
                                fontFamily: "Poppins",
                              },
                            }}
                          />
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            onClick={handleShowConfirmPassword}
                            style={{
                              color: "#636E72",
                              position: "absolute",
                              right: "10px",
                              top: "47%",
                              transform: "translateY(-41%)",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        {isPasswordNotMatch && (
                          <FormHelperText style={{ color: "red" }}>
                            {confirmPasswordMsgInfo}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
                {(role === "EMPLOYEE" || role === "HEAD") && (
                  <>
                    <Grid item xs={12} sx={{ mb: 0 }}>
                      <Typography
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "12.5px",
                          color: "#8C383E",
                          fontWeight: 500,
                        }}
                      >
                        Ensure all fields are filled correctly for successful
                        registration
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <FormControl
                          size="small"
                          disabled={role === "HEAD"}
                          fullWidth
                          required
                        >
                          <Select
                            required
                            labelId="employementStatusLabel"
                            id="employementStatus"
                            value={empStatus}
                            placeholder="Employee Status"
                            onChange={handleEmploymentStatus}
                            displayEmpty
                            sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return (
                                  <Box sx={{ color: "gray" }}>
                                    Employee Status
                                  </Box>
                                );
                              }
                              return selected;
                            }}
                          >
                            <MenuItem
                              disabled
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value=""
                            >
                              Employee Status
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value="Probationary"
                            >
                              Probationary
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value="Regular"
                            >
                              {" "}
                              Regular
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          label="Date Hired "
                          id="datehired"
                          type="date"
                          value={dateHired}
                          onChange={handleDateHiredChange}
                          InputLabelProps={{
                            shrink: true,
                            style: { fontFamily: "Poppins" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                            pattern:
                              "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <FormControl
                          size="small"
                          fullWidth
                          disabled={empStatus === "Regular" || role === "HEAD"}
                          required
                        >
                          <Select
                            required
                            labelId="probationaryStatusLabel"
                            id="probeStat"
                            value={probeStatus}
                            placeholder="Probationary Status"
                            onChange={handleProbeStatus}
                            displayEmpty
                            sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return (
                                  <Box sx={{ color: "gray" }}>
                                    Probationary Status
                                  </Box>
                                );
                              }
                              return selected;
                            }}
                          >
                            <MenuItem
                              disabled
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value=""
                            >
                              Probationary Status
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value={"3rd Probationary"}
                            >
                              3rd Probationary
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value={"5th Probationary"}
                            >
                              5th Probationary
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          disabled={empStatus === "Regular" || role === "HEAD"}
                          label="Date Started "
                          id="dateStarted"
                          type="date"
                          value={dateStarted}
                          onChange={handleDateStartedChange}
                          InputLabelProps={{
                            shrink: true,
                            style: { fontFamily: "Poppins" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                            pattern:
                              "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <TextField
                          required
                          fullWidth
                          size="small"
                          placeholder="First Name"
                          id="fName"
                          value={firstname}
                          onChange={handleFNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box style={{ fontFamily: "Poppins" }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Middle Name"
                          id="mName"
                          value={middlename}
                          onChange={handleMNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box style={{ fontFamily: "Poppins" }}>
                        <TextField
                          required
                          fullWidth
                          size="small"
                          placeholder="Last Name"
                          id="lName"
                          value={lastname}
                          onChange={handleLNameChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={7}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          placeholder="ID Number"
                          id="workId"
                          value={workID}
                          onChange={handleWorkIdChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                        {workIDInvalid && (
                          <FormHelperText style={{ color: "red" }}>
                            {workIDMsg}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={5}>
                      <Box>
                        <FormControl fullWidth size="small" required>
                          <Select
                            required
                            labelId="GenderLabel"
                            id="GenderLabel"
                            value={gender}
                            placeholder="Gender"
                            onChange={handleGender}
                            displayEmpty
                            sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return <Box sx={{ color: "gray" }}>Gender</Box>;
                              }
                              return selected;
                            }}
                          >
                            <MenuItem
                              disabled
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value=""
                            >
                              Gender
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value={"Female"}
                            >
                              Female
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value={"Male"}
                            >
                              {" "}
                              Male
                            </MenuItem>
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value={"Other"}
                            >
                              {" "}
                              Other
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <TextField
                          required
                          fullWidth
                          size="small"
                          placeholder="Position"
                          id="position"
                          value={position}
                          onChange={handlePositionChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <FormControl required fullWidth size="small">
                          <Select
                            required
                            labelId="deptLabel"
                            id="dept"
                            value={dept}
                            placeholder="Department"
                            onChange={handledept}
                            MenuProps={{
                              PaperProps: {
                                style: { maxWidth: "300px" },
                              },
                            }}
                            displayEmpty
                            sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return (
                                  <Box sx={{ color: "gray" }}>Department</Box>
                                );
                              }
                              return selected;
                            }}
                          >
                            <MenuItem
                              disabled
                              style={{
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              }}
                              value=""
                            >
                              Department
                            </MenuItem>
                            {availableDepartments.map((dept, index) => (
                              <MenuItem
                                key={index}
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: ".8em",
                                }}
                                value={dept.deptName}
                                sx={{
                                  fontFamily: "Poppins",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "300px",
                                }}
                              >
                                {dept.deptName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={7}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          label="Institutional Email"
                          id="email"
                          value={emailChange}
                          onChange={handleEmailChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                        {!emailIsAvailable && (
                          <FormHelperText style={{ color: "red" }}>
                            {emailMsgInfo}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={5}>
                      <Box>
                        <TextField
                          size="small"
                          required
                          fullWidth
                          label="Username"
                          id="username"
                          value={modifiedUsername}
                          onChange={handleCheckUsername}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                        {isTaken && (
                          <FormHelperText style={{ color: "red" }}>
                            {msgInfo}{" "}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <div style={{ position: "relative", width: "100%" }}>
                          <TextField
                            size="small"
                            required
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            onChange={handlePassword}
                            InputLabelProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontSize: ".8em",
                                fontFamily: "Poppins",
                              },
                            }}
                          />
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={handleShowPassword}
                            style={{
                              color: "#636E72",
                              position: "absolute",
                              right: "10px",
                              top: "47%",
                              transform: "translateY(-41%)",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          {passwordStrong ? (
                            <FormHelperText style={{ color: "green" }}>
                              {passwordMsg}{" "}
                            </FormHelperText>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: ".9em",
                                  padding: ".6em 1em 0 0",
                                }}
                              >
                                Password must contain:
                              </Typography>
                              {passwordLength ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  marginLeft="1em"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Minimum of 8 characters"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Minimum of 8 characters"
                                />
                              )}
                              {passwordContainNum ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Numbers"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "rgba(128, 128, 128, 0.5",
                                  }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Numbers"
                                />
                              )}
                              {passwordContainSpecialChar ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Special Character"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Special Characters"
                                />
                              )}
                              {passwordContainUpperAndLower ? (
                                <Chip
                                  sx={{
                                    bgcolor: "transparent",
                                    color: "green",
                                  }}
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Uppercase and Lowercase letters"
                                />
                              ) : (
                                <Chip
                                  disabled
                                  sx={{ bgcolor: "transparent" }}
                                  size="small"
                                  icon={<CheckCircleOutlineIcon />}
                                  label="Uppercase and Lowercase letters"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ height: "100%" }}>
                        <div style={{ position: "relative", width: "100%" }}>
                          <TextField
                            required
                            size="small"
                            fullWidth
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmpassword"
                            onChange={handleConfirmPassword}
                            InputLabelProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontSize: ".8em",
                                fontFamily: "Poppins",
                              },
                            }}
                          />
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            onClick={handleShowConfirmPassword}
                            style={{
                              color: "#636E72",
                              position: "absolute",
                              right: "10px",
                              top: "47%",
                              transform: "translateY(-41%)",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        {isPasswordNotMatch && (
                          <FormHelperText style={{ color: "red" }}>
                            {confirmPasswordMsgInfo}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mb: 1 }}>
              <Button
                type="submit"
                sx={{
                  borderRadius: "5px",
                  bgcolor: "#8C383E",
                  color: "white",
                  width: "90%",
                  "&:hover": { backgroundColor: "#762F34" },
                  display: role ? "block " : "none",
                }}
                style={{ textTransform: "none", fontFamily: "Poppins" }}
              >
                Create Account
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* dialog - EDIT */}
        <Dialog
          maxWidth="xs"
          open={openEditDialog}
          onClose={handleClickCloseBtn}
        >
          <form onSubmit={(e) => handleEditUserSave(e, selectedUser)}>
            <Box
              sx={{
                bgcolor: "#8c383e",
                height: "2em",
                width: "100%",
                display: "flex",
                justifyContent: "right",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={0.6}
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "transparent",
                      alignItems: "center",
                    }}
                  >
                    <Grid item sx={{ height: "2.2em", ml: ".5em", mt: ".3em" }}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        sx={{ color: "white", fontSize: "1.5em" }}
                      />
                    </Grid>
                    <Grid item>Edit User Details</Grid>
                  </Grid>
                </Grid>
              </Grid>
              <IconButton
                onClick={handleClickCloseBtn}
                sx={{ "&:hover": { color: "#F8C702" } }}
              >
                <HighlightOffOutlinedIcon
                  sx={{ fontSize: "1em", color: "white" }}
                />
              </IconButton>
            </Box>
            <DialogContent>
              <Grid
                container
                spacing={1.5}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  width: "100%",
                  fontFamily: "Poppins",
                }}
              >
                {selectedUser?.role === "ADMIN" && (
                  <>
                    <Grid item xs={4}>
                      <Box style={{ fontFamily: "Poppins" }} height="100%">
                        <TextField
                          required
                          disabled
                          fullWidth
                          size="small"
                          label="First Name"
                          id="fName"
                          name="fName"
                          value={selectedUser.fName}
                          onChange={handleUserDataChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box style={{ fontFamily: "Poppins" }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Middle Name"
                          id="mName"
                          name="mName"
                          value={selectedUser.mName}
                          onChange={handleUserDataChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box style={{ fontFamily: "Poppins" }}>
                        <TextField
                          required
                          disabled
                          fullWidth
                          size="small"
                          label="Last Name"
                          id="lName"
                          value={selectedUser.lName}
                          name="lName"
                          onChange={handleUserDataChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="ID Numbers should be numbers only" arrow>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            label="Id Number"
                            id="workId"
                            name="workID"
                            value={selectedUser.workID}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: {
                                fontFamily: "Poppins",
                                fontSize: ".8em",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontSize: ".8em",
                                fontFamily: "Poppins",
                              },
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <TextField
                          disabled
                          fullWidth
                          size="small"
                          label="Admin Username"
                          id="username"
                          name="username"
                          value={selectedUser.username}
                          onChange={handleUserDataChange}
                          InputLabelProps={{
                            style: { fontFamily: "Poppins", fontSize: ".8em" },
                          }}
                          inputProps={{
                            style: { fontSize: ".8em", fontFamily: "Poppins" },
                          }}
                        />
                        {!isAvailable && (
                          <FormHelperText
                            style={{
                              color: "red",
                              fontFamily: "Poppins",
                              fontSize: "0.6em",
                            }}
                          >
                            {msgInfo}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
                {(selectedUser?.role === "EMPLOYEE" ||
                  selectedUser?.role === "HEAD") && (
                    <>
                      <Grid item xs={4}>
                        <Box style={{ fontFamily: "Poppins" }} height="100%">
                          <TextField
                            disabled
                            fullWidth
                            size="small"
                            label="First Name"
                            id="fName"
                            name="fName"
                            value={selectedUser.fName}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box style={{ fontFamily: "Poppins" }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Middle Name"
                            id="mName"
                            name="mName"
                            value={selectedUser.mName}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box style={{ fontFamily: "Poppins" }}>
                          <TextField
                            fullWidth
                            disabled
                            size="small"
                            label="Last Name"
                            id="lName"
                            value={selectedUser.lName}
                            name="lName"
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <Box sx={{ height: "100%" }}>
                          <Tooltip
                            title="ID Numbers should be numbers only"
                            placement="left"
                            arrow
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, -14],
                                    },
                                  },
                                ],
                              },
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label="ID Number"
                              id="workId"
                              name="workID"
                              value={selectedUser.workID}
                              onChange={handleUserDataChange}
                              InputLabelProps={{
                                style: {
                                  fontFamily: "Poppins",
                                  fontSize: ".8em",
                                },
                              }}
                              inputProps={{
                                style: {
                                  fontSize: ".8em",
                                  fontFamily: "Poppins",
                                },
                              }}
                            />
                          </Tooltip>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <FormControl fullWidth size="small" disabled>
                            <InputLabel
                              id="GenderLabel"
                              value={gender}
                              sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            >
                              Gender
                            </InputLabel>
                            <Select
                              labelId="GenderLabel"
                              id="GenderLabel"
                              value={selectedUser.gender}
                              label="gender"
                              name="gender"
                              sx={{ fontFamily: "Poppins", fontSize: ".8em" }}
                            >
                              <MenuItem value={"Female"}>Female</MenuItem>
                              <MenuItem value={"Male"}>Male</MenuItem>
                              <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <Box>
                          <FormControl
                            size="small"
                            fullWidth
                            disabled={selectedUser?.role === "HEAD"}
                          >
                            <InputLabel
                              id="employementStatusLabel"
                              sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            >
                              Employment Status
                            </InputLabel>
                            <Select
                              labelId="employementStatusLabel"
                              id="employementStatus"
                              name="empStatus"
                              value={selectedUser.empStatus}
                              label="employment status"
                              onChange={handleUserDataChange}
                              sx={{ fontFamily: "Poppins", fontSize: ".8em" }}
                            >
                              <MenuItem
                                style={{ fontFamily: "Poppins" }}
                                value="Probationary"
                              >
                                Probationary
                              </MenuItem>
                              <MenuItem
                                style={{ fontFamily: "Poppins" }}
                                value="Regular"
                              >
                                {" "}
                                Regular
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            label="Date Hired "
                            id="datehired"
                            type="date"
                            name="dateHired"
                            value={selectedUser.dateHired}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              shrink: true,
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                              pattern:
                                "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <Box>
                          <FormControl
                            size="small"
                            fullWidth
                            disabled={
                              selectedUser?.empStatus === "Regular" ||
                              selectedUser?.role === "HEAD"
                            }
                          >
                            <InputLabel
                              id="probationaryStatus"
                              sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            >
                              Probationary Status
                            </InputLabel>
                            <Select
                              labelId="probationaryStatusLabel"
                              id="probeStat"
                              name="probeStatus"
                              value={selectedUser.probeStatus}
                              label="probationary status"
                              onChange={handleUserDataChange}
                              sx={{ fontFamily: "Poppins", fontSize: ".8em" }}
                            >
                              <MenuItem
                                style={{ fontFamily: "Poppins" }}
                                value={"3rd Probationary"}
                              >
                                3rd Probationary
                              </MenuItem>
                              <MenuItem
                                style={{ fontFamily: "Poppins" }}
                                value={"5th Probationary"}
                              >
                                5th Probationary
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <Box>
                          <TextField
                            fullWidth
                            disabled={
                              selectedUser?.empStatus === "Regular" ||
                              selectedUser?.role === "HEAD"
                            }
                            size="small"
                            label="Date Started "
                            id="dateStarted"
                            type="date"
                            name="dateStarted"
                            value={selectedUser.dateStarted}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              shrink: true,
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                              pattern:
                                "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={4.8}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            label="Position"
                            id="position"
                            name="position"
                            value={selectedUser.position}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={7.2}>
                        <Box>
                          <FormControl fullWidth size="small">
                            <InputLabel
                              id="deptLabel"
                              sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                            >
                              Department
                            </InputLabel>
                            <Select
                              labelId="deptLabel"
                              name="dept"
                              id="dept"
                              value={selectedUser.dept}
                              label="dept"
                              onChange={handleUserDataChange}
                              sx={{ fontFamily: "Poppins", fontSize: ".8em" }}
                            >
                              {departments.map((dept, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: ".8em",
                                    }}
                                    value={dept.deptName}
                                    sx={{
                                      fontFamily: "Poppins",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "300px",
                                    }}
                                  >
                                    {dept.deptName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6.5}>
                        <Box>
                          <TextField
                            disabled
                            fullWidth
                            size="small"
                            label="Institutional Email"
                            id="email"
                            name="workEmail"
                            value={selectedUser.workEmail}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                          {!emailIsAvailable && (
                            <FormHelperText style={{ color: "red" }}>
                              {emailMsgInfo}
                            </FormHelperText>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={5.5}>
                        <Box>
                          <TextField
                            disabled
                            fullWidth
                            size="small"
                            label="Username"
                            id="username"
                            name="username"
                            value={selectedUser.username}
                            onChange={handleUserDataChange}
                            InputLabelProps={{
                              style: { fontFamily: "Poppins", fontSize: ".8em" },
                            }}
                            inputProps={{
                              style: { fontSize: ".8em", fontFamily: "Poppins" },
                            }}
                          />
                        </Box>
                      </Grid>
                    </>
                  )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#8C383E",
                  height: "2.5em",
                  borderRadius: "5px",
                  textTransform: "none",
                  width: "35%",
                  mr: ".5em",
                  mb: "1em",
                  fontFamily: "Poppins",
                  color: "white",
                  "&:hover": { bgcolor: "#762F34", color: "white" },
                }}
              >
                Save Changes{" "}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/*dialog - DELETE */}
        <Dialog open={openDeleteDialog} onClose={handleClickCloseBtn}>
          <Box
            sx={{
              bgcolor: "#8c383e",
              height: "2em",
              width: "100%",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={0.6}
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    alignItems: "center",
                  }}
                >
                  <Grid item sx={{ height: "2em", ml: ".3em", mt: ".3em" }}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      sx={{ color: "white", fontSize: "1.5em" }}
                    />
                  </Grid>
                  <Grid item>Delete User Account</Grid>
                </Grid>
              </Grid>
            </Grid>
            <IconButton
              onClick={handleClickCloseBtn}
              sx={{ "&:hover": { color: "#F8C702" } }}
            >
              <HighlightOffOutlinedIcon
                sx={{ fontSize: "1em", color: "white" }}
              />
            </IconButton>
          </Box>
          <DialogContent>
            <DialogContentText
              sx={{
                fontFamily: "Poppins",
                color: "black",
                display: "flex",
                justifyContent: "center",
                mt: "1.3em",
              }}
            >
              Are you sure you want to delete this user account?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => handleYesDelBtn(selectedUser.userID)}
              variant="contained"
              style={{ textTransform: "none", fontFamily: "Poppins" }}
              sx={{
                borderRadius: "20px",
                fontFamily: "Poppins",
                bgcolor: "rgba(248, 199, 2, 0.8)",
                height: "2.3em",
                color: "black",
                "&:hover": { bgcolor: "#F8C702", color: "black" },
              }}
            >
              Yes
            </Button>
            <Button
              onClick={handleClickCloseBtn}
              style={{ textTransform: "none", fontFamily: "Poppins" }}
              sx={{
                borderRadius: "20px",
                fontFamily: "Poppins",
                height: "2.3em",
                color: "black",
                ml: "1em",
                "&:hover": {
                  bgcolor: "rgba(248, 199, 2, 0.2)",
                  color: "black",
                },
              }}
            >
              {" "}
              No
            </Button>
          </DialogActions>
        </Dialog>

        <CustomAlert
          open={successAlert.open}
          onClose={() => setSuccessAlert({ ...successAlert, open: false })}
          severity="success"
          message={successAlert.message}
        />
        <CustomAlert
          open={errorAlert.open}
          onClose={() => setErrorAlert({ ...errorAlert, open: false })}
          severity="error"
          message={errorAlert.message}
        />
      </Animated>
    </div>
  );
};
export default ManageAccount;
