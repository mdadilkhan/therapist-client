import { useState, useEffect, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CancelPopup from "../assets/CancelPopup.svg";
import Accepted from "../assets/Accepted.svg";
import FilterIcon from "../assets/filter.svg";
import warn from "../assets/Frame.svg";
import Backdrop from "@mui/material/Backdrop";
import { useSocket } from "../getSocket";
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
  Modal,
  Fade,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Popover,
  Typography,
} from "@mui/material";
import {
  calculateAge,
  extractTimeFromCreatedAt,
  getformatedDate,
} from "../constant/constatnt";
import { API_URL } from "../constant/ApiConstant";
import toast from "react-hot-toast";

const columns = [
  // for given it is is common column for preconsultation and session
  {
    id: "Client Name ",
    align: "right",
  },
  {
    id: "Client Mobile",
    align: "right",
  },

  {
    id: "Date",
    align: "right",
  },

  {
    id: "Referred to",
    align: "right",
  },
  {
    id: "Note ",
    align: "right",
  },
];

const referalRecievedColumnsession = [
  {
    id: "Client Name ",
    align: "right",
  },
  {
    id: "Client Mobile",
    align: "right",
  },
  {
    id: "Refered by",
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
    id: "View Client history",
    align: "right",
  },
  {
    id: "Request",
    align: "right",
  },
  {
    id: "Counsultation ",
    align: "right",
  },
];
const referalRecievedColumns = [
  {
    id: "Client Name ",
    align: "right",
  },
  {
    id: "Client Mobile",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "Request",
    align: "right",
  },
  // {
  //   id: "Counsultation ",
  //   align: "right",
  // },
];
const data = [
  {
    name: "Shruti Ramakrishnan",
    type: "External",
    concern: "Anger",
    gender: "External",
    specialization: "Child & Adolescent Psychologist",
  },
  {
    name: "Shruti Ramakrishnan",
    type: "External",
    concern: "Depression",
    gender: "External",
    specialization: "Child & Adolescent Psychologist",
  },
  {
    name: "Shruti Ramakrishnan",
    type: "External",
    concern: "Anger",
    gender: "External",
    specialization: "Child & Adolescent Psychologist",
  },
  {
    name: "Shruti Ramakrishnan",
    type: "External",
    concern: "Anger",
    gender: "External",
    specialization: "Child & Adolescent Psychologist",
  },
];
const givenRefrals = [
  {
    clientName: "John Doe",
    clientMobile: "123 456 7890",
    date: "2023-08-01",
    status: "Accepted",
  },
  {
    clientName: "Jane Smith",
    clientMobile: "234 567 8901",
    date: "2023-08-02",
    status: "Pending",
  },
  {
    clientName: "Emily Davis",
    clientMobile: "345 678 9012",
    date: "2023-08-03",
    status: "Accepted",
  },
  {
    clientName: "Michael Johnson",
    clientMobile: "456 789 0123",
    date: "2023-08-04",
    status: "Rejected",
  },
  {
    clientName: "Sarah Wilson",
    clientMobile: "567 890 1234",
    date: "2023-08-05",
    status: "Accepted",
  },
  {
    clientName: "David Martinez",
    clientMobile: "678 901 2345",
    date: "2023-08-06",
    status: "Pending",
  },
  {
    clientName: "Daniel Garcia",
    clientMobile: "789 012 3456",
    date: "2023-08-07",
    status: "Accepted",
  },
  {
    clientName: "Laura Brown",
    clientMobile: "890 123 4567",
    date: "2023-08-08",
    status: "Accepted",
  },
  {
    clientName: "James Anderson",
    clientMobile: "901 234 5678",
    date: "2023-08-09",
    status: "Rejected",
  },
  {
    clientName: "Elizabeth Hernandez",
    clientMobile: "012 345 6789",
    date: "2023-08-10",
    status: "Pending",
  },
];
const receivedRefralsession = [
  {
    clientName: "Yash Sharma",
    clientMobile: "343 143 4215",
    date: "09/10/2023",
    time: "12:00 PM - 01:00 PM",
    requestStatus: "Accepted",
    consultationStatus: "Accepted",
  },
  {
    clientName: "Shruti Ramakrishnan",
    clientMobile: "452 141 3343",
    date: "09/10/2023",
    time: "12:00 PM - 01:00 PM",
    requestStatus: "Pending",
    consultationStatus: "Pending",
  },
];
const receivedRefral = [
  {
    clientName: "Dayal Sharma pre",
    clientMobile: "343 143 4215",
    date: "09/10/2023",
    time: "12:00 PM - 01:00 PM",
    requestStatus: "Accepted",
  },
  {
    clientName: "Shruti Ramakrishnan",
    clientMobile: "452 141 3343",
    date: "09/10/2023",
    time: "12:00 PM - 01:00 PM",
    requestStatus: "Pending",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case "Rejected":
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case "Pending":
      return { backgroundColor: "#F4EDFF", color: "#614298" };
    case "Unknown":
      return { backgroundColor: "#F4EDFF", color: "#614298" };
    default:
      return { backgroundColor: "white", color: "black" };
  }
};

