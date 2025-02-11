import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeftArrow from "../../assets/LeftArrow.svg";
import ViewIcon from "../../assets/ViewIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import EditIcon from "../../assets/EditProfileIcon.svg";
import CollapseArrow from "../../assets/collapseArrow.svg";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../constant/ApiConstant";
import SendButton from "../../assets/SendButton.svg";
import { useSelector } from "react-redux";
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
  Stack,
  Chip,
  TextField,
  Box,
  Dialog,
  DialogActions,
  FormControlLabel,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import { calculateAge, getformatedDate } from "../../constant/constatnt";
import vector from "../../assets/Vector.svg";
import { useSocket } from "../../getSocket";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  paddingTop: "32px",
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const EmployeeColumns = [
  {},
  {
    id: "Name",
  },
  {
    id: "Type",
  },
  {
    id: "experience",
  },
  {
    id: "Gender",
  },
  {
    id: "Specilization",
  },
];
const EmployeeColumnsess = [
  {
    id: "Name",
  },
  {
    id: "Type",
  },
  {
    id: "Experience",
  },
  {
    id: "Gender",
  },
  {
    id: "Specilization",
  },
  {
    id: "Action",
  },
];
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

const styleEmp = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "73vh",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const referStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "90vh",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

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
  const [modalPre, setModalPre] = useState(false);
  const [modalSess, setModalSess] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updateClientProfile, setUpdateClientProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [sessationList, setSessationList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [specilisation, setSpecilisation] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [consultationLink, setConsultationLink] = useState(
    initialValueConsultation
  );
  const [listOfIds, setListOfIds] = useState([]);
  const [clientHistoryDetails, setClientHistoryDetails] = useState({});
  const fileRef = useRef(null);
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredmanagersEmp, setFilteredmanagersEmp] =
  //   useState(selectedEmployeeIdss);
  const [selectedItemsArray, setSelectedItemsArray] = useState([]);

  const details = useSelector((state) => state.userDetails);

  const [dateValue, setDateValue] = useState(new Date());
  const handleInputChange = (event) => {
    setNote(event.target.value);
  };
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedConcern, setSelectedConcern] = useState("");
  const [sendSessiondata, setSendSessiondata] = useState({
    notes: "",
    clientId: id,
    therapistId: "",
  });
  const [openModaln, setModaln] = useState(false);

  const [speciality, setSpeciality] = useState([]);
  const [concern, setConcern] = useState([]);
  const socket = useSocket();
  useEffect(() => {
    setSelectedItemsArray([
      selectedGender,
      selectedSpeciality,
      selectedConcern,
    ]);
  }, [selectedGender, selectedSpeciality, selectedConcern]);

  // const [sendReferal, setReferal] = useState({
  //   therapistId: listOfIds,
  //   clientId: id,
  //   notes: note,
  // });
  const handleMobileNumberChange = (e) => {
    const inputValue = e.target.value;
    const name = e.target.name;

    // Remove any non-digit characters except for the first '+'
    const digitsOnly = inputValue.replace(/\D/g, "");

    // Ensure the number starts with +91 and is followed by up to 10 digits
    let cleanedValue = digitsOnly.substring(0, 10);

    // If the input is being deleted entirely, allow the field to be empty
    if (digitsOnly.length === 0) {
      cleanedValue = "";
    }

    setUpdateClientProfile({
      ...updateClientProfile,
      [name]: cleanedValue,
    });
  };
  const handleNotesChange = (event) => {
    setSendSessiondata({
      ...sendSessiondata,
      notes: event.target.value,
    });
  };

  const handleOpenModaln = () => {
    setModaln(true);
  };
  const handleCloseModaln = () => {
    setModaln(false);
  };

  const sendReferalsess = () => {
    axios
      .post(`${API_URL}/sendSessionReferral`, sendSessiondata)
      .then((res) => {
        if (res.status == 201) {
          toast.success(`you have successfull send the referal`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
          socket.emit("therapist", {
            title: " Referal Recieved",
            message: `${employeeData.name} is refert to u i thas been refer by ${details.name}`,
            role: "therapist",
            userId: sendSessiondata.therapistId,
          });
          handleCloseModaln();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const sendReferalpre = () => {
    const data = {
      therapistIds: listOfIds,
      clientId: id,
      notes: note,
      referrerId: "12345",
    };
    axios
      .post(`${API_URL}/sendPreReferral`, data)
      .then((res) => {
        if (res.status == 201) {
          toast.success(`you have successfull send the referal`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
          listOfIds.forEach((userId, index) => {
            setTimeout(() => {
              socket.emit("therapist", {
                title: " Referal Recieved",
                message: `${employeeData.name} has been referred to you by ${details.name}`,
                role: "therapist",
                userId: userId,
              });
            }, index * 500); // Delay of 100ms (1 second) between each emission
          });
          closeModalPre();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfTherapist = () => {
    axios
      .get(`${API_URL}/listOfTherapist`)
      .then((res) => {
        if (res.status == 200) {
          setSelectedEmployeeIds(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfConcern = () => {
    axios
      .get(`${API_URL}/getConcern`)
      .then((res) => {
        if (res.status == 200) {
          // Assuming the API response data is an array of objects with a 'name' property
          const concernNames = res.data.data.map((item) => item.name);
          setConcern(concernNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfSpeciality = () => {
    axios
      .get(`${API_URL}/getSpeciality`)
      .then((res) => {
        if (res.status == 200) {
          // Assuming the API response data is an array of objects with a 'name' property
          const specialityNames = res.data.data.map((item) => item.name);
          setSpeciality(specialityNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  useEffect(() => {
    ListOfTherapist();
    ListOfConcern();
    ListOfSpeciality();
    setListOfIds([]);
  }, []);
  // const filteredmanagersEmps = selectedEmployeeIds;
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredmanagersEmps = selectedEmployeeIds.filter((employee) => {
    return (
      (!selectedGender ||
        employee?.profile_details?.gender === selectedGender) &&
      (!selectedSpeciality ||
        employee?.profile_details?.specialization?.toLowerCase() ===
          selectedSpeciality?.toLowerCase()) &&
      (!selectedConcern || employee?.concerns?.includes(selectedConcern)) &&
      (!searchTerm ||
        employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // const handleCheckboxChange = (event, index) => {

  //   if (event.target.checked) {
  //     // setSelectedEmployeeIds([...selectedEmployeeIds, index]);
  //     setListOfIds([...listOfIds, index]);
  //   } else {
  //     setSelectedEmployeeIds(
  //       selectedEmployeeIds.filter((_id) => _id !== index)
  //     );
  //     setListOfIds(listOfIds.filter((_id) => _id !== index));
  //   }
  // };
  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      // If checked, add the ID to the list
      setListOfIds((prevIds) => [...prevIds, id]);
    } else {
      // If unchecked, remove the ID from the list
      setListOfIds((prevIds) => prevIds.filter((_id) => _id !== id));
    }
  };
  // const handleCheckboxChange = (event, index) => {};
  // setListOfIds((prevList) => [...prevList, index]);
  // const handleSelectAllCheckboxChangeForAddEmp = (event) => {
  //   if (event.target.checked) {
  //     const allEmployeeIds = filteredmanagersEmps.map(
  //       (employee) => employee._id
  //     );
  //     setSelectedEmployeeIddd(allEmployeeIds);
  //   } else {
  //     setSelectedEmployeeIddd([]);
  //   }
  // };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSpecialityChange = (e) => {
    setSelectedSpeciality(e.target.value);
  };

  const handleConcernChange = (e) => {
    setSelectedConcern(e.target.value);
  };
  const handleOpenConsultationLink = (e) => {
    e.preventDefault();

    const updatedConsultationLink = {
      ...consultationLink,
      counsellor_email: employeeData.email,
    };
    setConsultationLink(updatedConsultationLink);
    const data = {
      user_email: employeeData.email,
      topic: updatedConsultationLink.topic,
      meet_link: updatedConsultationLink.meet_link,
    };
    axios
      .post(`${API_URL}/sendMeetLink `, data)
      .then((res) => {
        if (res.status == 200) {
          setConsultationLink({
            counsellor_email: "",
            employee_email: "",
            meet_link: "",
            topic: "",
          });
          alert("send successfully");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getSignedUrl = async () => {
    try {
      const res = await axios.get(`${API_URL}/uploadImage`);
      if (res.status === 200) {
        return res.data.data;
      } else {
        throw new Error("Failed to get signed URL");
      }
    } catch (error) {
      console.error("Error getting signed URL", error);
      throw error;
    }
  };

  const uploadImageToS3 = async (url) => {
    try {
      const res = await axios.put(url, image, {
        headers: {
          "Content-Type": image.type, // Ensure the correct Content-Type
          Authorization: undefined, // Explicitly override and remove the global Authorization header
        },
      });
      if (res.status === 200) {
        return true;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image to S3", error.response || error);
      throw error;
    }
  };
  const updateProfilePicture = async (imageUrl) => {
    try {
      const res = await axios.post(`${API_URL}//uploadClientProfilePicture`, {
        imageUrl: imageUrl,
        userId: employeeData._id,
      });
      if (res.status === 200) {
        console.log("Profile picture updated successfully", res);
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture", error);
      throw error;
    }
  };

  const getImageUrl = async () => {
    try {
      const { url, imageName } = await getSignedUrl();
      await uploadImageToS3(url);
      const imageUrl = `https://corportal.s3.ap-south-1.amazonaws.com/upload/profilePic/${imageName}`;
      await updateProfilePicture(imageUrl);
      getClientDetail();
    } catch (error) {
      console.error("Error in image upload process", error);
      alert("Error uploading file");
    }
  };

  useEffect(() => {
    if (image) {
      getImageUrl();
    }
  }, [image]);

  const handleChangeConsultation = (e) => {
    const { name, value } = e.target;
    setConsultationLink((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleSpecilisationChange = (e) => {
    setSpecilisation(e.target.value);
  };

  const handleDeleteChip = (item) => {
    if (item === selectedGender) {
      setSelectedGender("");
    } else if (item === specilisation) {
      setSpecilisation("");
    } else if (item === concern) {
      setSelectedConcern("");
    }
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
  const { type } = useParams();
  const [briefReportValue, setBriefReportValue] = useState(
    brief_report_initial_Value
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const openModalPre = () => {
    if (type == "pre") {
      setModalPre(true);
    } else {
      setModalSess(true);
    }
  };
  const closeModalPre = () => {
    if (type == "pre") {
      setModalPre(false);
    } else {
      setModalSess(false);
    }
  };

  const handleClientHistory = () => {
    setClientHistory(!isClientHistory);
  };
  const getClientHistory = () => {
    axios
      .get(`${API_URL}/getClientHistory/${id}`)
      .then((res) => {
        if (res.status == 200) {
          setClientHistoryDetails(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const sendSessionNote = () => {
    axios
      .post(`${API_URL}/sendSessionNotes `, {
        userId: id,
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success(
            `you have been send the notification to refer therapist`,
            {
              position: "top-center", // Set the position to top-right
              duration: 3000, // Display for 3 seconds (3000 ms)
              style: {
                fontWeight: "bold",
                fontSize: "14px", // Smaller text
              },
            }
          );
          // setClientHistoryDetails(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(`${err.response.data.message}`, {
          position: "top-center", // Set the position to top-right
          duration: 3000, // Display for 3 seconds (3000 ms)
          style: {
            fontWeight: "bold",
            fontSize: "14px", // Smaller text
          },
        });

        console.log(err);
      });
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

  const getClientDetail = () => {
    axios
      .get(`${API_URL}/getUserDetails/${id}`)
      .then((res) => {
        if (res.status == 200) {
          const employeeDetials = res.data.data;
          setClientData(employeeDetials);
          setClientHistory(employeeDetials.employeeHistory);
          setUpdateClientProfile((prevState) => ({
            ...prevState,
            emp_gmail: employeeDetials.email, // Dynamically update the property based on the key
          }));
          setDateValue(employeeDetials.emp_dob);

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

  const updateClientDetail = (event) => {
    event.preventDefault();
    const data = {
      userId: id,
      name: updateClientProfile.emp_name,
      gender: updateClientProfile.gender,
      emailId: updateClientProfile.emp_gmail,
      phoneNumber: updateClientProfile.emp_mob_no,
      dob: updateClientProfile.emp_dob,
      address: updateClientProfile.address,
      city: "Delhi",
    };
    axios
      .post(`${API_URL}/editUser`, data)
      .then((res) => {
        if (res.status == 200) {
          handleClose();
          getClientDetail();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getSessationList = () => {
    axios
      .post(`${API_URL}/getAllSessionNotesByUserId`, { userId: id })
      .then((res) => {
        // const temp = res.data.data;
        if (res.status == 200) {
          setSessationList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getClientDetail();
    getSessationList();
    getClientHistory();
  }, [open]);

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

  // const handleCheckboxChanges = (name) => (e) => {
  //   const newValue = e.target.checked ? "1" : "0";
  //   setBriefReportValue((prevValue) => ({
  //     ...prevValue,
  //     [name]: newValue,
  //   }));
  // };

  // const handleCheckboxConsultationLink = (name) => (e) => {
  //   const newValue = e.target.checked ? "1" : "0";
  //   setConsultationLink((prevValue) => ({
  //     ...prevValue,
  //     [name]: newValue,
  //   }));
  // };

  const handleRefer = () => {
    //do not have apptId and referId
  };

  const downloadFile = (url) => {
    //todo
  };
  // const handleSelectAllCheckboxChangeForAddEmp = (event) => {
  //   if (event.target.checked) {
  //     const allEmployeeIds = filteredtotalEmployee.map(
  //       (employee) => employee.emp_id
  //     );
  //     setSelectedEmployeeIds(allEmployeeIds);
  //   } else {
  //     setSelectedEmployeeIds([]);
  //   }
  // };

  const handleDateChange = (date) => {
    setDateValue(date);
    setUpdateClientProfile({
      ...updateClientProfile,
      emp_dob: date,
    });
  };

  return (
    <>
      <div className="flex justify-between py-[16px] px-[32px] gap-8 flex-col sm:flex-row">
        <div className="flex justify-start sm:justify-between items-center gap-8">
          <div
            style={{
              color: "#06030d",
            }}
            onClick={() => navigate(-1)}
          >
            {" "}
            <img src={LeftArrow} alt="" />
          </div>
          <h5 className="h5-bold">Client Profile</h5>
        </div>
        <div className="flex gap-8 flex-col sm:flex-row">
          <Button
            variant="outlined"
            sx={{
              display: "flex",
              width: "126px",
              gap: 1,
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #614298",
              color: "#614298",
              textTransform: "capitalize",
              "@media (max-width: 640px)": {
                width: "100%",
              },
            }}
            onClick={openModalPre}
          >
            <span className="btn1">Refer</span>{" "}
          </Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalPre}
            onClose={closeModalPre}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            }}
          >
            <Fade in={modalPre} sx={referStyle}>
              <Box className="text-start overflow-auto ">
                <div className="flex flex-col px-[30px] mt-[30px]">
                  <h1 className="h5-bold mb-8">Refer to Therapist</h1>
                  <div className="flex w-full gap-4 items-center">
                    <TextField
                      type="text"
                      name="searchTerm"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={vector} alt="search icon" />
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: "16px",
                          fontFamily: "Nunito",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          letterSpacing: "0.08px",
                          height: "40px", // Increase the height
                          width: "100%", // Set width to occupy full container width
                          borderRadius: "8px",
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

                    <div className="flex items-center gap-5 ml-[32px] justify-end">
                      <h2 className="body3-sem">Filters :</h2>
                      {/* Gender filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="genderSelect"
                          className="custom-select"
                          value={selectedGender}
                          onChange={handleGenderChange}
                        >
                          <option value="">Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Speciality filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="specialitySelect"
                          className="custom-select"
                          value={selectedSpeciality}
                          onChange={handleSpecialityChange}
                        >
                          <option value="">Speciality</option>
                          {/* Populate location options */}
                          {speciality.map((Speciality, index) => (
                            <option key={index} value={Speciality}>
                              {Speciality}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Concern filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="concernSelect"
                          className="custom-select"
                          value={selectedConcern}
                          onChange={handleConcernChange}
                        >
                          <option value="">Concern</option>
                          {concern.map((Concern, index) => (
                            <option key={index} value={Concern}>
                              {Concern}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <TableContainer
                    sx={{ marginTop: "20px", height: 300, overflowY: "auto" }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow className="addEmployee1">
                          {EmployeeColumns.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className="addEmployee2">
                        {Array.isArray(filteredmanagersEmps) &&
                          filteredmanagersEmps
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
                                  sx={{ cursor: "pointer" }}
                                >
                                  <TableCell
                                    align="left"
                                    className="body3-reg p-0"
                                  >
                                    <Checkbox
                                      className="checkbox"
                                      size="large"
                                      sx={{ borderRadius: "6px" }}
                                      checked={listOfIds.includes(row._id)}
                                      onChange={(event) =>
                                        handleCheckboxChange(event, row._id)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.name}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>External</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.profile_details?.experience}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.profile_details?.gender}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.profile_details?.specialization}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="flex justify-between flex-row-reverse items-center mt-2">
                    <TablePagination
                      className="body3-sem"
                      rowsPerPageOptions={[10, 25, 100, 125]}
                      component="div"
                      count={filteredmanagersEmps.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Show:"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} of ${count} items`
                      }
                      sx={{
                        "& .MuiTablePagination-select": {
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
                  </div>
                </div>
                <div className="w-full flex flex-col justify-center px-[30px]">
                  <h1 className="p1-sem mb-2">Add Note</h1>
                  <textarea
                    style={{ width: "100%", borderRadius: "8px" }}
                    id="myTextArea"
                    rows="4"
                    cols="500"
                    name="degree"
                    value={note}
                    placeholder="Add Notes Here"
                    onChange={handleInputChange}
                  ></textarea>
                  {/* Move the button container here */}
                  <div className="flex mb-[30px] justify-end mt-10 gap-8">
                    <Button
                      style={{
                        width: "198px",
                        cursor: "pointer",
                        height: "48px",
                        border: "2px solid #614298",
                        borderRadius: "8px",
                        background: "#614298",
                        color: "#ffffff",
                        fontFamily: "Nunito",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        lineHeight: "14px",
                        textTransform: "capitalize",
                      }}
                      onClick={sendReferalpre}
                    >
                      <span>Send Referral Request</span>
                    </Button>
                    <Button
                      autoFocus
                      sx={{
                        width: "198px",
                        cursor: "pointer",
                        height: "48px",
                        border: "2px solid #614298",
                        borderRadius: "8px",
                        color: "#614298",
                        fontFamily: "Nunito",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        lineHeight: "14px",
                        textTransform: "capitalize",
                      }}
                      onClick={closeModalPre}
                    >
                      <span>Closed</span>
                    </Button>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalSess}
            onClose={closeModalPre}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            }}
          >
            <Fade in={modalSess} sx={styleEmp}>
              <Box className="text-start w-[100%]">
                <div className="flex flex-col px-[30px] mt-[30px]">
                  <h1 className="h5-bold mb-8">Refer to Therapist</h1>
                  <div className="flex w-full gap-4 items-center">
                    <TextField
                      type="text"
                      required
                      name="searchTerm"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-[50%] flex-grow"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={vector} alt="search icon" />
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: "16px",
                          fontFamily: "Nunito",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          letterSpacing: "0.08px",
                          height: "40px", // Increase the height
                          width: "100%", // Set width to occupy full container width
                          borderRadius: "8px",
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

                    <div className="flex items-center gap-5 ml-[32px] justify-end">
                      <h2 className="body3-sem">Filters :</h2>
                      {/* Gender filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="genderSelect"
                          className="custom-select"
                          value={selectedGender}
                          onChange={handleGenderChange}
                        >
                          <option value="">Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Speciality filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="specialitySelect"
                          className="custom-select"
                          value={selectedSpeciality}
                          onChange={handleSpecialityChange}
                        >
                          <option value="">Speciality</option>
                          {/* Populate location options */}
                          {speciality.map((Speciality, index) => (
                            <option key={index} value={Speciality}>
                              {Speciality}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Concern filter */}
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          height: "40px",
                        }}
                      >
                        <select
                          id="concernSelect"
                          className="custom-select"
                          value={selectedConcern}
                          onChange={handleConcernChange}
                        >
                          <option value="">Concern</option>
                          {concern.map((Concern, index) => (
                            <option key={index} value={Concern}>
                              {Concern}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <TableContainer
                    sx={{ marginTop: "20px", height: 300, overflowY: "auto" }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow className="addEmployee1">
                          {EmployeeColumnsess.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className="addEmployee2">
                        {Array.isArray(filteredmanagersEmps) &&
                          filteredmanagersEmps
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
                                  sx={{ cursor: "pointer" }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.name}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>External</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.profile_details?.experience}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.profile_details?.gender}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.profile_details?.specialization}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      style={{
                                        width: "160px",
                                        cursor: "pointer",
                                        height: "48px",
                                        border: "2px solid #614298",
                                        borderRadius: "8px",
                                        color: "#614298",
                                        fontFamily: "Nunito",
                                        fontSize: "1.5rem",
                                        fontWeight: "700",
                                        lineHeight: "14px",
                                        textTransform: "capitalize",
                                      }}
                                      onClick={() => {
                                        handleOpenModaln();
                                        setSendSessiondata((prevState) => ({
                                          ...prevState,
                                          therapistId: row._id,
                                        }));
                                      }}
                                    >
                                      <span>Refer</span>
                                    </Button>
                                  </TableCell>
                                  <Modal
                                    aria-labelledby="transition-modal-title"
                                    aria-describedby="transition-modal-description"
                                    open={openModaln}
                                    onClose={handleCloseModaln}
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
                                    <Fade in={openModaln}>
                                      <Box sx={style} className="text-center">
                                        <div className="w-full flex flex-col justify-center px-[30px]">
                                          <h1 className="h5-bold mb-2">
                                            Add Note
                                          </h1>
                                          <textarea
                                            style={{
                                              width: "100%",
                                              borderRadius: "8px",
                                            }}
                                            id="myTextArea"
                                            rows="4"
                                            cols="500"
                                            placeholder="Add Notes Here"
                                            value={sendSessiondata.notes}
                                            onChange={handleNotesChange}
                                          ></textarea>
                                          {/* Move the button container here */}
                                          <div className="flex mb-[30px] justify-end mt-10 gap-8">
                                            <Button
                                              style={{
                                                width: "198px",
                                                cursor: "pointer",
                                                height: "48px",
                                                border: "2px solid #614298",
                                                borderRadius: "8px",
                                                background: "#614298",
                                                color: "#ffffff",
                                                fontFamily: "Nunito",
                                                fontSize: "1.5rem",
                                                fontWeight: "700",
                                                lineHeight: "14px",
                                                textTransform: "capitalize",
                                              }}
                                              onClick={sendReferalsess}
                                            >
                                              <span>Refer</span>
                                            </Button>
                                            <Button
                                              autoFocus
                                              sx={{
                                                width: "198px",
                                                cursor: "pointer",
                                                height: "48px",
                                                border: "2px solid #614298",
                                                borderRadius: "8px",
                                                color: "#614298",
                                                fontFamily: "Nunito",
                                                fontSize: "1.5rem",
                                                fontWeight: "700",
                                                lineHeight: "14px",
                                                textTransform: "capitalize",
                                              }}
                                              onClick={handleCloseModaln}
                                            >
                                              <span>Go Back</span>
                                            </Button>
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
                  <div className="flex justify-between flex-row-reverse items-center">
                    <TablePagination
                      className="body3-sem"
                      rowsPerPageOptions={[10, 25, 100, 125]}
                      component="div"
                      count={filteredmanagersEmps.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Show:"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} of ${count} items`
                      }
                      sx={{
                        "& .MuiTablePagination-select": {
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
                  </div>
                </div>
                <div className="w-full h-[200px] flex-flex-col justify-center">
                  {/* <h1> Add Note </h1>
                  <TextField
                    className="flex flex-col w-full h-[100px] text-xl"
                    value={note} // bind the state to value
                    onChange={handleInputChange} // update the state on input change
                    placeholder="Add notes here" // use placeholder for guidance text
                    multiline
                    variant="outlined"
                  >
                    {" "}
                  </TextField> */}
                  <div className="flex gap-4 mt-4 mr-4 justify-end">
                    <div className="flex gap-4 mt-4 mr-4">
                      <Button
                        autoFocus
                        sx={{
                          width: "160px",
                          cursor: "pointer",
                          height: "48px",
                          border: "2px solid #614298",
                          borderRadius: "8px",
                          color: "#614298",
                          fontFamily: "Nunito",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "14px",
                          textTransform: "capitalize",
                        }}
                        onClick={closeModalPre}
                      >
                        <span>Close</span>
                      </Button>
                      {/* <Button
                        style={{
                          width: "160px",
                          cursor: "pointer",
                          height: "48px",
                          border: "2px solid #614298",
                          borderRadius: "8px",
                          background: "#614298",
                          color: "#ffffff",
                          fontFamily: "Nunito",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          lineHeight: "14px",
                          textTransform: "capitalize",
                        }}
                        onClick={closeModalPre}
                      >
                        <span>Send Referal Request</span>
                      </Button> */}
                    </div>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>

          {/* <Button
            variant="outlined"
            sx={{
              display: "flex",
              width: "126px",
              gap: 1,
              height: "48px",
              color: "#614298",
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
          </Button> */}
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
            onSubmit={updateClientDetail}
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
                <DatePicker
                  onChange={handleDateChange}
                  value={dateValue}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                />
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
                  value={calculateAge(updateClientProfile.emp_dob)}
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
              <div style={{ width: "48%" }}>
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Mobile No.
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="emp_mob_no"
                  value={updateClientProfile?.emp_mob_no || ""}
                  disabled={!updateClientProfile?.emp_mob_no}
                  onChange={handleMobileNumberChange}
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
                  disabled={true}
                  value={updateClientProfile?.emp_gmail || ""}
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
                name="emp_address"
                value={updateClientProfile.emp_address}
                onChange={handelChage}
              ></textarea>
            </div>
            <div className="flex gap-4 justify-end">
              <button className="changeStatusButton cursor-pointer">
                <span>Update</span>
              </button>
              <button
                onClick={handleClose}
                autoFocus
                className="changeReferCancelButton cursor-pointer"
              >
                <span>Close</span>
              </button>
            </div>
          </form>
        </div>
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
            <div className="w-[210px] h-[180px] rounded-full overflow-hidden object-cover">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
              <div className="relative flex sm:justify-start justify-center">
                <img
                  className="cursor-pointer w-[168px] h-[168px] object-cover rounded-full"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                  width={168}
                  src={employeeData.profile_image}
                  alt=""
                />

                <img
                  className="absolute left-[75%] top-[70%] cursor-pointer"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                  src={EditIcon}
                  alt=""
                />
              </div>
            </div>
            <div className="flex w-full justify-between sm:flex-row flex-col align-bottom space-x-5">
              <div>
                <h6 className="h6-bold">{employeeData.name}</h6>
                <p className="body4-bold">{employeeData.email}</p>
              </div>
            </div>
            {/* <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h6 className="h6-bold">{employeeData.m_user_name}</h6>
              <p className="body3-sem">{employeeData.emp_name}</p>
              <p className="body3-sem">{employeeData.emp_gmail}</p>
            </div> */}
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
                <p className="body2-sem">Mobile Number </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData?.phone_number}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">Joined on</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {getformatedDate(employeeData?.createdAt)}
                </p>
              </div>
              <div>
                <p className="body2-sem"> Email </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData?.email}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[25px]">
              <div>
                <p className="body2-sem">Gender</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData?.profile_details?.gender}
                </p>
              </div>
              <div>
                <p className="body2-sem">Referred by</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData?.profile_details?.referral_code}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">DOB</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {getformatedDate(employeeData?.profile_details?.dob)}
                </p>
              </div>
              <div>
                <p className="body2-sem">Address</p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {employeeData?.profile_details?.address}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-[33px]">
              <div>
                <p className="body2-sem">Age </p>
                <p className="p2-sem" style={{ color: "#4A4159" }}>
                  {calculateAge(employeeData?.profile_details?.dob)}
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
            <div className="w-full sm:w-[49%]">
              <p className="p2-sem">Topic</p>
              <TextField
                fullWidth
                variant="outlined"
                name="topic"
                value={consultationLink.topic}
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
            <div className="w-full sm:w-[49%]">
              <p className="p2-sem">Meeting Link</p>
              <TextField
                fullWidth
                variant="outlined"
                name="meet_link"
                value={consultationLink.meet_link}
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
              background: "#614298",
              textTransform: "capitalize",
              "&:hover": {
                background: "#614298",
              },
              "@media (max-width: 640px)": {
                width: "100%",
              },
            }}
            onClick={handleOpenConsultationLink}
          >
            <span className="btn1">Send Link</span>
          </Button>
        </form>

        <div style={{ marginTop: "16px" }}>
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
                    color: "#614298",
                    fontSize: "16px",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "10px",
                    },
                  }}
                  onClick={() => {
                    navigate(
                      `/therapist/clients/clientsDetails/${id}/clienthistory`
                    );
                  }}
                >
                  <img src={AddIcon} alt="" />
                  <span className="btn1 text-[13px]">
                    Update Client History
                  </span>{" "}
                </Button>
                {/* <Button
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
                    color: "#614298",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "10px",
                    },
                  }}
                >
                  <img src={SendButton} alt="" />
                  <span className="btn1 text-[13px]">
                    Send the Client history
                  </span>{" "}
                </Button> */}
              </div>
            </div>

            {isClientHistory && (
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                      {clientHistoryDetails?.dateOfIntake && (
                        <div>
                          <p className="body2-sem">Intake Date</p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.dateOfIntake || "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.presentingProblem && (
                        <div>
                          <p className="body2-sem">
                            Presenting Problem (clients initial explanation of
                            the problem, duration and pertinent cause)
                          </p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.presentingProblem || "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.tentativeGoalsAndPlans && (
                        <div>
                          <p className="body2-sem">Tentative Goals and Plans</p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.tentativeGoalsAndPlans ||
                              "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.specialNeeds && (
                        <div>
                          <p className="body2-sem">
                            Special Needs of Client (e.g. Need for Interpreter,
                            Disability, Religious Consultant, etc. if yes,
                            what?)
                          </p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.specialNeeds || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                      {clientHistoryDetails?.familyCurrentSituation && (
                        <div>
                          <p className="body2-sem">
                            Family (current living situation)
                          </p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.familyCurrentSituation ||
                              "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.familyHistory && (
                        <div>
                          <p className="body2-sem">Family History</p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.familyHistory || "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.pertinentHistory && (
                        <div>
                          <p className="body2-sem">
                            Pertinent History (any prior therapy including
                            family, social, psychological, and medical-declared
                            condition)
                          </p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.pertinentHistory || "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.observations && (
                        <div>
                          <p className="body2-sem">Observations</p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.observations || "N/A"}
                          </p>
                        </div>
                      )}

                      {clientHistoryDetails?.diagnosticImpression && (
                        <div>
                          <p className="body2-sem">Diagnostic Impression</p>
                          <p className="body3-reg">
                            {clientHistoryDetails?.diagnosticImpression ||
                              "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr style={{ margin: "10px 0px", background: "#D5D2D9" }} />

                  <div
                    className="2nd"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {clientHistoryDetails == null ? (
                      <div>
                        <h6 className="h6-bold" style={{ color: "#06030D" }}>
                          MSE
                        </h6>
                      </div>
                    ) : null}

                    <div className="flex sm:flex-row flex-col">
                      <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                        {clientHistoryDetails?.appearance && (
                          <div>
                            <p className="body2-sem">Appearance</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.appearance || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.orientation && (
                          <div>
                            <p className="body2-sem">Orientation</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.orientation || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.speech && (
                          <div>
                            <p className="body2-sem">Speech</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.speech || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.thoughtProcessContent && (
                          <div>
                            <p className="body2-sem">
                              Thought Process and Content
                            </p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.thoughtProcessContent ||
                                "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.sleep && (
                          <div>
                            <p className="body2-sem">Sleep</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.sleep || "N/A"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                        {clientHistoryDetails?.behavior && (
                          <div>
                            <p className="body2-sem">Behaviour</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.behavior || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.mood && (
                          <div>
                            <p className="body2-sem">Mood</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.mood || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.affect && (
                          <div>
                            <p className="body2-sem">Affect</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.affect || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.judgement && (
                          <div>
                            <p className="body2-sem">Judgement</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.judgement || "N/A"}
                            </p>
                          </div>
                        )}

                        {clientHistoryDetails?.appetite && (
                          <div>
                            <p className="body2-sem">Appetite</p>
                            <p className="body3-reg">
                              {clientHistoryDetails?.appetite || "N/A"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {clientHistoryDetails?.importantNotes && (
                    <div>
                      <p className="body2-sem">Important Notes</p>
                      <p className="body3-reg">
                        {clientHistoryDetails?.importantNotes || "N/A"}
                      </p>
                    </div>
                  )}
                  {clientHistoryDetails?.imageUrl && (
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        width: "196px",
                        height: "48px",
                        borderRadius: "8px",
                        border: "1px solid #614298",
                        background: "#614298",
                        textTransform: "capitalize",
                        "&:hover": {
                          background: "#614298",
                        },
                        "@media (max-width: 640px)": {
                          width: "100%",
                        },
                      }}
                      onClick={() =>
                        window.open(clientHistoryDetails.imageUrl, "_blank")
                      }
                    >
                      <span className="btn1">View</span>
                    </Button>
                  )}
                </div>
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
            <div className="flex justify-between flex-col sm:flex-row h-[70px]">
              <div>
                <h5
                  className="h5-bold"
                  onClick={handleSessionNote}
                  style={{ cursor: "pointer", display: "flex", gap: 8 }}
                >
                  Session Notes
                  <img src={CollapseArrow} alt="" onClick={handleSessionNote} />
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
                    color: "#614298",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "10px",
                    },
                  }}
                  onClick={sendSessionNote}
                >
                  <img src={SendButton} alt="" />
                  <span className="btn1 text-[13px]">
                    Send the Session Note
                  </span>{" "}
                </Button>
              </div>
            </div>

            <div className="overflow-auto max-h-[50vh]">
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
                            <p className="body3-reg">{item?._id?.slice(-10)}</p>
                          </div>
                          <div>
                            <p className="body2-sem">Date/Time</p>
                            <p className="body3-reg">
                              {getformatedDate(item?.created_at)}
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
                              color: "#614298",
                              marginRight: "20px",
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
                                  Diagnostic Impression
                                </p>
                                <p className="body3-reg">
                                  {item.diagnosticImpression
                                    ? item.diagnosticImpression
                                    : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Observations</p>
                                <p className="body3-reg">
                                  {item.observations
                                    ? item.observations
                                    : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">
                                  Therapeutic Intervention
                                </p>
                                <p className="body3-reg">
                                  {item.therapeuticIntervention
                                    ? item.therapeuticIntervention
                                    : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">
                                  Planned Intervention (for upcoming sessions)
                                </p>
                                <p className="body3-reg">
                                  {item.plannedIntervention
                                    ? item.plannedIntervention
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
                                    border: "1px solid #614298",
                                    textTransform: "capitalize",
                                    background: "#614298",
                                    color: "white",
                                    gap: 1,
                                    "&:hover": {
                                      boxShadow:
                                        "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                      background: "#614298",
                                    },
                                  }}
                                  onClick={() => {
                                    downloadFile(item.imageName);
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
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col w-full sm:w-[39.5%] gap-[24px]">
                              <div>
                                <p className="body2-sem">Session Focus</p>
                                <p className="body3-reg">
                                  {item.sessionFocus
                                    ? item.sessionFocus
                                    : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Client Goals</p>
                                <p className="body3-reg">
                                  {item.clientGoals ? item.clientGoals : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">Tasks Given</p>
                                <p className="body3-reg">
                                  {item.tasksGiven ? item.tasksGiven : "N/a"}
                                </p>
                              </div>
                              <div>
                                <p className="body2-sem">
                                  Important Notes (if any)
                                </p>
                                <p className="body3-reg">
                                  {item.importantNotes
                                    ? item.importantNotes
                                    : "N/a"}
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
                    color: "#614298",
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
        </div>
      </div>
    </>
  );
};

export default ClientDetails;
