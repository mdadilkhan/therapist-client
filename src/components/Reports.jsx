import { useState, useEffect, createContext, lazy, Suspense } from "react";
const Navbar = lazy(() => import("./Navbar"));

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ViewReport from '../assets/ViewReportICon.svg'
import DummyReport from "../assets/dummyreport.jpg"

import {
  Grid,
  Card,
  Paper,
  TableBody,
  TableContainer,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { getReportType } from "../constant/constatnt";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const columns = [
  {
    id: "Client No",
    align: "right",
  },
  {
    id: "Client Name",
    align: "right",
  },
  {
    id: "Report Type",
    align: "right",
  },
  {
    id: "Sent to",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "View Report",
    align: "right",
  },

];

const rows = [
  {
    'Client Id': 1,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 2,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 3,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 4,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 5,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 6,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 7,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 8,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 9,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 10,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 11,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 12,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 13,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 14,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 15,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Principal",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 16,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Sent to": "Teacher",
    Date: "09/10/2023",
    "View Report": "View",
  },

];

const received_columns = [
  {
    id: "Client Id",
    align: "right",
  },
  {
    id: "Client Name",
    align: "right",
  },
  {
    id: "Report Type",
    align: "right",
  },
  {
    id: "Received From",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "View Report",
    align: "right",
  },
];
const received_rows = [
  {
    'Client Id': 1,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 2,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 3,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },

  {
    'Client Id': 4,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 5,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 6,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 7,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 8,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 9,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 11,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 12,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 13,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 14,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 15,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 16,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
  {
    'Client Id': 17,
    "Client Name": "Adil",
    "Report Type": "596149",
    "Received From": "Sage Turtle",
    Date: "09/10/2023",
    "View Report": "View",
  },
];

const Reports = () => {



  const [value, setValue] = useState("1");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [givenReport, setGivenReport] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [openDialogs, setOpenDialogs] = useState(Array(givenReport.length).fill(false));

  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeReceivedIndex, setActiveReceivedIndex] = useState(-1);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleClickReceived = (index) => {
    setActiveReceivedIndex(index === activeReceivedIndex ? -1 : index);
  }

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleOpenView = (index) => {
    setOpenDialogs((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = true;
      return newOpenDialogs;
    });
  };

  const handleCloseView = (index) => {
    setOpenDialogs((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = false;
      return newOpenDialogs;
    });
  };

  const getGivenReport = () => {
    const userId = window.localStorage.getItem("userId");
    let formData = new FormData();
    formData.append("m_user_id", userId);
    axios
      .post(
        "https://onekeycare.com/smportal/Counsellor_Api/given_report",
        formData
      )
      .then((res) => {
        const temp = res.data.data;
        if (res.data.response == "success") {
          setGivenReport(temp);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  useEffect(() => {
    getGivenReport();
  }, [])

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <h5 className="h5-bold">Reports</h5>
        <div style={{ marginTop: "24px" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, width: "200px" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Given"
                  value="1"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      fontSize: "16px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                      "@media (max-width: 640px)": {
                        fontSize: "16px",
                      },
                    },
                  }}
                />
                <Tab
                  label="Recieved"
                  value="2"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      fontSize: "16px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                      "@media (max-width: 640px)": {
                        fontSize: "16px",
                      },
                    },
                  }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              {viewportWidth >= 640 ? (
                <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(givenReport) && givenReport.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        ).map((row, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              sx={{ padding: "16px" }}
                            >
                              <TableCell align="left" className="body3-reg">
                                {row.m_student_id}
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                {row.m_student_name}
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                {getReportType(+row.mb_type)}
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                {row.mb_sent_to}
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                {row.mb_added_on}
                              </TableCell>

                              <TableCell align="left" className="body3-reg">
                                <Button
                                  sx={{
                                    display: "flex",
                                    width: "100px",
                                    padding: "4px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexShrink: 0,
                                    borderRadius: "4px",
                                    background: "#F4EDFF",
                                    '&:hover': {
                                      background: '#F4EDFF',
                                    },
                                  }}
                                  onClick={() => handleOpenView(index)}
                                >
                                  <img src={ViewReport} alt="" />
                                  <span
                                    style={{
                                      color: "#1D2900",
                                      textAlign: "center",
                                      fontFamily: "Nunito",
                                      fontSize: "16px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "24px",
                                      letterSpacing: "0.08px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    View
                                  </span>
                                </Button>
                                <Dialog
                                  open={openDialogs[index]}
                                  onClose={() => handleCloseView(index)}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <div
                                    style={{ width: "100%", padding: "16px" }}
                                  >
                                    <img
                                      className="w-full"
                                      src={row.mb_attach_file ? `https://onekeycare.com/smportal/uploads/briefrep/${row.mb_attach_file}` : DummyReport}
                                      alt=""
                                    />
                                  </div>

                                  <DialogActions>
                                    <Button
                                      onClick={() => handleCloseView(index)}
                                      autoFocus
                                      sx={{
                                        display: "flex",
                                        color: "#FCFCFC",
                                        width: "100px",
                                        padding: "8px 8px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexShrink: 0,
                                        borderRadius: "4px",
                                        background: "#614298",
                                        '&:hover': {
                                          background: '#614298',
                                        },
                                      }}
                                    > Close
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={givenReport.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Show:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count} items`
                    }
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTablePagination-input": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTablePagination-select": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTypography-root": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                    }}
                  />
                </Paper>) : (
                <div>
                  {Array.isArray(givenReport) && givenReport.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((item, index) => (
                    <div key={index}>
                      <div
                        className="flex justify-between cursor-pointer items-center"
                        onClick={() => handleClick(index)}
                      >
                        <div className="w-full px-2 py-3 flex flex-row justify-between">
                          <div className="body3-sem w-[50%]">Client Name</div>
                          <div className="body3-reg pr-2 w-[50%]">
                            {item.m_student_name}
                          </div>
                        </div>
                        {index === activeIndex ? (
                          <KeyboardArrowUpIcon fontSize="large" />
                        ) : (
                          <KeyboardArrowDownIcon fontSize="large" />
                        )}
                      </div>
                      {index === activeIndex && (
                        <div className="w-full flex flex-col justify-between">
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Client ID</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item.m_student_id}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Report Type</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {getReportType(+item.mb_type)}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Send To</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item.mb_sent_to}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Date</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item.mb_added_on}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3">
                            <div className="body3-sem w-[50%]">View Report</div>
                            <Button
                              sx={{
                                display: "flex",
                                width: "100px",
                                padding: "4px 8px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                flexShrink: 0,
                                borderRadius: "4px",
                                background: "#F4EDFF",
                                '&:hover': {
                                  background: '#F4EDFF',
                                },
                              }}
                              onClick={() => handleOpenView(index)}
                            >
                              <img src={ViewReport} alt="" />
                              <span
                                style={{
                                  color: "#1D2900",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "16px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "24px",
                                  letterSpacing: "0.08px",
                                  textTransform: "capitalize",
                                }}
                              >
                                View
                              </span>
                            </Button>
                            <Dialog
                              open={openDialogs[index]}
                              onClose={() => handleCloseView(index)}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <div
                                style={{ width: "100%", padding: "16px" }}
                              >
                                <img
                                  className="w-full"
                                  src={row.mb_attach_file ? `https://onekeycare.com/smportal/uploads/briefrep/${row.mb_attach_file}` : DummyReport}
                                  alt=""
                                />
                              </div>

                              <DialogActions>
                                <Button
                                  onClick={() => handleCloseView(index)}
                                  autoFocus
                                  sx={{
                                    display: "flex",
                                    color: "#FCFCFC",
                                    width: "100px",
                                    padding: "8px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexShrink: 0,
                                    borderRadius: "4px",
                                    background: "#614298",
                                    '&:hover': {
                                      background: '#614298',
                                    },
                                  }}
                                >
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </div>
                      )}
                      <hr className="h-0.5 text-[#D9D9D9]" />
                    </div>
                  ))}
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={givenReport.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Show:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count} items`
                    }
                  />
                </div>
              )}
            </TabPanel>
            <TabPanel value="2">
              {viewportWidth >= 640 ? (
                <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {received_columns.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(received_rows) && received_rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                          .map((row) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                                sx={{ padding: "16px" }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  {row["Client Id"]}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row["Client Name"]}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row["Report Type"]}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row["Received From"]}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row.Date}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <Button
                                    sx={{
                                      display: "flex",
                                      width: "100px",
                                      padding: "4px 8px",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: "10px",
                                      flexShrink: 0,
                                      borderRadius: "4px",
                                      background: "#F4EDFF",
                                      '&:hover': {
                                        background: '#F4EDFF',
                                      },
                                    }}
                                  >
                                    <img src={ViewReport} alt="" />
                                    <span
                                      style={{
                                        color: "#1D2900",
                                        textAlign: "center",
                                        fontFamily: "Nunito",
                                        fontSize: "16px",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        lineHeight: "24px",
                                        letterSpacing: "0.08px",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {row["View Report"]}
                                    </span>
                                  </Button>
                                </TableCell>

                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={received_rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Show:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count} items`
                    }
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTablePagination-input": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTablePagination-select": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                      "& .MuiTypography-root": {
                        color: "var(--Black, #06030D)",
                        fontFamily: "Nunito",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "0.08px",
                      },
                    }}
                  />
                </Paper>) : (
                <div>
                  {Array.isArray(received_rows) && received_rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((item, index) => (
                    <div key={index}>
                      <div
                        className="flex justify-between cursor-pointer items-center"
                        onClick={() => handleClickReceived(index)}
                      >
                        <div className="w-full px-2 py-3 flex flex-row justify-between">
                          <div className="body3-sem w-[50%]">Client</div>
                          <div className="body3-reg pr-2 w-[50%]">
                            {item["Client Name"]}
                          </div>
                        </div>
                        {index === activeReceivedIndex ? (
                          <KeyboardArrowUpIcon fontSize="large" />
                        ) : (
                          <KeyboardArrowDownIcon fontSize="large" />
                        )}
                      </div>
                      {index === activeReceivedIndex && (
                        <div className="w-full flex flex-col justify-between">
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Client ID</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item["Client Id"]}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Report Type</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item["Report Type"]}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Received From</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item["Received From"]}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[50%]">Date</div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item.Date}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3">
                            <div className="body3-sem w-[50%]">View Report</div>
                            <Button
                              sx={{
                                display: "flex",
                                width: "100px",
                                padding: "4px 8px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                flexShrink: 0,
                                borderRadius: "4px",
                                background: "#F4EDFF",
                                '&:hover': {
                                  background: '#F4EDFF',
                                },
                              }}
                            >
                              <img src={ViewReport} alt="" />
                              <span
                                style={{
                                  color: "#1D2900",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "16px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "24px",
                                  letterSpacing: "0.08px",
                                  textTransform: "capitalize",
                                }}
                              >
                                View
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                      <hr className="h-0.5 text-[#D9D9D9]" />
                    </div>
                  ))}
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={received_rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Show:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count} items`
                    }
                  />
                </div>
              )}
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </>
  )
}


export default Reports