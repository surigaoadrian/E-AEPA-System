import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ManagePeerModal({
  openModal,
  handleCloseModal,
  userId,
  year,
  selectedEvaluationPeriod,
}) {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "350px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  const [value, setValue] = React.useState(0);
  const [assignPeerId, setAssignPeerId] = useState(null);
  const [assignedEvaluators, setAssignedEvaluators] = useState([]);
  const [deptUsers, setDeptUsers] = useState([]);
  const [openEditPeer, setOpenEditPeer] = useState(false);
  const [viewedUser, setViewedUser] = useState();
  const [selectedEvaluators, setSelectedEvaluators] = useState("");

  //fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userId}`
        );
        setViewedUser(response.data);
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

  //fetching id from assign peer table
  useEffect(() => {
    const fetchAssignPeerID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/assignedPeers/getAssignedPeersId`,
          {
            params: {
              period: selectedEvaluationPeriod,
              evaluateeId: userId,
            },
          }
        );
        setAssignPeerId(response.data);
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

    fetchAssignPeerID();
  }, [userId, selectedEvaluationPeriod]);

  //fetching assigned evaluators id
  useEffect(() => {
    if (assignPeerId !== null) {
      const fetchAssignedEvaluators = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/assignedPeers/getEvaluatorIds`,
            {
              params: {
                assignedPeersId: assignPeerId,
              },
            }
          );
          setAssignedEvaluators(response.data);
          console.log("Fetched evaluators id: " + assignedEvaluators);
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

      fetchAssignedEvaluators();
    }
  }, [assignPeerId, selectedEvaluators]);

  //fetching all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getAllUser`
        );
        setDeptUsers(response.data);
        console.log("Fetched Users: " + deptUsers);
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

    fetchAllUsers();
  }, []);

  // Filtered users
  const filteredDeptUsers = deptUsers.filter(
    (user) =>
      assignedEvaluators.includes(user.userID) && user.dept === viewedUser.dept
  );

  // filtered users dept only
  const filteredDeptOnlyUsers = deptUsers.filter(
    (user) =>
      user.dept === viewedUser?.dept &&
      user.position !== "Secretary" &&
      user.role !== "HEAD"
  );

  console.log("filtered Dept user: ", filteredDeptUsers);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditPeer = () => {
    setOpenEditPeer(!openEditPeer);
  };

  const handleSelectChange = (index, event) => {
    const newSelectedEvaluators = [...selectedEvaluators];
    newSelectedEvaluators[index] = event.target.value;
    setSelectedEvaluators(newSelectedEvaluators);
  };

  // Function to fetch assigned evaluators again
  const fetchAssignedEvaluators = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/assignedPeers/getEvaluatorIds`,
        {
          params: {
            assignedPeersId: assignPeerId,
          },
        }
      );
      setAssignedEvaluators(response.data);
      console.log("Fetched evaluators id: " + assignedEvaluators);
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

  //update evaluator
  const updateEvaluators = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/assignedPeers/updateAssignedEvaluators/${assignPeerId}`,
        selectedEvaluators
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating evaluators:", error);
    }
  };

  const handleSaveEditPeer = async () => {
    await updateEvaluators();
    await fetchAssignedEvaluators();
    setOpenEditPeer(false);
  };

  console.log("Assigned peer id:" + assignPeerId);
  console.log("selected evaluation period " + selectedEvaluationPeriod);

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <div
          style={{
            // backgroundColor: "yellow",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              //backgroundColor: "lightblue",
              height: "100%",
            }}
          >
            {openEditPeer ? (
              <div
                style={{
                  height: "100%",
                  //backgroundColor: "yellow",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    Edit {selectedEvaluationPeriod} Peers:
                  </p>
                  {assignedEvaluators.map((evaluatorId, index) => (
                    <div
                      style={{
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        //backgroundColor: "tomato",
                      }}
                      key={index}
                    >
                      <p
                        style={{
                          paddingTop: "8px",
                          //backgroundColor: "tomato",
                          width: "15%",
                        }}
                      >
                        Peer {index + 1}:
                      </p>
                      <select
                        style={{
                          marginTop: "10px",
                          marginLeft: "10px",
                          border: "1px solid #898989",
                          borderRadius: "4px",
                        }}
                        value={selectedEvaluators[index] || evaluatorId}
                        onChange={(e) => handleSelectChange(index, e)}
                      >
                        <option value={evaluatorId}>
                          {
                            filteredDeptOnlyUsers.find(
                              (user) => user.userID === evaluatorId
                            )?.fName
                          }{" "}
                          {
                            filteredDeptOnlyUsers.find(
                              (user) => user.userID === evaluatorId
                            )?.lName
                          }
                        </option>
                        {filteredDeptOnlyUsers.map((user) => (
                          <option key={user.userID} value={user.userID}>
                            {user.fName} {user.lName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                {console.log("Selected Evaluators: " + selectedEvaluators)}
                <div
                  style={{
                    height: "30%",
                    //backgroundColor: "tomato",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "end",
                    marginTop: "12px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      height: "2.5em",
                      width: "8rem",
                      fontFamily: "Poppins",
                      backgroundColor: "#8c383e",
                      padding: "1px 1px 0 0 ",
                      "&:hover": {
                        backgroundColor: "#762F34",
                        color: "white",
                      },
                    }}
                    style={{ textTransform: "none" }}
                    onClick={handleSaveEditPeer}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      height: "2.5em",
                      width: "8rem",
                      fontFamily: "Poppins",
                      backgroundColor: "#8c383e",
                      padding: "1px 1px 0 0 ",
                      "&:hover": {
                        backgroundColor: "#762F34",
                        color: "white",
                      },
                      marginLeft: "15px",
                    }}
                    style={{ textTransform: "none" }}
                    onClick={handleEditPeer}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                }}
              >
                {assignPeerId ? (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: "20px" }}>
                        {selectedEvaluationPeriod} Assigned Peers:
                      </p>

                      {filteredDeptUsers.map((evaluator) => (
                        <div
                          style={{
                            display: "flex",
                            //backgroundColor: "lightgreen",
                            width: "100%",
                            marginTop: "10px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ marginRight: "10px" }}
                          />

                          <p key={evaluator.userID}>
                            {evaluator.fName} {evaluator.lName}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        height: "30%",
                        //backgroundColor: "tomato",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "end",
                        marginTop: "19px",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          height: "2.5em",
                          width: "8rem",
                          fontFamily: "Poppins",
                          backgroundColor: "#8c383e",
                          padding: "1px 1px 0 0 ",
                          "&:hover": {
                            backgroundColor: "#762F34",
                            color: "white",
                          },
                        }}
                        style={{ textTransform: "none" }}
                        onClick={handleEditPeer}
                      >
                        Edit Peer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ fontWeight: 500, marginBottom: "20px" }}>
                      There are no assigned peers available to display.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default ManagePeerModal;
