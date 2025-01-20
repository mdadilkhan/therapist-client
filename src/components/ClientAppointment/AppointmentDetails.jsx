import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeftArrow from "../../assets/LeftArrow.svg";
import ViewIcon from "../../assets/ViewIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import DeleteIcon from "../../assets/DeleteIcon.svg";
import EditIcon from "../../assets/EditIcon.svg";
import ViewReport from "../../assets/ViewReportICon.svg";
import CollapseArrow from "../../assets/collapseArrow.svg";
import styled from "@emotion/styled";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Backdrop from "@mui/material/Backdrop";
import DownloadIcon from "../../assets/DownloadIcon.svg";
import {
  Paper,
  TableBody,
  TableContainer,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Modal,
  Fade,
  Box,
} from "@mui/material";
import {
  changeAppoitmentStatus,
  convertTo12HourFormat,
  getBookingType,
  getformatedDate,
} from "../../constant/constatnt";
import { API_URL } from "../../constant/ApiConstant";

const columns = [
  {
    id: "Date",
    align: "center",
  },
  {
    id: "Title",
    align: "center",
  },
  {
    id: "Dosage",
    align: "center",
  },
  {
    id: "Instruction",
    align: "center",
  },
  {
    id: "Description",
    align: "center",
  },
];

const columnsNotes = [
  {
    id: "Session Id",
    align: "center",
  },
  {
    id: "Date/Time",
    align: "center",
  },
  {
    id: "",
    align: "center",
  },
];

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "564px",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCollapsedPrescription, setCollapsedPrescription] = useState(false);
  const [isCollapsedNotes, setCollapsedNotes] = useState(false);
  const [appointDetails, setAppointmentDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [openTimeline, setOpenTimeline] = useState(false);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [timeline, setTimeline] = useState({});
  const [employeeDetail, setEmployeeDetail] = useState({});
  const [openDialogs, setOpenDialogs] = useState(
    Array(prescriptionList?.length).fill(false)
  );
  const [slots, setSlots] = useState("");
  const [notesValue, setNotesValue] = useState({});
  const [rowsNotes, setRowNotes] = useState([]);
  const [openNotesDialogs, setOpenNotesDialogs] = useState(
    Array(rowsNotes.length).fill(false)
  );
  const [openModal, setOpenModal] = useState(false);
  const [openRTSModal, setOpenRTSModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeNotesIndex, setActiveNotesIndex] = useState(-1);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleNotesClick = (index) => {
    setActiveNotesIndex(index === activeNotesIndex ? -1 : index);
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
  const getInterventionNotes = () => {
    const app_id = {
      appointmentId: id,
    };
    axios
      .post(`${API_URL}/getAllSessionNotesByAppointmentId`, app_id)
      .then((res) => {
        if (res.data.success === true) {
          setRowNotes(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getInterventionNotes();
  }, []);

  const navigate = useNavigate();

  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTogglePrescription = () => {
    setCollapsedPrescription(!isCollapsedPrescription);
  };
  const handleToggleNotes = () => {
    setCollapsedNotes(!isCollapsedNotes);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseTimeline = () => {
    setOpenTimeline(false);
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

  const handleChnageTimeline = (e) => {
    setTimeline({
      ...timeline,
      [e.target.name]: e.target.value,
    });
  };

  const generateTimeString = (morning, afternoon, night) => {
    const timeArray = [];

    if (morning === "1") {
      timeArray.push("Morning");
    }

    if (afternoon === "1") {
      timeArray.push("Afternoon");
    }

    if (night === "1") {
      timeArray.push("Night");
    }

    return timeArray.join(",");
  };

  const getAppointmentDetails = () => {
    const app_id = {
      appointmentId: id,
    };
    axios
      .post(`${API_URL}/getAppointmentDetail`, app_id)
      .then((res) => {
        if (res.status == 200) {
          setAppointmentDetails(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getAppointmentDetails();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (days) => {
    setOpenModal(true);
  };

  const handleRTSCloseModal = () => {
    setOpenRTSModal(false);
  };
  const handleRTSOpenModal = (days) => {
    setOpenRTSModal(true);
  };

  const handleNotesCloseModal = () => {
    setOpenNotesModal(false);
    setNotesValue([]);
  };
  const handleNotesOpenModal = (days) => {
    setOpenNotesModal(true);
  };

  const handleChangeNotes = (e) => {
    setNotesValue({
      ...notesValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/getAllSessionNotesByAppointmentId`, {
        appointmentId: id,
      })
      .then((res) => {
        if (res.data.response == "success") {
          getInterventionNotes();
          setNotesValue(res.data.data);
          handleNotesCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const extractTrueInstructions = (instructions) => {
    return Object.entries(instructions)
      .filter(([key, value]) => value)
      .map(([key]) => key)
      .join(", ");
  };

  const handleCheckboxNotesChange = (name) => (e) => {
    const newValue = e.target.checked ? "1" : "0";
    setNotesValue((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
  };

  const handleChangeStatus = () => {
    const app_id = {
      app_id: id,
    };
    axios
      .post(`${API_URL}/changeBookingStatus`, app_id)
      .then((res) => {
        if (res.data.success === true) {
          getAppointmentDetails();
          handleCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handelReferToSage = () => {
    const referDetails = {
      referred_emp_id: employeeDetail.emp_id,
    };
    axios
      .post(`${API_URL}/referToSage`, referDetails)
      .then((res) => {
        if (res.data.success === true) {
          getAppointmentDetails();
          handleRTSCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleRedirectProfile = () => {
    navigate(`/clients/clientDetails/${appointDetails.therapist_id}`);
  };

  const handleOpenNotesView = (index) => {
    setOpenNotesDialogs((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = true;
      return newOpenDialogs;
    });
  };

  const handleCloseNotesView = (e, index) => {
    e.preventDefault();
    setOpenNotesDialogs((prev) => {
      const newOpenDialogs = [...prev];
      newOpenDialogs[index] = false;
      return newOpenDialogs;
    });
  };

  const openImageInBrowser = (imageName) => {
    window.open(imageName, "_blank");
  };

  return (
    <>
      <div style={{ padding: "16px 32px", display: "flex", gap: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              color: "#06030d",
            }}
            onClick={() => navigate(-1)}
          >
            {" "}
            <img src={LeftArrow} alt="" />
          </div>
          <h5 className="h5-bold">Appointment details</h5>
        </div>
      </div>

      <div style={{ padding: "24px 24px" }} className="w-full">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            borderRadius: "16px",
            border: "1px solid #D5D2D9",
            background: "#FCFCFC",
            padding: "24px",
          }}
          className="w-full"
        >
          <div
            className="left-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 50,
              marginBottom: "15px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Appointment No</h5>
                <h5 className="body3-reg">{appointDetails._id?.slice(-10)}</h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Date</h5>
                <h5 className="body3-reg">
                  {getformatedDate(appointDetails.booking_date)}{" "}
                </h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Status</h5>
                <h5 className="body3-reg">
                  <span
                    style={{
                      background: changeAppoitmentStatus(
                        appointDetails?.booking_status
                      ).color,
                      padding: "5px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    {
                      changeAppoitmentStatus(appointDetails?.booking_status)
                        .status
                    }
                  </span>
                </h5>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Type</h5>
                <h5 className="body3-reg">
                  {getBookingType(appointDetails?.booking_type)}
                </h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Time</h5>
                <h5 className="body3-reg">
                  <div>{slots?.m_schd_from}</div>
                </h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Duration</h5>
                <h5 className="body3-reg">
                  {appointDetails?.booking_duration} min
                </h5>
              </div>
            </div>
          </div>
          <div
            className="right-container"
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 8,
            }}
          >
            <div>
              {appointDetails?.booking_status == 1 ? (
                <Button
                  variant="outlined"
                  sx={{
                    width: "196px",
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                    },
                  }}
                  onClick={handleOpenModal}
                >
                  <span className="btn1">Complete Consultation</span>{" "}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    width: "196px",
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100% !important",
                    },
                  }}
                  onClick={handleRTSOpenModal}
                  disabled={appointDetails?.booking_status == 3}
                >
                  <span className="btn1">Refer to Sage Turtle</span>{" "}
                </Button>
              )}
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    timeout: 500,
                    style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                  },
                }}
              >
                <Fade in={openModal}>
                  <Box sx={style} className="text-center">
                    <div className="flex flex-col gap-4 justify-center items-center">
                      <div className="loader"></div>
                      <h1 className="body3-reg">
                        Are you sure you want to change the appointment status ?
                      </h1>
                      <div className="w-full flex justify-end">
                        <button
                          className="changeStatusButton cursor-pointer"
                          onClick={handleChangeStatus}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </Box>
                </Fade>
              </Modal>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openRTSModal}
                onClose={handleRTSCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    timeout: 500,
                    style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                  },
                }}
              >
                <Fade in={openRTSModal}>
                  <Box sx={style} className="text-center">
                    <div className="flex flex-col gap-4 justify-center items-center">
                      <div className="sageTurtleLoader"></div>
                      <h1 className="body4-reg">
                        Are you sure you want to send referral to Sage Turtle?
                      </h1>
                      <div className="w-full flex justify-end gap-4">
                        <button
                          className="changeStatusButton cursor-pointer"
                          onClick={handelReferToSage}
                        >
                          Send
                        </button>
                        <button
                          className="changeReferCancelButton cursor-pointer"
                          onClick={handleRTSCloseModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Box>
                </Fade>
              </Modal>
            </div>
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={() => {
                  navigate(
                    `/counsellor/clients/clientDetails/clienthistory/${appointDetails._id}`
                  );
                }}
              >
                <span className="btn1">Employee History</span>
              </Button>
            </div>
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={() => {
                  navigate(
                    `/counsellor/clientsessationnotes/${appointDetails?._id}`
                  );
                }}
              >
                <span className="btn1"> Session Note</span>
              </Button>
            </div>
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={handleClickOpen}
              >
                <span className="btn1">Add Prescription</span>
              </Button>
            </div>

            {/* <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <AddPrescription
                onClosePrescription={handleClose}
                appointId={id}
                getPrescription={() => getAppointmentDetails()}
              />
            </Dialog> */}
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={() =>
                  navigate(
                    `/counsellor/calendar/client/${appointDetails.emp_id}`
                  )
                }
              >
                <span className="btn1">Create Appointment</span>
              </Button>{" "}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
        }}
        className="appointmentDetail"
      >
        <div
          className="left w-full"
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #D5D2D9",
              background: "#FCFCFC",
              display: "flex",
              flexDirection: "column",
              rowGap: 24,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h5
                className="h5-bold"
                onClick={handleTogglePrescription}
                style={{ cursor: "pointer", display: "flex", gap: 8 }}
              >
                Prescription
                <img src={CollapseArrow} alt="" />
              </h5>
              <div>
                <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "196px",
                    gap: 0,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                  onClick={handleClickOpen}
                >
                  <img src={AddIcon} alt="" />
                  <span className="btn1">Add Prescription</span>{" "}
                </Button>
              </div>
            </div>
            {!isCollapsedPrescription && (
              <div>
                {viewportWidth >= 640 ? (
                  <Paper
                    elevation={0}
                    sx={{ width: "100%", overflow: "hidden" }}
                  >
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                className="body3-sem"
                                align={column.align}
                              >
                                {column.id}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(prescriptionList) &&
                            prescriptionList
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
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {getformatedDate(row.created_at)}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {row.title}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {row.dosage}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {extractTrueInstructions(
                                        row.instructions
                                      )}
                                    </TableCell>

                                    <TableCell
                                      className="body3-reg"
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Dialog
                                        open={openDialogs[index]}
                                        onClose={() => handleCloseView(index)}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                      >
                                        <div
                                          style={{
                                            width: "532px",
                                            padding: "16px",
                                          }}
                                        >
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

                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100%",
                                            }}
                                          >
                                            <div
                                              style={{
                                                width: "50%",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 24,
                                              }}
                                            >
                                              <div>
                                                <p
                                                  className="p2-sem"
                                                  style={{ color: "#4A4159" }}
                                                >
                                                  Date
                                                </p>
                                                <p className="body3-reg">
                                                  {getformatedDate(
                                                    row.created_at
                                                  )}
                                                </p>
                                              </div>
                                              <div>
                                                <p
                                                  className="p2-sem"
                                                  style={{ color: "#4A4159" }}
                                                >
                                                  Dosage
                                                </p>
                                                <p className="body3-reg">
                                                  {row.dosage}
                                                </p>
                                              </div>
                                              <div>
                                                <p
                                                  className="p2-sem"
                                                  style={{ color: "#4A4159" }}
                                                >
                                                  Description
                                                </p>
                                                <p className="body3-reg">
                                                  {row.description}
                                                </p>
                                              </div>
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 24,
                                              }}
                                            >
                                              <div>
                                                <p
                                                  className="p2-sem"
                                                  style={{ color: "#4A4159" }}
                                                >
                                                  Title
                                                </p>
                                                <p className="body3-reg">
                                                  {row.title}
                                                </p>
                                              </div>
                                              <div>
                                                <p
                                                  className="p2-sem"
                                                  style={{ color: "#4A4159" }}
                                                >
                                                  Instruction
                                                </p>
                                                <p className="body3-reg">
                                                  {extractTrueInstructions(
                                                    row.instructions
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <p
                                            style={{
                                              borderBottom: "1px solid #D5D2D9",
                                              marginTop: "24px",
                                            }}
                                          ></p>
                                        </div>

                                        <DialogActions>
                                          <Button
                                            onClick={() =>
                                              handleCloseView(index)
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
                      count={prescriptionList?.length}
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
                    {Array.isArray(prescriptionList) &&
                      prescriptionList
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
                                <div className="body3-sem w-[50%]">Title</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.title}
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
                                    Dosage
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {item.dosage}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">Date</div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {getformatedDate(item.created_at)}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Instructions
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    <div>
                                      {extractTrueInstructions(
                                        item.instructions
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
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

                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "50%",
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 24,
                                            }}
                                          >
                                            <div>
                                              <p
                                                className="p2-sem"
                                                style={{ color: "#4A4159" }}
                                              >
                                                Date
                                              </p>
                                              <p className="body3-reg">
                                                {item.created_at}
                                              </p>
                                            </div>
                                            <div>
                                              <p
                                                className="p2-sem"
                                                style={{ color: "#4A4159" }}
                                              >
                                                Dosage
                                              </p>
                                              <p className="body3-reg">
                                                {item.dosage}
                                              </p>
                                            </div>
                                            <div>
                                              <p
                                                className="p2-sem"
                                                style={{ color: "#4A4159" }}
                                              >
                                                Description
                                              </p>
                                              <p className="body3-reg">
                                                {item.description}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 24,
                                            }}
                                          >
                                            <div>
                                              <p
                                                className="p2-sem"
                                                style={{ color: "#4A4159" }}
                                              >
                                                Title
                                              </p>
                                              <p className="body3-reg">
                                                {item.title}
                                              </p>
                                            </div>
                                            <div>
                                              <p
                                                className="p2-sem"
                                                style={{ color: "#4A4159" }}
                                              >
                                                Instruction
                                              </p>
                                              <p className="body3-reg">
                                                {generateTimeString(
                                                  item.morning,
                                                  item.afternoon,
                                                  item.night
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <p
                                          style={{
                                            borderBottom: "1px solid #D5D2D9",
                                            marginTop: "24px",
                                          }}
                                        ></p>
                                      </div>
                                      <DialogActions>
                                        <Button
                                          onClick={() => handleCloseView(index)}
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
                      count={prescriptionList?.length}
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
              </div>
            )}
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #D5D2D9",
              background: "#FCFCFC",
              display: "flex",
              flexDirection: "column",
              rowGap: 24,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h5
                className="h5-bold"
                onClick={handleToggleNotes}
                style={{ cursor: "pointer" }}
              >
                SessionNote
                <img src={CollapseArrow} alt="" />
              </h5>
              <div>
                {/* <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "196px",
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                  onClick={handleNotesOpenModal}
                >
                  <span className="btn1">Send Notes</span>
                </Button> */}
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={openNotesModal}
                  onClose={handleNotesCloseModal}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                      style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                    },
                  }}
                >
                  <Fade in={openNotesModal}>
                    <Box sx={style}>
                      <form
                        onSubmit={handleSaveNotes}
                        className="flex flex-col gap-4"
                      >
                        <h1 className="h5-bold mb-4 text-center">
                          Intervention Note
                        </h1>
                        <div className="w-full">
                          <h2 className="p2-sem" style={{ color: "#4A4159" }}>
                            Send to
                          </h2>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={notesValue.m_send_parent === "1"}
                                  onChange={handleCheckboxNotesChange(
                                    "m_send_parent"
                                  )}
                                  value={notesValue.m_send_parent}
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 24,
                                      padding: "0px",
                                      margin: "0px",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span
                                  className="body3-bold"
                                  style={{ color: "#06030D" }}
                                >
                                  Parent
                                </span>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={notesValue.m_send_teacher === "1"}
                                  onChange={handleCheckboxNotesChange(
                                    "m_send_teacher"
                                  )}
                                  value={notesValue.m_send_teacher}
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 24,
                                      padding: "0px",
                                      margin: "0px",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span
                                  className="body3-bold"
                                  style={{ color: "#06030D" }}
                                >
                                  Teacher
                                </span>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={notesValue.mb_principal_id === "1"}
                                  onChange={handleCheckboxNotesChange(
                                    "mb_principal_id"
                                  )}
                                  value={notesValue.mb_principal_id}
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 24,
                                      padding: "0px",
                                      margin: "0px",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span
                                  className="body3-bold"
                                  style={{ color: "#06030D" }}
                                >
                                  Principal
                                </span>
                              }
                            />
                          </div>
                        </div>
                        <h2 className="p2-sem" style={{ color: "#4A4159" }}>
                          Title
                        </h2>
                        <TextField
                          fullWidth
                          type="text"
                          required
                          name="mb_title"
                          value={notesValue.mb_title}
                          onChange={handleChangeNotes}
                          InputProps={{
                            sx: {
                              fontSize: "16px",
                              fontFamily: "Nunito",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "24px",
                              letterSpacing: "0.08px",
                              height: "48px",

                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: `${theme.palette.grey[200]}`,
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: `${theme.palette.grey[200]}`,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: `${theme.palette.grey[200]}`,
                                },
                              "& input::placeholder": {
                                color: `${theme.palette.grey[200]}`,
                              },
                            },
                          }}
                        />
                        <h2 className="p2-sem" style={{ color: "#4A4159" }}>
                          Description
                        </h2>
                        <textarea
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontFamily: "Nunito",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "24px",
                            letterSpacing: "0.08px",
                          }}
                          id="myTextArea"
                          rows="4"
                          cols="500"
                          name="mb_description"
                          value={notesValue.mb_description}
                          onChange={handleChangeNotes}
                          required
                        ></textarea>
                        <div className="w-full flex justify-end gap-4">
                          <button
                            className="changeStatusButton cursor-pointer"
                            type="submit"
                          >
                            Save
                          </button>
                          <div
                            className="changeReferCancelButton cursor-pointer"
                            onClick={handleNotesCloseModal}
                          >
                            Cancel
                          </div>
                        </div>
                      </form>
                    </Box>
                  </Fade>
                </Modal>
              </div>
            </div>
            {!isCollapsedNotes && (
              <div>
                {viewportWidth >= 640 ? (
                  <Paper
                    elevation={0}
                    sx={{ width: "100%", overflow: "hidden" }}
                  >
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columnsNotes.map((column) => (
                              <TableCell
                                key={column.id}
                                className="body3-sem"
                                align={column.align}
                              >
                                {column.id}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(rowsNotes) &&
                            rowsNotes
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
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {row?._id?.slice(-10)}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="body3-reg"
                                    >
                                      {row.created_at}
                                    </TableCell>
                                    <TableCell
                                      className="body3-reg"
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                      }}
                                    >
                                      <div
                                        onClick={() =>
                                          handleOpenNotesView(index)
                                        }
                                        className="flex justify-center items-center w-[40px] h-[40px] cursor-pointer border border-[#614298] rounded-full border-solid"
                                      >
                                        <img src={ViewReport} alt="" />
                                      </div>
                                      <div
                                        onClick={() =>
                                          navigate(
                                            `/counsellor/clientsessationnotes/${row?.appointmentId}/${row?._id}`
                                          )
                                        }
                                        className="flex justify-center items-center w-[40px] h-[40px] cursor-pointer border border-[#614298] rounded-full border-solid"
                                      >
                                        <img src={EditIcon} alt="" />
                                      </div>
                                      <Dialog
                                        open={openNotesDialogs[index]}
                                        onClose={(e) =>
                                          handleCloseNotesView(e, index)
                                        }
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                      >
                                        <div
                                          style={{
                                            width: "100%",
                                            padding: "16px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              marginTop: "16px",
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            <div className="flex sm:flex-row flex-col-reverse">
                                              <div className="flex flex-col w-full gap-[24px]">
                                                <div>
                                                  <p className="body2-sem">
                                                    Session Id
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?._id
                                                      ? row?._id?.slice(-10)
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Diagnostic Impression
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.diagnosticImpression
                                                      ? row?.diagnosticImpression
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Observations
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.observations
                                                      ? row?.observations
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Therapeutic Intervention
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.therapeuticIntervention
                                                      ? row?.therapeuticIntervention
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Planned Intervention (for
                                                    upcoming sessions)
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.plannedIntervention
                                                      ? row?.plannedIntervention
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <Button
                                                    variant="contained"
                                                    type="submit"
                                                    sx={{
                                                      width: "209px",
                                                      height: "48px",
                                                      borderRadius: "8px",
                                                      border:
                                                        "1px solid #614298",
                                                      textTransform:
                                                        "capitalize",
                                                      background: "#614298",
                                                      color: "white", // Text color white
                                                      gap: 1,
                                                      "&:hover": {
                                                        boxShadow:
                                                          "0px 4px 12px rgba(0, 0, 0, 0.2)", // Overshadow effect
                                                        background: "#614298", // Keep background color the same
                                                      },
                                                    }}
                                                    onClick={() => {
                                                      openImageInBrowser(
                                                        row.attachment
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      src={DownloadIcon}
                                                      alt=""
                                                    />
                                                    <span className="btn2">
                                                      Download Consent
                                                    </span>
                                                  </Button>
                                                </div>
                                              </div>
                                              <div className="flex flex-col w-full gap-[24px]">
                                                <div>
                                                  <p className="body2-sem">
                                                    Session Focus
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.sessionFocus
                                                      ? row?.sessionFocus
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Employee Goals
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.clientGoals
                                                      ? row?.clientGoals
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Tasks Given
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.tasksGiven
                                                      ? row?.tasksGiven
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Important Notes (if any)
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.importantNotes
                                                      ? row?.importantNotes
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="body2-sem">
                                                    Important Notes (if any)
                                                  </p>
                                                  <p className="body3-reg">
                                                    {row?.importantNotes
                                                      ? row?.importantNotes
                                                      : "N/a"}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <DialogActions>
                                          <Button
                                            onClick={(e) =>
                                              handleCloseNotesView(e, index)
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
                      count={rowsNotes.length}
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
                    {Array.isArray(rowsNotes) &&
                      rowsNotes
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => (
                          <div key={index}>
                            <div
                              className="flex justify-between cursor-pointer items-center"
                              onClick={() => handleNotesClick(index)}
                            >
                              <div className="w-full px-2 py-3 flex flex-row justify-between">
                                <div className="body3-sem w-[50%]">
                                  Session Id
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item?._id?.slice(-10)}
                                </div>
                              </div>
                              {index === activeNotesIndex ? (
                                <KeyboardArrowUpIcon fontSize="large" />
                              ) : (
                                <KeyboardArrowDownIcon fontSize="large" />
                              )}
                            </div>
                            {index === activeNotesIndex && (
                              <div className="w-full flex flex-col justify-between">
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Date/Time
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {item?.created_at}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap py-3 justify-between">
                                  <Button
                                    sx={{
                                      width: "100%",
                                      background: "#F4EDFF",
                                      color: "#7355A8",
                                    }}
                                    onClick={() => handleOpenNotesView(index)}
                                  >
                                    View
                                  </Button>
                                  <Dialog
                                    open={openNotesDialogs[index]}
                                    onClose={(e) =>
                                      handleCloseNotesView(e, index)
                                    }
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                  >
                                    <div
                                      style={{
                                        width: "100%",
                                        padding: "16px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          marginTop: "16px",
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div className="flex sm:flex-row flex-col-reverse">
                                          <div className="flex flex-col w-full gap-[24px] mt-6">
                                            <div>
                                              <p className="body2-sem">
                                                Session Id
                                              </p>
                                              <p className="body3-reg">
                                                {item?._id
                                                  ? item?._id?.slice(-10)
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Diagnostic Impression
                                              </p>
                                              <p className="body3-reg">
                                                {item?.diagnosticImpression
                                                  ? item?.diagnosticImpression
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Observations
                                              </p>
                                              <p className="body3-reg">
                                                {item?.observations
                                                  ? item?.observations
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Therapeutic Intervention
                                              </p>
                                              <p className="body3-reg">
                                                {item?.therapeuticIntervention
                                                  ? item?.therapeuticIntervention
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Planned Intervention (for
                                                upcoming sessions)
                                              </p>
                                              <p className="body3-reg">
                                                {item?.plannedIntervention
                                                  ? item?.plannedIntervention
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              {/* 
                                              <Button
  variant="contained"
  type="submit"
  sx={{
    width: "209px",
    height: "48px",
    borderRadius: "8px",
    border: "1px solid #614298",
    textTransform: "capitalize",
    background: "#614298",
    color: "white", // Text color white
    gap: 1,
    "&:hover": {
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Overshadow effect
      background: "#614298", // Keep background color the same
    },
  }}
   onClick={() => {
                                                  openImageInBrowser(
                                                    item.attachment
 );
}}
>
  <img
    src={DownloadIcon}
    alt=""
    style={{
      background: "#614298", // Image background color
    }}
  />
  <span className="btn2">Download Consent</span>
</Button> */}
                                              <Button
                                                variant="contained"
                                                type="submit"
                                                sx={{
                                                  width: "209px",
                                                  height: "48px",
                                                  borderRadius: "8px",
                                                  border: "1px solid #614298",
                                                  textTransform: "capitalize",
                                                  background: "#614298",
                                                  color: "white", // Text color white
                                                  gap: 1,
                                                  "&:hover": {
                                                    boxShadow:
                                                      "0px 4px 12px rgba(0, 0, 0, 0.2)", // Overshadow effect
                                                    background: "#614298", // Keep background color the same
                                                  },
                                                }}
                                                onClick={() => {
                                                  openImageInBrowser(
                                                    item.attachment
                                                  );
                                                }}
                                              >
                                                <img
                                                  src={DownloadIcon}
                                                  alt=""
                                                  style={{
                                                    background: "#614298", // Image background color
                                                  }}
                                                />
                                                <span className="btn2">
                                                  Download Consent
                                                </span>
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="flex flex-col w-full gap-[24px]">
                                            <div>
                                              <p className="body2-sem">
                                                Session Focus
                                              </p>
                                              <p className="body3-reg">
                                                {item?.sessionFocus
                                                  ? item?.sessionFocus
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Employee Goals
                                              </p>
                                              <p className="body3-reg">
                                                {item?.clientGoals
                                                  ? item?.clientGoals
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Tasks Given
                                              </p>
                                              <p className="body3-reg">
                                                {item?.tasksGiven
                                                  ? item?.tasksGiven
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Important Notes (if any)
                                              </p>
                                              <p className="body3-reg">
                                                {item?.importantNotes
                                                  ? item?.importantNotes
                                                  : "N/a"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="body2-sem">
                                                Important Notes (if any)
                                              </p>
                                              <p className="body3-reg">
                                                {item?.importantNotes
                                                  ? item?.importantNotes
                                                  : "N/a"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogActions>
                                      <Button
                                        onClick={(e) =>
                                          handleCloseNotesView(e, index)
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
                      count={rowsNotes.length}
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
              </div>
            )}
          </div>
          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #D5D2D9",
              background: "#FCFCFC",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h5 className="h5-bold">Assessments</h5>
              <div>
                <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "196px",
                    gap: 4,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                >
                  <span className="btn1">Send Assessment</span>{" "}
                </Button>
              </div>
            </div>

            <div className="flex justify-between flex-col sm:flex-row">
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <label
                  className="p2-sem"
                  style={{ color: "#4A4159" }}
                  htmlFor=""
                >
                  Name of Assessment
                </label>
                <Select id="demo-simple-select-helper">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <label
                  className="p2-sem"
                  style={{ color: "#4A4159" }}
                  htmlFor=""
                >
                  Employee Name
                </label>
                <Select id="demo-simple-select-helper">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #D5D2D9",
              background: "#FCFCFC",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h5
                className="h5-bold"
                onClick={handleTogglePrescription}
                style={{ cursor: "pointer", display: "flex", gap: 8 }}
              >
                Activities
              </h5>
              <div>
                <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "196px",
                    gap: 4,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                >
                  <span className="btn1">Send activities</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between flex-col sm:flex-row">
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <label
                  className="p2-sem"
                  style={{ color: "#4A4159" }}
                  htmlFor=""
                >
                  Type of Activity
                </label>
                <Select id="demo-simple-select-helper">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <label
                  className="p2-sem"
                  style={{ color: "#4A4159" }}
                  htmlFor=""
                >
                  Employee Name
                </label>
                <Select id="demo-simple-select-helper">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="right">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="rightContent">
              <div>
                <h6 className="h6-bold" style={{ color: "#06030D" }}>
                  Employee Overview
                </h6>
              </div>
              <div>
                <div>
                  <h5 className="body2-sem" style={{ color: "#06030D" }}>
                    Employee Name
                  </h5>
                  <p className="body3-reg" style={{ color: "#06030D" }}>
                    {employeeDetail?.emp_name}
                  </p>
                </div>
                <div>
                  <h5 className="body2-sem" style={{ color: "#06030D" }}>
                    Employee ID
                  </h5>
                  <p className="body3-reg" style={{ color: "#06030D" }}>
                    {appointDetails?.emp_id}
                  </p>
                </div>
                <div>
                  <h5 className="body2-sem" style={{ color: "#06030D" }}>
                    Mobile No.
                  </h5>
                  <p className="body3-reg" style={{ color: "#06030D" }}>
                    {employeeDetail?.emp_mob_no}
                  </p>
                </div>
                <div>
                  <h5 className="body2-sem" style={{ color: "#06030D" }}>
                    DOB
                  </h5>
                  <p className="body3-reg" style={{ color: "#06030D" }}>
                    {getformatedDate(employeeDetail?.emp_dob)}
                  </p>
                </div>
                <p className="body2-sem">Description</p>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  disabled={true}
                  value={employeeDetail?.emp_description}
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                      color: "#4A4159",
                      fontFamily: "Nunito",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      "&:hover": {
                        borderColor: "red",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetails;