const oldAppointmentStatus = {
  0: "Pending",
  1: "Complete",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const Refrals = () => {
  const { id } = useParams();
  const [value, setValue] = useState("1");
  const [page, setPage] = useState(0);
  // const [givenRefral, setGivenRefral] = useState([]);
  // const [receivedRefral, setReceivedRefral] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModalv, setOpenModalv] = useState(false);
  const [openModalve, setOpenModalve] = useState(false);
  const [values, setValues] = useState("pre-consultation");
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [givenRefral, setGivenRefral] = useState({});
  const [recieveReferal, setRecieveRefral] = useState({});
  const [givenRefralsess, setGivenRefralsess] = useState({});
  const [recieveReferalsess, setRecieveRefralsess] = useState({});
  const [data, setData] = useState([]);
  const [selectedReferralId, setSelectedReferralId] = useState({
    referralId: "",
    clientId: "",
    name: "",
  });
  const [notes, setNote] = useState("");
  const [openModalClientHistory, setOpenModalClientHistory] = useState(false); // Keep track of modal state
  const [clientHistory, setClientHistory] = useState({}); // Store fetched client data
  const [loading, setLoading] = useState(false); // Add loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const socket = useSocket();
  const details = useSelector((state) => state.userDetails);
  const fetchClientDetails = async (clientId, notes) => {
    setLoading(true); // Start loading state
    try {
      axios
        .get(`${API_URL}/getClientHistory/${clientId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.data);

            // Merge notes into the clientHistory object
            const updatedClientHistory = {
              ...res.data.data, // Spread existing client history data
              notes: notes, // Add/merge the notes
            };

            // Set the updated client history with notes
            setClientHistory(updatedClientHistory);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching client details:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleOpenModalClientHistory = (clientId, notes) => {
    setIsModalOpen(true); // Use the new state
    fetchClientDetails(clientId, notes); // Fetch client details by ID
  };

  // Function to close the modal and reset client data
  const handleCloseModalClientHistory = () => {
    setIsModalOpen(false); // Use the new state
    setClientHistory(null); // Reset client data when closing
  };

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModalve = () => {
    setOpenModalve(false);
  };

  const handleOpenModalve = (note) => {
    setNote(note);
    setOpenModalve(true);
    console.log(openModalve, "KKLLKLKLKL");
  };

  const handleCloseModalv = () => {
    setOpenModalv(false);
  };

  const handleOpenModalv = (viewlistdata) => {
    setData(viewlistdata);
    setOpenModalv(true);
  };

  const handleAcceptPreRequest = (refId, clientId) => {
    axios
      .post(`${API_URL}/acceptPreReferral`, {
        referralId: refId,
        therapistId: clientId,
      })
      .then((res) => {
        if (res.status == 200) {
          socket.emit("client", {});
          handleCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const handleAcceptSessRequest = () => {
    const data = {
      referralId: selectedReferralId.referralId,
      clientId: selectedReferralId.clientId,
    };
    axios
      .post(`${API_URL}/acceptSessionReferral`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`you accept the referal`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
          socket.emit("client", {
            title: "Accepted Referal",
            message: ` Dr ${details.name} is accepet your refferal `,
            userId: data.clientId,
            role: "user",
          });
          handleCloseModal2();
          ReceivedRefralToTherapistsession();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleChangepre = (event) => {
    setValues(event.target.value);
  };

  const handleOpenModal2 = (referralId, clientId, name) => {
    setSelectedReferralId({
      referralId: referralId,
      clientId: clientId,
      name: name,
    });
    setOpenModal2(true);
  };
  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleOpenModal3 = (referralId, clientId, clientName) => {
    console.log(referralId, clientId, clientName);

    setSelectedReferralId({
      referralId: referralId,
      clientId: clientId,
      name: clientName,
    });
    console.log(selectedReferralId);
    setOpenModal3(true);
  };

  const handleCloseModal3 = () => {
    setOpenModal3(false);
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
  // both will be fetch according to value {Given and Recieved  api for referal and recived}
  const givenRefralToTherapist = () => {
    axios
      .get(`${API_URL}/getGivenPreconsultationReferralList`)
      .then((res) => {
        if (res.status === 200) {
          setGivenRefral(res.data.data);
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ReceivedRefralToTherapist = () => {
    axios
      .get(`${API_URL}/getReceivedPreconsultationReferralList`)
      .then((res) => {
        if (res.status === 200) {
          setRecieveRefral(res.data.data);
          // setRecieveRefralsess(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const givenRefralToTherapistsession = () => {
    axios
      .get(`${API_URL}/getGivenSessionReferralList`)
      .then((res) => {
        if (res.status === 200) {
          setGivenRefralsess(res.data.data);
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ReceivedRefralToTherapistsession = () => {
    axios
      .get(`${API_URL}/getReceivedSessionReferralList`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);

          setRecieveRefralsess(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    if (values == "pre-consultation") {
      if (value == "1") {
        givenRefralToTherapist();
      } else {
        ReceivedRefralToTherapist();
      }
    } else {
      if (value == "1") {
        givenRefralToTherapistsession();
      } else {
        ReceivedRefralToTherapistsession();
      }
    }
  }, [values, value]);
  const sendLinks = () => {
    let formData = new FormData();
    formData.append("m_ref_id", givenRefral?.m_ref_id);
    axios
      .post(
        "https://onekeycare.com/smportal/Counsellor_Api/send_link",
        formData
      )
      .then((res) => {
        if (res.data.response == "success") {
          console.log("refer done");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  // const getRecievedReferrals = () => {
  //   axios
  //     .get(`${API_URL}/getRecievedReferrals`)
  //     .then((res) => {
  //       if (res.data.success === true) {
  //         setReceivedRefral(res.data.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error:", err);
  //     });
  // };

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <div className="flex flex-row space-x-5">
          <h5 className="h5-bold">Referrals</h5>
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
              value={values}
              onChange={handleChangepre}
              sx={{
                width: "90%",
                fontSize: "16px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="pre-consultation" sx={{ fontSize: "14px" }}>
                Pre consultation
              </MenuItem>
              <MenuItem value="sessions" sx={{ fontSize: "14px" }}>
                Sessions
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginTop: "24px" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, width: "210px" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Given "
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
                  label="Received"
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
              {values === "pre-consultation" ? (
                viewportWidth >= 640 ? (
                  <Paper
                    elevation={0}
                    sx={{ width: "100%", overflow: "hidden" }}
                  >
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
                          {Array.isArray(givenRefral) &&
                            givenRefral
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id}
                                  sx={{ padding: "16px" }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    {row.clientName}
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    {row?.phoneNumber}
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    {getformatedDate(row?.createdAt)}
                                  </TableCell>
                                  {/* <TableCell align="left" className="body3-reg">
                                    <div
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "2px 8px",
                                        border: "none",
                                        background: getStatusColor(
                                          row?.referredTo[0]?.referralStatus
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          row?.referredTo[0]?.referralStatus
                                        ).color,
                                      }}
                                    >
                                      <div>
                                        {row?.referredTo[0]?.referralStatus}
                                      </div>
                                    </div>
                                  </TableCell> */}

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
                                        border: "1px solid #614298",
                                        color: "#614298", // Text color when not hovered
                                        background: "#fff",
                                        "&:hover": {
                                          background: "#614298",
                                          color: "#fff", // Change text color on hover
                                        },
                                        opacity:
                                          row.m_refered_status == 1 ? 0.5 : 1,
                                      }}
                                      disabled={row.m_refered_status == 1}
                                      onClick={() => sendLinks()}
                                    >
                                      <span
                                        style={{
                                          textAlign: "center",
                                          fontFamily: "Nunito",
                                          fontSize: "16px",
                                          fontStyle: "normal",
                                          fontWeight: 400,
                                          lineHeight: "24px",
                                          letterSpacing: "0.08px",
                                          textTransform: "capitalize",
                                        }}
                                        onClick={() => {
                                          handleOpenModalv(row?.referredTo);
                                        }}
                                      >
                                        View List
                                      </span>
                                    </Button>

                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={openModalv}
                                      onClose={handleCloseModalv}
                                      closeAfterTransition
                                      slots={{ backdrop: Backdrop }}
                                      slotProps={{
                                        backdrop: {
                                          timeout: 500,
                                          style: {
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.3)", // Make the background fully transparent
                                          },
                                        },
                                      }}
                                    >
                                      <Fade in={openModalv}>
                                        <Box
                                          className="p-6 bg-[#FCFCFC] rounded-[8px]"
                                          sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)", // Center the modal
                                            minWidth: "60%", // Adjust minWidth as needed
                                            outline: "none", // Optional: Remove outline for better aesthetics
                                            padding: "16px",
                                          }}
                                        >
                                          <h1 className="h5-bold mb-4">
                                            Refer to Therapist
                                          </h1>
                                          <TableContainer
                                            component={Paper}
                                            className="bg-[#FCFCFC]"
                                          >
                                            <Table>
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell className="body3-reg align-left">
                                                    Name
                                                  </TableCell>
                                                  <TableCell>Type</TableCell>
                                                  <TableCell>Gender</TableCell>
                                                  <TableCell>
                                                    Specialization
                                                  </TableCell>
                                                  <TableCell>Status</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {data.map((row, index) => (
                                                  <TableRow key={index}>
                                                    {/* Add a checkbox in the first cell of each row */}

                                                    <TableCell>
                                                      {row?.therapistName}
                                                    </TableCell>
                                                    <TableCell>
                                                      External
                                                    </TableCell>
                                                    <TableCell>
                                                      {row?.gender}
                                                    </TableCell>

                                                    <TableCell>
                                                      {row.specialization}
                                                    </TableCell>
                                                    <TableCell>
                                                      <button
                                                        style={{
                                                          borderRadius: "4px",
                                                          textAlign: "center",
                                                          padding: "6px 24px",
                                                          border: "none",
                                                          width: "100px",
                                                          background:
                                                            getStatusColor(
                                                              row?.referralStatus
                                                                ?.charAt(0)
                                                                .toUpperCase() +
                                                                row?.referralStatus
                                                                  ?.slice(1)
                                                                  .toLowerCase()
                                                            ).backgroundColor,
                                                          color: getStatusColor(
                                                            row?.referralStatus
                                                              ?.charAt(0)
                                                              .toUpperCase() +
                                                              row?.referralStatus
                                                                ?.slice(1)
                                                                .toLowerCase()
                                                          ).color,
                                                        }}
                                                      >
                                                        {row?.referralStatus
                                                          ?.charAt(0)
                                                          .toUpperCase() +
                                                          row?.referralStatus
                                                            ?.slice(1)
                                                            .toLowerCase()}
                                                      </button>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </TableContainer>

                                          <Box className="flex justify-end mt-4">
                                            <Button
                                              autoFocus
                                              sx={{
                                                width: "170px",
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
                                              onClick={handleCloseModalv}
                                            >
                                              <span>Closed</span>
                                            </Button>
                                          </Box>
                                        </Box>
                                      </Fade>
                                    </Modal>
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
                                        border: "1px solid #614298",
                                        color: "#614298",
                                        background: "#fff",
                                        "&:hover": {
                                          background: "#614298",
                                          color: "#fff",
                                        },
                                        opacity:
                                          row.m_refered_status == 1 ? 0.5 : 1,
                                      }}
                                      disabled={row.m_refered_status == 1}
                                      onClick={() =>
                                        handleOpenModalve(row?.notes)
                                      }
                                    >
                                      <span
                                        style={{
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
                                        Views
                                      </span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      className="body3-sem"
                      rowsPerPageOptions={[10, 25, 100, 125]}
                      component="div"
                      count={givenRefral.length}
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
                    {Array.isArray(givenRefral) &&
                      givenRefral
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
                                  <div className="body3-sem w-[50%]">
                                    Appointment ID
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {item.m_appt_no}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Parent’s mobile
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {item.m_parent_mobileno}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">Date</div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {getformatedDate(item.m_refered_date)}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Status
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    {item.m_refered_status}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Referred by
                                  </div>
                                  <div className="body3-reg pr-2 w-[50%]">
                                    Teacher
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[50%]">
                                    Consent Form
                                  </div>
                                  <div
                                    style={{
                                      borderRadius: "4px",
                                      textAlign: "center",
                                      padding: "5px 8px",
                                      fontSize: "13px",
                                      width: "50%",
                                      background: getStatusColor(
                                        consentFormSubmittedStatus ===
                                          "Submitted"
                                          ? "Green"
                                          : "Red"
                                      ),
                                      color: "#FFF",
                                    }}
                                  >
                                    {consentFormSubmittedStatus === "Submitted"
                                      ? "View"
                                      : "Submitted"}
                                  </div>
                                </div>
                                <div className="w-full flex justify-center pt-3">
                                  <Button
                                    sx={{
                                      display: "flex",
                                      width: "120px",
                                      padding: "4px 8px",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: "10px",
                                      flexShrink: 0,
                                      borderRadius: "4px",
                                      background: "#614298",
                                      "&:hover": {
                                        background: "#614298",
                                      },
                                    }}
                                    onClick={() => sendLinks()}
                                  >
                                    <span
                                      style={{
                                        color: "#FFF",
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
                                      View List
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    <TablePagination
                      className="body3-sem"
                      rowsPerPageOptions={[10, 25, 100, 125]}
                      component="div"
                      count={givenRefral.length}
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
                  </div>
                )
              ) : viewportWidth >= 640 ? (
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
                        {Array.isArray(givenRefralsess) &&
                          givenRefralsess
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                                sx={{ padding: "16px" }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  {row.clientName}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row?.phoneNumber}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {getformatedDate(row?.createdAt)}
                                </TableCell>
                                {/* <TableCell align="left" className="body3-reg">
                                  <div
                                    style={{
                                      borderRadius: "4px",
                                      textAlign: "center",
                                      padding: "2px 8px",
                                      ...getStatusColor(row.status),
                                    }}
                                  >
                                    {row.status}
                                  </div>
                                </TableCell> */}

                                <TableCell align="left" className="body3-reg">
                                  {row?.referredTo[0].therapistName}
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
                                      border: "1px solid #614298",
                                      color: "#614298",
                                      background: "#fff",
                                      "&:hover": {
                                        background: "#614298",
                                        color: "#fff",
                                      },
                                      opacity:
                                        row.m_refered_status == 1 ? 0.5 : 1,
                                    }}
                                    disabled={row.m_refered_status == 1}
                                    onClick={() =>
                                      handleOpenModalve(row?.notes)
                                    }
                                  >
                                    <span
                                      style={{
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
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={givenRefral.length}
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
                  {Array.isArray(givenRefral) &&
                    givenRefral
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
                                <div className="body3-sem w-[50%]">
                                  Appointment ID
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.m_appt_no}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">
                                  Parent’s mobile
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.m_parent_mobileno}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Date</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {getformatedDate(item.m_refered_date)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">Status</div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  {item.m_refered_status}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">
                                  Referred by
                                </div>
                                <div className="body3-reg pr-2 w-[50%]">
                                  Teacher
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[50%]">
                                  Consent Form
                                </div>
                                <div
                                  style={{
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "5px 8px",
                                    fontSize: "13px",
                                    width: "50%",
                                    background: getStatusColor(
                                      consentFormSubmittedStatus === "Submitted"
                                        ? "Green"
                                        : "Red"
                                    ),
                                    color: "#FFF",
                                  }}
                                >
                                  {consentFormSubmittedStatus === "Submitted"
                                    ? "View"
                                    : "Submitted"}
                                </div>
                              </div>
                              <div className="w-full flex justify-center pt-3">
                                <Button
                                  sx={{
                                    display: "flex",
                                    width: "120px",
                                    padding: "4px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexShrink: 0,
                                    borderRadius: "4px",
                                    background: "#614298",
                                    "&:hover": {
                                      background: "#614298",
                                    },
                                  }}
                                  onClick={() => sendLinks()}
                                >
                                  <span
                                    style={{
                                      color: "#FFFF",
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
                                    View List
                                  </span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  <TablePagination
                    className="body3-sem"
                    rowsPerPageOptions={[10, 25, 100, 125]}
                    component="div"
                    count={givenRefral.length}
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
                </div>
              )}
            </TabPanel>

            <TabPanel value="2">
              {values === "pre-consultation" ? (
                viewportWidth >= 640 ? (
                  <Paper
                    elevation={0}
                    sx={{ width: "100%", overflow: "hidden" }}
                  >
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {referalRecievedColumns.map((column) => (
                              <TableCell key={column.id} className="body3-sem">
                                {column.id}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(recieveReferal) &&
                            recieveReferal
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
                                    sx={{ padding: "16px" }}
                                  >
                                    <TableCell
                                      align="left"
                                      className="body3-reg"
                                    >
                                      <div>{row.clientName} </div>
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className="body3-reg"
                                    >
                                      <div>{row?.phoneNumber}</div>
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className="body3-reg"
                                    >
                                      <div>
                                        {getformatedDate(row?.createdAt)}pre
                                      </div>
                                    </TableCell>

                                    <TableCell
                                      align="left"
                                      className="body3-reg"
                                    >
                                      <div
                                        onClick={
                                          row?.referralStatus === "pending" ||
                                          row?.referralStatus === "Unknown"
                                            ? handleOpenModal
                                            : null
                                        }
                                        style={{
                                          borderRadius: "4px",
                                          textAlign: "center",
                                          padding: "2px 8px",
                                          border: "none",
                                          background: getStatusColor(
                                            row?.referralStatus
                                          ).backgroundColor,
                                          color: getStatusColor(
                                            row?.referralStatus
                                          ).color,
                                          cursor:
                                            row?.referralStatus === "Pending" ||
                                            row?.referralStatus === "Unknown"
                                              ? "pointer"
                                              : "default",
                                        }}
                                      >
                                        {row?.referralStatus === "pending" ||
                                        row?.referralStatus === "Unknown" ? (
                                          <div
                                            style={{
                                              color: getStatusColor(
                                                row.referralStatus
                                              ).color,
                                              fontFamily: "nunito",
                                              fontWeight: "600",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {row.referralStatus}
                                          </div>
                                        ) : (
                                          <div>{row?.referralStatus}</div>
                                        )}
                                      </div>
                                    </TableCell>

                                    <TableCell
                                      align="left"
                                      className="body3-reg"
                                    >
                                      <div
                                        style={{
                                          borderRadius: "4px",
                                          textAlign: "center",
                                          padding: "2px 8px",
                                          border: "none",
                                          background: getStatusColor(
                                            row.requestStatus
                                          ).backgroundColor,
                                          color: getStatusColor(
                                            row.requestStatus
                                          ).color,
                                        }}
                                      >
                                        {row?.consultationStatus ===
                                        "Pending" ? (
                                          <div>
                                            <button
                                              onClick={handleOpenModal}
                                              style={{
                                                color: getStatusColor(
                                                  row.consultationStatus
                                                ).color,
                                                border: "none",
                                                fontFamily: "nunito",
                                                fontWeight: "600",
                                                fontSize: "16px",
                                              }}
                                            >
                                              {row.consultationStatus}
                                            </button>
                                          </div>
                                        ) : (
                                          <div>{row?.consultationStatus}</div>
                                        )}
                                      </div>
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
                      count={receivedRefral?.length}
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
                    {Array.isArray(receivedRefral) &&
                      receivedRefral
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
                                  {item.employee.emp_name}
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
                                    Client Id Session
                                  </div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    {item.employee.emp_id}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">
                                    Gender
                                  </div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    {item.employee.emp_gender}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">Age</div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    {calculateAge(item?.employee.emp_dob)}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">
                                    Department
                                  </div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    {item.employee.emp_department}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">Date</div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    {getformatedDate(item?.refer_date)}
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">
                                    Referral status
                                  </div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px 24px",
                                        border: "none",
                                        width: "100%",
                                        cursor:
                                          item.referral_status == 0
                                            ? "pointer"
                                            : "default",
                                        background: getStatusColor(
                                          item.referral_status
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          item.referral_status
                                        ).color,
                                      }}
                                    >
                                      {
                                        oldAppointmentStatus[
                                          item.referral_status
                                        ]
                                      }
                                    </button>
                                  </div>
                                </div>
                                <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                  <div className="body3-sem w-[40%]">
                                    Consultation Status
                                  </div>
                                  <div className="body3-reg pr-2 w-[60%]">
                                    <button
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "6px 24px",
                                        border: "none",
                                        width: "100%",
                                        cursor:
                                          item.consultation_status == 0
                                            ? "pointer"
                                            : "default",
                                        background: getStatusColor(
                                          item.consultation_status
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          item.consultation_status
                                        ).color,
                                      }}
                                    >
                                      {
                                        oldAppointmentStatus[
                                          item.consultation_status
                                        ]
                                      }
                                    </button>
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
                      count={receivedRefral.length}
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
                )
              ) : viewportWidth >= 640 ? (
                <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {referalRecievedColumnsession.map((column) => (
                            <TableCell key={column.id} className="body3-sem">
                              {column.id}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(recieveReferalsess) &&
                          recieveReferalsess
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
                                  key={row?.clientId}
                                  sx={{ padding: "16px" }}
                                >
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row.clientName} </div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.phoneNumber}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>{row?.referredBy}</div>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <div>{getformatedDate(row?.createdAt)}</div>
                                  </TableCell>
                                  <TableCell align="left" className="body3-reg">
                                    <div>
                                      {extractTimeFromCreatedAt(row?.createdAt)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
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
                                        border: "1px solid #614298",
                                        color: "#614298",
                                        background: "#fff",
                                        "&:hover": {
                                          background: "#614298",
                                          color: "#fff",
                                        },
                                        opacity:
                                          row.m_refered_status == 1 ? 0.5 : 1,
                                      }}
                                      disabled={row.m_refered_status == 1}
                                      onClick={() =>
                                        handleOpenModalClientHistory(
                                          row?.clientId,
                                          row?.notes
                                        )
                                      }
                                    >
                                      <span
                                        style={{
                                          textAlign: "center",
                                          fontFamily: "Nunito",
                                          fontSize: "16px",
                                          fontWeight: 400,
                                          lineHeight: "24px",
                                          letterSpacing: "0.08px",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        View List
                                      </span>
                                    </Button>

                                    {/* Modal */}
                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={isModalOpen}
                                      onClose={handleCloseModalClientHistory}
                                      closeAfterTransition
                                      slots={{ backdrop: Backdrop }}
                                      slotProps={{
                                        backdrop: {
                                          timeout: 500,
                                          style: {
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.1)",
                                          },
                                        },
                                      }}
                                    >
                                      <Fade in={isModalOpen}>
                                        <Box
                                          className="p-6 bg-[#FCFCFC] rounded-[8px]"
                                          sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            minWidth: "60%",
                                            outline: "none",
                                            padding: "16px",

                                            maxHeight: "80vh", // Set a max height for the modal
                                            overflowY: "auto",
                                          }}
                                        >
                                          <div className="flex flex-col gap-4">
                                            <h1 className="h6-bold">
                                              View Notes
                                            </h1>
                                            <div className="w-full h-[170px] border border-solid border-[#D5D2D9] rounded-2xl p-4">
                                              {clientHistory?.notes}
                                            </div>

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
                                                  <h1 className="h6-bold">
                                                    Client History
                                                  </h1>
                                                </div>
                                              </div>

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
                                                      <div>
                                                        <p className="body2-sem">
                                                          Intake Date
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.dateOfIntake ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Age
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.age ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Presenting Problem
                                                          (clients initial
                                                          explanation of the
                                                          problem, duration and
                                                          pertinent cause)
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.presentingProblem ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Tentative Goals and
                                                          Plans
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.tentativeGoalsAndPlans ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Special Needs of
                                                          Client (e.g. Need for
                                                          Interpreter,
                                                          Disability, Religious
                                                          Consultant, etc. if
                                                          yes, what?
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.specialNeeds ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                                                      <div>
                                                        <p className="body2-sem">
                                                          Family (current living
                                                          situation)
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.familyCurrentSituation ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Family History
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.familyHistory ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Pertinent History (any
                                                          prior therapy
                                                          including family,
                                                          social, psychological,
                                                          and medical-declared
                                                          condition)
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.pertinentHistory ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Observations
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.observations ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                      <div>
                                                        <p className="body2-sem">
                                                          Diagnostic Impression
                                                        </p>
                                                        <p className="body3-reg">
                                                          {clientHistory?.diagnosticImpression ||
                                                            "N/A"}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <hr
                                                    style={{
                                                      margin: "10px 0px",
                                                      background: "#D5D2D9",
                                                    }}
                                                  />

                                                  <div
                                                    className="2nd"
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                    }}
                                                  >
                                                    <div>
                                                      <h6
                                                        className="h6-bold"
                                                        style={{
                                                          color: "#06030D",
                                                        }}
                                                      >
                                                        MSE
                                                      </h6>
                                                    </div>
                                                    <div className="flex sm:flex-row flex-col">
                                                      <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                                                        <div>
                                                          <p className="body2-sem">
                                                            Appearance
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.appearance ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Orientation
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.orientation ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Speech
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.speech ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Thought Process and
                                                            Content
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.thoughtProcessContent ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Sleep
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.sleep ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex flex-col sm:w-[50%] w-full gap-[24px]">
                                                        <div>
                                                          <p className="body2-sem">
                                                            Behaviour
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.behavior ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Mood
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.mood ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Affect
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.affect ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Judgement
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.judgement ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <p className="body2-sem">
                                                            Appetite
                                                          </p>
                                                          <p className="body3-reg">
                                                            {clientHistory?.appetite ||
                                                              "N/A"}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <Box className="flex justify-end mt-4">
                                            <Button
                                              autoFocus
                                              sx={{
                                                width: "170px",
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
                                              onClick={
                                                handleCloseModalClientHistory
                                              }
                                            >
                                              <span>Close</span>
                                            </Button>
                                          </Box>
                                        </Box>
                                      </Fade>
                                    </Modal>
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="body3-reg "
                                  >
                                    <div
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "2px 8px",
                                        border: "none",
                                        cursor: " pointer",
                                        background: getStatusColor(
                                          row?.referralStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.referralStatus.slice(1)
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          row?.referralStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.referralStatus.slice(1)
                                        ).color,
                                      }}
                                    >
                                      {row?.referralStatus === "Pending" ||
                                      row?.referralStatus === "pending" ? (
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleOpenModal2(
                                                row?.referralId,
                                                row?.clientId,
                                                row?.clientName
                                              )
                                            }
                                            style={{
                                              color: getStatusColor(
                                                row?.referralStatus
                                              ).color,
                                              border: "none",
                                              fontFamily: "nunito",
                                              fontWeight: "600",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {row?.referralStatus
                                              .charAt(0)
                                              .toUpperCase() +
                                              row?.referralStatus.slice(1)}
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {row?.referralStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.referralStatus.slice(1)}
                                        </div>
                                      )}
                                    </div>

                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={openModal2}
                                      onClose={handleCloseModal2}
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
                                      <Fade in={openModal2}>
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "30%",
                                            bgcolor: "background.paper",
                                            borderRadius: "16px",
                                            border: "1px solid #D5D2D9",
                                            p: 4,
                                            "@media (max-width: 640px)": {
                                              width: "90%",
                                              marginTop: "5px",
                                            },
                                          }}
                                          className="text-center"
                                        >
                                          <div className="flex flex-col gap-4 justify-center items-center ">
                                            <img src={warn} />
                                            <h1 className="body3-reg">
                                              Do you want to accept appointment
                                              consultation of {row?.clientName}?
                                            </h1>
                                            <span className="text-gray-600 font-nunito text-xs font-normal leading-[1.4] tracking-[0.06px]">
                                              Once the appointment has been
                                              changed, you will not be able to
                                              make any changes!
                                            </span>
                                            <div className="w-full flex justify-end space-x-6">
                                              <button
                                                className="changeStatusButton cursor-pointer w-[160px]"
                                                onClick={() => {
                                                  handleAcceptSessRequest();
                                                  // handleCloseModal2(); // Close modal after action
                                                }}
                                              >
                                                OK
                                              </button>
                                              <button
                                                className="changeStatusButton cursor-pointer w-[160px] bg-[#fff] text-[#614298] border border-solid rounded-[8px] border-[#614298]"
                                                onClick={handleCloseModal2}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </Box>
                                      </Fade>
                                    </Modal>
                                  </TableCell>

                                  <TableCell align="left" className="body3-reg">
                                    <Modal
                                      aria-labelledby="transition-modal-title"
                                      aria-describedby="transition-modal-description"
                                      open={openModal3}
                                      onClose={handleCloseModal3}
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
                                      <Fade in={openModal3}>
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "30%",
                                            bgcolor: "background.paper",
                                            borderRadius: "16px",
                                            border: "1px solid #D5D2D9",
                                            p: 4,
                                            "@media (max-width: 640px)": {
                                              width: "90%",
                                              marginTop: "5px",
                                            },
                                          }}
                                          className="text-center"
                                        >
                                          <div className="flex flex-col gap-4 justify-center items-center ">
                                            <img src={warn} />

                                            <h1 className="body3-reg">
                                              Do you want to Schedule the
                                              appointment with
                                              <br />
                                              {selectedReferralId?.name}?
                                            </h1>
                                            <span className="text-gray-600 font-nunito text-l font-normal leading-[1.4] tracking-[0.06px]">
                                              Once the appointment has been
                                              changed, you will not be able to
                                              make any changes!
                                            </span>
                                            <div className="w-full flex justify-end space-x-6">
                                              <button
                                                className="changeStatusButton cursor-pointer p-10px"
                                                onClick={() => {
                                                  handleCloseModal3,
                                                    navigate(
                                                      `/therapist/calendar/?client=${selectedReferralId?.clientId}`
                                                    );
                                                }}
                                              >
                                                OK
                                              </button>
                                              <button
                                                className="changeStatusButton cursor-pointer"
                                                onClick={handleCloseModal3}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </Box>
                                      </Fade>
                                    </Modal>
                                    <div
                                      style={{
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        padding: "2px 8px",
                                        border: "none",
                                        cursor: " pointer",
                                        background: getStatusColor(
                                          row?.consultationStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.consultationStatus.slice(1)
                                        ).backgroundColor,
                                        color: getStatusColor(
                                          row?.consultationStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.consultationStatus.slice(1)
                                        ).color,
                                      }}
                                    >
                                      {row?.consultationStatus === "Pending" ||
                                      row?.consultationStatus === "pending" ? (
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleOpenModal3(
                                                row?.referralId,
                                                row?.clientId,
                                                row?.clientName
                                              )
                                            }
                                            style={{
                                              color: getStatusColor(
                                                row?.consultationStatus
                                              ).color,
                                              border: "none",
                                              fontFamily: "nunito",
                                              fontWeight: "600",
                                              fontSize: "16px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {row?.consultationStatus
                                              .charAt(0)
                                              .toUpperCase() +
                                              row?.consultationStatus.slice(1)}
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {row?.consultationStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            row?.consultationStatus.slice(1)}
                                        </div>
                                      )}
                                    </div>
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
                    count={receivedRefral?.length}
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
                  {Array.isArray(receivedRefral) &&
                    receivedRefral
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
                                {item.employee.emp_name}
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
                                  {item.employee.emp_id}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Gender</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.employee.emp_gender}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Age</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {calculateAge(item?.employee.emp_dob)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">
                                  Department
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {item.employee.emp_department}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">Date</div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  {getformatedDate(item?.refer_date)}
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">
                                  Referral status
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  <button
                                    style={{
                                      borderRadius: "4px",
                                      textAlign: "center",
                                      padding: "6px 24px",
                                      border: "none",
                                      width: "100%",
                                      cursor:
                                        item.referral_status == 0
                                          ? "pointer"
                                          : "default",
                                      background: getStatusColor(
                                        item.referral_status
                                      ).backgroundColor,
                                      color: getStatusColor(
                                        item.referral_status
                                      ).color,
                                    }}
                                  >
                                    {oldAppointmentStatus[item.referral_status]}
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                                <div className="body3-sem w-[40%]">
                                  Consultation Status
                                </div>
                                <div className="body3-reg pr-2 w-[60%]">
                                  <button
                                    style={{
                                      borderRadius: "4px",
                                      textAlign: "center",
                                      padding: "6px 24px",
                                      border: "none",
                                      width: "100%",
                                      cursor:
                                        item.consultation_status == 0
                                          ? "pointer"
                                          : "default",
                                      background: getStatusColor(
                                        item.consultation_status
                                      ).backgroundColor,
                                      color: getStatusColor(
                                        item.consultation_status
                                      ).color,
                                    }}
                                  >
                                    {
                                      oldAppointmentStatus[
                                        item.consultation_status
                                      ]
                                    }
                                  </button>
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
                    count={receivedRefral.length}
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
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModalve}
            onClose={handleCloseModalve}
            closeAfterTransition
            BackdropProps={{
              style: {
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Use a semi-transparent background
              },
              timeout: 500,
            }}
          >
            <Fade in={openModalve}>
              <Box sx={style} className="text-center">
                <div className="w-full flex flex-col justify-center px-[30px]">
                  <h1 className="h5-bold mb-2">View Note</h1>
                  <textarea
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                    }}
                    id="myTextArea"
                    rows="4"
                    cols="500"
                    placeholder="Add Notes Here"
                    value={notes}
                  ></textarea>
                  {/* Move the button container here */}
                  <div className="flex mb-[30px] justify-end mt-10 gap-8">
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
                      onClick={handleCloseModalve}
                    >
                      <span>Close</span>
                    </Button>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Refrals;
