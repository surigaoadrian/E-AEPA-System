import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Container, Divider, Grid } from "@mui/material/";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Animated from "./motion";
import logo from "../assets/logo.png";
import imageSources from "../data/imageSource";
import efficiencyImg from "../assets/efficient.png";
import accuracyImg from "../assets/accuracy.png";
import transparencyImg from "../assets/transparency.png";
import evaluate from "../assets/evaluate.png";
import select from "../assets/select.png";
import done from "../assets/done.png";
import Button from "@mui/material/Button";
import SchoolYearModal from "../modals/SchoolYearModal";

function UserHome() {
  const [loggedUserData, setLoggedUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userID}`
        );

        setLoggedUserData(response.data);
        console.log(userID);
        console.log(response.data);
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

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getWeekday = (date) => {
    const options = { weekday: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <Animated>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          width: "80vw",
          height: "86vh",
          margin: "25px 0px 0px 43px",
          boxShadow: "-1px 4px 10px rgba(0, 0, 0, 0.3)",
          overflowY: "auto",
        }}
      >
        <Box
          component="header"
          sx={{
            backgroundColor: "#8C383E",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <Container sx={{ padding: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column-row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "20px",
                  }}
                >
                  Hello, {loggedUserData ? loggedUserData.fName : "User"}!
                </Typography>
              </Box>

              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: "50px",
                  height: "auto",
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontFamily: "Poppins",
                  textAlign: "center",
                  fontSize: "15px",
                }}
              >
                {formatDate(new Date())} - {getWeekday(new Date())}
              </Typography>
            </Box>
          </Container>
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "Poppins",
            fontSize: "18px",
            mt: 2,
            ml: 2,
            mr: 2,
            mb: 5,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              color: "#1E1E1",
              fontSize: "50px",
            }}
          >
            WELCOME TO THE{" "}
          </span>
          <br />
          <span style={{ fontWeight: 600, color: "#8C383E" }}>
            Expanded Administrative Employee Performance Appraisal (e-AEPA)
            System.
          </span>{" "}
        </Typography>

        <Box
          sx={{
            margin: "4% auto",
            width: "90%",
            maxHeight: "300px",
            overflow: "hidden",
          }}
        >
          <Carousel
            showThumbs={true}
            autoPlay
            infiniteLoop
            interval={3000}
            stopOnHover
            swipeable
            emulateTouch
            showStatus={false}
            style={{
              maxHeight: "300px",
            }}
          >
            {imageSources.map((source, index) => (
              <div key={index}>
                <img
                  src={source.src}
                  alt={source.alt}
                  style={{
                    width: source.width,
                    height: "100%",
                    margin: source.margin,
                    objectFit: source.objectFit,
                  }}
                />
              </div>
            ))}
          </Carousel>
        </Box>

        <Box sx={{ padding: 2, ml: 4, mr: 4 }}>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins",
              fontSize: "19px",
              lineHeight: "2em",
              ml: 2,
              mr: 2,
              padding: "0 30px 0 30px",
              textAlign: "justify",
              color: "#2C2828",
            }}
          >
            At CIT-U, we are committed to enhancing the way we evaluate our
            team. The e-AEPA system is designed to modernize and streamline the
            employee evaluation process, transitioning from traditional manual
            Excel-based assessments to a comprehensive digital platform.
          </Typography>

          <Divider sx={{ my: 8 }} />

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins",
              fontWeight: "bold",
              textAlign: "center",
              color: "#8C383E",
              mb: 8,
            }}
          >
            E-AEPA FOCUSES ON THE FOLLOWING
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={efficiencyImg}
                  alt="Efficiency"
                  style={{ width: "100%", maxWidth: "170px" }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span
                    style={{
                      color: "#F8C720",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                      fontSize: "20px",
                    }}
                  >
                    EFFICIENT
                  </span>
                </div>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16.5px",
                    textAlign: "justify",
                    color: "#2C2828",
                    mr: 3,
                    ml: 3,
                    mt: 1,
                  }}
                >
                  e-AEPA enhances efficiency by automating tedious tasks,
                  allowing more time for critical decision-making.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={accuracyImg}
                  alt="Accuracy"
                  style={{ width: "100%", maxWidth: "210px" }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span
                    style={{
                      color: "#F8C720",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                      fontSize: "20px",
                    }}
                  >
                    ACCURACY
                  </span>
                </div>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16.5px",
                    textAlign: "justify",
                    color: "#2C2828",
                    mr: 3,
                    ml: 3,
                    mt: 1,
                  }}
                >
                  By reducing human error, our platform ensures accurate and
                  reliable performance evaluations.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={transparencyImg}
                  alt="Transparency"
                  style={{ width: "100%", maxWidth: "320px" }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span
                    style={{
                      color: "#F8C720",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                      fontSize: "20px",
                    }}
                  >
                    TRANSPARENCY
                  </span>
                </div>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16.5px",
                    textAlign: "justify",
                    color: "#2C2828",
                    mr: 3,
                    ml: 3,
                    mt: 1,
                  }}
                >
                  Our system promotes transparency, making the evaluation
                  process clear and understandable for all employees.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5 }} />

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              fontWeight: "bold",
              textAlign: "center",
              color: "#8C383E",
              mb: 8,
            }}
          >
            LEARN E-AEPA EVALUATION WITH 3 EASY STEPS:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} mb={10}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={evaluate}
                  alt="Step 1"
                  style={{ width: "100%", maxWidth: "165px" }}
                />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    textAlign: "justify",
                    padding: "0 20px 0 20px",
                    color: "#2C2828",
                    mt: 2,
                  }}
                >
                  <span
                    style={{
                      color: "#8C383E",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    {" "}
                    Step 1:
                  </span>{" "}
                  Navigate to the Take Evaluation tab.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={select}
                  alt="Step 2"
                  style={{ width: "100%", maxWidth: "140px" }}
                />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    textAlign: "justify",
                    color: "#2C2828",
                    mt: 2,
                    padding: "0 20px 0 20px",
                  }}
                >
                  <span
                    style={{
                      color: "#8C383E",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    {" "}
                    Step 2:
                  </span>{" "}
                  Either select Self or Peer Evaluation. You can decide which
                  response to provide first.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={done}
                  alt="Step 3"
                  style={{ width: "100%", maxWidth: "150px" }}
                />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    textAlign: "justify",
                    color: "#2C2828",
                    padding: "0 20px 0 20px",
                    mt: 2,
                  }}
                >
                  <span
                    style={{
                      color: "#8C383E",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    {" "}
                    Step 3:
                  </span>{" "}
                  Make sure that every field is filled out correctly, then send
                  in your assessment. This concludes your participation.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Button
          sx={{
            width: "130px",
            height: "35px",
            backgroundColor: "#8C383E",
            "&:hover": {
              backgroundColor: "#7C2828",
            },
            fontFamily: "poppins",
          }}
          variant="contained"
          onClick={handleOpenModal}
        >
          Manage S.Y.
        </Button>
      </Box>
      <SchoolYearModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
      />
    </Animated>
  );
}

export default UserHome;
