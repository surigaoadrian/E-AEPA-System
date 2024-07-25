import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConfirmationModal from "./ConfirmationModal";
import ReactRouterPrompt from "react-router-prompt";
import LeaveConfirmationModal from "../modals/LeaveConfirmationModal";

function EvaluationForm({
  stage,
  evalType,
  loggedUser,
  period,
  setOpenForm,
  setEvalType,
  selectedEmp,
  selectedAssignedPeerId,
  randomPeerId,
}) {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [jobResponses, setJobResponses] = useState([]);
  const [scores, setScores] = useState({});
  const [peer, setPeer] = useState({});
  const [assignedPeer, setAssignedPeer] = useState({});
  const [evaluationID, setEvaluationID] = useState(0);

  const [selectedEmpJobResp, setSelectedEmpJobResp] = useState([]);
  const [headScores, setHeadScores] = useState({});

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const stageType = stage;
  const evalPeriod = period;
  const formType = evalType;
  const userId = sessionStorage.getItem("userID");

  const marginTopValueHead = formType === "HEAD" ? "20px" : "10px";

  let hasRenderedFillHeading = false;

  const formContainer = {
    height: "80vh",
    width: "100%",
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
  };

  const formHeader = {
    height: "35px",
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  };

  const formContent = {
    height: "68vh",
    overflow: "auto",
    paddingRight: "10px",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1300, // Ensure it sits above other elements
  };

  const modalStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    fontSize: "16px",
    textAlign: "start",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Add some shadow for depth
    zIndex: 1400, // Ensure it sits above the overlay
    width: "400px",
    borderTop: "30px solid #8C383E",
    position: "relative",
  };

  const vbInstructions = [
    "Less than 20% of the time. Exhibits the value rarely.",
    "Less than 40% of the time. Exhibits the value sometimes.",
    "Less than 60% of the time. Exhibits the value fairly.",
    "Less than 80% of the time. Exhibits the value most of the time.",
    "At least 80% of the time. Exhibits the value consistently and habitually.",
  ];

  const jbInstructions = [
    "Consistently fails to meet expectations.",
    "Occasionally fails to meet expectations.",
    "Consistently meets expectations.",
    "Occasionally exceeds expectations.",
    "Consistently exceeds expectations.",
  ];

  const hasUnsavedChanges = responses.length > 0 || jobResponses.length > 0;

  const openModal = () => {
    setShowConfirmModal(true);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
  };

  //empty the peer when evaluation is open
  useEffect(() => {
    if (setOpenForm) {
      setPeer({});
    }
  }, [setOpenForm]);

  //fetch id from random

  //fetch id from assigned peer table
  const [assignPeerID, setAssignPeerID] = useState(null);
  const [assignEvaluatorID, setAssignEvaluatorID] = useState(null);

  useEffect(() => {
    if (evalType === "PEER-A") {
      const fetchAssignPeerID = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/assignedPeers/getAssignedPeersId",
            {
              params: {
                period: evalPeriod,
                evaluateeId: selectedAssignedPeerId,
              },
            }
          );

          setAssignPeerID(response.data);
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
    }
  }, [evalType, evalPeriod, selectedAssignedPeerId]);

  //fetch id from assigned evaluators table
  useEffect(() => {
    if (evalType === "PEER-A" && assignPeerID) {
      const fetchAssignEvalutaorsID = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/assignedPeers/getAssignedEvaluatorId",
            {
              params: {
                evaluatorId: userId,
                assignedPeersId: assignPeerID,
              },
            }
          );

          setAssignEvaluatorID(response.data);
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

      fetchAssignEvalutaorsID();
    }
  }, [evalType, assignPeerID, userId]);

  //fetch eval id
  useEffect(() => {
    const fetchEvalID = async () => {
      let response = null;
      try {
        if (evalType === "PEER") {
          response = await axios.get(
            "http://localhost:8080/evaluation/getEvalIDAssignedPeer",
            {
              params: {
                userID: userId,
                period: evalPeriod,
                stage: stageType,
                evalType: formType,
                peerID: randomPeerId,
              },
            }
          );
        } else if (evalType === "PEER-A") {
          response = await axios.get(
            "http://localhost:8080/evaluation/getEvalIDAssignedPeer",
            {
              params: {
                userID: userId,
                period: evalPeriod,
                stage: stageType,
                evalType: formType,
                peerID: selectedAssignedPeerId,
              },
            }
          );
        } else if (evalType === "SELF") {
          response = await axios.get(
            "http://localhost:8080/evaluation/getEvalID",
            {
              params: {
                userID: userId,
                period: evalPeriod,
                stage: stageType,
                evalType: formType,
              },
            }
          );
        } else if (evalType === "HEAD") {
          response = await axios.get(
            "http://localhost:8080/evaluation/getEvalIDHead",
            {
              params: {
                userID: userId,
                empID: selectedEmp.userID,
                period: evalPeriod,
                stage: stageType,
                evalType: formType,
              },
            }
          );
        }

        console.log(response.data);
        setEvaluationID(response.data);
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

    const intervalId = setInterval(fetchEvalID, 1000); // Fetch every 1 second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [userId, evalPeriod, stageType]);

  //fetch selected emp job responses
  useEffect(() => {
    if (selectedEmp && selectedEmp.userID) {
      const fetchJobResp = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/jobbasedresponse/getAllResponsesByID/${selectedEmp.userID}`
          );
          const jobResponsesWithScores = response.data.map((resp, index) => ({
            index,
            responsibility: resp,
            score: "", // Initialize score
          }));
          setSelectedEmpJobResp(jobResponsesWithScores);
        } catch (error) {
          console.log(error);
        }
      };

      fetchJobResp();
    }
  }, [selectedEmp]);

  //prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Save to local storage whenever responses or jobResponses change
  useEffect(() => {
    localStorage.setItem("responses", JSON.stringify(responses));
    localStorage.setItem("jobResponses", JSON.stringify(jobResponses));
  }, [responses, jobResponses]);

  //fetched assigned peer details
  useEffect(() => {
    if (evalType === "PEER-A") {
      const fetchAssignedPeer = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/getUser/${selectedAssignedPeerId}`
          );
          setAssignedPeer(response.data);
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

      fetchAssignedPeer();
    }
  }, [selectedAssignedPeerId, evalType === "PEER-A"]);

  //fetch peer details if peer is selected
  useEffect(() => {
    if (evalType === "PEER") {
      const fetchRandomPeer = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/getUser/${randomPeerId}`
          );

          setPeer(response.data);
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

      fetchRandomPeer();
    }
  }, [evalType]);

  //fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/question/getAllQuestions"
        );
        setQuestions(response.data);
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

    fetchQuestions();
  }, []);

  const handleRadioChange = (quesID, value) => {
    setResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (resp) => resp.question.quesID === quesID
      );
      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].score = value;
        return updatedResponses;
      } else {
        return [
          ...prevResponses,
          {
            evaluation: { evalID: evaluationID },
            question: { quesID: quesID },
            user: { userID: userId },
            score: value,
            comments: "",
            answers: "",
          },
        ];
      }
    });
  };

  const handleTextareaChange = (quesID, value) => {
    setResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (resp) => resp.question.quesID === quesID
      );
      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].answers = value;
        return updatedResponses;
      } else {
        return [
          ...prevResponses,
          {
            evaluation: { evalID: evaluationID },
            question: { quesID: quesID },
            user: { userID: userId },
            answers: value,
            score: "",
            comments: "",
          },
        ];
      }
    });
  };

  const handleJobTextareaChange = (index, value) => {
    setJobResponses((prevJobResponses) => {
      const existingJobResponseIndex = prevJobResponses.findIndex(
        (resp) => resp.index === index
      );
      if (existingJobResponseIndex !== -1) {
        const updatedJobResponses = [...prevJobResponses];
        updatedJobResponses[existingJobResponseIndex].responsibility = value;
        return updatedJobResponses;
      } else {
        return [
          ...prevJobResponses,
          {
            index,
            evaluation: { evalID: evaluationID },
            user: { userID: userId },
            responsibility: value,
            score: scores[index] || "",
            comments: "",
          },
        ];
      }
    });
  };

  const handleJobScoreChange = (index, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [index]: value,
    }));

    setJobResponses((prevJobResponses) => {
      const existingJobResponseIndex = prevJobResponses.findIndex(
        (resp) => resp.index === index
      );
      if (existingJobResponseIndex !== -1) {
        const updatedJobResponses = [...prevJobResponses];
        updatedJobResponses[existingJobResponseIndex].score = value;
        return updatedJobResponses;
      } else {
        return [
          ...prevJobResponses,
          {
            index,
            evaluation: { evalID: evaluationID },
            user: { userID: userId },
            responsibility: "",
            score: value,
            comments: "",
          },
        ];
      }
    });
  };

  //job score change for head
  const handleHeadJobScoreChange = (index, value) => {
    setHeadScores((prevScores) => ({
      ...prevScores,
      [index]: value,
    }));

    setSelectedEmpJobResp((prevJobResponses) => {
      const existingJobResponseIndex = prevJobResponses.findIndex(
        (resp) => resp.index === index
      );
      if (existingJobResponseIndex !== -1) {
        const updatedJobResponses = [...prevJobResponses];
        updatedJobResponses[existingJobResponseIndex].score = value;
        return updatedJobResponses;
      } else {
        return [
          ...prevJobResponses,
          {
            index,
            evaluation: { evalID: evaluationID },
            user: { userID: userId },
            responsibility: "",
            score: value,
            comments: "",
          },
        ];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openModal();
  };

  //submit
  const handleConfirmSubmit = async () => {
    closeModal();
    const evalPayload = {
      status: "COMPLETED",
    };

    const peerEvalPayload = {
      status: "COMPLETED",
    };

    const peerAEvalPayload = {
      status: "COMPLETED",
    };

    const assignPeerEvalPayload = {
      status: "COMPLETED",
    };

    try {
      let response = null;
      let updateEval = null;
      let updateEvaluatorStatus = null;
      let createResults = null;

      console.log("Stage:", stage);
      console.log("EvalType:", evalType);
      console.log("EvaluationID:", evaluationID);

      if (stage === "VALUES" && evalType === "PEER-A") {
        response = await axios.post(
          "http://localhost:8080/response/createResponses",
          responses
        );

        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          peerAEvalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (assignEvaluatorID) {
          updateEvaluatorStatus = await axios.patch(
            `http://localhost:8080/assignedPeers/updateEvaluatorStatus/${assignEvaluatorID}`,
            assignPeerEvalPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          console.error("assignEvaluatorID is null");
        }
      } else if (stage === "VALUES" && evalType === "PEER") {
        response = await axios.post(
          "http://localhost:8080/response/createResponses",
          responses
        );

        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          peerEvalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        createResults = await axios.post(
          `http://localhost:8080/results/calculateResults?evaluationID=${evaluationID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (stage === "VALUES" && evalType === "HEAD") {
        response = await axios.post(
          "http://localhost:8080/response/createResponses",
          responses
        );

        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          evalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        createResults = await axios.post(
          `http://localhost:8080/results/calculateResults?evaluationID=${evaluationID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (stage === "VALUES") {
        response = await axios.post(
          "http://localhost:8080/response/createResponses",
          responses
        );

        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          evalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        createResults = await axios.post(
          `http://localhost:8080/results/calculateResults?evaluationID=${evaluationID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (stage === "JOB" && evalType === "HEAD") {
        const responsesToSubmit = selectedEmpJobResp.map((resp, index) => ({
          ...resp,
          score: headScores[index] || "",
          evaluation: { evalID: evaluationID },
          user: { userID: userId },
        }));

        response = await axios.post(
          "http://localhost:8080/jobbasedresponse/createResponses",
          responsesToSubmit
        );

        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          evalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        createResults = await axios.post(
          `http://localhost:8080/results/calculateJobResults?evaluationID=${evaluationID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (stage === "JOB") {
        console.log("Job Responses:", jobResponses);

        response = await axios.post(
          "http://localhost:8080/jobbasedresponse/createResponses",
          jobResponses
        );

        console.log("Eval Payload:", evalPayload);
        updateEval = await axios.patch(
          `http://localhost:8080/evaluation/updateEvaluation/${evaluationID}`,
          evalPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        createResults = await axios.post(
          `http://localhost:8080/results/calculateJobResults?evaluationID=${evaluationID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Ensure response is not null before accessing its data
      if (response && response.data) {
        console.log("Responses submitted successfully:", response.data);
        localStorage.removeItem("responses");
        localStorage.removeItem("jobResponses");
        setResponses([]);
        setOpenForm(false);
        setEvalType("");
        setEvaluationID(0);
      } else {
        console.error("No response data received.");
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const filteredQuestions = questions.filter(
    (ques) => ques.evalType === formType || ques.kind === "RADIO"
  );

  return (
    <div style={formContainer}>
      <ReactRouterPrompt when={hasUnsavedChanges}>
        {({ isActive, onConfirm, onCancel }) => (
          <LeaveConfirmationModal sx={modalStyle} show={isActive}>
            <div style={overlayStyle}>
              <Box sx={modalStyle}>
                <Typography
                  id="modal-title"
                  sx={{ fontSize: "16px" }}
                  component="h2"
                >
                  Are you sure you want to leave this page? Any unsaved changes
                  will be lost. Please confirm your action.
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    sx={{
                      marginRight: "10px",
                      width: "20%",
                      height: "35px",
                      backgroundColor: "#8C383E",
                      "&:hover": {
                        backgroundColor: "#7C2828",
                      },
                      fontFamily: "poppins",
                    }}
                    variant="contained"
                    onClick={onConfirm}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      width: "20%",
                      fontWeight: "bold",
                      border: "none",
                      color: "#8C383E",
                      "&:hover": {
                        backgroundColor: "#a4b0be",
                        color: "white",
                        border: "none",
                      },
                    }}
                    onClick={onCancel}
                  >
                    NO
                  </Button>
                </div>
              </Box>
            </div>
          </LeaveConfirmationModal>
        )}
      </ReactRouterPrompt>
      <div style={formHeader}>
        <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
          {period} Evaluation:{" "}
          {stageType === "VALUES"
            ? evalType === "PEER" || evalType === "PEER-A"
              ? "Values-Based Performance Assessment (Peer)"
              : evalType === "HEAD"
              ? "Values-Based Performance Assessment (Employee)"
              : "Values-Based Performance Assessment"
            : "Job-Based Performance Assessment"}
        </h2>
      </div>
      <div style={formContent}>
        <form onSubmit={handleSubmit}>
          {(stageType === "VALUES" || stageType === "JOB") && (
            <>
              <div
                style={{
                  display: "flex",
                  height: "30px",
                  alignItems: "center",
                  backgroundColor: "#636E72",
                  color: "white",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                <p>
                  {evalType === "PEER" || evalType === "PEER-A"
                    ? "Peer"
                    : evalType === "HEAD"
                    ? "Employee"
                    : "Self"}{" "}
                  Description:
                </p>
              </div>
              <div
                style={{
                  minHeight: "40px",
                  marginTop: "10px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ width: "20%" }}>Employee:</p>
                  <p>
                    {evalType === "PEER-A"
                      ? `${assignedPeer.fName} ${assignedPeer.lName}`
                      : evalType === "PEER"
                      ? `${peer.fName} ${peer.lName}`
                      : evalType === "HEAD"
                      ? `${selectedEmp.fName} ${selectedEmp.lName}`
                      : `${loggedUser.fName} ${loggedUser.lName}`}
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ width: "20%" }}>Employee ID:</p>
                  <p>
                    {evalType === "PEER-A"
                      ? `${assignedPeer.workID}`
                      : evalType === "PEER"
                      ? `${peer.workID}`
                      : evalType === "HEAD"
                      ? `${selectedEmp.workID}`
                      : `${loggedUser.workID}`}
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ width: "20%" }}>Department:</p>
                  <p>{loggedUser.dept}</p>
                </div>
              </div>
            </>
          )}

          {stageType === "VALUES" && (
            <>
              {/** Instructions */}
              <div style={{ height: "180px" }}>
                <p
                  style={{
                    display: "flex",
                    height: "30px",
                    alignItems: "center",
                    backgroundColor: "#1E1E1E",
                    color: "white",
                    border: "1px solid black",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  Instruction: For each performance factor, select the
                  appropriate scale by which such CIT's core value is
                  demonstrated at work.
                </p>
                {vbInstructions.map((ins, index) => (
                  <p key={index}>
                    {index + 1} - {ins}
                  </p>
                ))}
              </div>
              {/** Label */}
              <div style={{ minHeight: "48vh" }}>
                <div
                  style={{
                    display: "flex",
                    height: "30px",
                    alignItems: "center",
                    backgroundColor: "#8C383E",
                    border: "1px solid black",
                  }}
                >
                  <div style={{ width: "70%" }}></div>
                  <div
                    style={{
                      display: "flex",
                      width: "30%",
                      justifyContent: "space-around",
                      color: "white",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <p key={value} style={{ marginLeft: "3px" }}>
                        {value}
                      </p>
                    ))}
                  </div>
                </div>

                {/** Questions */}
                {filteredQuestions.map((ques, index) => {
                  // Check if the current question is of type "FILL"
                  if (
                    formType === "SELF" &&
                    ques.kind === "FILL" &&
                    !hasRenderedFillHeading
                  ) {
                    hasRenderedFillHeading = true;
                    return (
                      <React.Fragment key={index}>
                        <h2
                          style={{
                            fontWeight: "500",
                            margin: "15px 0px 15px 0px",
                          }}
                        >
                          {formType === "PEER"
                            ? "Suggestions / Insights for the Co-Worker"
                            : "Personal Insights / Perspectives on my performance:"}
                        </h2>
                        <div>
                          <label htmlFor={ques.quesID}>{ques.quesText}</label>
                          <textarea
                            id={ques.quesID}
                            style={{
                              margin: "8px 0px 5px 0px",
                              height: "100px",
                              width: "100%",
                              border: "1px solid black",
                              borderRadius: "5px",
                              padding: "5px",
                              boxSizing: "border-box",
                              overflow: "hidden",
                              resize: "none",
                            }}
                            onChange={(e) =>
                              handleTextareaChange(ques.quesID, e.target.value)
                            }
                          ></textarea>
                        </div>
                      </React.Fragment>
                    );
                  }

                  // Render "RADIO" type questions or subsequent "FILL" questions without the heading
                  return ques.kind === "RADIO" ? (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        minHeight: "50px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "70%",
                        }}
                      >
                        <p>{ques.quesText}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "30%",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div
                            key={value}
                            style={{
                              display: "flex",
                            }}
                          >
                            <input
                              type="radio"
                              id={`ques-${index}-opt-${value}`}
                              name={`question-${index}`}
                              value={value}
                              onChange={() =>
                                handleRadioChange(ques.quesID, value)
                              }
                            />
                            <label
                              htmlFor={`ques-${index}-opt-${value}`}
                              className="custom-radio"
                            ></label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {formType === "HEAD" ? null : (
                        <div key={index}>
                          <label htmlFor={ques.quesID}>{ques.quesText}</label>
                          <textarea
                            id={ques.quesID}
                            style={{
                              margin: "8px 0px 15px 0px",
                              height: "100px",
                              width: "100%",
                              border: "1px solid black",
                              borderRadius: "5px",
                              padding: "5px",
                              boxSizing: "border-box",
                              overflow: "hidden",
                              resize: "none",
                            }}
                            onChange={(e) =>
                              handleTextareaChange(ques.quesID, e.target.value)
                            }
                          ></textarea>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </>
          )}

          {stageType === "JOB" && (
            <>
              {/** Instructions */}
              <div style={{ height: "180px" }}>
                <p
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    height: "30px",
                    alignItems: "center",
                    backgroundColor: "#1E1E1E",
                    color: "white",
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  Instruction: For each performance factor, select the
                  appropriate scale by which such vital function or primary
                  responsibility has been carried out.
                </p>
                {jbInstructions.map((ins, index) => (
                  <p key={index}>
                    {index + 1} - {ins}
                  </p>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  height: "30px",
                  alignItems: "center",
                  backgroundColor: "#8C383E",
                  border: "1px solid black",
                  marginBottom: "20px",
                }}
              >
                <div style={{ width: "70%" }}>
                  <p style={{ color: "white", padding: "5px" }}>
                    Vital Functions / Primary Responsibilities
                  </p>
                </div>
              </div>
              {evalType === "HEAD"
                ? /** Job-based Questions for HEAD */
                  selectedEmpJobResp.map((resp, index) => (
                    <div key={index}>
                      <label htmlFor={index}>{index + 1}.</label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <textarea
                          id={index}
                          readOnly
                          value={resp.responsibility}
                          style={{
                            margin: "8px 0px 15px 0px",
                            height: "100px",
                            width: "100%",
                            border: "1px solid black",
                            borderRadius: "5px",
                            padding: "5px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            resize: "none",
                          }}
                        ></textarea>

                        <div
                          style={{
                            width: "10%",
                            height: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#8C383E",
                              border: "1px solid black",
                              borderTopRightRadius: "3px",
                              borderTopLeftRadius: "3px",

                              color: "white",
                              padding: "5px",
                              fontSize: "14px",
                              height: "30px",
                              width: "75px",
                              textAlign: "center",
                            }}
                          >
                            Ratings:
                          </div>

                          <FormControl sx={{ width: "75px" }}>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={headScores[index] || ""}
                              onChange={(e) =>
                                handleHeadJobScoreChange(index, e.target.value)
                              }
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  ))
                : /** Job-based Questions for other evalTypes */
                  [1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <label htmlFor={i}>{i}.</label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <textarea
                          id={i}
                          style={{
                            margin: "8px 0px 15px 0px",
                            height: "100px",
                            width: "100%",
                            border: "1px solid black",
                            borderRadius: "5px",
                            padding: "5px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            resize: "none",
                          }}
                          onChange={(e) =>
                            handleJobTextareaChange(i, e.target.value)
                          }
                        ></textarea>

                        <div
                          style={{
                            width: "10%",
                            height: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#8C383E",
                              border: "1px solid black",
                              borderTopRightRadius: "3px",
                              borderTopLeftRadius: "3px",

                              color: "white",
                              padding: "5px",
                              fontSize: "14px",
                              height: "30px",
                              width: "75px",
                              textAlign: "center",
                            }}
                          >
                            Ratings:
                          </div>

                          <FormControl sx={{ width: "75px" }}>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={scores[i] || ""}
                              onChange={(e) =>
                                handleJobScoreChange(i, e.target.value)
                              }
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  ))}
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px 0px 10px 0px",
            }}
          >
            <Button
              type="submit"
              sx={{
                marginTop: marginTopValueHead,
                width: "8%",
                backgroundColor: "#8C383E",
                "&:hover": {
                  backgroundColor: "#7C2828",
                },
                fontFamily: "poppins",
              }}
              variant="contained"
            >
              Finish
            </Button>
          </div>
        </form>
      </div>
      <ConfirmationModal
        onConfirm={handleConfirmSubmit}
        isOpen={showConfirmModal}
        onCancel={closeModal}
      />
    </div>
  );
}

export default EvaluationForm;
