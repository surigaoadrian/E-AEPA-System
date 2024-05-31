import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, Menu, } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";

import Fade from '@mui/material/Fade';

function EvaluateEmployee() {
    const [rows, setRows] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);
    const [updateFetch, setUpdateFetch] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/user/getAllUser");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

                const processedData = data
                    .filter((item) => item.role === "EMPLOYEE")
                    .map((item) => ({
                        ...item,
                        name: `${item.fName} ${item.lName}`,
                        userID: item.userID,
                    }));

                setRows(processedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [updateFetch]);


    const columnsEmployees = [
        {
            id: "workID",
            label: "ID Number",
            align: "center",
            minWidth: 150,
        },
        {
            id: "name",
            label: "Name",
            minWidth: 170,
            align: "center",
            format: (value) => formatName(value),
        },


        {
            id: "position",
            label: "Position",
            minWidth: 150,
            align: "center",
            format: (value) => (value ? value.toLocaleString("en-US") : ""),
        },
        {
            id: "probeStatus",
            label: "Evaluation Period",
            minWidth: 150,
            align: "center",
            format: (value) => {
                if (value === "") {
                    return "Annually";
                } else {
                    return value.toLocaleString("en-US");
                }
            },
        },

        {
            id: "actions",
            label: "Action",
            minWidth: 150,
            align: "center",
            format: (value, row) => {
                return (
                    <div>
                        <Button id="fade-button"
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined} sx={{
                                color: '#8c383e',
                                fontSize: '.9em', "&:hover": { color: "red", },
                            }}
                            onClick={handleClick}
                            style={{ textTransform: "none", }} startIcon={<FontAwesomeIcon icon={faFileLines} style={{ fontSize: ".8rem", }} />}>
                            Evaluate
                        </Button>
                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem sx={{ fontSize: '.8em', fontFamily: 'Poppins' }} onClick={handleClose}>Stage 1: H-VBPA </MenuItem> {/* igka click mo gawas ang evaluation  */}
                            <MenuItem disabled sx={{ fontSize: '.8em', fontFamily: 'Poppins' }} onClick={handleClose}>Stage 2: H-JBPA </MenuItem> {/* so disabled siya if wa pa nahoman ang stage 1, din if mana sd si stage 1 dapat mo disable si 1  */}
                        </Menu>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <Animated>
                <Typography ml={6.5} mt={3} sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}>User Accounts</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { ml: 6, mt: 0.1, width: "93.5%" }, }}>
                    <Grid container spacing={1.5} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", }}>


                        <Paper elevation={1} sx={{ borderRadius: "5px", width: "100%", height: "32em", backgroundColor: "transparent", mt: '.2%' }}>
                            <TableContainer sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%", }} >
                                <Table stickyHeader aria-label="sticky table" size="small">
                                    <TableHead sx={{ height: "2em" }}>
                                        <TableRow>
                                            {columnsEmployees.map((column) => (
                                                <TableCell sx={{
                                                    fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: "bold", maxWidth: "2em",
                                                }} key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>{column.label}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow sx={{ bgcolor: 'white', "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", color: "black", }, }} key={row.id}>
                                                {columnsEmployees.map((column) => (
                                                    <TableCell sx={{ fontFamily: "Poppins", }} key={`${row.id}-${column.id}`} align={column.align}>
                                                        {column.id === "name" ? row.name : column.id === "actions" ? column.format ? column.format(row[column.id], row) : null : column.format ? column.format(row[column.id]) : row[column.id]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </Grid>
                </Box>
            </Animated>
        </div>
    );
}

export default EvaluateEmployee;



