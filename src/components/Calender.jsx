import { useState, useEffect, lazy } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogActions,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  Modal,
  Backdrop,
  Fade,
  Box,
  Autocomplete,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import grayDot from "../assets/grayDot.svg";
import DropdownArrowClosed from "../assets/DropdownArrowClosed.svg";
import DropdownArrowOpen from "../assets/DropdownArrowOpen.svg";
import FilterIcon from "../assets/filter.svg";
import AddUser from "../assets/AddUser.svg";
import greenDot from "../assets/greenDot.svg";
import redDot from "../assets/redDot.svg";
import { useNavigate } from "react-router-dom";
import {
  convertTo12HourFormat,
  getDayIndex,
  getDayName,
} from "../constant/constatnt";
import { useParams } from "react-router-dom";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../constant/ApiConstant";
import CancelPopup from "../assets/CancelPopup.svg";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSocket } from "../getSocket";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const getDatetoDayName = (dateString) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const Calender = () => {
  const { id, empId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [slotList, setSlotList] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [openAppointment, setOpenAppointment] = useState(false);
  const [duration, setDuration] = useState("50");
  const [sessationType, setSessationType] = useState("1");
  const [dateValue, setDateValue] = useState(new Date());
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [value, setValue] = useState("session");
  const [openModal, setOpenModal] = useState(false);
  const [clientData, setClientData] = useState({});
  const [clientId, setClientId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    emailId: "",
    phoneNumber: "",
    dob: "",
    address: "",
    city: "",
  });
  const [userSuggestions, setUserSuggestions] = useState([]);
  function getMediaType(input) {
    if (input == "1") {
      return "in_person";
    } else if (input == "2") {
      return "audio";
    } else if (input == "3") return "video";
  }
  const details = useSelector((state) => state.userDetails);

  const [searchParams] = useSearchParams();
  const refralClientId = searchParams.get("client");
  console.log(refralClientId);

  const therapistId = details?.id;
  const socket = useSocket();
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getClientDetailsFromRefral = () => {
    if (refralClientId) {
      axios
        .get(`${API_URL}/getUserDetails/${refralClientId}`)
        .then((res) => {
          if (res.status == 200) {
            const employeeDetials = res.data.data;
            setClientData(employeeDetials);
            setEmail(employeeDetials.email);
            const newUser = {
              name: employeeDetials.name,
              email: employeeDetials.email,
            };
            setSelectedUser(newUser);
            setUserSuggestions((prevSuggestions) => [
              ...prevSuggestions,
              newUser,
            ]);
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  };

  const getClientDetail = () => {
    axios
      .get(`${API_URL}/getUserDetails/${clientId}`)
      .then((res) => {
        if (res.status == 200) {
          const employeeDetials = res.data.data;
          setClientData(employeeDetials);
          setEmail(employeeDetials.email);
          const newUser = {
            name: employeeDetials.name,
            email: employeeDetials.email,
          };
          setSelectedUser(newUser);
          setUserSuggestions((prevSuggestions) => [
            ...prevSuggestions,
            newUser,
          ]);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getClientDetailsByEmail = () => {
    axios
      .post(`${API_URL}/getUserDetailsByEmail`, { emailId: email })
      .then((res) => {
        if (res.status == 200) {
          const employeeDetials = res.data.data;
          setClientData(employeeDetials);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewuser();
    handleCloseModal();
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (days) => {
    setOpenModal(true);
  };
  const handleChange = (event) => {
    if (clientId != null) {
      setValue("session");
    } else {
      setValue(event.target.value);
    }
  };

  const handleDateChange = (date) => {
    setDateValue(date);
  };

  const handleDOBChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dob: date, // Update the dob field with the selected date
    }));
  };

  const handleClickOpenAppointment = () => {
    if (
      value === "preconsultation" ||
      (value === "session" && (duration === "50" || duration === "60"))
    ) {
      setOpenAppointment(true);
    }
  };
  const handleCloseAppointment = () => {
    setOpenAppointment(false);
    setSelectedSlots([]);
  };

  const durationChange = (e) => {
    setDuration(e.target.value);
  };
  const sessationChange = (e) => {
    setSessationType(e.target.value);
  };

  const handleSlotClick = (index) => {
    const clickedSlot = slotList[index];

    if (clickedSlot.m_booked_status !== 0) {
      console.log("Clicked slot is not available");
      return;
    }

    if (duration === "30") {
      const adjacentIndex = index;
      const adjacentSlot = slotList[adjacentIndex];

      if (!adjacentSlot || adjacentSlot.m_booked_status !== 0) {
        console.log("Adjacent slot is not available for 60-minute booking");
        return;
      }

      const areBothSelected =
        selectedSlots.some((slot) => slot.id === clickedSlot.id) &&
        selectedSlots.some((slot) => slot.id === adjacentSlot.id);

      if (areBothSelected) {
        setSelectedSlots(
          selectedSlots.filter(
            (slot) => slot.id !== clickedSlot.id && slot.id !== adjacentSlot.id
          )
        );
      } else {
        setSelectedSlots([...selectedSlots, clickedSlot, adjacentSlot]);
        handleClickOpenAppointment();
      }
    } else if (duration === "60" || duration === "50") {
      // For 60-minute duration, select or deselect two adjacent slots
      const adjacentIndex = index + 1;
      const adjacentSlot = slotList[adjacentIndex];

      if (!adjacentSlot || adjacentSlot.m_booked_status !== 0) {
        console.log("Adjacent slot is not available for 60-minute booking");
        return;
      }

      const areBothSelected =
        selectedSlots.some((slot) => slot.id === clickedSlot.id) &&
        selectedSlots.some((slot) => slot.id === adjacentSlot.id);

      if (areBothSelected) {
        setSelectedSlots(
          selectedSlots.filter(
            (slot) => slot.id !== clickedSlot.id && slot.id !== adjacentSlot.id
          )
        );
      } else {
        setSelectedSlots([...selectedSlots, clickedSlot, adjacentSlot]);
        handleClickOpenAppointment();
      }
    } else {
      console.log("Invalid duration");
    }
  };
  const getpreSlots = () => {
    const data = {
      therapistId: details?.id,
      date: formatDate(dateValue),
    };
    axios
      .post(`${API_URL}/getTherapistPreconsultationSlots`, data)
      .then((res) => {
        if (res.status == 200) {
          setSlotList(res.data.data.slots);
        }
      })
      .catch((err) => {
        console.log("err:", err);
        setSlotList([]);
      });
  };

  const getSlots = () => {
    const data = {
      date: formatDate(dateValue),
      therapistId: therapistId,
    };
    axios
      .post(`${API_URL}/getTherapistSlots`, data)
      .then((res) => {
        if (res.status == 200) {
          setSlotList(res.data.data.slots);
        }
      })
      .catch((err) => {
        console.log("err:", err);
        setSlotList([]);
      });
  };

  useEffect(() => {
    if (value == "preconsultation") {
      getpreSlots();
      setDuration("30");
    } else {
      setDuration("50");
      getSlots();
    }
  }, [value, dateValue]);

  const handelChage = (e) => {
    setClientId(e.target.value);
  };

  const getAppointmentDetails = () => {
    const appointmentId = {
      appointmentId: id,
    };
    axios
      .post(`${API_URL}/getAppointmentDetail`, appointmentId)
      .then((res) => {
        if (res.status === 200) {
          setValue(res?.data?.data?.appointmentDetails?.type);
          setClientId(res?.data?.data?.userDetails._id);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  // Fetch therapist user details when input changes
  const fetchUserSuggestions = async (inputValue) => {
    axios
      .get(`${API_URL}/getAllUsersByTherapist`)
      .then((res) => {
        if (res.status === 200) {
          const filteredUsers = res.data.data.filter((user) =>
            user.name.toLowerCase().includes(inputValue.toLowerCase())
          );
          setUserSuggestions(filteredUsers);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  // Handle input change in the Autocomplete
  const handleInputChange = (event, newInputValue) => {
    if (newInputValue) {
      fetchUserSuggestions(newInputValue);
    }
  };

  // Handle selection from dropdown
  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
    if (newValue) {
      setEmail(newValue.email); // Automatically fill email
    }
  };

  useEffect(() => {
    if (id != null) {
      getAppointmentDetails();
    }
  }, [id]);

  useEffect(() => {
    if (clientId != null) {
      getClientDetail();
    }
  }, [clientId]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (email != null) {
        getClientDetailsByEmail();
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  useEffect(() => {
    getClientDetailsFromRefral();
  }, []);

  const addNewuser = () => {
    const data = {
      name: formData.name,
      gender: formData.gender,
      emailId: formData.emailId,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      address: formData.address,
      city: formData.city,
    };
    axios
      .post(`${API_URL}/addUser`, data)
      .then((res) => {
        if (res.status === 201) {
          const newUser = {
            name: res.data.user.name,
            email: res.data.user.email, // Ensure emailId is returned from the backend
          };
          setSelectedUser(newUser);
          setUserSuggestions((prevSuggestions) => [
            ...prevSuggestions,
            newUser,
          ]);
          setEmail(res?.data?.user?.email);
          setFormData({
            firstName: "",
            lastName: "",
            gender: "",
            emailId: "",
            phoneNumber: "",
            age: "",
            address1: "",
            city: "",
            address2: "",
          });
          toast.success(`Client Add Successfully`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const bookAppointment = (e) => {
    e.preventDefault();
    let formattedDateValue;

    if (typeof dateValue === "string") {
      const parsedDate = dayjs(dateValue);
      if (!parsedDate.isValid()) {
        console.error("Invalid date provided");
        return;
      }
      formattedDateValue = parsedDate.format("YYYY-MM-DD");
    } else if (dateValue instanceof Date) {
      formattedDateValue = dayjs(dateValue).format("YYYY-MM-DD");
    } else {
      console.error("dateValue must be a valid date string or Date object");
      return;
    }
    const appointmentData = {
      bookingDate: formattedDateValue,
      bookingSlots: selectedSlots,
      duration: duration,
      userId: clientData._id,
      bookingType: getMediaType(sessationType),
      type: value,
    };

    const appointmentId = id;

    if (appointmentId) {
      const rescheduleData = {
        appointmentId: appointmentId,
        newDate: formattedDateValue,
        newSlots: selectedSlots,
        newDuration: duration,
        newAppointmentType: getMediaType(sessationType),
        therapistId: therapistId,
      };
      axios
        .post(`${API_URL}/rescheduleAppointment`, rescheduleData)
        .then((res) => {
          if (res.status == 200) {
            socket.emit("client", {
              title: "Upcoming Appointment",
              message: `${clientData?.name}  your appointment has been reschdule  by ${details?.name} at ${selectedSlots} on ${formattedDateValue} `,
              role: "user",
              userId: clientData?._id,
            });
            toast.success(`Appointment has been Reschdule`, {
              position: "top-center", // Set the position to top-right
              duration: 3000, // Display for 3 seconds (3000 ms)
              style: {
                fontWeight: "bold",
                fontSize: "14px", // Smaller text
              },
            });
            navigate("/therapist/upcomming-appointments");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      axios
        .post(`${API_URL}/bookAppointmentByTherapist`, appointmentData)
        .then((res) => {
          if (res.status == 200) {
            handleCloseModal();
            socket.emit("client", {
              title: "Upcoming Appoitment",
              message: `${details.name} book  a session for you `,
              role: "user",
              userId: clientData._id,
            });
            toast.success(`Appointment book Successfull`, {
              position: "top-center", // Set the position to top-right
              duration: 3000, // Display for 3 seconds (3000 ms)
              style: {
                fontWeight: "bold",
                fontSize: "14px", // Smaller text
              },
            });

            navigate("/therapist/upcomming-appointments");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  };

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <div className="flex gap-12">
          <h5 className="h5-bold">Calendar</h5>
          <FormControl
            variant="outlined"
            sx={{
              width: "20%",
              height: "40px",
              border: "1px solid #787486",
              display: "flex",
              gap: "10px",
              borderRadius: "6px",
              flexDirection: "row",
            }}
          >
            <img src={FilterIcon} className="w-[20px] pl-2" />
            <Select
              id="dropdown"
              value={value}
              disabled={id != null || refralClientId != null ? true : false}
              onChange={handleChange}
              sx={{
                width: "90%",
                fontSize: "16px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="preconsultation" sx={{ fontSize: "14px" }}>
                Pre consultation
              </MenuItem>
              <MenuItem value="session" sx={{ fontSize: "14px" }}>
                Sessions
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mt-10 w-[10%]">
          <h4 className="body3-sem">Date</h4>
          <DatePicker
            onChange={handleDateChange}
            value={dateValue}
            minDate={new Date()}
          />
          <h1 className="text-[#9A93A5] text-[16px] font-medium mt-4">
            {getDatetoDayName(dateValue)}
          </h1>
        </div>
        {value === "session" && (
          <div style={{ marginTop: "24px" }}>
            <h4 className="body3-sem">Duration (in minutes)</h4>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={duration}
                onChange={durationChange}
              >
                <FormControlLabel
                  value="50"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="50"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                    },
                  }}
                />
                <FormControlLabel
                  value="60"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="60"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <h4 className="body3-sem">Slots</h4>
          <div className="py-7 sm:p-4">
            {slotList.length !== 0 ? (
              <div className="flex flex-wrap gap-[6px] sm:gap-[10px]">
                {slotList.map((item, index) => {
                  let chipClass, paraClass;

                  if (item.m_booked_status === 0) {
                    chipClass = "chip-available";
                    paraClass = "available";
                  } else if (item.m_booked_status === 1) {
                    chipClass = "chip-booked";
                    paraClass = "booked";
                  } else {
                    chipClass = "chip-unavailable";
                    paraClass = "unavailbale";
                  }
                  const isSelected = selectedSlots.includes(item);
                  const selectedBox = isSelected ? "selected-box" : "";
                  const selectedPara = isSelected ? "selected-para" : "";
                  return (
                    <div
                      className={`${chipClass} ${selectedBox}`}
                      key={index}
                      style={{ width: "max-content", cursor: "pointer" }}
                      onClick={() => {
                        handleSlotClick(index);
                      }}
                    >
                      <p className={`${paraClass} ${selectedPara}`}>
                        {convertTo12HourFormat(item.m_schd_from)} -{" "}
                        {convertTo12HourFormat(item.m_schd_to)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No Data Found</div>
            )}

            <Dialog
              open={openAppointment}
              onClose={handleCloseAppointment}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="appointmentDilog"
            >
              <div className="w-[100%] sm:w-[532px] p-[16px]">
                <h5 style={{ textAlign: "center" }} className="h5-bold">
                  Book Appointment
                </h5>
                {selectedSlots.length !== 0 && (
                  <p
                    style={{
                      marginBottom: "24px",
                      textAlign: "center",
                      color: "#4A4159",
                    }}
                    className="p2-sem"
                  >
                    {convertTo12HourFormat(selectedSlots[0].m_schd_from)}-
                    {convertTo12HourFormat(selectedSlots[1].m_schd_to)}
                  </p>
                )}

                <form
                  onSubmit={bookAppointment}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                  action=""
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "end",
                      gap: "20px",
                    }}
                  >
                    <div className="flex flex-col w-[80%]">
                      <label
                        className="p2-sem"
                        style={{ color: "#4A4159" }}
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <Autocomplete
                        options={userSuggestions}
                        getOptionLabel={(option) =>
                          `${option.name} (${option.email})`
                        }
                        onInputChange={handleInputChange}
                        disabled={
                          id != null || refralClientId != null ? true : false
                        }
                        onChange={handleUserSelect}
                        value={selectedUser}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            type="text"
                            required
                            name="name"
                            placeholder="Enter name"
                            InputProps={{
                              ...params.InputProps,
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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                    <img
                      src={AddUser}
                      className="rounded-[8px]"
                      onClick={handleOpenModal}
                    />
                  </div>
                  {value == "session" ? (
                    <div>
                      <p className="p2-sem" style={{ color: "#4A4159" }}>
                        Type
                      </p>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={sessationType}
                          onChange={sessationChange}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio sx={{ fontSize: "16px" }} />}
                            label="In-Person"
                            sx={{
                              fontSize: "16px",
                              "& .MuiFormControlLabel-label": {
                                fontSize: "16px",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio sx={{ fontSize: "16px" }} />}
                            label="Video"
                            sx={{
                              fontSize: "16px",
                              "& .MuiFormControlLabel-label": {
                                fontSize: "16px",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio sx={{ fontSize: "16px" }} />}
                            label="Call"
                            sx={{
                              fontSize: "16px",
                              "& .MuiFormControlLabel-label": {
                                fontSize: "16px",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="w-[100%] h-[1px] bg-[#D5D2D9]" />
                  <DialogActions sx={{ padding: "0px" }}>
                    <button
                      type="submit"
                      style={{
                        width: "160px",
                        height: "48px",
                        cursor: "pointer",
                        backgroundColor: "#614298",
                        border: "2px solid #614298",
                        borderRadius: "8px",
                        marginRight: "5px",
                        color: "#ffffff",
                        fontFamily: "Nunito",
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        lineHeight: "14px",
                      }}
                    >
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseAppointment}
                      style={{
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
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <span>Close</span>
                    </button>
                  </DialogActions>
                </form>
              </div>
            </Dialog>
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
                  style: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                },
              }}
            >
              <Fade in={openModal}>
                <Box sx={style}>
                  <div className="w-[100%] sm:w-[532px] p-[16px]">
                    <h5
                      style={{ marginBottom: "24px", textAlign: "center" }}
                      className="h5-bold"
                    >
                      Add New Client
                    </h5>
                    <form
                      onSubmit={handleSubmit}
                      style={{ display: "flex", flexDirection: "column" }}
                      action=""
                    >
                      <div className="flex justify-between flex-wrap sm:flex-row flex-col gap-[15px]">
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            First Name
                          </label>
                          <TextField
                            fullWidth
                            type="text"
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleAddUserChange}
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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            Gender
                          </label>

                          <Select
                            fullWidth
                            required
                            name="gender"
                            value={formData.gender}
                            onChange={handleAddUserChange}
                            displayEmpty
                            inputProps={{
                              sx: {
                                fontSize: "16px",
                                fontFamily: "Nunito",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "24px",
                                letterSpacing: "0.08px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: `#d5d2d9`,
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: `#d5d2d9`,
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                                padding: "12px 12px", // Adjust the padding to reduce height
                                height: "40px", // Adjust the height
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select Gender
                            </MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </div>
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            Email Id
                          </label>
                          <TextField
                            fullWidth
                            type="email"
                            required
                            name="emailId"
                            value={formData.emailId}
                            onChange={handleAddUserChange}
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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            Phone Number
                          </label>
                          <TextField
                            fullWidth
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleAddUserChange}
                            inputProps={{
                              maxLength: 10, // Limit to 10 digits
                              pattern: "[0-9]*", // Ensure only numbers are entered
                            }}
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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                    margin: 0,
                                  },
                                "& input[type=number]": {
                                  "-moz-appearance": "textfield",
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            DOB
                          </label>
                          <DatePicker
                            onChange={handleDOBChange}
                            value={formData.dob}
                          />
                        </div>
                        <div className="flex sm:w-[48%] w-full flex-col gap-2">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            City
                          </label>
                          <TextField
                            fullWidth
                            type="text"
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleAddUserChange}
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
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#d5d2d9`,
                                  },
                                "& input::placeholder": {
                                  color: `#d5d2d9`,
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex sm:w-[100%] w-full flex-col">
                          <label
                            className="p2-sem"
                            style={{ color: "#4A4159" }}
                          >
                            Address
                          </label>
                          <TextField
                            fullWidth
                            type="text"
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleAddUserChange}
                            InputProps={{
                              sx: {
                                fontSize: "16px",
                                fontFamily: "Nunito",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "24px",
                                letterSpacing: "0.08px",
                                height: "80px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: `#d5d2d9`,
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: `#d5d2d9`,
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
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
                      <DialogActions sx={{ marginTop: "10px" }}>
                        <button
                          className="changeStatusButton cursor-pointer"
                          type="submit"
                        >
                          Save
                        </button>
                        <div
                          className="changeReferCancelButton cursor-pointer"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </div>
                      </DialogActions>
                    </form>
                  </div>
                </Box>
              </Fade>
            </Modal>
          </div>
        </div>

        <div>
          <h4 className="body3-sem" style={{ marginTop: "16px" }}>
            Status
          </h4>

          <div
            style={{
              display: "flex",
              width: "max-content",
              marginTop: "8px",
              textAlign: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={grayDot} alt="" />
              <p className="unavailbale">Unavailable</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={greenDot} alt="" />
              <p className="available">Available</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={redDot} alt="" />
              <p className="booked" style={{}}>
                Booked
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;
