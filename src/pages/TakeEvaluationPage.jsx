import React, { useEffect, useRef, useState } from "react";

import EvaluationCard from "../components/EvaluationCard";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import EvaluationForm from "../components/EvaluationForm";

function TakeEvaluationPage() {
  const [openForm, setOpenForm] = useState(false);
  const [evalType, setEvalType] = useState("");
  const [stage, setStage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [loggedUser, setLoggedUser] = useState({});
  const userID = sessionStorage.getItem("userID");
  const [period, setPeriod] = useState("");
  const [fetchEvalID, setFetchEvalID] = useState();

  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userID}`
        );
        setLoggedUser(response.data);
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

  const handleOpenModal = (stage, period) => {
    setSelectedStage(stage);
    setOpenModal(true);
    setPeriod(period);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    setOpenForm(true);
    setStage(selectedStage);
    setOpenModal(false);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    const currentDate = `${year}-${month}-${day}`;

    const evaluation = {
      user: {
        userID: userID,
      },
      stage: selectedStage,
      period: period,
      evalType: evalType,
      status: "OPEN",
      dateTaken: currentDate,
      isDeleted: 0,
    };

    console.log("Evaluation object to be sent:", evaluation);

    let existingEvalID = null;

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
      console.log("Existing evaluation ID:", existingEvalID);
      setFetchEvalID(existingEvalID);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }

    if (!existingEvalID) {
      try {
        const response = await axios.post(
          "http://localhost:8080/evaluation/createEvaluation",
          evaluation
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

  const handleOpenForm = (stage) => {
    setOpenForm(!openForm);
    setStage(stage);
  };

  const handleEvalTypeChange = (e) => {
    setEvalType(e.target.value);
  };

  const container = {
    //backgroundColor: "tomato",
    height: "100%",
    padding: "10px 25px 0px 25px",
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
        <div style={dateHiredStyles}>
          <p>Date Hired:</p>
          <p>{loggedUser.dateHired}</p>
        </div>
      </div>

      {openForm ? (
        <EvaluationForm
          period={period}
          loggedUser={loggedUser}
          stage={stage}
          evalType={evalType}
          setOpenForm={setOpenForm}
          setEvalType={setEvalType}
        />
      ) : (
        <div style={{ position: "relative" }}>
          <EvaluationCard
            period={"3rd Month"}
            loggedUser={loggedUser}
            evalType={evalType}
            handleOpenForm={handleOpenForm}
            handleEvalTypeChange={handleEvalTypeChange}
            setEvalType={setEvalType}
            handleOpenModal={handleOpenModal}
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            handleConfirm={handleConfirm}
            style={{ zIndex: 1 }}
          />
          {/* <EvaluationCard
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
          /> */}
          {/* <EvaluationCard
            period={"Annual"}
            loggedUser={loggedUser}
            evalType={evalType}
            handleOpenForm={handleOpenForm}
            handleEvalTypeChange={handleEvalTypeChange}
            setEvalType={setEvalType}
            handleOpenModal={handleOpenModal}
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            handleConfirm={handleConfirm}
          /> */}

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
