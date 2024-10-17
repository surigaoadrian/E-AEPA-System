import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { apiUrl } from "../config/config";
function PeerEvaluationCard({
  id,
  setEvalType,
  handleOpenModal,
  openModal,
  handleCloseModal,
  handleConfirm,
  evalDeets,
  setSelectedAssignedPeerId,
}) {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  const cardContainer = {
    minHeight: "30vh",
    width: "100%",
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "10px",
    zIndex: 3,
    position: "relative",
  };

  const periodResult =
    evalDeets.period === "3rd Month"
      ? "3-Month probationary"
      : evalDeets.period === "5th Month"
      ? "5-Month probationary"
      : evalDeets.period === "Annual-1st"
      ? "first annual"
      : "second annual";

  //format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const [evaluatee, setEvaluatee] = useState({});

  //fetch evaluatee details
  useEffect(() => {
    const fetchEvaluatee = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}user/getUser/${evalDeets.evaluateeId}`
        );
        setEvaluatee(response.data);
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

    fetchEvaluatee();
  }, []);

  const pronounsResult = evaluatee.gender === "Female" ? "her" : "his";

  return (
    <div style={cardContainer}>
      {/**Evaluation header */}
      <div
        style={{
          display: "flex",
          height: "30px",
          //   backgroundColor: "yellow",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            fontWeight: "600",

            fontSize: "18px",
            width: "84%",
          }}
        >
          Peer Evaluation
        </h3>
        {/*  */}

        <div
          style={{
            display: "flex",

            width: "18%",
            justifyContent: "space-between",
          }}
        >
          <p>Date:</p>
          <p>{formatDate(evalDeets.dateAssigned)}</p>
        </div>
      </div>

      <>
        {/**Evaluation description */}
        <div style={{ width: "82%" }}>
          {periodResult === "first annual" ||
          periodResult === "second annual" ? (
            <p>
              As of {formatDate(evalDeets.dateAssigned)}, following the
              conclusion of the first semester, the {periodResult} evaluation
              for{" "}
              <b style={{ fontWeight: "600", color: "#EE5253" }}>
                {evaluatee.fName}
              </b>{" "}
              is due. You will serve as{" "}
              {evaluatee.gender === "Female" ? "her" : "his"} Peer Evaluator
              during this e-AEPA.
            </p>
          ) : (
            <p>
              As of {formatDate(evalDeets.dateAssigned)},{" "}
              <b style={{ fontWeight: "600", color: "#EE5253" }}>
                {evaluatee.fName}
              </b>{" "}
              has completed {pronounsResult} {periodResult} period. During this
              e-AEPA, {evaluatee.gender === "Female" ? "she" : "he"} will be
              evaluated by you, {pronounsResult}{" "}
              <b style={{ fontWeight: "600", color: "black" }}>
                Peer Evaluator
              </b>{" "}
              .
            </p>
          )}
        </div>
        {/**Evaluation footer */}
        <div
          style={{
            //   backgroundColor: "#a29bfe",
            height: "70px",
            width: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "55px",
              // backgroundColor: "#ffeaa7",
              alignItems: "flex-end",
              textAlign: "center",
            }}
          >
            <div
              style={{
                border: "2px solid #EE5253",
                padding: "5px 0px 5px 0px",
                height: "35px",
                width: "145px",
                borderRadius: "5px",
                color: "#EE5253",
                fontWeight: "500",
              }}
            >
              <p>Peer Evaluation</p>
            </div>
          </div>
          <Button
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
            //onClick={handleTakeEvalChange}
            onClick={() => {
              setEvalType("PEER-A");
              setSelectedAssignedPeerId(evalDeets.evaluateeId);
              handleOpenModal("VALUES", "3rd Month");
            }}
          >
            Take Evaluation
          </Button>
        </div>
      </>

      {/**Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" sx={{ fontSize: "16px" }} component="h2">
            Are you sure you want to start the Peer Evaluation now?
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
              onClick={handleConfirm}
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
              onClick={handleCloseModal}
            >
              NO
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default PeerEvaluationCard;
