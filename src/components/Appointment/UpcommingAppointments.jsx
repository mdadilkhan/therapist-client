import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThreeDot from "../../assets/ThreeDot.svg";
import Calendar from "../../assets/Calendar.svg";
import Cancel from "../../assets/Cancel.svg";
import CancelPopup from "../../assets/CancelPopup.svg";
import {
  Box,
  Paper,
  TableBody,
  TableContainer,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Popover,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  getBookingType,
  getformatedDate,
  getJoinMeet,
} from "../../constant/constatnt";
import { API_URL } from "../../constant/ApiConstant";
import { useSelector } from "react-redux";

const columns = [
  {
    id: "Appointment Id",
    align: "right",
  },
  {
    id: "Client Name",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "Time",
    align: "right",
  },
  {
    id: "Type",
    align: "right",
  },
  {
    id: "Duration",
    align: "right",
  },
  {
    id: "Status",
    align: "right",
  },
  {
    id: "Payment",
    align: "right",
  },
  {
    id: "Mode",
    align: "right",
  },
  {
    id: "Action",
    align: "center",
  },
];
const paymentStatus = {
  0: "Unpaid",
  1: "Paid",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Refer to Sage":
      return { backgroundColor: "#f2f2f2", color: "#635b73" };
    case "Complete":
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case "Pending":
      return { backgroundColor: "#F4EDFF", color: "#614298" };
    case "Join Meet":
      return { backgroundColor: "#614298", color: "#FCFCFC" };
    case "Cancelled":
      return { backgroundColor: "#F8DDDF", color: "#500000" };
    case "Paid":
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case "Unpaid":
      return { backgroundColor: "#F8DDDF", color: "#500000" };
    default:
      return { backgroundColor: "white", color: "black" };
  }
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const UpcommingAppointment = () => {
  const userDetails = useSelector((state) => state.userDetails);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState("1");
  // const [appointmentList, setOldAppointment] = useState([]);
  const [appointmentList, SetAppointmentList] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [anchorThree, setAnchorThree] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const navigate = useNavigate();
  const handleThreeDotClicked = (event, appId) => {
    setModalData(appId);
    setAnchorThree(event.target);
  };

  const handleClose = () => {
    setAnchorThree(null);
  };

  const openThree = Boolean(anchorThree);
  const ids = openThree ? "qwerty" : undefined;

  const [activeIndex, setActiveIndex] = useState(-1);
  const [cancelId, setCancelId] = useState("");

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id) => {
    setCancelId(id);
    setOpenModal(true);
    setAnchorThree(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const newAppointmentList = () => {
    axios
      .post(`${API_URL}/getUpcomingAppointments`, {
        type: value == "2" ? "session" : "preconsultation",
        therapistID: userDetails._id,
      })
      .then((res) => {
        if (res.status == 200) {
          SetAppointmentList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  useEffect(() => {
    SetAppointmentList([])
    newAppointmentList();
  }, [value]);

  const oldAppointmentStatus = {
    1: "Pending",
    2: "Complete",
    3: "Refer to Sage",
    4: "Join Meet",
    5: "Cancelled",
  };

  const handleCancelAppointment = () => {
    axios
      .post(`${API_URL}/cancelAppointmentByTherapist`, { app_id: modalData })
      .then((res) => {
        if (res.status == 200) {
          newAppointmentList();
          handleCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <>
      <div className="p-6 md:p-8">
        <h5 className="h5-bold">Appointments</h5>

        <div style={{ marginTop: "24px" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, width: "280px" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Preconsultation"
                  value="1"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media screen and (min-width: 641px)": {
                      fontSize: "20px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                    },
                  }}
                />
                <Tab
                  label="Sessions"
                  value="2"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media screen and (min-width: 641px)": {
                      fontSize: "20px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
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
                        {Array.isArray(appointmentList) &&
                          appointmentList
                            .slice(
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
                                  sx={{ padding: "16px", cursor: "pointer" }}
                                  onClick={() => {
                                    navigate(
                                      `/therapist/appointment/appointmentdetails/${row?._id}`
                                    );
                                  }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div style={{ textDecoration: "none" }}>
                                      {row?.appointment_no ? row?.appointment_no : "APT00000"}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.userDetails?.name}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {getformatedDate(row.booking_date)}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.booking_slots[0].m_schd_from}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row.booking_type}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row.booking_duration} Min</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px",
                                        border: "none",
                                        width: "100px",
                                        cursor: getJoinMeet(row)
                                          ? "pointer"
                                          : "default",
                                        background: getJoinMeet(row)
                                          ? getStatusColor("Join Meet")
                                              .backgroundColor
                                          : getStatusColor(
                                              oldAppointmentStatus[
                                                row.booking_status
                                              ]
                                            ).backgroundColor,
                                        color: getJoinMeet(row)
                                          ? getStatusColor("Join Meet").color
                                          : getStatusColor(
                                              oldAppointmentStatus[
                                                row.booking_status
                                              ]
                                            ).color,
                                      }}
                                      onClick={(event) => {
                                        if (getJoinMeet(row)) {
                                          event.stopPropagation();
                                          let meetLink = row.meet_link;
                                          if (
                                            !meetLink.startsWith("https://")
                                          ) {
                                            meetLink = "https://" + meetLink;
                                          }
                                          window.open(meetLink);
                                        }
                                      }}
                                    >
                                      {getJoinMeet(row)
                                        ? "Join Meet"
                                        : oldAppointmentStatus[
                                            row.booking_status
                                          ]}
                                    </button>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px 24px",
                                        border: "none",
                                        width: "100px",
                                        cursor:
                                          row.booking_status == 4
                                            ? "pointer"
                                            : "default",
                                        background: getStatusColor(
                                          paymentStatus[row?.payment_status]
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          paymentStatus[row?.payment_status]
                                        ).color,
                                      }}
                                    >
                                      {paymentStatus[row?.payment_status]}
                                    </button>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.payment_status == 0
                                        ? "NILL"
                                        : row?.payment_mode}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <img
                                      src={ThreeDot}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleThreeDotClicked(event, row._id);
                                      }}
                                    />

                                    <Popover
                                      id={ids}
                                      open={openThree}
                                      anchorEl={anchorThree}
                                      onClose={(event) => {
                                        event.stopPropagation();
                                        handleClose();
                                      }}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                      }}
                                    >
                                      <div className="w-[190px] h-[35px] mx-4 my-5 flex flex-col justify-between ">
                                        <div
                                          className="flex justify-start pl-4"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenModal(row._id);
                                          }}
                                        >
                                          <img src={Cancel} alt="" />
                                          <p className="h-[40px] flex items-center text-[#614298] text-[14px] px-6 cursor-pointer">
                                            Cancel Appoinment
                                          </p>
                                        </div>
                                      </div>
                                    </Popover>
                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={openModal}
                                      onClose={(event) => {
                                        event.stopPropagation();
                                        handleCloseModal();
                                      }}
                                      closeAfterTransition
                                      slots={{ backdrop: Backdrop }}
                                      slotProps={{
                                        backdrop: {
                                          timeout: 500,
                                          style: {
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.3)",
                                          },
                                        },
                                      }}
                                    >
                                      <Fade in={openModal}>
                                        <Box sx={style} className="text-center">
                                          <div className="flex flex-col gap-4 justify-center items-center">
                                            <img src={CancelPopup} />
                                            <h1 className="body3-sem">
                                              {" "}
                                              Are you sure you want to cancel
                                              the appointment ?{" "}
                                            </h1>
                                            <p className="ovr1-reg text-[#9A93A5] mb-6">
                                              Once the appointment status is
                                              finalized, you will not be able to
                                              make any changes!
                                            </p>
                                            <div className="w-full flex justify-end gap-4">
                                              <button
                                                className="changeStatusButton cursor-pointer w-[50%]"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCancelAppointment();
                                                }}
                                              >
                                                OK
                                              </button>
                                              <button
                                                className="changeReferCancelButton cursor-pointer w-[50%]"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCloseModal();
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </Box>
                                      </Fade>
                                    </Modal>
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
                    count={appointmentList.length}
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
                </Paper>
              ) : (
                <div>
                  {Array.isArray(appointmentList) &&
                    appointmentList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <div key={index}>
                          <div
                            className="flex justify-between cursor-pointer items-center"
                            onClick={() => handleClick(index)}
                          >
                            <div className="w-full px-2 py-3 flex flex-row justify-between">
                              <div className="body3-sem w-[50%]">Client</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?.employeeName}
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
                                <div className="body3-sem w-[50%]">
                                  Appointment No
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.appointment_no ? item?.appointment_no : "APT00000"}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Name</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.userDetails?.name}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Date</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {getformatedDate(item.booking_date)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Time</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.booking_slots[0].m_schd_from}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Type</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.booking_type}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">
                                  Duration
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.booking_duration}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <button
                                  style={{
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "6px",
                                    border: "none",
                                    width: "100px",
                                    cursor: getJoinMeet(item)
                                      ? "pointer"
                                      : "default",
                                    background: getJoinMeet(item)
                                      ? getStatusColor("Join Meet")
                                          .backgroundColor
                                      : getStatusColor(
                                          oldAppointmentStatus[
                                            item.booking_status
                                          ]
                                        ).backgroundColor,
                                    color: getJoinMeet(item)
                                      ? getStatusColor("Join Meet").color
                                      : getStatusColor(
                                          oldAppointmentStatus[
                                            item.booking_status
                                          ]
                                        ).color,
                                  }}
                                  onClick={(event) => {
                                    if (getJoinMeet(item)) {
                                      event.stopPropagation();
                                      let meetLink = item.meet_link;
                                      if (!meetLink.startsWith("https://")) {
                                        meetLink = "https://" + meetLink;
                                      }
                                      window.open(meetLink);
                                    }
                                  }}
                                >
                                  {getJoinMeet(item)
                                    ? "Join Meet"
                                    : oldAppointmentStatus[item.booking_status]}
                                </button>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <button
                                  style={{
                                    width: "100%",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "6px 24px",
                                    border: "none",
                                    background: "#9C81CC",
                                    color: "#fff",
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(
                                      `/therapist/calendar/${item?._id}`
                                    );
                                  }}
                                >
                                  Reschedule
                                </button>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <Button
                                  sx={{
                                    width: "100%",
                                    background: "#F4EDFF",
                                    color: "#7355A8",
                                    "&:hover": {
                                      background: "#7355A8",
                                      color: "#F4EDFF",
                                      border: "1px solid #614298",
                                    },
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/appointment/appointmentdetails/${item?._id}`
                                    )
                                  }
                                >
                                  View More
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
                    count={appointmentList.length}
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
                          {columns.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(appointmentList) &&
                          appointmentList
                            .slice(
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
                                  sx={{ padding: "16px", cursor: "pointer" }}
                                  onClick={() => {
                                    navigate(
                                      `/therapist/appointment/appointmentdetails/${row?._id}`
                                    );
                                  }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div style={{ textDecoration: "none" }}>
                                      {row?.appointment_no ? row?.appointment_no : "APT00000"}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.userDetails?.name}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {getformatedDate(row.booking_date)}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.booking_slots[0].m_schd_from}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row.booking_type}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row.booking_duration} Min</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px",
                                        border: "none",
                                        width: "100px",
                                        cursor: getJoinMeet(row)
                                          ? "pointer"
                                          : "default",
                                        background: getJoinMeet(row)
                                          ? getStatusColor("Join Meet")
                                              .backgroundColor
                                          : getStatusColor(
                                              oldAppointmentStatus[
                                                row.booking_status
                                              ]
                                            ).backgroundColor,
                                        color: getJoinMeet(row)
                                          ? getStatusColor("Join Meet").color
                                          : getStatusColor(
                                              oldAppointmentStatus[
                                                row.booking_status
                                              ]
                                            ).color,
                                      }}
                                      onClick={(event) => {
                                        if (getJoinMeet(row)) {
                                          event.stopPropagation();
                                          let meetLink = row.meet_link;
                                          if (
                                            !meetLink.startsWith("https://")
                                          ) {
                                            meetLink = "https://" + meetLink;
                                          }
                                          window.open(meetLink);
                                        }
                                      }}
                                    >
                                      {getJoinMeet(row)
                                        ? "Join Meet"
                                        : oldAppointmentStatus[
                                            row.booking_status
                                          ]}
                                    </button>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px 24px",
                                        border: "none",
                                        width: "100px",
                                        cursor:
                                          row.booking_status == 4
                                            ? "pointer"
                                            : "default",
                                        background: getStatusColor(
                                          paymentStatus[row?.payment_status]
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          paymentStatus[row?.payment_status]
                                        ).color,
                                      }}
                                    >
                                      {paymentStatus[row?.payment_status]}
                                    </button>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.payment_status == 0
                                        ? "NILL"
                                        : row?.payment_mode}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <img
                                      src={ThreeDot}
                                      onClick={(event) => {
                                        event.stopPropagation();

                                        handleThreeDotClicked(event, row._id);
                                      }}
                                    />
                                    <Popover
                                      id={ids}
                                      open={openThree}
                                      anchorEl={anchorThree}
                                      onClose={(event) => {
                                        event.stopPropagation();
                                        handleClose();
                                      }}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                      }}
                                    >
                                      <div className="w-[190px] h-[100px] mx-4 my-5 flex flex-col justify-between ">
                                        <div
                                          className="flex justify-start pl-4"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            navigate(
                                              `/therapist/calendar/${modalData}`
                                            );
                                          }}
                                        >
                                          <img src={Calendar} alt="" />
                                          <p className="h-[40px] text-[14px] flex items-center text-[#614298] px-6 cursor-pointer">
                                            Reschedule
                                          </p>
                                        </div>
                                        <hr className="px-4" />
                                        <div
                                          className="flex justify-start pl-4"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenModal();
                                          }}
                                        >
                                          <img src={Cancel} alt="" />
                                          <p className="h-[40px] flex items-center text-[#614298] text-[14px] px-6 cursor-pointer">
                                            Cancel Appoinment
                                          </p>
                                        </div>
                                      </div>
                                    </Popover>
                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={openModal}
                                      onClose={(event) => {
                                        event.stopPropagation();
                                        handleCloseModal();
                                      }}
                                      closeAfterTransition
                                      slots={{ backdrop: Backdrop }}
                                      slotProps={{
                                        backdrop: {
                                          timeout: 500,
                                          style: {
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.3)",
                                          },
                                        },
                                      }}
                                    >
                                      <Fade in={openModal}>
                                        <Box sx={style} className="text-center">
                                          <div className="flex flex-col gap-4 justify-center items-center">
                                            <img src={CancelPopup} />
                                            <h1 className="body3-sem">
                                              {" "}
                                              Are you sure you want to cancel
                                              the appointment ?{" "}
                                            </h1>
                                            <p className="ovr1-reg text-[#9A93A5] mb-6">
                                              Once the appointment status is
                                              finalized, you will not be able to
                                              make any changes!
                                            </p>
                                            <div className="w-full flex justify-end gap-4">
                                              <button
                                                className="changeStatusButton cursor-pointer w-[50%]"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCancelAppointment();
                                                }}
                                              >
                                                OK
                                              </button>
                                              <button
                                                className="changeReferCancelButton cursor-pointer w-[50%]"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCloseModal();
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </Box>
                                      </Fade>
                                    </Modal>
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
                    count={appointmentList.length}
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
                </Paper>
              ) : (
                <div>
                  {Array.isArray(appointmentList) &&
                    appointmentList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <div key={index}>
                          <div
                            className="flex justify-between cursor-pointer items-center"
                            onClick={() => handleClick(index)}
                          >
                            <div className="w-full px-2 py-3 flex flex-row justify-between">
                              <div className="body3-sem w-[50%]">Client</div>
                              <div className="body3-reg pr-2 w-[50%]">kaif</div>
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
                                <div className="body3-sem w-[50%]">
                                  Appointment No
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.appointment_no ? item?.appointment_no : "APT00000"}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Name</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.userDetails?.name}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Date</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {getformatedDate(item.booking_date)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Time</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?.booking_slots[0].m_schd_from}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Type</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.booking_type}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">
                                  Duration
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.booking_duration} Min
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <button
                                  style={{
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "6px",
                                    border: "none",
                                    width: "100px",
                                    cursor: getJoinMeet(item)
                                      ? "pointer"
                                      : "default",
                                    background: getJoinMeet(item)
                                      ? getStatusColor("Join Meet")
                                          .backgroundColor
                                      : getStatusColor(
                                          oldAppointmentStatus[
                                            item.booking_status
                                          ]
                                        ).backgroundColor,
                                    color: getJoinMeet(item)
                                      ? getStatusColor("Join Meet").color
                                      : getStatusColor(
                                          oldAppointmentStatus[
                                            item.booking_status
                                          ]
                                        ).color,
                                  }}
                                  onClick={(event) => {
                                    if (getJoinMeet(item)) {
                                      event.stopPropagation();
                                      let meetLink = item.meet_link;
                                      if (!meetLink.startsWith("https://")) {
                                        meetLink = "https://" + meetLink;
                                      }
                                      window.open(meetLink);
                                    }
                                  }}
                                >
                                  {getJoinMeet(item)
                                    ? "Join Meet"
                                    : oldAppointmentStatus[item.booking_status]}
                                </button>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <button
                                  style={{
                                    width: "100%",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "6px 24px",
                                    border: "none",
                                    background: "#9C81CC",
                                    color: "#fff",
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(`/calendar/${item?._id}`);
                                  }}
                                >
                                  Reschedule
                                </button>
                              </div>
                              <div className="flex flex-row flex-wrap py-3 justify-between">
                                <Button
                                  sx={{
                                    width: "100%",
                                    background: "#F4EDFF",
                                    color: "#7355A8",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/appointment/appointmentdetails/${item?._id}`
                                    )
                                  }
                                >
                                  View More
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
                    count={appointmentList.length}
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
  );
};

export default UpcommingAppointment;
