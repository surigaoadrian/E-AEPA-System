import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";

function EvaluationTypeTab({
  evalType,
  handleOpenForm,
  handleOpenModal,
  period,
  setShouldDisplay,
}) {
  const [response1, setResponse1] = useState(false);
  const [response2, setResponse2] = useState(false);
  const [response3, setResponse3] = useState(false);
  const evalPeriod = period;
  const userId = sessionStorage.getItem("userID");

  const tabContainer = {
    minHeight: "45px",
    width: "100%",
    marginTop: "25px",
  };

  useEffect(() => {
    const fetchEvalChecker = async () => {
      try {
        const response1 = await axios.get(
          "http://localhost:8080/evaluation/isEvaluationCompleted",
          {
            params: {
              userID: userId,
              period: evalPeriod,
              stage: "VALUES",
              evalType: "SELF",
            },
          }
        );

        const response2 = await axios.get(
          "http://localhost:8080/evaluation/isEvaluationCompleted",
          {
            params: {
              userID: userId,
              period: evalPeriod,
              stage: "JOB",
              evalType: "SELF",
            },
          }
        );

        const response3 = await axios.get(
          "http://localhost:8080/evaluation/isEvaluationCompleted",
          {
            params: {
              userID: userId,
              period: evalPeriod,
              stage: "VALUES",
              evalType: "PEER",
            },
          }
        );

        setResponse1(response1.data);
        setResponse2(response2.data);
        setResponse3(response3.data);
      } catch (error) {
        console.error("Error submitting responses:", error);
      }
    };

    fetchEvalChecker();
  }, [evalType]);

  useEffect(() => {
    if (response1 && response2 && response3) {
      setShouldDisplay(false);
    }
  }, [response1, response2, response3]);

  return (
    <>
      {evalType ? (
        <div style={tabContainer}>
          {evalType === "SELF" ? (
            <>
              {/** Self */}
              <div>
                <div
                  style={{
                    height: "30px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "600",
                    paddingBottom: "15px",
                    color: "black",
                    borderBottom: "5px solid #8C383E",
                  }}
                >
                  Stage 1:
                </div>
                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "100%",
                    //backgroundColor: "lightblue",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "25px",
                  }}
                >
                  <p>Values-Based Performance Assessment</p>
                  <Button
                    disabled={response1 === true}
                    sx={{
                      width: "14%",
                      height: "35px",
                      backgroundColor: "#8C383E",
                      "&:hover": {
                        backgroundColor: "#7C2828",
                      },
                      fontFamily: "poppins",
                    }}
                    variant="contained"
                    onClick={() => handleOpenModal("VALUES", period)}
                  >
                    Take Assessment
                  </Button>
                </div>
              </div>
              <div>
                <div
                  style={{
                    height: "30px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "600",
                    paddingBottom: "15px",
                    color: "black",
                    borderBottom: "5px solid #8C383E",
                  }}
                >
                  Stage 2:
                </div>
                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "100%",
                    //backgroundColor: "lightblue",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "25px",
                  }}
                >
                  <p>Job-Based Performance Assessment</p>
                  <Button
                    disabled={response2 === true}
                    sx={{
                      width: "14%",
                      height: "35px",
                      backgroundColor: "#8C383E",
                      "&:hover": {
                        backgroundColor: "#7C2828",
                      },
                      fontFamily: "poppins",
                    }}
                    variant="contained"
                    onClick={() => handleOpenModal("JOB", period)}
                  >
                    Take Assessment
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/** Peer */}
              <div>
                <div
                  style={{
                    height: "30px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "600",
                    paddingBottom: "15px",
                    color: "black",
                    borderBottom: "5px solid #8C383E",
                  }}
                >
                  Stage 1:
                </div>

                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "100%",
                    //backgroundColor: "lightblue",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "25px",
                  }}
                >
                  <p>Values-Based Performance Assessment (Peer)</p>
                  <Button
                    disabled={response3 === true}
                    sx={{
                      width: "14%",
                      height: "35px",
                      backgroundColor: "#8C383E",
                      "&:hover": {
                        backgroundColor: "#7C2828",
                      },
                      fontFamily: "poppins",
                    }}
                    variant="contained"
                    onClick={() => handleOpenModal("VALUES", period)}
                  >
                    Take Assessment
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

export default EvaluationTypeTab;
