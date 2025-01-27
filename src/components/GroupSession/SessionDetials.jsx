import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constant/ApiConstant";
import LeftArrow from "../../assets/LeftArrow.svg";
import toast from "react-hot-toast";
import ListIcon from "../../assets/List.svg";
import Phone from "../../assets/Phone.svg";
import { getTimeInterval } from "../../constant/constatnt";
import Select from "react-select";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  DialogActions,
  TextField,
  Modal,
  Backdrop,
  Fade,
  Box,
} from "@mui/material";

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

const SessionDetials = () => {
  const { sessationId } = useParams();
  const navigate = useNavigate();
  const [sessationDetials, setSessationDetials] = useState({});
  const [allClient, setAllClient] = useState([]);
  const [clientDetails, setClientDetails] = useState([]);
  const [guests, setGuests] = useState([]);
  const [deleteGuests, setDeleteGuests] = useState([]);
  const [selectedClientOption, setSelectedClientOption] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleCheckboxChange = (guestId) => {
    // Toggle the guestId in the deleteGuests array
    setDeleteGuests((prevState) => {
      if (prevState.includes(guestId)) {
        // If guestId is already in deleteGuests, remove it
        return prevState.filter((id) => id !== guestId);
      } else {
        // If guestId is not in deleteGuests, add it
        return [...prevState, guestId];
      }
    });
  };

  // Handle selection changes
  const handleSelectChange = (selectedOption) => {
    // Construct the new client object with _id, status, paymentLink, and payment fields
    const newClient = {
      _id: selectedOption.value, // Client ID from selected option
      status: false, // Default status as false
      paymentLink: false, // Default paymentLink as false
      payment: false, // Default payment as false
    };

    // Add the new client object to the clientDetails array
    setClientDetails((prevDetails) => [...prevDetails, newClient]);

    // Optionally set the selected client option for UI purposes
    setSelectedClientOption(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewuser();
    getAllClients();
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const addNewuser = () => {
    const data = {
      name: formData.firstName + formData.lastName,
      gender: formData.gender,
      emailId: formData.emailId,
      phoneNumber: formData.phoneNumber,
      dob: formData.age,
      address: formData.address1,
      city: formData.city,
    };
    axios
      .post(`${API_URL}/addUser`, data)
      .then((res) => {
        if (res.status === 201) {
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
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const addGuest = () => {
    axios
      .post(`${API_URL}/groupSessation/addGuestListToGroupSession`, {
        id: sessationId,
        guests: clientDetails,
      })
      .then((res) => {
        if (res.status === 200) {
          setClientDetails([]);
          setSelectedClientOption(null);
          getAllGuestList();
          toast.success("Guest Added Successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteGuests = () => {
    axios
      .post(`${API_URL}/groupSessation/removeGuestFromSession`, {
        id: sessationId,
        guestId: deleteGuests,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Guest Deleted Successfully");
          getAllGuestList();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getGroupSessationDetials = () => {
    axios
      .post(`${API_URL}/groupSessation/getGroupSessationDetials`, {
        id: sessationId,
      })
      .then((res) => {
        if (res.status === 200) {
          setSessationDetials(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllClients = () => {
    axios
      .get(`${API_URL}/user/getAllUser`)
      .then((res) => {
        if (res.status === 200) {
          setAllClient(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllGuestList = () => {
    axios
      .post(`${API_URL}/groupSessation/getGuestListFromGroupSession`, {
        id: sessationId,
      })
      .then((res) => {
        if (res.status === 200) {
          setGuests(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeGuestStatus = (guestId, status) => {
    const data = {
      id: sessationId,
      _id: guestId,
      status: status,
    };

    axios
      .put(`${API_URL}/groupSessation/updateGuestStatus`, data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          getAllGuestList();
          toast.success("Status Updated  Successfully");
        }
      })
      .catch((err) => {
        toast.error("Status Update  Failed");
        console.log(err);
      });
  };

  useEffect(() => {
    getGroupSessationDetials();
    getAllClients();
    getAllGuestList();
  }, []);


  const options = allClient.map((client) => ({
    value: client._id, // This is typically the unique identifier
    label: client.name, // This is what will be displayed in the dropdown
  }));


  return (
    <>
      <div className="pb-4 pt-16 pl-8 pr-16 flex justify-between gap-5">
        <div className="flex justify-center items-center gap-4">
          <div onClick={() => navigate(-1)} className="cursor-pointer">
            <img src={LeftArrow} alt="" />
          </div>
          <div>
            <h5 className="h5-bold">{sessationDetials?.topic}</h5>
          </div>
        </div>
        {/* modal for add new guest */}
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
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        First Name
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="firstName"
                        value={formData.firstName}
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        Last Name
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="lastName"
                        value={formData.lastName}
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        Gender
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="gender"
                        value={formData.gender}
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        Age
                      </label>
                      <TextField
                        fullWidth
                        type="number"
                        required
                        name="age"
                        value={formData.age}
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        Address Line 1
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="address1"
                        value={formData.address1}
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
                    <div className="flex sm:w-[48%] w-full flex-col gap-2">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
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
                    <div className="flex sm:w-[100%] w-full flex-col">
                      <label className="p2-sem" style={{ color: "#4A4159" }}>
                        Address Line 2
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="address2"
                        value={formData.address2}
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
        <div className="flex gap-4">
          <button
            className="bg-[#614298] w-[173px] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer font-quicksand"
            // onClick={() => setShowPopup(true)}
            onClick={handleOpenModal}
          >
            Add New Guest
          </button>
          <button
            className="flex items-center justify-center gap-1 bg-[#614298] w-[132px] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer font-quicksand"
            // onClick={() => setShowPopup(true)}
          >
            <img src={ListIcon} alt="" />
            Edit
          </button>
        </div>
      </div>

      <div className="pb-4 pt-16 pl-8 pr-16 flex flex-col justify-between gap-10 w-full">
        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Description</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.description}</p>
          </div>
        </div>

         <div className="flex">
          <div className="w-[20%]">
            <p className="body1-bold">Time intervals</p>
          </div>
          <div className="w-[80%] flex flex-wrap gap-4">
            {Array.isArray(sessationDetials?.dateValue) &&
            sessationDetials?.dateValue.length > 0 ? (
              sessationDetials?.dateValue?.map((date, index) => (
                <div key={index} className="p1-reg px-[10px] py-[14px] rounded-lg bg-[#F4EDFF] text-[#635B73] border border-solid border-[#9C81CC]">{getTimeInterval(date)}</div>
              ))
            ) : (
              <p className="body2-reg">No time intervals available</p>
            )}
          </div>
        </div> 


        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Language</p>
          </div>
          <div className="w-[80%] flex gap-[22.5%]">
            <p className="body2-reg">{sessationDetials?.language}</p>
            <div className="flex  gap-32">
               <div>
                  <p className="body1-bold">Type</p>
               </div>
               <div>
                  <p className="body2-reg">{sessationDetials?.type}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Duration</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.duration}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Amount</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.amount}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Community</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.community}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Guest Limit</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.guestList?.length}/{sessationDetials?.guestLimit}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">G Meet Link</p>
          </div>
          <div className="w-[80%] flex items-center gap-10">
            <p className="body1-sem text-[#779FF1]">{sessationDetials?.googleMeet}</p>

            <button
              className="bg-[#614298] w-[160px] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer font-quicksand"
              onClick={() => window.open(sessationDetials?.googleMeet, "_blank")}
            >
             Join Now
          </button>

          </div>
        </div>
      </div>

      <div className="p-4  mx-auto">
        {/* Search and Add/Delete Buttons */}
        <div className="flex justify-between items-center p-6">
          <div className="w-[200px]">
            <p className="text-[20px] font-bold text-[#06030D]">Guest List</p>
          </div>

          <div className="w-full flex  mb-4 p-4 gap-10">
            <div className="w-full flex items-center justify-end">
              <Select
                value={selectedClientOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Select or type client name"
                className="w-[440px] h-[37px] z-[500]"
                isClearable // Optional: allows clearing the selected option
              />
            </div>

            <div className="flex gap-4">
              <button
                className="w-[120px] px-5 py-4 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298] rounded-xl cursor-pointer"
                onClick={addGuest}
              >
                Add Guest
              </button>

              <button
                onClick={handleDeleteGuests}
                disabled={deleteGuests.length === 0}
                className="w-[120px] border border-solid border-[#E83F40] text-[#E83F40] bg-white px-4 py-2 rounded-xl mx-2 cursor-pointer"
              >
                Delete Guest
              </button>
            </div>
          </div>
        </div>

        {/* Guest List Table */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table className="min-w-full bg-white border">
            <TableHead>
              <TableRow>
                <TableCell align="left" className="body3-sem">
                  Name
                </TableCell>
                <TableCell align="left" className="body3-sem">
                  Mobile
                </TableCell>
                <TableCell align="left" className="body3-sem">
                  Email
                </TableCell>
                <TableCell align="left" className="body3-sem">
                  Status
                </TableCell>
                <TableCell align="left" className="body3-sem">
                  Payment
                </TableCell>
                <TableCell align="left" className="body3-sem">
                  Send Link
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="addEmployee2">
              {guests.map((row) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row?._id}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="left" className="body3-reg">
                    <div className="flex items-center">
                      <div>
                        <Checkbox
                          className="checkbox"
                          size="large"
                          sx={{ borderRadius: "6px" }}
                          // checked={row.status}
                          defaultChecked={false}
                          checked={deleteGuests.includes(row._id)} // Controlled checkbox
                          onChange={() => handleCheckboxChange(row._id)} // Handle checkbox change
                        />
                      </div>
                      <div>
                        <div>{row?.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left" className="body3-reg">
                    <div>{row?.phone_number}</div>
                  </TableCell>
                  <TableCell align="left" className="body3-reg">
                    <div>{row?.email}</div>
                  </TableCell>

                  <TableCell align="left" className="body3-reg">
                    <button
                      disabled={row.status === true}
                      className={`w-[120px] px-5 py-4 ${
                        row?.status
                          ? "bg-[#F2F2F2] text-[#B7B2BF] border border-solid border-[#D5D2D9]"
                          : "bg-[#614298] text-white  cursor-pointer"
                      }   border border-solid border-[#614298] rounded-xl `}
                      onClick={() => {
                        changeGuestStatus(row._id, true);
                      }}
                    >
                      Mark as joined
                    </button>
                  </TableCell>
                  <TableCell align="left" className="body3-reg">
                    <div
                      className={`px-4 py-1 flex justify-center items-center rounded-lg w-[80px] ${
                        row?.payment === true
                          ? "bg-[#ECFFBF] text-[#385000] "
                          : "bg-[#F8DDDF] text-[#500000]"
                      }`}
                    >
                      {row?.payment === true ? "Paid" : "Unpaid"}
                    </div>
                  </TableCell>
                  <TableCell align="left" className="body3-reg">
                    <button
                      onClick={changeGuestStatus}
                      className="w-[100px] px-5 py-4 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298] rounded-xl cursor-pointer"
                    >
                      Send Link
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default SessionDetials;
