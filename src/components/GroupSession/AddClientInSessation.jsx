import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constant/ApiConstant";
import LeftArrow from "../../assets/LeftArrow.svg";
import Select from "react-select";
import toast from "react-hot-toast";
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

const AddClientInSessation = () => {
  const { sessationId } = useParams();
  const navigate = useNavigate();
  const [sessationDetials, setSessationDetials] = useState({});
  const [allClient, setAllClient] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedClientOption, setSelectedClientOption] = useState(null); // Local state for selected option
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
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
  // Fetching group session details
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

  // Fetching all clients
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
  const addGuestListInGroupSessation = () => {
    axios
      .post(`${API_URL}/groupSessation/addGuestListToGroupSession`, {
        id: sessationId,
        guests: selectedClients,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("Guest Added Successfully");
          navigate("/therapist/group-session");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getGroupSessationDetials();
    getAllClients();
  }, []);

  // Handle selecting a client option
  const handleSelectChange = (selectedOption) => {
    setSelectedClientOption(selectedOption);
  };

  // Handle adding the selected client when button is clicked
  const handleAddClient = () => {
    if (selectedClientOption) {
      const clientData = allClient.find(
        (client) => client._id === selectedClientOption.value
      );
      setSelectedClients([
        ...selectedClients,
        {
          _id: clientData._id,
          name: clientData.name,
          phone_number: clientData.phone_number, // Add mobile number
          email: clientData.email, // Add email
          status: false,
          payment: false,
          paymentLink: false,
        },
      ]);

      setSelectedClientOption(null); // Clear the selection
    }
  };

  const EmployeeColumns = [
    { id: "name", label: "Guest Name" },
    { id: "mobile", label: "Mobile" },
    { id: "email", label: "Email" },
    // { id: "status", label: "Status" },
    // { id: "payment", label: "Payment" },
    // { id: "paymentLink", label: "Payment Link" },
  ];

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      // Add client if checked
      setSelectedClients((prevClients) => [
        ...prevClients,
        {
          _id: id,
          name: "",
          mobile: "",
          email: "",
          status: false,
          payment: false,
          paymentLink: false,
        },
      ]);
    } else {
      // Remove client if unchecked
      setSelectedClients((prevClients) =>
        prevClients.filter((client) => client._id !== id)
      );
    }
  };

  const filteredtotalClient = selectedClients;

  const options = allClient.map((client) => ({
    value: client._id,
    label: client.name,
  }));
console.log(selectedClients);

  return (
    <>
      <div className="pb-4 pt-16 pl-8 pr-16 flex justify-between gap-5">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div onClick={() => navigate(-1)}>
            <img src={LeftArrow} alt="" />
          </div>
          <h5 className="h5-bold">{sessationDetials?.topic}</h5>
        </div>
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
        <div>
          <button
            className="bg-[#614298] w-[173px] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer font-quicksand"
            onClick={handleOpenModal}
          >
            Add New Guest
          </button>
        </div>
      </div>

      <div className="px-16 flex justify-between mt-16">
        <div>
          <div style={{ width: "fit-content" }}>
            <h5
              className="text-[#06030D] font-quicksand text-[20px] font-normal not-italic tracking-widest pb-2"
              style={{
                borderBottom: "4px solid var(--primary-5, #614298)",
              }}
            >
              Employee
            </h5>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[#06030D] font-quicksand text-sm font-semibold not-italic leading-5 tracking-[0.28px]">
          <p className="">Search :</p>
          <div className="flex items-center gap-4 justify-center">
            <Select
              value={selectedClientOption}
              onChange={handleSelectChange}
              options={options}
              placeholder="Select or type client name"
              className="w-[440px] h-[37px] z-[500]"
            />
            <button
              className={`bg-[#614298] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer font-quicksand ${
                selectedClients.length >= sessationDetials?.guestLimit
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleAddClient}
              disabled={selectedClients.length >= sessationDetials?.guestLimit}
            >
              Add Client
            </button>
          </div>
        </div>
      </div>

      <div className="px-16 flex justify-between mt-16">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className="addEmployee1">
                {EmployeeColumns.map((column) => (
                  <TableCell align="left" key={column.id} className="body3-sem">
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="addEmployee2">
              {Array.isArray(filteredtotalClient) &&
                filteredtotalClient
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id}

                    >
                      <TableCell align="left" className="body3-reg">
                        <div className="flex items-center">
                          <div>
                            <Checkbox
                              className="checkbox"
                              size="large"
                              sx={{ borderRadius: "6px" }}
                              // checked={row.status}
                              defaultChecked={true}
                              onChange={() => handleCheckboxChange(row._id)}
                            />
                          </div>
                          <div>
                            <div>{row.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      {/* <TableCell align="left" className="body3-reg">
                       
                      </TableCell> */}
                      <TableCell align="left" className="body3-reg">
                        <div>{row.phone_number}</div>
                      </TableCell>
                      <TableCell align="left" className="body3-reg">
                        <div>{row.email}</div>
                      </TableCell>

                      {/* <TableCell align="left" className="body3-reg">
                        <button
                          className={`w-[120px] px-5 py-4 cursor-pointer ${
                            row?.status
                              ? "bg-[#F2F2F2] text-[#B7B2BF] border border-solid border-[#D5D2D9]"
                              : "bg-[#614298] text-white  cursor-pointer"
                          }   border border-solid border-[#614298] rounded-xl `}
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
                        <button className="w-[100px] px-5 py-4 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298] rounded-xl cursor-pointer">
                          Send Link
                        </button>
                      </TableCell> */}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="px-16 flex justify-between mt-16">
        <div className="flex gap-4">
          <button
            className="w-[120px] px-5 py-4 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298] rounded-xl cursor-pointer"
            onClick={() => {
              addGuestListInGroupSessation();
            }}
          >
            Save
          </button>
          <button
            className="w-[120px] px-5 py-4 bg-[#fcfcfc] text-[#614298] rounded-xl border border-solid border-[#614298] cursor-pointer"
            onClick={() => navigate("/therapist/group-session")}
          >
            Cancel
          </button>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <span className="text-[#06030D] font-quicksand text-[16px] not-italic font-semibold leading-6 tracking-wider">
            Guest
          </span>
          <span className="p-4 border border-solid border-[#D5D2D9] rounded-lg text-[#06030D] font-quicksand text-[16px] not-italic font-semibold leading-6 tracking-wider">
            {selectedClients.length > 0 ? selectedClients.length : "0"}/
            {sessationDetials?.guestLimit}
          </span>
          <span className="text-[#06030D] font-quicksand text-[16px] not-italic font-semibold leading-6 tracking-wider">
            Limit
          </span>
        </div>
      </div>
    </>
  );
};

export default AddClientInSessation;
