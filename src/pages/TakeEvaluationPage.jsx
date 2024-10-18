import React, { useEffect, useRef, useState } from "react";
import EvaluationCard from "../components/EvaluationCard";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import EvaluationForm from "../components/EvaluationForm";
import PeerEvaluationCard from "../components/PeerEvaluationCard";
import { apiUrl } from "../config/config";
import Loader from "../components/Loader";
import { format } from "date-fns";

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
  const insertionExecuted1stSem = useRef(false);
  const insertionExecutedEvalStatusTracker = useRef(false);

  const [renderFlag, setRenderFlag] = useState(false);

  const handleRenderFlag = () => {
    setRenderFlag((prevFlag) => !prevFlag);
  };

  //evaluation completed checker for 3rd month
  const [shouldDisplay, setShouldDisplay] = useState(true);

  const [response1, setResponse1] = useState(false);
  const [response2, setResponse2] = useState(false);
  const [response3, setResponse3] = useState(false);

  //evaluation completed checker for 5th month
  const [shouldDisplay5th, setShouldDisplay5th] = useState(true);

  const [response1For5th, setResponse1For5th] = useState(false);
  const [response2For5th, setResponse2For5th] = useState(false);
  const [response3For5th, setResponse3For5th] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  //fetch school year and semester
  useEffect(() => {
    const fetchSchoolYearAndSem = async () => {
      try {
        const response = await axios.get(`${apiUrl}academicYear/current-year`);
        const response2 = await axios.get(
          `${apiUrl}academicYear/current-semester`
        );
        setSchoolYear(response.data);
        setSemester(response2.data);
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

    fetchSchoolYearAndSem();
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

  const periodResult =
    loggedUser.empStatus === "Regular"
      ? semester === "First Semester"
        ? "Annual-1st"
        : semester === "Second Semester"
        ? "Annual-2nd"
        : "Invalid Semester"
      : loggedUser.probeStatus === "3rd Probationary"
      ? "3rd Month"
      : "5th Month";

  console.log("Period Result:", periodResult);

  //fetch is evaluation completed for 3rd Month
  useEffect(() => {
    const fetchEvalChecker = async () => {
      try {
        const response1 = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "3rd Month",
              stage: "VALUES",
              evalType: "SELF",
            },
          }
        );

        const response2 = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "3rd Month",
              stage: "JOB",
              evalType: "SELF",
            },
          }
        );

        const response3 = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "3rd Month",
              stage: "VALUES",
              evalType: "PEER",
            },
          }
        );

        console.log("user id to be submitted:" + userID);
        console.log("period to be submitted:" + period);

        setResponse1(response1.data);
        setResponse2(response2.data);
        setResponse3(response3.data);
      } catch (error) {
        console.error("Error submitting responses:", error);
      }
    };

    fetchEvalChecker();
  }, [renderFlag, shouldDisplay]);

  useEffect(() => {
    if (response1 && response2 && response3) {
      setShouldDisplay(false);
    }
  }, [renderFlag, response1, response2, response3, shouldDisplay]);

  //fetch is evaluation completed for 5th Month
  useEffect(() => {
    const fetchEvalCheckerFor5th = async () => {
      try {
        const response1For5th = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "5th Month",
              stage: "VALUES",
              evalType: "SELF",
            },
          }
        );

        const response2For5th = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "5th Month",
              stage: "JOB",
              evalType: "SELF",
            },
          }
        );

        const response3For5th = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompleted`,
          {
            params: {
              userID: userID,
              period: "5th Month",
              stage: "VALUES",
              evalType: "PEER",
            },
          }
        );

        console.log("user id to be submitted:" + userID);
        console.log("period to be submitted:" + period);

        setResponse1For5th(response1For5th.data);
        setResponse2For5th(response2For5th.data);
        setResponse3For5th(response3For5th.data);
      } catch (error) {
        console.error("Error submitting responses:", error);
      }
    };

    fetchEvalCheckerFor5th();
  }, [renderFlag, shouldDisplay5th]);

  useEffect(() => {
    if (response1For5th && response2For5th && response3For5th) {
      setShouldDisplay5th(false);
    }
  }, [
    renderFlag,
    response1For5th,
    response2For5th,
    response3For5th,
    shouldDisplay5th,
  ]);

  //3rd
  const evaluationStartDate = new Date(dateHired);
  evaluationStartDate.setMonth(evaluationStartDate.getMonth() + 2);

  const formattedDate = evaluationStartDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const today = new Date();

  //3rd
  useEffect(() => {
    //random peers
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

  //console.log(assignedEvaluators);

  useEffect(() => {
    const fetchAndInsertAssignedPeers = async () => {
      if (insertionExecuted.current || assignedEvaluators.length === 0) return;

      try {
        if (today >= evaluationStartDate && periodResult === "3rd Month") {
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
                schoolYear: schoolYear,
                semester: semester,
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
  const is5thMonth = true;
  const [assignPeerId3rd, setAssignPeerId3rd] = useState(null); //43
  const [assignedEvaluators3rd, setAssignedEvaluators3rd] = useState([]);

  //get id from assigned peer table for 3rd month period
  useEffect(() => {
    const fetchIdFromAssignPeerTbl = async () => {
      try {
        if (is5thMonth) {
          const response = await axios.get(
            `${apiUrl}assignedPeers/getAssignedPeersId`,
            {
              params: {
                period: "3rd Month",
                evaluateeId: userID,
              },
            }
          );

          setAssignPeerId3rd(response.data);
          console.log(
            "Fetch id from assign peer table 3rd month: ",
            response.data
          );
        }
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

    fetchIdFromAssignPeerTbl();
  }, [today]);

  //fetch evaluators using that id from above function
  useEffect(() => {
    const fetch3rdMonthEvaluators = async () => {
      try {
        if (assignPeerId3rd) {
          const response = await axios.get(
            `${apiUrl}assignedPeers/getEvaluatorIds`,
            {
              params: {
                assignedPeersId: assignPeerId3rd,
              },
            }
          );

          setAssignedEvaluators3rd(response.data);
          console.log(
            "Fetch evaluators id from 3rd month array: ",
            response.data
          );
        }
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

    fetch3rdMonthEvaluators();
  }, [assignPeerId3rd]);

  //5th month start date
  const evaluationStartDate5th = new Date(dateHired);
  evaluationStartDate5th.setMonth(evaluationStartDate5th.getMonth() + 4);

  // Format the date
  const formattedDate5th = evaluationStartDate5th.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  //add here the condition useEffect for 5th month
  useEffect(() => {
    const get5thMonthEvaluators = async () => {
      if (insertionExecuted5th.current) return;

      try {
        if (today >= evaluationStartDate5th) {
          const response = await axios.get(
            `${apiUrl}user/get5thMonthAssignedEvaluators`,
            {
              params: {
                dept: loggedUser.dept,
                excludedUserID: loggedUser.userID,
                excludedPeerIds: assignedEvaluators3rd.join(","),
              },
            }
          );
          setAssignedEvaluators5th(response.data);
          console.log("excludedPeerIds: ", assignedEvaluators3rd.join(","));
          console.log(
            "Assigned Evalutors for 5th month: ",
            assignedEvaluators5th
          );
        }
      } catch (error) {
        console.error(
          "Error fetching assigned evaluators for 5th month:",
          error
        );
      }
    };

    get5thMonthEvaluators();
  }, [today >= evaluationStartDate5th]);

  useEffect(() => {
    const fetchAndInsertAssignedPeers5th = async () => {
      if (insertionExecuted5th.current || assignedEvaluators5th.length === 0)
        return;

      try {
        if (today >= evaluationStartDate5th && periodResult === "5th Month") {
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
                schoolYear: schoolYear,
                semester: semester,
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
        console.error(
          "Error fetching and inserting assigned peers for 5th month:",
          error
        );
      }
    };

    fetchAndInsertAssignedPeers5th();
  }, [assignedEvaluators5th]);

  //annual
  const [currentAcadYear, setCurrentAcadYear] = useState(null);
  const [firstSemEndDate, setFirstSemEndDate] = useState(null);
  const [secondSemEndDate, setSecondSemEndDate] = useState(null);

  // const [firstSemEvalOpen, setFirstSemEvalopen] = useState(false);
  // const [secondSemEvalOpen, setSecondSemEvalOpen] = useState(false);

  // const [evaluationStatus, setEvaluationStatus] = useState({
  //   academicYear: null,
  //   isFirstSemEvalCompleted: false,
  //   isSecondSemEvalCompleted: false,
  // });

  const [annualFirstSemStatus, setAnnualFirstSemStatus] = useState(null);
  const [annualSecondSemStatus, setAnnualSecondSemStatus] = useState(null);

  const [shouldDisplayAnnual1st, setShouldDisplayAnnual1st] = useState(false);
  const [shouldDisplayAnnual2nd, setShouldDisplayAnnual2nd] = useState(false);

  useEffect(() => {
    const fetchCurrentAcadYear = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}academicYear/current-year-full`
        );
        const currentYear = response.data;
        setCurrentAcadYear(currentYear);

        // Set semester end dates
        if (currentYear && currentYear.semesters.length >= 2) {
          const firstSemesterEndDate = new Date(
            currentYear.semesters[0].endDate
          );
          const secondSemesterEndDate = new Date(
            currentYear.semesters[1].endDate
          );

          setFirstSemEndDate(firstSemesterEndDate);
          setSecondSemEndDate(secondSemesterEndDate);
        }
      } catch (error) {
        console.error("Failed to fetch academic year:", error);
      }
    };

    fetchCurrentAcadYear();
  }, []);

  // console.log("Current Acad Year:", currentAcadYear);
  // console.log("Current 1st sem end date:", firstSemEndDate);
  // console.log("Current 2nd sem end date:", secondSemEndDate);

  //fetch EvaluationStatusTracker
  //  useEffect(() => {
  //   const now = new Date();

  //   const fetchEvaluationStatus = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/eval-status`, {
  //         params: {
  //           userId: loggedUser.id,
  //           academicYearId: currentAcadYear.id
  //         }
  //       });

  //       const statusData = response.data;

  //       // Assuming the first object is for the first semester and second is for the second semester
  //       const firstSemStatus = statusData[0];
  //       const secondSemStatus = statusData[1];

  //       // Check if evaluations are open for the first semester
  //       if (firstSemEndDate && loggedUser?.empStatus === "Regular") {
  //         const firstEvalOpenDate = new Date(firstSemEndDate);
  //         firstEvalOpenDate.setDate(firstEvalOpenDate.getDate() - 7);

  //         if (
  //           now >= firstEvalOpenDate &&
  //           now <= firstSemEndDate &&
  //           firstSemStatus.completed === false
  //         ) {
  //           setFirstSemEvalopen(true);
  //         } else {
  //           setFirstSemEvalopen(false);
  //         }
  //       }

  //       // Check if evaluations are open for the second semester
  //       if (secondSemEndDate && loggedUser?.empStatus === "Regular") {
  //         const secondEvalOpenDate = new Date(secondSemEndDate);
  //         secondEvalOpenDate.setDate(secondEvalOpenDate.getDate() - 7);

  //         if (
  //           now >= secondEvalOpenDate &&
  //           now <= secondSemEndDate &&
  //           secondSemStatus.completed === false
  //         ) {
  //           setSecondSemEvalOpen(true);
  //         } else {
  //           setSecondSemEvalOpen(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch evaluation status", error);
  //     }
  //   };

  //   fetchEvaluationStatus();
  // }, [firstSemEndDate, secondSemEndDate, loggedUser, currentAcadYear]);

  useEffect(() => {
    const checkEvalStatusAndInsert = async () => {
      // Prevent multiple insertions
      if (insertionExecutedEvalStatusTracker.current) {
        console.log(
          "Early return: insertion was already executed in eval status tracker."
        );
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}eval-status`, {
          params: {
            userId: loggedUser.userID,
            academicYearId: currentAcadYear.id,
          },
        });

        //check for existing eval status
        if (Array.isArray(response.data) && response.data.length === 0) {
          await axios.post(`${apiUrl}eval-status/create-tracker`, null, {
            params: {
              academicYearId: currentAcadYear.id,
              firstSemesterId: currentAcadYear.semesters[0].id,
              secondSemesterId: currentAcadYear.semesters[1].id,
              userId: loggedUser.userID,
            },
            headers: { "Content-Type": "application/json" },
          });

          console.log("Evaluation status tracker created for the user.");
          insertionExecutedEvalStatusTracker.current = true;
        } else {
          console.log("Evaluation status already exists.");
        }
      } catch (error) {
        console.error(
          "Error fetching and inserting eval status tracker:",
          error
        );
      }
    };

    if (loggedUser && currentAcadYear && currentAcadYear.semesters) {
      checkEvalStatusAndInsert();
    }
  }, [currentAcadYear, loggedUser]);

  //for testing only
  useEffect(() => {
    const fetchEvaluationStatus = async () => {
      if (!loggedUser.userID || !currentAcadYear || !currentAcadYear.id) {
        console.error(
          "User ID, current academic year, or academic year ID is missing."
        );
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}eval-status`, {
          params: {
            userId: loggedUser.userID,
            academicYearId: currentAcadYear.id,
          },
        });

        const statusData = response.data;

        let firstSemStatus = null;
        let secondSemStatus = null;
        // setAnnualFirstSemStatus(firstSemStatus);
        // setAnnualSecondSemStatus(secondSemStatus);

        // Check if the response contains valid data for the first and second semesters
        if (statusData.length >= 2) {
          firstSemStatus = statusData[0];
          secondSemStatus = statusData[1];

          setAnnualFirstSemStatus(firstSemStatus || null);
          setAnnualSecondSemStatus(secondSemStatus || null);
        } else {
          // Handle case where data is incomplete
          console.warn(
            "Incomplete semester data. Could not retrieve first or second semester status."
          );
          setAnnualFirstSemStatus(null);
          setAnnualSecondSemStatus(null);
        }

        // Enable first semester evaluation if it's incomplete and the user is "Regular"
        if (
          firstSemStatus?.completed === false &&
          loggedUser?.empStatus === "Regular"
        ) {
          //setFirstSemEvalopen(true);
          setShouldDisplayAnnual1st(true);
        } else {
          //setFirstSemEvalopen(false);
          setShouldDisplayAnnual1st(false);
        }

        // Enable second semester evaluation if it's incomplete and the user is "Regular"
        if (
          secondSemStatus?.completed === false &&
          loggedUser?.empStatus === "Regular"
        ) {
          //setSecondSemEvalOpen(true);
          setShouldDisplayAnnual2nd(true);
        } else {
          //setSecondSemEvalOpen(false);
          setShouldDisplayAnnual2nd(false);
        }
      } catch (error) {
        console.error("Failed to fetch evaluation status", error);
      }
    };

    if (loggedUser && currentAcadYear) {
      fetchEvaluationStatus();
    }
  }, [renderFlag, loggedUser, currentAcadYear]);

  console.log(
    "Annual First Sem Status isCompleted: ",
    annualFirstSemStatus?.completed
  );

  const [assignedEvaluators1stSem, setAsssignedEvaluators1stSem] = useState([]);

  //1st sem annual assign evaluators
  useEffect(() => {
    //random peers
    const fetchAssignPeers = async () => {
      if (insertionExecuted1stSem.current) return;

      try {
        if (
          shouldDisplayAnnual1st &&
          loggedUser.empStatus === "Regular" &&
          loggedUser.position !== "Secretary"
        ) {
          const response = await axios.get(
            `${apiUrl}user/get1stAnnualAssignedEvaluators`,
            {
              params: {
                dept: loggedUser.dept,
                excludedUserID: loggedUser.userID,
              },
            }
          );
          setAsssignedEvaluators1stSem(response.data);
          console.log(
            "Evaluators Array for Annual first Semester:" + response.data
          );
        }
      } catch (error) {
        console.error("Error fetching assigned evaluators:", error);
      }
    };

    if (shouldDisplayAnnual1st) {
      fetchAssignPeers();
    }
  }, [shouldDisplayAnnual1st]);

  // useEffect(() => {
  //   console.log("Assigned Evaluators for 1st Sem: ", assignedEvaluators1stSem);
  // }, [assignedEvaluators1stSem]);

  //insert assigned evaluators 1st sem annual
  useEffect(() => {
    const fetchAndInsertAssignedPeers = async () => {
      if (
        insertionExecuted1stSem.current ||
        assignedEvaluators1stSem.length === 0
      ) {
        console.log(
          "Early return: either insertion was already executed or no evaluators assigned."
        );
        return;
      }

      try {
        console.log("Checking conditions...");

        console.log("shouldDisplayAnnual1st:", shouldDisplayAnnual1st);
        console.log("periodResult:", periodResult);
        console.log("loggedUser.empStatus:", loggedUser.empStatus);

        if (
          shouldDisplayAnnual1st &&
          periodResult === "Annual-1st" &&
          loggedUser.empStatus === "Regular"
        ) {
          const response = await axios.get(
            `${apiUrl}assignedPeers/isAssignedPeersIdPresentAnnual`,
            {
              params: {
                period: periodResult,
                evaluateeId: userID,
                schoolYear: schoolYear,
                semester: semester,
              },
            }
          );

          console.log(
            "is assigned peers id present? (Annual-1st) ",
            response.data
          );

          const existingID = response.data;
          if (existingID == false) {
            const currentDate = today.toISOString().split("T")[0];

            const evaluatorsArray = assignedEvaluators1stSem.map(
              (evaluator) => ({
                evaluator: { userID: evaluator },
                status: "PENDING",
              })
            );

            await axios.post(
              `${apiUrl}assignedPeers/createAssignedPeers`,
              {
                evaluatee: { userID: loggedUser.userID },
                evaluators: evaluatorsArray,
                period: periodResult,
                dateAssigned: currentDate,
                schoolYear: schoolYear,
                semester: semester,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            insertionExecuted1stSem.current = true;
          } else {
            insertionExecuted1stSem.current = true;
          }
        }
      } catch (error) {
        console.error(
          "Error fetching and inserting assigned peers for Annual 1st Sem:",
          error
        );
      }
    };

    if (assignedEvaluators1stSem) {
      fetchAndInsertAssignedPeers();
    }
  }, [assignedEvaluators1stSem]);

  const [isPartOneEvalComplete, setIsPartOneEvalComplete] = useState(false);
  const [isPartTwoEvalComplete, setIsPartTwoEvalComplete] = useState(false);

  //check if eval is complete for eval status tracker
  useEffect(() => {
    const fetchEvalChecker = async () => {
      try {
        const response1 = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompletedAnnual`,
          {
            params: {
              userID: loggedUser.userID,
              period:
                semester === "First Semester"
                  ? "Annual-1st"
                  : semester === "Second Semester"
                  ? "Annual-2nd"
                  : null,
              stage: "VALUES",
              evalType: "SELF",
              schoolYear: schoolYear,
            },
          }
        );

        const response2 = await axios.get(
          `${apiUrl}evaluation/isEvaluationCompletedAnnual`,
          {
            params: {
              userID: loggedUser.userID,
              period:
                semester === "First Semester"
                  ? "Annual-1st"
                  : semester === "Second Semester"
                  ? "Annual-2nd"
                  : null,
              stage: "JOB",
              evalType: "SELF",
              schoolYear: schoolYear,
            },
          }
        );

        setIsPartOneEvalComplete(response1.data);
        setIsPartTwoEvalComplete(response2.data);
        console.log("Annual Stage SELF status: ", response1.data);
        console.log("Annual Stage JOB status: ", response2.data);
      } catch (error) {
        console.error("Error submitting responses:", error);
      }
    };

    if (schoolYear && semester) {
      fetchEvalChecker();
    }
  }, [renderFlag, semester, schoolYear]);

  //check should display for annual first sem
  useEffect(() => {
    if (
      isPartOneEvalComplete &&
      isPartTwoEvalComplete &&
      annualFirstSemStatus?.completed === true
    ) {
      setShouldDisplayAnnual1st(false);
    }
  }, [
    renderFlag,
    isPartOneEvalComplete,
    isPartTwoEvalComplete,
    annualFirstSemStatus,
  ]);

  // Update annual evaluation status
  useEffect(() => {
    const updateEvalStatusTracker = async () => {
      try {
        if (isPartOneEvalComplete && isPartTwoEvalComplete) {
          let updateAnnualEvalStatus;

          if (semester === "First Semester") {
            updateAnnualEvalStatus = await axios.patch(
              `${apiUrl}eval-status/update/${annualFirstSemStatus.id}`,
              null,
              {
                params: { isCompleted: true },
              }
            );
          } else if (semester === "Second Semester") {
            updateAnnualEvalStatus = await axios.patch(
              `${apiUrl}eval-status/update/${annualSecondSemStatus.id}`,
              null,
              {
                params: { isCompleted: true },
              }
            );
          }

          console.log(
            "Annual evaluation status updated:",
            updateAnnualEvalStatus.data
          );
        }
      } catch (error) {
        console.error("Error updating evaluation status tracker:", error);
      }
    };

    if (isPartOneEvalComplete && isPartTwoEvalComplete) {
      updateEvalStatusTracker();
    }
  }, [renderFlag, isPartOneEvalComplete, isPartTwoEvalComplete, semester]);

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

  // const [randomPeer, setRandomPeer] = useState({});
  const [evalID, setEvalID] = useState();

  // useEffect(() => {
  //   if (evalType === "PEER") {
  //     const fetchRandomPeer = async () => {
  //       try {
  //         const response = await axios.get(`${apiUrl}user/randomPeer`, {
  //           params: {
  //             dept: loggedUser.dept,
  //             excludedUserID: loggedUser.userID,
  //           },
  //         });
  //         setRandomPeer(response.data);

  //         console.log("Random Peer fetched:", response.data);
  //       } catch (error) {
  //         if (error.response) {
  //           console.log(error.response.data);
  //           console.log(error.response.status);
  //           console.log(error.response.headers);
  //         } else {
  //           console.log(`Error: ${error.message}`);
  //         }
  //       }
  //     };
  //     fetchRandomPeer();
  //   }
  // }, [evalType]);

  // console.log("random peer: " + randomPeer);

  const handleConfirm = async () => {
    setOpenForm(true);
    setStage(selectedStage);
    setOpenModal(false);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    const currentDate = `${year}-${month}-${day}`;

    // Ensure randomPeer is set correctly
    // if (evalType === "PEER" && (!randomPeer || !randomPeer.userID)) {
    //   console.error("Random Peer ID is undefined or null");
    //   return;
    // }

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

    // const periodResult =
    //   randomPeer.empStatus === "Regular"
    //     ? "Annual"
    //     : randomPeer.probeStatus === "3rd Probationary"
    //     ? "3rd Month"
    //     : "5th Month";

    // const randomPeerEvaluation = {
    //   user: {
    //     userID: userID,
    //   },
    //   peer: {
    //     userID: randomPeer.userID,
    //   },
    //   stage: selectedStage,
    //   period: periodResult,
    //   evalType: evalType,
    //   status: "OPEN",
    //   schoolYear: schoolYear,
    //   semester: semester,
    //   dateTaken: currentDate,
    //   isDeleted: 0,
    // };

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

    // if (evalType === "PEER") {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:8080/evaluation/getEvalID",
    //       {
    //         params: {
    //           userID: userID,
    //           period: period,
    //           stage: selectedStage,
    //           evalType: evalType,
    //         },
    //       }
    //     );
    //     existingEvalID = response.data;
    //     setEvalID(response.data);
    //     console.log("Existing evaluation ID:", existingEvalID);
    //   } catch (error) {
    //     if (error.response) {
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     } else {
    //       console.log(`Error: ${error.message}`);
    //     }
    //     existingEvalID = null; // Handle the case where no evaluation is found
    //   }
    // } else

    if (evalType === "PEER-A") {
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
          evalType === "PEER-A" ? assignPeerEvaluation : evaluation
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
            annualFirstSemId={annualFirstSemStatus?.id}
            annualSecondSemId={annualSecondSemStatus?.id}
            handleRenderFlag={handleRenderFlag}
          />
        )
      ) : (
        <div style={{ position: "relative" }}>
          {today >= evaluationStartDate &&
            loggedUser.empStatus !== "Regular" &&
            loggedUser.probeStatus !== "5th Probationary" &&
            shouldDisplay && (
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
            loggedUser.empStatus !== "Regular" &&
            loggedUser.probeStatus !== "3rd Probationary" && (
              <EvaluationCard
                id={"5thMonth"}
                period={"5th Month"}
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

          {shouldDisplayAnnual1st && (
            <EvaluationCard
              id={"Annual-1st"}
              period={"Annual-1st"}
              dateHired={dateHired}
              evalDate={format(firstSemEndDate, "MMMM dd, yyyy")}
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
