import { useState, useEffect, createContext, lazy, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ViewReportIcon from "../assets/ViewReportICon.svg";
import logo from '../assets/logo.png'
import cross from '../assets/cross.svg'
import {
  Box,
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
  Modal,
  Fade,
  Backdrop,
  DialogActions,
  TextField,
  Popover,
} from "@mui/material";
import ThreeDot from "../assets/ThreeDot.svg";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Calendar from "../assets/Calendar.svg";
import Cancel from "../assets/Cancel.svg";
import CancelPopup from "../assets/CancelPopup.svg";
import { API_URL } from "../constant/ApiConstant";
import {
  convertTo12HourFormat,
  getBookingType,
  getformatedDate,
  getJoinMeet,
} from "../constant/constatnt";
import Rect from "../assets/Rectangle.svg";
import getMatched from "../assets/GetMatched.svg";

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
    default:
      return { backgroundColor: "white", color: "black" };
  }
};

const oldAppointmentStatus = {
  1: "Pending",
  2: "Complete",
  3: "Refer to Sage",
  4: "Join Meet",
  5: "Cancelled",
};
const received_columns = [
  {
    id: "Date",
    align: "right",
  },
  {
    id: "Title",
    align: "right",
  },
  {
    id: "Dosage",
    align: "right",
  },
  {
    id: "Instruction",
    align: "right",
  },
  {
    id: "Description",
    align: "right",
  },
];

const sageColumn = [
  {
    id: "Therapist",
    align: "right",
  },
  {
    id: "Appointment no.",
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
    id: "Consultation",
    align: "right",
  },
  {
    id: "Payment",
    align: "right",
  },
  {
    id: "invoice",
    align: "right",
  },
];

const columns = [
  {
    id: "Therapist Name",
    align: "right",
  },
  {
    id: "Appointment Id",
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
    id: "Consultation",
    align: "right",
  },
  {
    id: "Payment",
    align: "right",
  },
  {
    id: "Action",
    align: "right",
  },
];

// const dummydata = [
//   {
//     id: "1",
//     therapist_id: "THR1234567890",
//     _id: "APT1234567890",
//     employee_name: "John Doe",
//     booking_date: "2023-08-18T10:00:00Z",
//     booking_slots: [
//       {
//         m_schd_from: "10:00 AM",
//       },
//     ],
//     booking_type: "online",
//     booking_duration: 60,
//     booking_status: 4,
//   },
//   {
//     id: "2",
//     therapist_id: "THR0987654321",
//     _id: "APT0987654321",
//     employee_name: "Jane Smith",
//     booking_date: "2023-08-19T11:00:00Z",
//     booking_slots: [
//       {
//         m_schd_from: "11:00 AM",
//       },
//     ],
//     booking_type: "in-person",
//     booking_duration: 45,
//     booking_status: 2,
//   },
//   {
//     id: "3",
//     therapist_id: "THR5678901234",
//     _id: "APT5678901234",
//     employee_name: "Emily Brown",
//     booking_date: "2023-08-20T09:30:00Z",
//     booking_slots: [
//       {
//         m_schd_from: "09:30 AM",
//       },
//     ],
//     booking_type: "online",
//     booking_duration: 30,
//     booking_status: 3,
//   },
// ];

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

const ClientDashboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState("1");
  const [appointmentList, setAppointmentList] = useState([]);
  const [inHouseAppointmentList, setInHouseAppointmentList] = useState([]);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [openDescriptions, setOpenDescriptions] = useState(
    Array(prescriptionList.length).fill(false)
  );
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [anchorThree, setAnchorThree] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const openThree = Boolean(anchorThree);
  const ids = openThree ? "qwerty" : undefined;
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const handleThreeDotClicked = (event) => {
    setAnchorThree(event.target);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
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

  const navigate = useNavigate();

  const handleCancelAppointment = (appId) => {
    axios
      .post(`${API_URL}/cancelAppointment`, { app_id: appId })
      .then((res) => {
        if (res.status === 200) {
          getAllInhouseAppointment();
          AppointmentList();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleDescriptionOpen = (index) => {
    setOpenDescriptions((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = true;
      return newOpenDialogs;
    });
  };

  const handleDescriptionClose = (index) => {
    setOpenDescriptions((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = false;
      return newOpenDialogs;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const AppointmentList = () => {
    axios
      .get(`${API_URL}/getAllAppointmentsByType/${"session"}`)
      .then((res) => {
        if (res.status === 200) {
          setAppointmentList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getPrescriptionList = () => {
    axios
      .get(`${API_URL}/getAllPrescriptionsByUser`)
      .then((res) => {
        if (res.status === 200) {
          setPrescriptionList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const getAllInhouseAppointment = () => {
    axios
      .get(`${API_URL}/getAllAppointmentsByType/${"preconsultation"}`)
      .then((res) => {
        if (res.status == 200) {
          setInHouseAppointmentList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    AppointmentList();
    getAllInhouseAppointment();
    getPrescriptionList();
  }, []);

  const handleClose = () => {
    setAnchorThree(null);
  };

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  return (
    <>
      <h1 className="h5-bold mx-[32px] mt-5">Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-[15px]">
        <div className="flex w-[564px] p-4 items-start gap-[14px] sm:w-[45%] h-[335px] sm:h-[174px] rounded-[15px] bg-[#ECFFBF] shadow-custom ml-[32px] my-0 sm:my-8  sm:flex-row flex-col  px-4 py-6">
          <div className="flex items-center gap-12 h-full">
            <img
              src={getMatched}
              alt=""
              className="w-[181px] flex-shrink-0 self-stretch rounded-[8px]"
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 h-full">
            <div className="flex flex-col gap-2">
            <h1 className="h6-bold hidden sm:block">Get Matched</h1>
              <h1 className="ovr1-reg">
                Preliminary consultation, help us find the perfect therapist for
                you
              </h1>
            </div>
            <button
            className="w-[123px] h-[48px] bg-[#614298] rounded-[8px] border-none text-[#fff] p1-reg cursor-pointer flex px-5 py-4 justify-center items-center gap-2"
            onClick={() => navigate("/client/appointments")}
          >
            Book Now
          </button>
          </div>
        </div>
        <div className="flex w-[564px] p-4 items-start gap-[14px] sm:w-[45%] h-[335px] sm:h-[174px] rounded-[15px] bg-[#F4EDFF] shadow-custom ml-[32px] my-0 sm:my-8  sm:flex-row flex-col  px-4 py-6">
          <div className="flex items-center gap-12 h-full">
            <img
              src={Rect}
              alt=""
              className="w-[181px] flex-shrink-0 self-stretch rounded-[8px]"
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 h-full">
            <div className="flex flex-col gap-2">
            <h1 className="h6-bold hidden sm:block">Find Therapist </h1>
              <h1 className="ovr1-reg">
                Select from wide range of professional
              </h1>
            </div>
            <button
            className="w-[123px] h-[48px] bg-[#614298] rounded-[8px] border-none text-[#fff] p1-reg cursor-pointer"
            onClick={() => navigate("/client/therapist-list")}
          >
            Book Now
          </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "24px" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, width: "100%" }}>
            <TabList
              onChange={handleChange}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Tab
                label="  Preconsultation Appointment"
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
                  "&.Mui-selected": {
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    borderBottom: "4px solid #614298",
                  },
                }}
              />
              <Tab
                label="Session Appointment"
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
                  "&.Mui-selected": {
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    borderBottom: "4px solid #614298",
                  },
                }}
              />
              <Tab
                label="Prescriptions"
                value="3"
                sx={{
                  color: "#06030D",
                  fontFamily: "Quicksand",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "normal",
                  letterSpacing: "0.1px",
                  textTransform: "capitalize",
                  "&.Mui-selected": {
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    borderBottom: "4px solid #614298",
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
                      {Array.isArray(inHouseAppointmentList) &&
                        inHouseAppointmentList.length > 0 &&
                        inHouseAppointmentList
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
                                key={row?.id}
                                sx={{ padding: "16px", cursor: "pointer" }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  <div style={{ textDecoration: "none" }}>
                                    {row?.therapist_name}
                                  </div>
                                </TableCell>
                                {/* one is therapist id and another for appointment id */}
                                <TableCell align="left" className="body3-reg">
                                  <div style={{ textDecoration: "none" }}>
                                    {row?._id?.slice(-10)}
                                  </div>
                                </TableCell>

                                {/* <TableCell align="left" className="body3-reg">
                                  <div>{row?.employee_name}ss</div>
                                </TableCell> */}
                                <TableCell align="left" className="body3-reg">
                                  <div>{getformatedDate(row.booking_date)}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {convertTo12HourFormat(
                                    row?.booking_slots?.[0]?.m_schd_from
                                  )}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.booking_type}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.booking_duration} Min</div>
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
                                        if (!meetLink.startsWith("https://")) {
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
                                  <div>
                                    {row?.payment_mode
                                      ? row?.payment_mode
                                      : "NILL"}
                                  </div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <img
                                    src={ThreeDot}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if(row.booking_status != 5){
                                        handleThreeDotClicked(event);
                                      }
                                    }}
                                  />
                                </TableCell>
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
                                    {/* <div
                                      className="flex justify-start pl-4"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(
                                          `/client/appointments/therapist?therapistId=${row?.therapist_id}&&appointmentId=${row?._id}&&type=pre`
                                        );
                                      }}
                                    >
                                      <img src={Calendar} alt="" />
                                      <p className="h-[40px] text-[14px] flex items-center text-[#614298] px-6 cursor-pointer">
                                        Reschedule
                                      </p>
                                    </div>
                                    <hr className="px-4" /> */}
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
                                    handleClose();
                                  }}
                                  closeAfterTransition
                                  slots={{ backdrop: Backdrop }}
                                  slotProps={{
                                    backdrop: {
                                      timeout: 500,
                                      style: {
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                      },
                                    },
                                  }}
                                >
                                  <Fade in={openModal}>
                                    <Box
                                      sx={style}
                                      className="text-center"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                    >
                                      <div className="flex flex-col gap-4 justify-center items-center">
                                        <img src={CancelPopup} />
                                        <h1 className="body3-sem">
                                          {" "}
                                          Are you sure you want to cancel the
                                          appointment ?{" "}
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
                                              handleCancelAppointment(row?._id);
                                              handleCloseModal();
                                              handleClose();
                                            }}
                                          >
                                            OK
                                          </button>
                                          <button
                                            className="changeReferCancelButton cursor-pointer w-[50%]"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleCloseModal();
                                              handleClose();
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </Box>
                                  </Fade>
                                </Modal>
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
                  count={inHouseAppointmentList.length}
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
                {Array.isArray(inHouseAppointmentList) &&
                  inHouseAppointmentList.length > 0 &&
                  inHouseAppointmentList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <div key={index}>
                        <div
                          className="flex justify-between cursor-pointer items-center"
                          onClick={() => handleClick(index)}
                        >
                          <div className="w-full px-2 py-3 flex flex-row justify-between">
                            <div className="body3-sem w-[50%]">Employee</div>
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
                                Appointment Id
                              </div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?._id?.slice(-10)}
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
                              <div className="body3-sem w-[50%]">Duration</div>
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
                                  `/client/appointments/therapist?therapistId=${item?.therapist_id}&&appointmentId=${item?._id}&&type=pre`;
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
                                    `/therapist/appointment/appointmentdetails/${item?._id}`
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
                  count={inHouseAppointmentList.length}
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
                        appointmentList.length > 0 &&
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
                                key={row?.id}
                                sx={{ padding: "16px", cursor: "pointer" }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  <div style={{ textDecoration: "none" }}>
                                    {row?.therapist_name}
                                  </div>
                                </TableCell>

                                <TableCell align="left" className="body3-reg">
                                  <div>{row?._id?.slice(-10)}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>
                                    {getformatedDate(row?.booking_date)}
                                  </div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {convertTo12HourFormat(
                                    row?.booking_slots?.[0]?.m_schd_from
                                  )}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.booking_type}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.booking_duration} Min</div>
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
                                        if (!meetLink.startsWith("https://")) {
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
                                  <div>
                                    {row?.payment_mode
                                      ? row?.payment_mode
                                      : "NILL"}
                                  </div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <img
                                    src={ThreeDot}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if(row.booking_status){
                                        handleThreeDotClicked(event);
                                      }
                                    }}
                                  />
                                </TableCell>
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
                                          `/client/appointments/therapist?therapistId=${row?.therapist_id}&&appointmentId=${row?._id}&&type=sess`
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
                                        Cancel Appointment
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
                                    handleClose();
                                  }}
                                  closeAfterTransition
                                  slots={{ backdrop: Backdrop }}
                                  slotProps={{
                                    backdrop: {
                                      timeout: 500,
                                      style: {
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                      },
                                    },
                                  }}
                                >
                                  <Fade in={openModal}>
                                    <Box
                                      sx={style}
                                      className="text-center"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                    >
                                      <div className="flex flex-col gap-4 justify-center items-center">
                                        <img src={CancelPopup} />
                                        <h1 className="body3-sem">
                                          Are you sure you want to cancel the
                                          appointment?
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
                                              handleCancelAppointment(row?._id);
                                              handleCloseModal();
                                              handleClose();
                                            }}
                                          >
                                            OK
                                          </button>
                                          <button
                                            className="changeReferCancelButton cursor-pointer w-[50%]"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleCloseModal();
                                              handleClose();
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </Box>
                                  </Fade>
                                </Modal>
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
                  appointmentList.length > 0 &&
                  appointmentList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <div key={index}>
                        <div
                          className="flex justify-between cursor-pointer items-center"
                          onClick={() => handleClick(index)}
                        >
                          <div className="w-full px-2 py-3 flex flex-row justify-between">
                            <div className="body3-sem w-[50%]">Employee</div>
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
                                Appointment Id
                              </div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?._id?.slice(-10)}
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
                              <div className="body3-sem w-[50%]">Duration</div>
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
                                  `/client/appointments/therapist?therapistId=${item?.therapist_id}&&appointmentId=${item?._id}&&type=sess`;
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
                                    `/therapist/appointment/appointmentdetails/${item?._id}`
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
          <TabPanel value="3">
            {prescriptionList.length !== 0 ? (
              <>
                <Paper
                  elevation={0}
                  className="hidden sm:block"
                  sx={{ width: "100%", overflow: "hidden" }}
                >
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
                        {prescriptionList
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                sx={{ padding: "16px" }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  {getformatedDate(row?.created_at)}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row?.title}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row?.dosage}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>
                                    {[
                                      row?.instructions?.morning && "Morning",
                                      row?.instructions?.afternoon &&
                                        "Afternoon",
                                      row?.instructions?.night && "Night",
                                    ]
                                      .filter(Boolean) // Remove any `false` or `undefined` values
                                      .join(", ")}{" "}
                                    {/* Join the array with a comma and space */}
                                  </div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <Dialog
                                    open={openDescriptions[index]}
                                    onClose={() =>
                                      handleDescriptionClose(index)
                                    }
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    className="detailDilog"
                                  >
                                    <div className="w-[100%] sm:w-[532px] p-[16px]">
                                      <div
                                        style={{
                                          width: "100%",
                                          padding: "16px",
                                        }}
                                      >
                                        <h5
                                          style={{
                                            marginBottom: "24px",
                                            textAlign: "center",
                                          }}
                                          className="h5-bold"
                                        >
                                          Description
                                        </h5>
                                      </div>
                                      <div className="flex justify-between w-[100%] flex-wrap gap-4">
                                        <div className="w-[45%]">
                                          <p
                                            className="p2-sem"
                                            style={{ color: "#4A4159" }}
                                          >
                                            Date
                                          </p>
                                          <p className="body3-reg">
                                            {getformatedDate(row?.created_at)}
                                          </p>
                                        </div>
                                        <div className="w-[45%]">
                                          <p
                                            className="p2-sem"
                                            style={{ color: "#4A4159" }}
                                          >
                                            Title
                                          </p>
                                          <p className="body3-reg">
                                            {row?.title}
                                          </p>
                                        </div>
                                        <div className="w-[45%]">
                                          <p
                                            className="p2-sem"
                                            style={{ color: "#4A4159" }}
                                          >
                                            Dosage
                                          </p>
                                          <p className="body3-reg">
                                            {row?.dosage}
                                          </p>
                                        </div>
                                        <div className="w-[45%]">
                                          <p
                                            className="p2-sem"
                                            style={{ color: "#4A4159" }}
                                          >
                                            Instruction
                                          </p>
                                          <p className="body3-reg">
                                            <div>
                                              {[
                                                row?.instructions?.morning &&
                                                  "Morning",
                                                row?.instructions?.afternoon &&
                                                  "Afternoon",
                                                row?.instructions?.night &&
                                                  "Night",
                                              ]
                                                .filter(Boolean) // Remove any `false` or `undefined` values
                                                .join(", ")}{" "}
                                              {/* Join the array with a comma and space */}
                                            </div>
                                          </p>
                                        </div>
                                        <div className="w-[45%]">
                                          <p
                                            className="p2-sem"
                                            style={{ color: "#4A4159" }}
                                          >
                                            Description
                                          </p>
                                          <p className="body3-reg">
                                            {row?.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogActions
                                      sx={{
                                        "@media (max-width: 640px)": {
                                          justifyContent: "center",
                                        },
                                      }}
                                    >
                                      <Button
                                        onClick={() =>
                                          handleDescriptionClose(index)
                                        }
                                        autoFocus
                                        sx={{
                                          width: "160px",
                                          cursor: "pointer",
                                          height: "48px",
                                          border: "2px solid #614298",
                                          borderRadius: "8px",
                                          color: "#614298",
                                          fontFamily: "Nunito",
                                          fontSize: "1.1rem",
                                          fontWeight: "700",
                                          lineHeight: "14px",
                                        }}
                                      >
                                        <span>Close</span>
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
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
                                      "&:hover": {
                                        background: "#F4EDFF",
                                      },
                                    }}
                                    onClick={() => handleDescriptionOpen(index)}
                                  >
                                    <img src={ViewReportIcon} alt="" />
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
                    count={prescriptionList.length}
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

                <div className="sm:hidden">
                  {prescriptionList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <div key={item.title}>
                        <div
                          className="flex justify-between cursor-pointer items-center"
                          onClick={() => handleClick(index)}
                        >
                          <div className="w-full px-2 py-3 flex flex-row justify-between">
                            <div className="body3-sem w-[40%]">Title</div>
                            <div className="body3-reg pr-2 w-[60%]">
                              {item.prescription_title}
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
                              <div className="body3-sem w-[50%]">Date</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                12/10/2024
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                              <div className="body3-sem w-[50%]">Dosage</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item.prescription_dosage}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                              <div className="body3-sem w-[50%]">
                                Instruction
                              </div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item.prescription_instruction}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                              <div className="body3-reg pr-2 w-[100%]">
                                <Button
                                  sx={{
                                    display: "flex",
                                    width: "100%",
                                    padding: "4px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexShrink: 0,
                                    borderRadius: "4px",
                                    background: "#F4EDFF",
                                    "&:hover": {
                                      background: "#F4EDFF",
                                    },
                                  }}
                                  onClick={() => handleDescriptionOpen(index)}
                                >
                                  <img src={ViewReportIcon} alt="" />
                                  <p className="p3-reg">View</p>
                                </Button>
                              </div>
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
                    count={prescriptionList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Show:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count} items`
                    }
                    sx={
                      {
                        // Your styling for TablePagination here
                      }
                    }
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  height: "30vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="sm:hidden"
              >
                <span className="body1-reg">No Records Found</span>
              </div>
            )}
          </TabPanel>
        </TabContext>
      </div>
      <div className={`chat-container ${isChatOpen ? "open" : ""}`}>
        <iframe
          title="chat"
          style={{ height: "100%", width: "100%" }}
          frameBorder="0"
          // src="https://widget.botsonic.com/CDN/index.html?service-base-url=https%3A%2F%2Fapi-azure.botsonic.ai&token=5f13ba92-08b2-4dc5-be50-81b3da300ecc&base-origin=https%3A%2F%2Fbot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https%3A%2F%2Fbot.writesonic.com%2Fbots%2Fbbbebb3d-3eff-44a9-bb82-d9848a72d1e8%2Fintegrations">
          src="https://widget.botsonic.com/CDN/index.html?service-base-url=https%3A%2F%2Fapi-azure.botsonic.ai&token=5f13ba92-08b2-4dc5-be50-81b3da300ecc&base-origin=https%3A%2F%2Fbot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https%3A%2F%2Fbot.writesonic.com%2Fbots%2Fbbbebb3d-3eff-44a9-bb82-d9848a72d1e8%2Fconnect"
        ></iframe>
      </div>
      <div className="chat-button" onClick={toggleChat}>
        <img
          style={{ height: "100%", width: "100%" }}
          src={isChatOpen ? cross : logo}
          alt="Chat"
        />
      </div>
    </>
  );
};

export default ClientDashboard;
