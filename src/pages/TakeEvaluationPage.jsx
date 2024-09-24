import React, { useEffect, useRef, useState } from "react";
import EvaluationCard from "../components/EvaluationCard";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import EvaluationForm from "../components/EvaluationForm";
import PeerEvaluationCard from "../components/PeerEvaluationCard";
import { apiUrl } from "../config/config";
import Loader from "../components/Loader";

function TakeEvaluationPage() {
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [evalType, setEvalType] = useState("");
  const [stage, setStage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [loggedUser, setLoggedUser] = useState({});
  const userID = sessionStorage.getItem("userID");
  const [dateHired, setDateHired] = useState("");
  const [period, setPeriod] = useState("");
  const [fetchEvalID, setFetchEvalID] = useState();
  const [activeCard, setActiveCard] = useState(null);
  const [selectedAssignedPeerId, setSelectedAssignedPeerId] = useState(0);
  const [schoolYear, setSchoolYear] = useState("");
  const [semester, setSemester] = useState("");

  const [assignedEvaluators, setAssignedEvaluators] = useState([]);
  const [assignedEvaluators5th, setAssignedEvaluators5th] = useState([]);
  const insertionExecuted = useRef(false);
  const insertionExecuted5th = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  //fetch school year
  useEffect(() => {
    const fetchSchoolYear = async () => {
      try {
        const response = await axios.get(`${apiUrl}schoolYear/currentyear`);
        setSchoolYear(response.data);
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

    fetchSchoolYear();
  }, []);

  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/getUser/${userID}`);
        setLoggedUser(response.data);
        setDateHired(response.data.dateHired);
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

  //3rd
  const evaluationStartDate = new Date(dateHired);
  evaluationStartDate.setMonth(evaluationStartDate.getMonth() + 2);

  // Format the date
  const formattedDate = evaluationStartDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  //5th
  const evaluationStartDate5th = new Date(dateHired);
  evaluationStartDate5th.setMonth(evaluationStartDate5th.getMonth() + 4);

  const today = new Date();

  const periodResult =
    loggedUser.empStatus === "Regular"
      ? "Annual"
      : loggedUser.probeStatus === "3rd Probationary"
      ? "3rd Month"
      : "5th Month";

  console.log("period results:" + periodResult);

  //3rd

  useEffect(() => {
    const fetchAssignPeers = async () => {
      if (insertionExecuted.current) return;

      try {
        if (today >= evaluationStartDate) {
          const response = await axios.get(
            `${apiUrl}user/getAssignedEvaluators`,
            {
              params: {
                dept: loggedUser.dept,
                excludedUserID: loggedUser.userID,
              },
            }
          );
          setAssignedEvaluators(response.data);
          console.log("Evaluators Array:" + response.data);
        }
      } catch (error) {
        console.error("Error fetching assigned evaluators:", error);
      }
    };

    fetchAssignPeers();
  }, [today >= evaluationStartDate]);

  console.log(assignedEvaluators);

  useEffect(() => {
    const fetchAndInsertAssignedPeers = async () => {
      if (insertionExecuted.current || assignedEvaluators.length === 0) return;

      try {
        if (today >= evaluationStartDate) {
          const response = await axios.get(
            `${apiUrl}assignedPeers/isAssignedPeersIdPresent`,
            {
              params: {
                period: periodResult,
                evaluateeId: userID,
              },
            }
          );

          const existingID = response.data;
          if (existingID === false) {
            const currentDate = today.toISOString().split("T")[0];

            const evaluatorsArray = assignedEvaluators.map((evaluator) => ({
              evaluator: { userID: evaluator },
              status: "PENDING",
            }));

            await axios.post(
              `${apiUrl}assignedPeers/createAssignedPeers`,
              {
                evaluatee: { userID: loggedUser.userID },
                evaluators: evaluatorsArray,
                period: periodResult,
                dateAssigned: currentDate,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            insertionExecuted.current = true;
          } else {
            insertionExecuted.current = true;
          }
        }
      } catch (error) {
        console.error("Error fetching and inserting assigned peers:", error);
      }
    };

    fetchAndInsertAssignedPeers();
  }, [assignedEvaluators]);

  //5th
  useEffect(() => {
    const fetchAssignPeers = async () => {
      if (insertionExecuted5th.current) return;

      try {
        if (today >= evaluationStartDate5th) {
          const response = await axios.get(
            `${apiUrl}user/getAssignedEvaluators`,
            {
              params: {
                dept: loggedUser.dept,
                excludedUserID: loggedUser.userID,
              },
            }
          );
          setAssignedEvaluators5th(response.data);
          console.log("Evaluators Array 5th:" + response.data);
        }
      } catch (error) {
        console.error("Error fetching assigned evaluators:", error);
      }
    };

    fetchAssignPeers();
  }, [loggedUser.probeStatus === "5th Probationary"]);

  useEffect(() => {
    const fetchAndInsertAssignedPeers = async () => {
      if (insertionExecuted5th.current || assignedEvaluators5th.length === 0)
        return;

      try {
        if (today >= evaluationStartDate5th) {
          const response = await axios.get(
            `${apiUrl}assignedPeers/isAssignedPeersIdPresent`,
            {
              params: {
                period: periodResult,
                evaluateeId: userID,
              },
            }
          );

          const existingID = response.data;
          if (existingID === false) {
            const currentDate = today.toISOString().split("T")[0];

            const evaluatorsArray = assignedEvaluators5th.map((evaluator) => ({
              evaluator: { userID: evaluator },
              status: "PENDING",
            }));

            await axios.post(
              `${apiUrl}assignedPeers/createAssignedPeers`,
              {
                evaluatee: { userID: loggedUser.userID },
                evaluators: evaluatorsArray,
                period: periodResult,
                dateAssigned: currentDate,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            insertionExecuted5th.current = true;
          } else {
            insertionExecuted5th.current = true;
          }
        }
      } catch (error) {
        console.error("Error fetching and inserting assigned peers:", error);
      }
    };

    fetchAndInsertAssignedPeers();
  }, [assignedEvaluators5th]);

  //check if you are the assigned evaluator
  const [evaluateesDetails, setEvaluateesDetails] = useState([]);

  useEffect(() => {
    const checkIfAssignedEvaluator = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}assignedPeers/checkEvaluator`,
          {
            params: {
              evaluatorId: userID,
            },
          }
        );

        setEvaluateesDetails(response.data);
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

    checkIfAssignedEvaluator();
    console.log(`Evaluators: ${evaluateesDetails}`);
  }, [openForm]);

  const handleOpenModal = (stage, period) => {
    setSelectedStage(stage);
    setOpenModal(true);
    setPeriod(period);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [randomPeer, setRandomPeer] = useState({});
  const [evalID, setEvalID] = useState();

  useEffect(() => {
    if (evalType === "PEER") {
      const fetchRandomPeer = async () => {
        try {
          const response = await axios.get(`${apiUrl}user/randomPeer`, {
            params: {
              dept: loggedUser.dept,
              excludedUserID: loggedUser.userID,
            },
          });
          setRandomPeer(response.data);

          console.log("Random Peer fetched:", response.data);
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

  console.log("random peer: "+randomPeer);

  const handleConfirm = async () => {
    setOpenForm(true);
    setStage(selectedStage);
    setOpenModal(false);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const monthNum = today.getMonth();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    const currentDate = `${year}-${month}-${day}`;

    console.log(monthNames[monthNum]);

    try {
      const response = await axios.get(
        `${apiUrl}schoolYear/semester/${monthNames[monthNum]}`
      );

      setSemester(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }

    // Ensure randomPeer is set correctly
    if (evalType === "PEER" && (!randomPeer || !randomPeer.userID)) {
      console.error("Random Peer ID is undefined or null");
      return;
    }

    const evaluation = {
      user: {
        userID: userID,
      },
      stage: selectedStage,
      period: period,
      evalType: evalType,
      status: "OPEN",
      dateTaken: currentDate,
      schoolYear: schoolYear,
      semester: semester,
      isDeleted: 0,
    };

    const periodResult =
      randomPeer.empStatus === "Regular"
        ? "Annual"
        : randomPeer.probeStatus === "3rd Probationary"
        ? "3rd Month"
        : "5th Month";

    const randomPeerEvaluation = {
      user: {
        userID: userID,
      },
      peer: {
        userID: randomPeer.userID,
      },
      stage: selectedStage,
      period: periodResult,
      evalType: evalType,
      status: "OPEN",
      schoolYear: schoolYear,
      semester: semester,
      dateTaken: currentDate,
      isDeleted: 0,
    };

    const assignPeerEvaluation = {
      user: {
        userID: userID,
      },
      peer: {
        userID: selectedAssignedPeerId,
      },
      stage: selectedStage,
      period: period,
      evalType: evalType,
      status: "OPEN",
      dateTaken: currentDate,
      isDeleted: 0,
    };

    console.log("Evaluation object to be sent:", evaluation);
    console.log("Evaluation object to be sent:", assignPeerEvaluation);
    console.log("Peer id :" + selectedAssignedPeerId);

    let existingEvalID = null;

    if (evalType === "PEER") {
      try {
        const response = await axios.get(
          "http://localhost:8080/evaluation/getEvalID",
          {
            params: {
              userID: userID,
              period: period,
              stage: selectedStage,
              evalType: evalType,
            },
          }
        );
        existingEvalID = response.data;
        setEvalID(response.data);
        console.log("Existing evaluation ID:", existingEvalID);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
        existingEvalID = null; // Handle the case where no evaluation is found
      }
    } else if (evalType === "PEER-A") {
      try {
        const response = await axios.get(
          `${apiUrl}evaluation/getEvalIDAssignedPeer`,
          {
            params: {
              userID: userID,
              period: period,
              stage: selectedStage,
              evalType: evalType,
              peerID: selectedAssignedPeerId,
            },
          }
        );
        existingEvalID = response.data;
        console.log("Existing evaluation ID:", existingEvalID);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
        existingEvalID = null; // Handle the case where no evaluation is found
      }
    } else {
      try {
        const response = await axios.get(`${apiUrl}evaluation/getEvalID`, {
          params: {
            userID: userID,
            period: period,
            stage: selectedStage,
            evalType: evalType,
          },
        });
        existingEvalID = response.data;
        console.log("Existing evaluation ID:", existingEvalID);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    }

    console.log("Final value of existingEvalID:", existingEvalID);

    if (!existingEvalID) {
      try {
        const response = await axios.post(
          `${apiUrl}evaluation/createEvaluation`,
          evalType === "PEER"
            ? randomPeerEvaluation
            : evalType === "PEER-A"
            ? assignPeerEvaluation
            : evaluation
        );
        console.log("New evaluation created:", response.data);
      } catch (error) {
        console.error("Creating evaluation failed", error);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    }
  };

  console.log(selectedAssignedPeerId);

  const handleOpenForm = (stage) => {
    setIsFormLoading(true); // Start form loading immediately
    setOpenForm(!openForm);
    setStage(stage);

    setTimeout(() => {
      setIsFormLoading(false); // Stop form loading after delay
    }, 1000); // Adjust delay as needed
  };

  const handleEvalTypeChange = (e) => {
    setEvalType(e.target.value);
  };

  const container = {
    //backgroundColor: "tomato",
    height: "100%",
    padding: "10px 25px 0px 25px",
    overflow: "auto",
  };

  const evaluationHeaderStyles = {
    // backgroundColor: "lightblue",
    height: "6vh",
    alignItems: "center",
    display: "flex",
    marginBottom: "10px",
  };

  const dateHiredStyles = {
    // backgroundColor: "lightgreen",
    display: "flex",
    justifyContent: "space-between",
    width: "20%",
    fontSize: "15px",
    fontWeight: "500",
  };

  return (
    <div style={container}>
      <div style={evaluationHeaderStyles}>
        <h1
          style={{
            // backgroundColor: "yellow",
            flex: 1,
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Evaluation
        </h1>
        <div></div>
      </div>

      {loading ? (
        <Loader />
      ) : openForm ? (
        isFormLoading ? (
          <Loader />
        ) : (
          <EvaluationForm
            period={period}
            loggedUser={loggedUser}
            stage={stage}
            evalType={evalType}
            setOpenForm={setOpenForm}
            setEvalType={setEvalType}
            selectedAssignedPeerId={selectedAssignedPeerId}
            evalID={evalID}
          />
        )
      ) : (
        <div style={{ position: "relative" }}>
          {today >= evaluationStartDate &&
            loggedUser.empStatus !== "Regular" && (
              <EvaluationCard
                id={"3rdMonth"}
                period={"3rd Month"}
                dateHired={dateHired}
                evalDate={formattedDate}
                loggedUser={loggedUser}
                evalType={evalType}
                handleOpenForm={handleOpenForm}
                handleEvalTypeChange={handleEvalTypeChange}
                setEvalType={setEvalType}
                handleOpenModal={handleOpenModal}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                handleConfirm={handleConfirm}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                style={{ zIndex: 1 }}
              />
            )}

          {today >= evaluationStartDate5th &&
            loggedUser.empStatus !== "Regular" && (
              <EvaluationCard
                id={"5thMonth"}
                period={"5th Month"}
                loggedUser={loggedUser}
                evalType={evalType}
                handleOpenForm={handleOpenForm}
                handleEvalTypeChange={handleEvalTypeChange}
                setEvalType={setEvalType}
                handleOpenModal={handleOpenModal}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                handleConfirm={handleConfirm}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
              />
            )}

          {evaluateesDetails && evaluateesDetails.length > 0
            ? evaluateesDetails.map((evalDeets) => {
                return (
                  <PeerEvaluationCard
                    key={evalDeets.id}
                    id={evalDeets.id}
                    evalDeets={evalDeets}
                    setEvalType={setEvalType}
                    handleOpenModal={handleOpenModal}
                    openModal={openModal}
                    handleCloseModal={handleCloseModal}
                    handleConfirm={handleConfirm}
                    setSelectedAssignedPeerId={setSelectedAssignedPeerId}
                  />
                );
              })
            : null}

          <div
            style={{
              height: "75px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "absolute",
              top: "50px",
              left: "35%",
              zIndex: 0,
              color: "#a8a7a9",
            }}
          >
            <FontAwesomeIcon
              icon={faGears}
              style={{ fontSize: "30px", color: "#a8a7a9" }}
            />
            <p>There are no evaluations as of the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeEvaluationPage;
