import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { API_URL } from "../../constant/ApiConstant";
import vector from "../../assets/Vector.svg";
import add from "../../assets/Icon.svg";

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
  Box,
  InputAdornment,
  TextField,
  Tab,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { calculateAge } from "../../constant/constatnt";
import FilterIcon from "../../assets/filter.svg";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const columns = [
  {
    id: "Client ID",
    align: "right",
  },
  {
    id: "Client Name",
    align: "right",
  },
  {
    id: "Mobile no",
    align: "right",
  },
  {
    id: "Email",
    align: "right",
  },
  {
    id: "Type",
    align: "right",
  },
  {
    id: "Age",
    align: "right",
  },
  {
    id: "Gender",
    align: "right",
  },
  // {
  //   id: "Session Status",
  //   align: "right",
  // },
];
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

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case "Pending":
      return { backgroundColor: "#F4EDFF", color: "#614298" };
    case "Cancelled":
      return { backgroundColor: "#F8DDDF", color: "#500000" };
    default:
      return { backgroundColor: "white", color: "black" };
  }
};

const Clients = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [clientDetails, setClientDetails] = useState([]);
  const [exClientDetails, setExClientDetails] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [value, setValue] = useState("1");
  const [appointType, setAppointType] = useState("pre-consultation");
  const [searchTerm, setSearchTerm] = useState("");
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
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewuser();
    handleCloseModal();
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
  const handleOpenModal = (days) => {
    setOpenModal(true);
  };

  const handleChangeType = (event) => {
    setAppointType(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
        if (res.status === 200) {
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getClients = () => {
    axios
      .get(`${API_URL}/getAllTherapistUsers/preconsultation`)
      .then((res) => {
        const employees = res.data.data;
        if (res.status == 200) {
          setClientDetails(employees);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  // const getClientspre = () => {
  //   axios
  //     .get(`${API_URL}/getAllTherapistUsers/preconsultation`)
  //     .then((res) => {
  //       const employees = res.data.data;
  //       if (res.status == 200) {
  //         setClientDetails(employees);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error:", err);
  //     });
  // };
  const getexClients = () => {
    axios
      .get(`${API_URL}/getAllTherapistUsers/session`)
      .then((res) => {
        const employees = res.data.data;
        if (res.status == 200) {
          setExClientDetails(employees);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    if (value == "1") {
      getClients();
    } else if (value == "2") {
      getexClients();
    }
  }, [value]);
  const filteredClientDetails = (
    value === "1" ? clientDetails : exClientDetails
  ).filter(
    (client) =>
      !searchTerm.trim() ||
      client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <div className="flex items-center justify-between">
          <h5 className="h5-bold">Clients</h5>
          {/* <div className="flex flex-col justify-end space-y-10">
          {/* <div className="flex flex-col justify-end space-y-10">
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
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: "14px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={handleOpenModal}
            >
              <img src={add} />
              <span>Add New User</span>
            </button>
          </div> */}
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
                        <label className="p2-sem" style={{ color: "#4A4159" }}>
                          Phone Number
                        </label>
                        <TextField
                          fullWidth
                          type="number"
                          required
                          name="phoneNumber"
                          value={formData.phoneNumber}
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

        <div style={{ marginTop: "10px" }}>
          <TabContext value={value}>
            <div className="flex justify-between items-center">
              <Box sx={{ borderBottom: 1, width: "295px" }}>
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
            </div>
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
                        {Array.isArray(filteredClientDetails) &&
                          filteredClientDetails
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
                                  key={row._id}
                                  sx={{ padding: "16px", cursor: "pointer" }}
                                  onClick={() => {
                                    navigate(
                                      `/therapist/clientDetails/${row._id}/${
                                        value == 1 ? "pre" : "sess"
                                      }`
                                    );
                                  }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div style={{ textDecoration: "none" }}>
                                      {row?._id.slice(-10)}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.name == null
                                        ? "unknown"
                                        : row?.name}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.phone_number == null
                                        ? "unknown"
                                        : row?.phone_number}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.email}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.referred_by}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {calculateAge(row?.profile_details?.dob)}

                                      {/*  */}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.profile_details?.gender}</div>
                                  </TableCell>
                                  {/* <TableCell align="left" className="body3-reg">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px 24px",
                                        border: "none",
                                        width: "105px",
                                        cursor:
                                          row.booking_status == 4
                                            ? "pointer"
                                            : "default",
                                        background:
                                          getStatusColor("Accepted")
                                            .backgroundColor,
                                        color: getStatusColor("Accepted").color,
                                      }}
                                    >
                                      Accepted
                                    </button>
                                  </TableCell> */}
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
                    count={filteredClientDetails.length}
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
                  {Array.isArray(filteredClientDetails) &&
                    filteredClientDetails
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
                              <div className="body3-sem w-[40%]">Client</div>
                              <div className="body3-reg pr-2 w-[60%]">
                                {item.emp_name}
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
                                <div className="body3-sem w-[40%]">
                                  Client Id
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_id}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Mobile</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_mob_no}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">
                                  Reffered By
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item?.m_refered_user}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Age</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {calculateAge(item.emp_dob)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Gender</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_gender}
                                </div>
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
                                      `/therapist/clientDetails/${item.emp_id}`
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
                    count={filteredClientDetails.length}
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
                        {Array.isArray(filteredClientDetails) &&
                          filteredClientDetails
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
                                  key={row._id}
                                  sx={{ padding: "16px", cursor: "pointer" }}
                                  onClick={() => {
                                    navigate(
                                      `/therapist/clientDetails/${row._id}/${
                                        value == 1 ? "pre" : "sess"
                                      }`
                                    );
                                  }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div style={{ textDecoration: "none" }}>
                                      {row._id.slice(-12)}
                                    </div>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.name}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.phone_number == null
                                        ? "*******"
                                        : row?.phone_number}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.email}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {row?.m_refered_user == null
                                        ? "Enso Product "
                                        : row?.m_refered_user}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {calculateAge(row?.profile_details?.dob)}
                                    </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.profile_details?.gender}</div>
                                  </TableCell>
                                  {/* <TableCell align="left" className="body3-reg">
                                    <div>Accepted</div>
                                  </TableCell> */}
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
                    count={filteredClientDetails.length}
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
                  {Array.isArray(filteredClientDetails) &&
                    filteredClientDetails
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
                              <div className="body3-sem w-[40%]">Client</div>
                              <div className="body3-reg pr-2 w-[60%]">
                                {item.emp_name}
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
                                <div className="body3-sem w-[40%]">
                                  Client Id
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_id}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Mobile</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_mob_no}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">
                                  Reffered By
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item?.m_refered_user}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Age</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {calculateAge(item.emp_dob)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Gender</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.emp_gender}
                                </div>
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
                                      `/therapist/clientDetails/${item._id}`
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
                    count={filteredClientDetails.length}
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

export default Clients;
