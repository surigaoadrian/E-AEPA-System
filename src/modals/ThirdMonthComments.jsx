import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { apiUrl } from "../config/config";

const selfQuestionLabels = {
  21: "For this period that you are evaluating yourself, what is/are 1 or 2 of your accomplish/s or contribution/s that you are most proud of?",
  22: "[GAP] Describe areas you feel require improvement in terms of your professional capabilities.",
  23: "[TARGET] What should be your career goals for this semester?",
  24: "[ACTION/S] What could you, your Immediate Head, or CIT management do to best support you in accomplishing these goals?",
};

const ThirdMonthComments = ({ userId, filter }) => {
  const role = sessionStorage.getItem("userRole");
  const [selfComments, setSelfComments] = useState([]);
  const [peerComments, setPeerComments] = useState([]);
  const [commentsData, setCommentsData] = useState({
    27: "", // GAP comment
    28: "", // TARGET comment
    29: "", // ACTION comment
    30: "", // SUPPLEMENTARY comment
  });

  const [editingCommentID, setEditingCommentID] = useState(null); // ID of the comment being edited
  const [responseIDs, setResponseIDs] = useState({});

  // Fetch comments and response IDs on component mount and when userId changes
  const fetchCommentsAndResponseIDs = async () => {
    try {
      // Fetch comments
      const commentsResponse = await axios.get(
        `${apiUrl}response/getHeadComments/${userId}`
      );
      const comments = commentsResponse.data;

      // Fetch response IDs
      const responsesResponse = await axios.get(
        `${apiUrl}response/getAllResponses`
      );
      const responses = responsesResponse.data;

      // Update comments and response IDs state
      const initialData = {
        27:
          comments.find((comment) => comment.question.quesID === 27)
            ?.comments || "",
        28:
          comments.find((comment) => comment.question.quesID === 28)
            ?.comments || "",
        29:
          comments.find((comment) => comment.question.quesID === 29)
            ?.comments || "",
        30:
          comments.find((comment) => comment.question.quesID === 30)
            ?.comments || "",
      };

      const ids = {};
      responses.forEach((res) => {
        if (res.user.userID === userId) {
          ids[res.question.quesID] = res.responseID;
        }
      });

      setCommentsData(initialData);
      setResponseIDs(ids);
    } catch (error) {
      console.error("Error fetching comments and responses:", error);
    }
  };

  useEffect(() => {
    fetchCommentsAndResponseIDs();
  }, [userId]);

  const handleEditComment = (quesID) => {
    setEditingCommentID(quesID);
  };

  const handleCancelEdit = () => {
    setEditingCommentID(null);
  };

  const handleSaveComment = async () => {
    const responseID = responseIDs[editingCommentID];
    const dataToSend = {
      user: { userID: userId },
      question: { quesID: editingCommentID },
      comments: commentsData[editingCommentID],
    };

    try {
      if (responseID) {
        // Update existing comment
        await axios.put(
          `${apiUrl}response/updateHeadComment/${responseID}`,
          dataToSend
        );
        console.log("Comment updated");
      } else {
        // Create new comment
        await axios.post(`${apiUrl}response/createHeadComment`, dataToSend);
        console.log("Comment added");
      }

      // Clear editing state and refetch comments
      setEditingCommentID(null);
      await fetchCommentsAndResponseIDs(); // Refetch to get updated data
    } catch (error) {
      console.error("Error saving comments:", error);
    }
  };

  const handleCommentChange = (quesID, value) => {
    setCommentsData((prevData) => ({ ...prevData, [quesID]: value }));
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
          return isCorrectUser && isCorrectQuestion && isSelfEvaluation;
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
              period: "3rd Month",
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
        console.log("Evaluator IDs:", evaluatorIds);

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

                return (
                  isCorrectEvaluator &&
                  isCorrectEvaluatee &&
                  isCorrectQuestion &&
                  isPeerEvaluation
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
                      comment ? comment.answers : "No comments available"
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
                {role !== "EMPLOYEE" && (
                  <IconButton
                    onClick={() => handleEditComment(quesID)}
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
                )}
              </Typography>
              <TextareaAutosize
                disabled={role === "EMPLOYEE" || editingCommentID !== quesID}
                variant="outlined"
                fullWidth
                minRows={5}
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
    </div>
  );
};

export default ThirdMonthComments;
