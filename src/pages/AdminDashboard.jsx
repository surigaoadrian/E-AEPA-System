import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Container } from "@mui/material";
import EvaluationStatusChart from "../components/EvaluationStatusChart";
import EmployeeStatusChart from "../components/EmployeeStatusChart";
import AccomplishmentRateChart from "../components/AccomplishmentRateChart";
import ThirdMonthCompletion from "../components/ThirdMonthCompletion";
import FifthMonthCompletion from "../components/FifthMonthCompletion";
import AnnualCompletion from "../components/AnnualCompletion";
import SchoolYearModal from "../modals/SchoolYearModal";
import Button from "@mui/material/Button";
import EligibleEvaluators from '../components/EligibleEvaluators';

function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [showEligibleEvaluators, setShowEligibleEvaluators] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, "MMMM dd, yyyy | EEEE");
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('AdminDashboard/EligibleEvaluators')) {
        setShowEligibleEvaluators(false);
        navigate('/AdminDashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleShowEligibleEvaluators = () => {
    navigate('/AdminDashboard/EligibleEvaluators');
    setShowEligibleEvaluators(true);
  }
  //adi codes
  const [openSYModal, setOpenSYModal] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [openAddSY, setOpenAddSY] = useState(false);
  const [openEditView, setOpenEditView] = useState(false);

  const handleOpenEditView = () => {
    setOpenEditView(true);
  };

  const handleCloseEditView = () => {
    setOpenEditView(false);
  };

  const handleOpenSYModal = () => {
    setOpenSYModal(true);
  };

  const handleCloseSYModal = () => {
    setOpenSYModal(false);
    setIsOpenView(false);
    setOpenEditView(false);
  };

  const handleOpenView = () => {
    setIsOpenView(true);
  };

  const handleCloseView = () => {
    setIsOpenView(false);
    setOpenEditView(false);
  };

  const handleOpenAddSY = () => {
    setOpenAddSY(true);
  };

  const handleCloseAddSY = () => {
    setOpenAddSY(false);
    setOpenEditView(false);
  };

  return (
    <Container maxWidth="120px" sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bolder" fontFamily="Poppins">
          Dashboard
        </Typography>
        {/* <Typography variant="h7" fontFamily="Poppins">{currentDate}</Typography> */}
        <Button
          onClick={handleOpenSYModal}
          sx={{
            width: "10%",
            backgroundColor: "#8C383E",
            "&:hover": {
              backgroundColor: "#7C2828",
            },
            fontFamily: "poppins",
          }}
          variant="contained"
        >
          Manage S.Y.
        </Button>
      </Box>

      {showEligibleEvaluators ? (
        <EligibleEvaluators />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
                <Typography sx={{ textAlign: 'center', fontWeight: 500 }} fontSize={13} gutterBottom fontFamily="Poppins">Evaluation Status for 3rd and 5th Month</Typography>
                <Box
                  sx={{
                    height: 150,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 1,
                  }}
                >
                  <EvaluationStatusChart />
                </Box>
              </Paper>
            </Grid>
            <Grid item container spacing={2} xs={12} md={6} lg={6}>
              <Grid item xs={4}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">3rd Evaluation Completion</Typography>
                  <Box
                    sx={{
                      height: 92,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <ThirdMonthCompletion />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">5th Evaluation Completion</Typography>
                  <Box
                    sx={{
                      height: 92,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      <FifthMonthCompletion />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">Annual Evaluation Completion</Typography>
                  <Box
                    sx={{
                      height: 92,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <AnnualCompletion />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Box sx={{ display: 'flex'}}>
                <Button
                  onClick={handleShowEligibleEvaluators}
                  sx={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    height: '190px',
                    backgroundColor: '#8C383E',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.1px',
                    textAlign: 'center',
                    fontSize: '14px',
                    textTransform: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#6C2A2E',
                    },
                    marginRight: '3px',
                  }}
                >
                Eligible Evaluators
                </Button>
                <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)', flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 500 }} fontSize={20} gutterBottom fontFamily="Poppins">Employee Status</Typography>
                  <Box
                    sx={{
                      height: 338,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <EmployeeStatusChart />
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={6} sx={{ marginTop: '-23px' }}>
              <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
                <AccomplishmentRateChart />
              </Paper>
            </Grid>
            <SchoolYearModal
          openModal={openSYModal}
          handleCloseModal={handleCloseSYModal}
          isOpenView={isOpenView}
          handleOpenView={handleOpenView}
          handleCloseView={handleCloseView}
          openAddSY={openAddSY}
          setOpenAddSY={setOpenAddSY}
          handleOpenAddSY={handleOpenAddSY}
          handleCloseAddSY={handleCloseAddSY}
          openEditView={openEditView}
          handleOpenEditView={handleOpenEditView}
          handleCloseEditView={handleCloseEditView}
        />
          </Grid>
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;
