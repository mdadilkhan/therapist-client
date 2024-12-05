import { useState, useEffect } from "react";

import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeftArrow from "../../assets/LeftArrow.svg";
import ViewIcon from "../../assets/ViewIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import EditIcon from "../../assets/EditIcon.svg";
import CollapseArrow from "../../assets/CollapseArrow.svg";
import DownloadIcon from "../../assets/DownloadIcon.svg";
import styled from "@emotion/styled";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddBreifIcon from "../../assets/AddBriefIcon.svg";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

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
  TextField,
  Box,
  Dialog,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { calculateAge, getformatedDate } from "../../constant/constatnt";
import { API_URL } from "../../constant/ApiConstant";
import { useSelector } from "react-redux";

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

const columnsCore = [
  {
    id: "Assessment ID",
    align: "center",
  },
  {
    id: "Name",
    align: "center",
  },
  {
    id: "Date",
    align: "center",
  },
  {
    id: "Score",
    align: "center",
  },
];

const rowsScore = [
  {
    "Assessment ID": "Teacher",
    Name: "Neha Needs Attention",
    Date: "15/02/2024",
    score: "05/10",
  },
];

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;
const ClientDetails = () => {
  const initialValueConsultation = {
    counsellor_email: "",
    employee_email: "",
    meet_link: "",
    topic: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const [isClientHistory, setClientHistory] = useState(false);
  const [isSessionNote, setSessionNote] = useState(false);
  const [isAssessmentScore, setAssessmentScore] = useState(false);
  const [employeeData, setClientData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updateClientProfile, setUpdateClientProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState({});
  const [sessationList, setSessationList] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [consultationLink, setConsultationLink] = useState(
    initialValueConsultation
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [consultationPopup, setConsultationPopup] = useState(false);
  const [dateValue, onChange] = useState(new Date());
  const handleOpenConsultationLink = (e) => {
    e.preventDefault();
    setConsultationPopup(true);
  };

  const handleCloseConsultationLink = () => {
    setConsultationPopup(false);
    setConsultationLink(initialValueConsultation);
  };

  const handleChangeConsultation = (e) => {
    const { name, value } = e.target;
    setConsultationLink((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const getClientDetail = () => {
    const emp_id = {
      emp_id: id,
    };
    axios
      .post(`${API_URL}/getClientDetails`, emp_id)
      .then((res) => {
        if (res.data.success === true) {
          const employeeDetials = res.data.data;
          setClientData(employeeDetials);
          setConsultationLink((prevState) => ({
            ...prevState,
            employee_email: employeeDetials.emp_gmail,
          }));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const user = useSelector((state) => state.userDetails);

  const handleSubmitConsultationLink = (e) => {
      e.preventDefault();
      const updatedConsultationLink = {
        ...consultationLink,
        counsellor_email: user.gmail,
      };
      setConsultationLink(updatedConsultationLink);
      axios
        .post(`${API_URL}/sendMeetLink`, updatedConsultationLink)
        .then((res) => {
          if (res.data.response === "success") {
            handleCloseConsultationLink();
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    };
    

    axios
      .post(`${API_URL}/sendMeetLink`, consultationLink)
      .then((res) => {
        if (res.data.response === "success") {
          handleCloseConsultationLink();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
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

  const brief_report_initial_Value = {
    mb_attach_file: "",
    m_send_teacher: "0",
    m_send_parent: "0",
    mb_principal_id: "0",
  };

  const [briefReportValue, setBriefReportValue] = useState(
    brief_report_initial_Value
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClientHistory = () => {
    setClientHistory(!isClientHistory);
  };
  const handleSessionNote = () => {
    setSessionNote(!isSessionNote);
  };
  const handleAssessmentScore = () => {
    setAssessmentScore(!isAssessmentScore);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setUpdateClientProfile(employeeData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handelChage = (e) => {
    setUpdateClientProfile({
      ...updateClientProfile,
      [e.target.name]: e.target.value,
    });
  };

  const updateClientDetail = () => {
    const userId=id;
    const data={
      name:updateClientDetail.emp_name,
      gender: updateClientDetail.gender,
      emailId: updateClientDetail.emp_gmail,
      phoneNumber: updateClientDetail.emp_mob_no,
      dob: updateClientDetail.emp_dob,
      address: updateClientDetail.address,
      city: "Delhi"
    }
    axios
      .post(`${API_URL}/editUser/${userId}`
        ,data
      )
      .then((res) => {
        if (res.status === 200) {
          handleClose();
          getClientDetail();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getClientHistory = () => {
    const app_id = {
      app_id: id,
    };
    axios
      .post(`${API_URL}/getAppointmentDetails`, app_id)
      .then((res) => {
        if (res.data.success == true) {
          setClientHistory(res.data.data.appointment.employeeHistory);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getClientHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setBriefReportValue((prevValue) => ({
      ...prevValue,
      mb_attach_file: file,
    }));
  };

 

  const getSessationList = () => {
    const employeeId = id;
    let formData = new FormData();
    formData.append("emp_id", employeeId);
    // axios
    //   .post(
    //     "https://onekeycare.com/smportal/Counsellor_Api/session_note_list",
    //     formData
    //   )
    //   .then((res) => {
    //     const temp = res.data.data;
    //     if (res.status === 200) {
    //       setSessationList(res.data.data);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("Error:", err);
    //   });
  };

  useEffect(() => {
    getClientDetail();
    getClientHistory();
    getSessationList();
  }, []);

  const [visibleIndex, setVisibleIndex] = useState(null);

  const viewNote = (index) => {
    setVisibleIndex(index === visibleIndex ? null : index);
  };

  const [openModal, setOpenModal] = useState(false);
  const [notesId, setNotesId] = useState("");
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (noteId) => {
    setOpenModal(true);
    setNotesId(noteId);
  };

  const handleCheckboxChange = (name) => (e) => {
    const newValue = e.target.checked ? "1" : "0";
    setBriefReportValue((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
  };

  const handleCheckboxConsultationLink = (name) => (e) => {
    const newValue = e.target.checked ? "1" : "0";
    setConsultationLink((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
  };

  const handleRefer = () => {
    //do not have apptId and referId
  };

  const downloadFile = (url) => {
    //todo
  };

  return (
    <>
      <div className="flex justify-between py-[16px] px-[32px] gap-8 flex-col sm:flex-row">
        <div className="flex justify-start sm:justify-between items-center gap-8">
          <StyledLink to="/employees">
            <img src={LeftArrow} alt="" />
          </StyledLink>
          <h5 className="h5-bold">Client Profile</h5>
        </div>
        <div className="flex gap-8 flex-col sm:flex-row">
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
              },
            }}
            onClick={handleRefer}
          >
            <span className="btn1">Refer</span>{" "}
          </Button>
          <Button
            variant="outlined"
            sx={{
              display: "flex",
              width: "196px",
              gap: 1,
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
            <img src={EditIcon} alt="" />
            <span className="btn1">Edit</span>{" "}
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{ width: "532px", padding: "16px" }}>
          <h5 style={{ marginBottom: "24px" }} className="h5-bold">
            Client Profile
          </h5>
          <form
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
            action=""
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "100%" }}>
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Name
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="emp_name"
                  value={updateClientProfile.emp_name}
                  onChange={handelChage}
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
                        borderColor: `#d5d2d9`,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "& input::placeholder": {
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "48%" }}>
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Date of Birth
                </label>
                <DatePicker onChange={onChange} value={dateValue} />
              </div>
              <div style={{ width: "48%" }}>
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Age
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="emp_age"
                  value={updateClientProfile.emp_age}
                  disabled
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "& input::placeholder": {
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "48%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  className="p2-sem"
                  style={{ color: "#4A4159" }}
                  htmlFor=""
                >
                  Gender
                </label>
                <Select
                  id="demo-simple-select-helper"
                  value={updateClientProfile.emp_gender}
                  onChange={handelChage}
                  name="emp_gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </div>
              {/* </FormControl> */}
              <div style={{ width: "48%" }}>
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Email
                </label>
                <TextField
                  fullWidth
                  type="email"
                  required
                  name="emp_gmail"
                  value={updateClientProfile.emp_gmail}
                  onChange={handelChage}
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
                        borderColor: `#d5d2d9`,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `#d5d2d9`,
                      },
                      "& input::placeholder": {
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Address
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="emp_adress"
                value={updateClientProfile.emp_adress}
                onChange={handelChage}
              ></textarea>
            </div>
          </form>
        </div>

        <DialogActions>
          <button
            onClick={updateClientDetail}
            className="changeStatusButton cursor-pointer"
          >
            <span>Update</span>
          </button>
          <button
            onClick={handleClose}
            autoFocus
            className="changeReferCancelButton cursor-pointer"
          >
            <span>Close</span>
          </button>
        </DialogActions>
      </Dialog>

      <div
        className="w-full"
        style={{
          padding: "16px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          className="w-full"
          style={{
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid  #D5D2D9",
            background: "#FCFCFC",
          }}
        >
          <div className="flex justify-center items-center text-center flex-col sm:flex-row sm:justify-start mb-6 sm:text-left gap-4">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden object-cover">
              <img
                className="w-[150px] h-[150px]"
                src={`https://onekeycare.com/smportal/uploads/student/${employeeData.m_user_img}`}
                alt="No Img"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h6 className="h6-bold">{employeeData.m_user_name}</h6>
              <p className="body3-sem">
                Class {employeeData.m_class_name} {employeeData.m_sec_name}
              </p>
              <p className="body3-sem">{employeeData.m_user_emailid}</p>
            </div>
          </div>
          <hr style={{ background: "#D5D2D9", marginBottom: "16px" }} />
          <div className="flex justify-between flex-col sm:flex-row">
            <div className="flex flex-row sm:flex-col gap-[25px]">
              <div>
                <p className="body2-sem">Client ID</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {id}
                </p>
              </div>
              <div>
                <p className="body2-sem">Parent Ph no. </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData.m_user_mobileno}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">Joined on</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {getformatedDate(employeeData.m_user_joining_date)}
                </p>
              </div>
              <div>
                <p className="body2-sem">Parent Email </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData.m_user_emailid}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[25px]">
              <div>
                <p className="body2-sem">Gender</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData.m_user_gender === ""
                    ? "Not Specified"
                    : employeeData.m_user_gender}
                </p>
              </div>
              <div>
                <p className="body2-sem">Referred by</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData.m_refered_user}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">DOB</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {getformatedDate(employeeData.m_user_dob)}
                </p>
              </div>
              <div>
                <p className="body2-sem">Address</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData.m_user_address}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">Age </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {isNaN(calculateAge(employeeData.m_user_dob))
                    ? 0
                    : calculateAge(employeeData.m_user_dob)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          className="w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid  #D5D2D9",
            background: "#FCFCFC",
          }}
          onSubmit={handleOpenConsultationLink}
        >
          <h6 className="h6-bold" style={{ color: "#06030D" }}>
            Consultation
          </h6>
          <div className="flex justify-between sm:flex-row flex-col">
            <div className="w-full sm:w-[31%]">
              <p className="p2-sem">Topic</p>
              <TextField
                fullWidth
                variant="outlined"
                name="m_topic"
                value={consultationLink.m_topic}
                onChange={handleChangeConsultation}
                required
                InputProps={{
                  style: {
                    maxWidth: "352px",
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
            <div className="w-full sm:w-[31%]">
              <p className="p2-sem">Meeting ID</p>
              <TextField
                fullWidth
                variant="outlined"
                name="m_meeting_link"
                value={consultationLink.m_meeting_link}
                onChange={handleChangeConsultation}
                required
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
            <div className="w-full sm:w-[31%]">
              <p className="p2-sem">Passcode</p>
              <TextField
                fullWidth
                variant="outlined"
                name="m_passcode"
                value={consultationLink.m_passcode}
                onChange={handleChangeConsultation}
                required
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
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "196px",
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #614298",
              textTransform: "capitalize",
              "&:hover": {
                background: "#614298",
              },
              "@media (max-width: 640px)": {
                width: "100%",
              },
            }}
          >
            <span className="btn1">Send Link</span>
          </Button>
          <Dialog
            open={consultationPopup}
            onClose={handleCloseConsultationLink}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="appointmentDilog"
          >
            <div className="w-[100%] sm:w-[532px] p-[16px]">
              <h5 style={{ textAlign: "center" }} className="h5-bold">
                Consultation
              </h5>
              <form onSubmit={handleSubmitConsultationLink}>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                  }}
                >
                  <div>
                    <p className="p2-bold" style={{ color: "#4A4159" }}>
                      Topic
                    </p>
                    <p className="body3-reg">{consultationLink.m_topic}</p>
                  </div>
                  <div>
                    <p className="p2-bold" style={{ color: "#4A4159" }}>
                      Meeting Link
                    </p>
                    <p className="body3-reg">
                      {consultationLink.m_meeting_link}
                    </p>
                  </div>
                  <div>
                    <p className="p2-bold" style={{ color: "#4A4159" }}>
                      Passcode
                    </p>
                    <p className="body3-reg">{consultationLink.m_passcode}</p>
                  </div>
                  <div className="w-full">
                    <h2 className="p2-bold">Send link to</h2>
                    <div className="flex sm:gap-[20px] gap-[6px]">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={consultationLink.m_send_parent === "1"}
                            onChange={handleCheckboxConsultationLink(
                              "m_send_parent"
                            )}
                            value={consultationLink.m_send_parent}
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
                            checked={consultationLink.m_send_teacher === "1"}
                            onChange={handleCheckboxConsultationLink(
                              "m_send_teacher"
                            )}
                            value={consultationLink.m_send_teacher}
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
                    </div>
                  </div>
                </div>
                <DialogActions>
                  <button
                    className="changeStatusButton cursor-pointer"
                    type="submit"
                  >
                    Send
                  </button>
                  <button
                    className="changeReferCancelButton cursor-pointer"
                    onClick={handleCloseConsultationLink}
                  >
                    Cancel
                  </button>
                </DialogActions>
              </form>
            </div>
          </Dialog>
        </form>

        <div style={{ marginTop: "16px" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, width: "470px", marginBottom: "24px" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Counsellor Summary"
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
                  label="Sage Turtle Summary"
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

            <TabPanel
              value="1"
              sx={{
                "@media (max-width: 640px)": {
                  padding: "0px",
                },
              }}
            >
              <div
                className="w-full"
                style={{
                  padding: "24px",
                  "@media (max-width: 640px)": {
                    padding: "0px",
                  },
                  borderRadius: "16px",
                  border: "1px solid  #D5D2D9",
                  background: "#FCFCFC",
                }}
              >
                <div className="flex justify-between flex-col sm:flex-row">
                  <div>
                    <h5
                      className="h5-bold"
                      onClick={handleClientHistory}
                      style={{ cursor: "pointer", display: "flex", gap: 8 }}
                    >
                      Client History
                      <img src={CollapseArrow} alt="" />
                    </h5>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        display: "flex",
                        width: "223px",
                        gap: 0.5,
                        height: "48px",
                        padding: "14px 15px 14px 12px",
                        borderRadius: "8px",
                        border: "1px solid #614298",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          width: "100%",
                          marginTop: "10px",
                        },
                      }}
                      onClick={() => {
                        navigate(
                          `/employees/employeeDetails/employeehistory/${id}`,
                          { replace: true }
                        );
                      }}
                    >
                      <img src={AddIcon} alt="" />
                      <span className="btn1">Add Client History</span>{" "}
                    </Button>
                  </div>
                </div>

                {!isClientHistory && (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {history !== undefined ? (
                      <div>
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                            <div>
                              <p className="body2-sem">Intake Date</p>
                              <p className="body3-reg">
                                {history?.sp_family_living
                                  ? history.sp_family_living
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">Age</p>
                              <p className="body3-reg">
                                {history.sp_student_age
                                  ? history.sp_student_age
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">
                                Presenting Problem (clients initial explanation
                                of the problem, duration and pertinent cause)
                              </p>
                              <p className="body3-reg">
                                {history.sp_present_problem
                                  ? history.sp_present_problem
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">
                                Tentative Goals and Plans
                              </p>
                              <p className="body3-reg">
                                {history.sp_tentative_goal
                                  ? history.sp_tentative_goal
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">
                                Special Needs of Client (e.g. Need for
                                Interpreter, Disability, Religious Consultant,
                                etc. if yes, what?
                              </p>
                              <p className="body3-reg">
                                {history.sp_special_needs
                                  ? history.sp_special_needs
                                  : "N/a"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                            <div>
                              <p className="body2-sem">
                                Family (current living situation){" "}
                              </p>
                              <p className="body3-reg">
                                {history.sp_family_history
                                  ? history.sp_family_living
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">Family History</p>
                              <p className="body3-reg">
                                {history.sp_family_history
                                  ? history.sp_family_history
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">
                                Pertinent History (any prior therapy including
                                family, social, psychological, and
                                medical-declared condition)
                              </p>
                              <p className="body3-reg">
                                {history.sp_pertinent_history
                                  ? history.sp_pertinent_history
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">Observations</p>
                              <p className="body3-reg">
                                {history.sp_observations
                                  ? history.sp_observations
                                  : "N/a"}
                              </p>
                            </div>
                            <div>
                              <p className="body2-sem">Diagnostic Impression</p>
                              <p className="body3-reg">None</p>
                            </div>
                          </div>
                        </div>

                        <hr
                          style={{ margin: "10px 0px", background: "#D5D2D9" }}
                        />

                        <div
                          className="2nd"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div>
                            <h6
                              className="h6-bold"
                              style={{ color: "#06030D" }}
                            >
                              MSE
                            </h6>
                          </div>
                          <div className="flex sm:flex-row flex-col">
                            <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                              <div>
                                <p className="body2-sem">Appearance</p>
                                <p className="body3-reg">
                                  {history.sp_appearance}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Orientation</p>
                                <p className="body3-reg">None</p>
                              </div>
                              <div>
                                <p className="body2-sem">Speech</p>
                                <p className="body3-reg">{history.sp_speech}</p>
                              </div>
                              <div>
                                <p className="body2-sem">
                                  Thought Process and Content
                                </p>
                                <p className="body3-reg">
                                  {history.sp_thought_process}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Sleep</p>
                                <p className="body3-reg">{history.sp_sleep}</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                              <div>
                                <p className="body2-sem">Behaviour</p>
                                <p className="body3-reg">
                                  {history.sp_behaviour}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Mood</p>
                                <p className="body3-reg">{history.sp_mood}</p>
                              </div>
                              <div>
                                <p className="body2-sem">Affect</p>
                                <p className="body3-reg">{history.sp_affect}</p>
                              </div>
                              <div>
                                <p className="body2-sem">Judgement</p>
                                <p className="body3-reg">
                                  {history.sp_judgement}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Appetite</p>
                                <p className="body3-reg">
                                  {history.sp_appetite}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>No Data Found</span>
                    )}
                  </div>
                )}
              </div>

              <div
                className="w-full"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid  #D5D2D9",
                  background: "#FCFCFC",
                  marginTop: "16px",
                }}
              >
                <div className="flex justify-between flex-col sm:flex-row">
                  <div>
                    <h5
                      className="h5-bold"
                      onClick={handleSessionNote}
                      style={{ cursor: "pointer", display: "flex", gap: 8 }}
                    >
                      Session Note
                      <img src={CollapseArrow} alt="" />
                    </h5>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        display: "flex",
                        width: "223px",
                        gap: 0.5,
                        height: "48px",
                        padding: "14px 15px 14px 12px",
                        borderRadius: "8px",
                        border: "1px solid #614298",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          width: "100%",
                          marginTop: "10px",
                        },
                      }}
                      onClick={() => {
                        navigate(`/employeesessationnotes/${id}`);
                      }}
                    >
                      <img src={AddIcon} alt="" />
                      <span className="btn1">Add Session Note</span>{" "}
                    </Button>
                  </div>
                </div>

                {sessationList.length !== 0 &&
                  !isSessionNote &&
                  sessationList?.map((item, index) => {
                    return (
                      <>
                        <div
                          style={{
                            borderBottom: "1px solid #D5D2D9",
                            marginTop: "16px",
                          }}
                        />
                        <div className="flex justify-between mt-[10px] sm:flex-row flex-col-reverse">
                          <div className="flex w-[48%] justify-between sm:flex-row flex-col">
                            <div>
                              <p className="body2-sem">Session ID</p>
                              <p className="body3-reg">{item.s_note_id}</p>
                            </div>
                            <div>
                              <p className="body2-sem">Date/Time</p>
                              <p className="body3-reg">
                                {getformatedDate(item.s_note_added_on)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 sm:flex-row flex-col">
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
                                  marginBottom: "10px",
                                },
                              }}
                              onClick={() => viewNote(index)}
                            >
                              <img src={ViewIcon} alt="" />
                              <span className="btn1">View Note</span>{" "}
                            </Button>
                          </div>
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
                                style: {
                                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                                },
                              },
                            }}
                          >
                            <Fade in={openModal}>
                              <Box sx={style}>
                                <div className="flex flex-col gap-4 justify-center items-center">
                                  <h1 className="h5-bold mb-4">Send Report</h1>
                                  <label
                                    htmlFor="fileInput"
                                    className="briefAttachement cursor-pointer"
                                  >
                                    <img src={AddBreifIcon} alt="" />
                                    {briefReportValue.mb_attach_file ? (
                                      <p className="p1-bold">
                                        {briefReportValue.mb_attach_file.name}
                                      </p>
                                    ) : (
                                      <h1 className="p1-bold">Add File</h1>
                                    )}
                                    <h2 className="p2-bold">
                                      File should be below( limit)
                                    </h2>
                                  </label>
                                  <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                  />
                                  <div className="w-full">
                                    <h2>Send report to</h2>
                                    <div className="flex sm:gap-[20px] gap-[6px]">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              briefReportValue.m_send_parent ===
                                              "1"
                                            }
                                            onChange={handleCheckboxChange(
                                              "m_send_parent"
                                            )}
                                            value={
                                              briefReportValue.m_send_parent
                                            }
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
                                            checked={
                                              briefReportValue.m_send_teacher ===
                                              "1"
                                            }
                                            onChange={handleCheckboxChange(
                                              "m_send_teacher"
                                            )}
                                            value={
                                              briefReportValue.m_send_teacher
                                            }
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
                                            checked={
                                              briefReportValue.mb_principal_id ===
                                              "1"
                                            }
                                            onChange={handleCheckboxChange(
                                              "mb_principal_id"
                                            )}
                                            value={
                                              briefReportValue.mb_principal_id
                                            }
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
                                  <div className="w-full flex justify-end gap-4">
                                    <button
                                      className="changeStatusButton cursor-pointer"
                                      onClick={handleSaveBriefReport}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="changeReferCancelButton cursor-pointer"
                                      onClick={handleCloseModal}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </Box>
                            </Fade>
                          </Modal>
                        </div>
                        {visibleIndex === index && (
                          <div
                            style={{
                              marginTop: "16px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div className="flex sm:flex-row flex-col-reverse">
                              <div className="flex flex-col w-full sm:w-[39.5%] gap-[24px]">
                                <div>
                                  <p className="body2-sem">
                                    Diagnostic Impression{" "}
                                  </p>
                                  <p className="body3-reg">
                                    {item.s_note_diag_imp
                                      ? item.s_note_diag_imp
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">Observations</p>
                                  <p className="body3-reg">
                                    {item.s_observation
                                      ? item.s_observation
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">
                                    Therapeutic Intervention
                                  </p>
                                  <p className="body3-reg">
                                    {item.s_thera_int
                                      ? item.s_thera_int
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">
                                    Planned Intervention (for upcoming sessions)
                                  </p>
                                  <p className="body3-reg">
                                    {item.s_plan_int ? item.s_plan_int : "N/a"}
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
                                      border: "1px solid #614298",
                                      textTransform: "capitalize",
                                      gap: 1,
                                      "&:hover": {
                                        background: "#614298",
                                      },
                                    }}
                                    onClick={() => {
                                      downloadFile(item.s_note_attachment);
                                    }}
                                  >
                                    <img src={DownloadIcon} alt="" />
                                    <span className="btn2">
                                      Download Consent
                                    </span>{" "}
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-col w-full sm:w-[39.5%] gap-[24px]">
                                <div>
                                  <p className="body2-sem">Session Focus</p>
                                  <p className="body3-reg">
                                    {item.s_session_focus
                                      ? item.s_session_focus
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">Client Goals</p>
                                  <p className="body3-reg">
                                    {item.s_student_goals
                                      ? item.s_student_goals
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">Tasks Given</p>
                                  <p className="body3-reg">
                                    {item.s_task_given
                                      ? item.s_task_given
                                      : "N/a"}
                                  </p>
                                </div>
                                <div>
                                  <p className="body2-sem">
                                    Important Notes (if any)
                                  </p>
                                  <p className="body3-reg">
                                    {item.s_imp_note ? item.s_imp_note : "N/a"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
              </div>

              <div
                className="w-full"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid  #D5D2D9",
                  background: "#FCFCFC",
                  marginTop: "16px",
                }}
              >
                <div className="flex justify-between flex-col sm:flex-row">
                  <div>
                    <h5
                      className="h5-bold"
                      onClick={handleAssessmentScore}
                      style={{ cursor: "pointer", display: "flex", gap: 8 }}
                    >
                      Assessment Score
                      <img src={CollapseArrow} alt="" />
                    </h5>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        display: "flex",
                        width: "196px",
                        gap: 0.5,
                        height: "48px",
                        borderRadius: "8px",
                        border: "1px solid #614298",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          width: "100%",
                          marginTop: "10px",
                        },
                      }}
                    >
                      <span className="btn2">Send Assessment Summary</span>{" "}
                    </Button>
                  </div>
                </div>

                {!isAssessmentScore && (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginTop: "24px" }}>
                      {viewportWidth >= 640 ? (
                        <Paper
                          elevation={0}
                          sx={{ width: "100%", overflow: "hidden" }}
                        >
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  {columnsCore.map((column) => (
                                    <TableCell
                                      key={column.id}
                                      className="body3-sem"
                                    >
                                      {column.id}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Array.isArray(rowsScore) &&
                                  rowsScore
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
                                          sx={{ padding: "16px" }}
                                        >
                                          <TableCell
                                            align="left"
                                            className="body3-reg"
                                          >
                                            <StyledLink
                                              className="link"
                                              sx={{
                                                textDecoration: "none",
                                                color: "#06030D",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  textDecoration: "none",
                                                }}
                                              >
                                                {row["Assessment ID"]}
                                              </div>
                                            </StyledLink>
                                          </TableCell>

                                          <TableCell
                                            align="left"
                                            className="body3-reg"
                                          >
                                            <StyledLink
                                              sx={{ textDecoration: "none" }}
                                            >
                                              <div>{row.Name}</div>
                                            </StyledLink>
                                          </TableCell>
                                          <TableCell
                                            align="left"
                                            className="body3-reg"
                                          >
                                            <StyledLink>
                                              <div>{row["Date"]}</div>
                                            </StyledLink>
                                          </TableCell>
                                          <TableCell
                                            align="left"
                                            className="body3-reg"
                                          >
                                            <StyledLink>
                                              <div>{row.score}</div>
                                            </StyledLink>
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
                            count={rowsScore.length}
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
                          {Array.isArray(rowsScore) &&
                            rowsScore
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
                                      <div className="body3-sem w-[50%]">
                                        Client
                                      </div>
                                      <div className="body3-reg pr-2 w-[50%]">
                                        {item.Name}
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
                                          Date/Time
                                        </div>
                                        <div className="body3-reg pr-2 w-[50%]">
                                          {item.name}
                                        </div>
                                      </div>
                                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                        <div className="body3-sem w-[50%]">
                                          Score
                                        </div>
                                        <div className="body3-reg pr-2 w-[50%]">
                                          {item.score}
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
                            count={rowsScore.length}
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
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div
                className="w-full"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid  #D5D2D9",
                  background: "#FCFCFC",
                }}
              >
                No Data Found
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </>
  );
};

export default ClientDetails;
