import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import axios from "axios";

const selfQuestionLabels = {
  21: "For this period that you are evaluating yourself, what is/are 1 or 2 of your accomplish/s or contribution/s that you are most proud of?",
  22: "[GAP] Describe areas you feel require improvement in terms of your professional capabilities.",
  23: "[TARGET] What should be your career goals for this semester?",
  24: "[ACTION/S] What could you, your Immediate Head, or CIT management do to best support you in accomplishing these goals?"
};

const ThirdMonthComments = ({ userId, filter }) => {
  const role = sessionStorage.getItem("userRole");
  const [department, setDepartment] = useState("");
  const [selfComments, setSelfComments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getUser/${userId}`);
        setDepartment(response.data.dept);
        setFullname(response.data.fName + " " + response.data.lName);
        setPosition(response.data.position);
      } catch (error) {
        console.error("Error checking evaluation status:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchSelfComments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/response/getAllResponses');
        const allResponses = response.data;
        console.log('All responses:', allResponses);

        // Filter comments based on userId and question_id
        const filteredComments = allResponses.filter(response => {
          const isCorrectUser = response.user.userID === parseInt(userId, 10);
          const isCorrectQuestion = [21, 22, 23, 24].includes(response.question.quesID);
          const isSelfEvaluation = response.evaluation.evalType === 'SELF';
          return isCorrectUser && isCorrectQuestion && isSelfEvaluation;
        });

        console.log('Filtered self comments:', filteredComments);

        setSelfComments(filteredComments);
      } catch (error) {
        console.error('Error fetching self comments:', error);
      }
    };

    fetchSelfComments();
  }, [userId]);

  useEffect(() => {
    const fetchHeadData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getAllUser`);
        const users = response.data;

        const head = users.find(
          (user) => user.dept === department && user.position === "Department Head"
        );

        if (head) {
          setHeadFullname(`${head.fName} ${head.lName}`);
          setHeadPosition(head.position);
        }
      } catch (error) {
        console.error("Error fetching department head data:", error);
      }
    };

    if (department) {
      fetchHeadData();
    }
  }, [department]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userId}`
        );
        setEmployee(response.data);
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
        {[21, 22, 23, 24].map(questionId => {
          const comment = selfComments.find(c => c.question.quesID === questionId);
          return (
            <Box key={questionId} mb={2}>
              <Typography
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "1rem",
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
              <textarea
              disabled
              rows={5}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '1rem',
                color: 'black',
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '4px',
                boxSizing: 'border-box',
                marginTop: '8px',
                resize: 'none',  
              }}
              defaultValue={comment ? comment.answers : ''} 
            />
            </Box>
          );
        })}
      </>
    );
  };

  return (
    <div>
      {filter === 'self' && renderSelfComments()}

      {filter === "peer" && (
        <>
        <Box
        className="mb-2 "
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
        SUGGESTIONS / INSIGHTS FOR THE CO-WORKER
      </Box>
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
            }}
          >
            {" "}
            &nbsp; What suggestions do you have for your CO-WORKER to maintain or improve team relationships?{" "}
          </Typography>
          <textarea
            disabled
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '1rem',
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '4px',
              boxSizing: 'border-box',
              marginTop: '8px',
              marginBottom: '8px',
              resize: 'none',  
            }}
          />
                    <Typography
            sx={{
              backgroundColor: "black",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              height: "55px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "10px",
            }}
          >
            {" "}
            &nbsp; What else would you like CIT management or your Immediate Head to know about your CO-WORKER? Your CO-WORKER'S job? Other comments/remarks/suggestions?{" "}
          </Typography>
          <textarea
            disabled
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '1rem',
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '4px',
              boxSizing: 'border-box',
              marginTop: '8px',
              marginBottom: '8px',
              resize: 'none',  
            }}
          />
        </>
      )}

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
            }}
          >
            {" "}
            &nbsp; [GAP] Describe areas you feel require improvement in terms of your STAFF's professional capabilities. {" "}
          </Typography>
          <TextField
            disabled={role === "EMPLOYEE, ADMIN, SUPERUSER"}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
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
            }}
          >
            {" "}
            &nbsp; [TARGET] What should be your STAFF's career goals for the this semester?  {" "}
          </Typography>
          <TextField
            disabled={role === "EMPLOYEE"}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
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
            }}
          >
            {" "}
            &nbsp; [ACTION/S] What could your STAFF, you as Immediate Head or CIT management do to best support your STAFF in accomplishing these goals?  {" "}
          </Typography>
          <TextField
            disabled={role === "EMPLOYEE"}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
           <Typography
        sx={{
          backgroundColor: "#EAB4CF",
          fontSize: "1rem",
          fontWeight: "bold",
          height: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {" "}
        &nbsp; SUPPLEMENTARY NOTES / COMMENTS / REMINDERS{" "}
      </Typography>

      <TextField
        disabled={role === "EMPLOYEE"}
        variant="outlined"
        fullWidth
        multiline
        rows={5}
        margin="normal"
      />

        </>
      )}

     

    </div>
  );
};


export default ThirdMonthComments;
