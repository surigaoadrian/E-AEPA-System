import React, { useEffect, useState, useRef} from "react";
import {Box,Button, Snackbar, Alert,IconButton,Typography,TextareaAutosize,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { apiUrl } from "../config/config";
import '../index.css';

const selfQuestionLabels = {
  21: "For this period that you are evaluating yourself, what is/are 1 or 2 of your accomplish/s or contribution/s that you are most proud of?",
  22: "[GAP] Describe areas you feel require improvement in terms of your professional capabilities.",
  23: "[TARGET] What should be your career goals for this semester?",
  24: "[ACTION/S] What could you, your Immediate Head, or CIT management do to best support you in accomplishing these goals?",
};

const AnnualSecondSemComments = ({ headId, userId, filter, schoolYear }) => {
  const role = sessionStorage.getItem("userRole");
  console.log("Si role:", role);
  const [selfComments, setSelfComments] = useState([]);
  const [peerComments, setPeerComments] = useState([]);
  const [commentsData, setCommentsData] = useState({
    27: "", // GAP comment
    28: "", // TARGET comment
    29: "", // ACTION comment
    30: "", // SUPPLEMENTARY comment
  });

  const [editingCommentID, setEditingCommentID] = useState(null); 
  const [initialCommentText, setInitialCommentText] = useState(''); 
  const [responseIDs, setResponseIDs] = useState({});
  const textareaRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}headcomments/filteredcomments`, {
        params: {
          userID: userId,       
          period: "Annual-2nd",  
          schoolYear: schoolYear, 
          semester: "First Semester"     
        },
      });
      const fetchedComments = response.data;

      const updatedCommentsData = {};
      const updatedResponseIDs = {};

      fetchedComments.forEach((comment) => {
        const quesID = comment.question.quesID;
        updatedCommentsData[quesID] = comment.comment;
        updatedResponseIDs[quesID] = comment.id;
      });

      setCommentsData(updatedCommentsData);
      setResponseIDs(updatedResponseIDs);
      console.log("Fetched comments:", fetchedComments);
      console.log("Updated commentsData:", updatedCommentsData);
      console.log("Updated responseIDs:", updatedResponseIDs);
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
    }
  };

  fetchComments();

  if (editingCommentID !== null && textareaRef.current) {
    textareaRef.current.focus();
  }
}, [userId, editingCommentID]);  


// Handle the Edit Comment action
const handleEditComment = (quesID) => {
  console.log("Editing question ID:", quesID);
  setEditingCommentID(quesID);
  setInitialCommentText(commentsData[quesID]); // Store the initial comment text
};


// Handle Cancel action
const handleCancelEdit = () => {
  setEditingCommentID(null); 
  setCommentsData((prevData) => ({
    ...prevData,
    [editingCommentID]: initialCommentText,  
  }));
};


// Handle Save action (either create new or update existing)
const handleSaveComment = async () => {
  const responseID = responseIDs[editingCommentID]; 

  const dataToSend = responseID
    ? { comment: commentsData[editingCommentID], quesID:editingCommentID } 
    : {
        question: { quesID: editingCommentID },
        userID: { userID: userId }, 
        headID: { userID: headId }, 
        comment: commentsData[editingCommentID], 
        period: "Annual-2nd",
        schoolYear: schoolYear, 
        semester: "First Semester",
      };

  try {
    if (responseID) {
      // Update an existing comment
      await axios.put(`${apiUrl}headcomments/updateHeadComment/${responseID}`, dataToSend);
      setSnackbarMessage("Comment updated successfully!");
      console.log("Comment updated successfully");
    } else {
      // Add a new comment
      const response = await axios.post(`${apiUrl}headcomments/createHeadComment`, dataToSend);
      console.log("Comment added successfully");

      setResponseIDs((prevResponseIDs) => ({
        ...prevResponseIDs,
        [editingCommentID]: response.data.id, 
      }));
      setSnackbarMessage("Comment added successfully!");
    }
    setOpenSnackbar(true);
    setEditingCommentID(null); 
    await fetchComments(); 
  } catch (error) {
    console.error("Error saving comment:", error.response?.data || error.message);
  }

  // Debug logs for troubleshooting
  console.log("Editing comment ID:", editingCommentID);
  console.log("Response ID for current quesID:", responseID);
  console.log("Data to send:", dataToSend);
};

  // Update comment data while editing
  const handleCommentChange = (quesID, value) => {
    setCommentsData((prevData) => ({
      ...prevData,
      [quesID]: value,  
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  //FETCH SELF COMMENTS
  useEffect(() => {
    const fetchSelfComments = async () => {
      try {
        const response = await axios.get(`${apiUrl}response/getAllResponses`);
        const allResponses = response.data;

        // Filter comments based on userId, question_id, and evaluation type
        const filteredComments = allResponses.filter((response) => {
          const isCorrectUser = response.user?.userID === parseInt(userId, 10);
          const isCorrectQuestion = [21, 22, 23, 24].includes(
            response.question?.quesID
          );
          const isSelfEvaluation = response.evaluation?.evalType === "SELF";
          const isCorrectPeriod = response.evaluation?.period === "Annual-2nd";
          const isCorrectSchoolYear = response.evaluation?.schoolYear === schoolYear;
          return isCorrectUser && isCorrectQuestion && isSelfEvaluation && isCorrectPeriod && isCorrectSchoolYear;
        });

        setSelfComments(filteredComments);
      } catch (error) {
        console.error("Error fetching self comments:", error);
      }
    };

    fetchSelfComments();
  }, [userId]);

  const renderSelfComments = () => {
    return (
      <>
        <Box
          className="mb-2 mt-14"
          sx={{
            backgroundColor: "#E81B1B",
            color: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            height: "30px",
            borderBottom: "3px solid #F8C702",
          }}
        >
          PERSONAL INSIGHTS / PERSPECTIVES ON MY PERFORMANCE
        </Box>
        {[21, 22, 23, 24].map((questionId) => {
          const comment = selfComments.find(
            (c) => c.question.quesID === questionId
          );
          return (
            <Box key={questionId} mb={2}>
              <Typography
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  paddingLeft: "8px",
                  fontFamily: "poppins",
                }}
              >
                {selfQuestionLabels[questionId]}
              </Typography>
              <TextareaAutosize
                disabled
                minRows={5}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  color: "black",
                  backgroundColor: "white",
                  border: "1px solid black",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  marginTop: "8px",
                  resize: "none",
                }}
                defaultValue={comment ? comment.answers : ""}
              />
            </Box>
          );
        })}
      </>
    );
  };

  //FETCH PEER COMMENTS
  useEffect(() => {
    const fetchPeerComments = async () => {
      try {
        // Fetch assigned peer ID
        const assignedPeerIdResponse = await axios.get(
          `${apiUrl}assignedPeers/getAssignedPeersId`,
          {
            params: {
              period: "Annual-2nd",
              evaluateeId: userId,
            },
          }
        );
        const assignedPeersId = assignedPeerIdResponse.data;

        // Fetch evaluator IDs
        const evaluatorIdsResponse = await axios.get(
          `${apiUrl}assignedPeers/getEvaluatorIds`,
          {
            params: {
              assignedPeersId: assignedPeersId,
            },
          }
        );
        const evaluatorIds = evaluatorIdsResponse.data;
        //console.log("Evaluator IDs:", evaluatorIds);

        // Fetch comments for each evaluator
        const commentsPromises = evaluatorIds.map((evaluatorId) =>
          axios
            .get(`${apiUrl}response/getAllResponses`)
            .then((response) => {
              const allResponses = response.data;

              // Filter comments based on evaluator ID, evaluatee ID, question ID, and evaluation type
              const filteredPeerComments = allResponses.filter((res) => {
                const isCorrectEvaluator =
                  res.evaluation?.user?.userID === evaluatorId;
                const isCorrectEvaluatee =
                  res.evaluation?.peer?.userID === parseInt(userId, 10);
                const isCorrectQuestion = [31, 32].includes(
                  res.question?.quesID
                );
                const isPeerEvaluation = res.evaluation?.evalType === "PEER-A";
                const isCorrectPeriod = res.evaluation?.period === "Annual-2nd";
                const isCorrectSchoolYear = res.evaluation?.schoolYear === schoolYear;

                return (
                  isCorrectEvaluator &&
                  isCorrectEvaluatee &&
                  isCorrectQuestion &&
                  isPeerEvaluation &&
                  isCorrectPeriod &&
                  isCorrectSchoolYear
                );
              });

              return { evaluatorId, comments: filteredPeerComments };
            })
            .catch((error) => {
              console.error(
                `Error fetching comments for evaluator ${evaluatorId}:`,
                error
              );
              return { evaluatorId, comments: [] }; // Return empty comments in case of an error
            })
        );

        const commentsResults = await Promise.all(commentsPromises);
        setPeerComments(commentsResults);
      } catch (error) {
        console.error("Error fetching peer comments:", error);
      }
    };

    fetchPeerComments();
  }, [userId]);

  const renderPeerComments = () => {
    return (
      <>
        {peerComments.map(({ evaluatorId, comments }, index) => (
          <React.Fragment key={evaluatorId}>
            <Box
              className="mb-2 mt-4"
              sx={{
                backgroundColor: "#E81B1B",
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "bold",
                height: "30px",
                borderBottom: "3px solid #F8C702",
              }}
            >
              SUGGESTIONS / INSIGHTS FOR THE CO-WORKER (Peer {index + 1})
            </Box>
            {[31, 32].map((questionId) => {
              const comment = comments.find(
                (c) => c.question.quesID === questionId
              );
              return (
                <Box key={questionId} mb={2}>
                  <Typography
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      paddingLeft: "8px",
                      fontFamily: "poppins",
                      height: "50px",
                    }}
                  >
                    {questionId === 31
                      ? "What suggestions do you have for your CO-WORKER to maintain or improve team relationships?"
                      : "What else would you like CIT management or your Immediate Head to know about your CO-WORKER? Your CO-WORKER'S job? Other comments/remarks/suggestions?"}
                  </Typography>
                  <TextareaAutosize
                    disabled
                    minRows={5}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "1rem",
                      color: "black",
                      backgroundColor: "white",
                      border: "1px solid black",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      marginTop: "8px",
                      resize: "none",
                    }}
                    defaultValue={
                      comment ? comment.answers : " "
                    }
                  />
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div>
      {filter === "self" && renderSelfComments()}
      {filter === "peer" && renderPeerComments()}
      {(filter === "overall" || filter === "head") && (
        <>
          <Box
            className="mb-2 mt-14"
            sx={{
              backgroundColor: "#E81B1B",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: "bold",
              height: "30px",
              borderBottom: "3px solid #F8C702",
            }}
          >
            INPUTS FROM IMMEDIATE HEAD OR DESIGNATED SUPERVISOR
          </Box>

          {[
            {
              quesID: 27,
              label:
                "[GAP] Describe areas you feel require improvement in terms of your STAFF's professional capabilities.",
            },
            {
              quesID: 28,
              label:
                "[TARGET] What should be your STAFF's career goals for this semester?",
            },
            {
              quesID: 29,
              label:
                "[ACTION/S] What could your STAFF, you as Immediate Head or CIT-U do to best support your STAFF in accomplishing these goals?",
            },
            { quesID: 30, label: "SUPPLEMENTARY NOTES / COMMENTS / REMINDERS" },
          ].map(({ quesID, label }) => (
            <React.Fragment key={quesID}>
<Typography
  sx={{
    backgroundColor: "black",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    height: "40px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingLeft: "8px",
    fontFamily: "poppins",
  }}
>
  {label}
  {role !== "EMPLOYEE" && role!=="ADMIN" &&(
    <div className="ml-auto">
      <IconButton
        onClick={() => handleEditComment(quesID)}
        className="no-print"
        sx={{
          color: "white",
          "&:hover": {
            color: "white", // Change the color on hover
            backgroundColor: "rgba(255, 255, 255, 0.3)", // Optional background change on hover
          },
        }}
      >
        <EditIcon />
      </IconButton>
    </div>
  )}
</Typography>

              <TextareaAutosize
                disabled={role === "EMPLOYEE" || editingCommentID !== quesID}
                ref={textareaRef} 
                variant="outlined"
                fullWidth
                minRows={5}
                placeholder="Add your comment here"
                value={commentsData[quesID]}
                onChange={(e) => handleCommentChange(quesID, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  color: "black",
                  backgroundColor: "white",
                  border: "1px solid black",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  marginTop: "8px",
                  marginBottom: "8px",
                  resize: "none",
                }}
              />
              {editingCommentID === quesID && (
                <Box className="mb-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleSaveComment}
                    sx={{
                      backgroundColor: "#8C383E",
                      width: "10%",
                      borderRadius: "5px 5px",
                      textTransform: "none",
                      fontFamily: "Poppins",
                      "&:hover": {
                        backgroundColor: "#762F34",
                      },
                    }}
                  >
                    {responseIDs[quesID] ? "Update" : "Add"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    sx={{
                      color: "#1E1E1E",
                      borderColor: "#B4B4B4",
                      width: "10%",
                      borderRadius: "5px 5px",
                      textTransform: "none",
                      fontFamily: "Poppins",
                      "&:hover": {
                        backgroundColor: "#ECECEE",
                        borderColor: "#ECECEE",
                        color: "#1E1E1E",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </React.Fragment>
          ))}
        </>
      )}
      {/* The Snackbar */}
            <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Auto close after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" elevation={6}sx={{ width: "100%" }} style={{ fontFamily: "Poppins" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AnnualSecondSemComments;
