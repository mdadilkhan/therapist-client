import { useState, useEffect } from "react";
import { API_URL } from "../../constant/ApiConstant";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Backdrop from "@mui/material/Backdrop";
import DownloadIcon from "../../assets/DownloadIcon.svg";
import warn from "../../assets/Frame.svg";
import ensolabLogo from "../../assets/EnsolabLogo.png";
import {
  calculateAge,
  extractTimeFromCreatedAt,
  getformatedDate,
  getNamedDate,
} from "../../constant/constatnt";
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
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import AddPrescription from "../AddPrescription";
import CancelPopup from "../../assets/CancelPopup.svg";
import {
  changeAppoitmentStatus,
  convertTo12HourFormat,
  getBookingType,
} from "../../constant/constatnt";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

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
    id: " View/Edit",
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

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return { backgroundColor: "#ECFFBF", color: "#385000" };
    case 0:
      return { backgroundColor: "#F8DDDF", color: "#500000" };
    default:
      return { backgroundColor: "white", color: "black" };
  }
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
  const [clientDetail, setClientDetail] = useState({});
  const [openDialogs, setOpenDialogs] = useState(
    Array(prescriptionList?.length).fill(false)
  );
  const [updateClientProfile, setUpdateClientProfile] = useState({});
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [slots, setSlots] = useState("");
  const [notesValue, setNotesValue] = useState({});
  const [rowsNotes, setRowNotes] = useState([]);
  const [openNotesDialogs, setOpenNotesDialogs] = useState(
    Array(rowsNotes.length).fill(false)
  );

  const [opene, setOpene] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // Status modal
  const [openRTSModal, setOpenRTSModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeNotesIndex, setActiveNotesIndex] = useState(-1);
  const [dateValue, setDateValue] = useState(new Date());

  const [activityType, setActivityType] = useState("");
  const [clientName, setClientName] = useState("");
  const activities = [
    { value: "", label: "None" },
    { value: "Ten", label: "Ten" },
    { value: "Twenty", label: "Twenty" },
    { value: "Thirty", label: "Thirty" },
  ];

  const clients = [
    { value: "", label: "None" },
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Michael Brown", label: "Michael Brown" },
  ];

  const handleSend = () => {
    console.log("Mention:", mention);
    console.log("Selected Activity Type:", activityType);
    console.log("Selected Client Name:", clientName);
  };

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
  const handleCancelOpenModal = () => {
    setOpenCancelModal(true);
  };
  const handleCancelCloseModal = () => {
    setOpenCancelModal(false);
  };
  const updateClientDetail = (event) => {
    event.preventDefault();

    const data = {
      userId: clientDetail?._id,
      name: updateClientProfile.name,
      gender: updateClientProfile.gender,
      emailId: updateClientProfile.gmail,
      phoneNumber: updateClientProfile.phone_number,
      dob: updateClientProfile.dob,
      address: updateClientProfile.address,
      city: "Delhi",
    };
    axios
      .post(`${API_URL}/editUser`, data)
      .then((res) => {
        if (res.status == 200) {
          handleClosee();
          getAppointmentDetails();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const getInterventionNotes = () => {
    const app_id = {
      appointmentId: id,
    };
    axios
      .post(`${API_URL}/getAppointmentDetail`, app_id)
      .then((res) => {
        if (res.status === 200) {
          // setRowNotes(res.data.data);
          setPrescriptionList(res.data.data.appointmentDetails?.prescriptions);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getSesstionNotes = () => {
    const app_id = {
      appointmentId: id,
    };
    axios
      .post(`${API_URL}/getAllSessionNotesByAppointmentId`, app_id)
      .then((res) => {
        if (res.status === 200) {
          setRowNotes(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  useEffect(() => {
    getInterventionNotes();
    getSesstionNotes();
  }, []);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClickOpenedit = () => {
    setOpene(true);
    setUpdateClientProfile(employeeData);
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
  const handleClosee = () => {
    setOpene(false);
  };
  const handleCloseTimeline = () => {
    setOpenTimeline(false);
  };

  const handelChage = (e) => {
    setUpdateClientProfile({
      ...updateClientProfile,
      [e.target.name]: e.target.value,
    });
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
          setAppointmentDetails(res.data.data?.appointmentDetails);
          setClientDetail(res.data.data.userDetails);
          setBookingHistory(res.data.data.bookingHistory);
          setUpdateClientProfile(res?.data?.data?.userDetails);
          setPrescriptionList(res.data.data.appointmentDetails?.prescriptions);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getAppointmentDetails();
  }, []);
  const handleDateChange = (date) => {
    setDateValue(date);
    setUpdateClientProfile({
      ...updateClientProfile,
      dob: date,
    });
  };

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

  const handleCancelAppointment = () => {
    axios
      .post(`${API_URL}/cancelAppointmentByTherapist`, { app_id: appointDetails._id })
      .then((res) => {
        if (res.status === 200) {
          getAppointmentDetails();
          handleCancelCloseModal();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const handleSaveNotes = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/getAllSessionNotesByAppointmentId`, {
        appointmentId: id,
      })
      .then((res) => {
        if (res.status == 200) {
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
        if (res.status == 200) {
          toast.success("Complete consultation done")
          getAppointmentDetails();
          handleCloseModal();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
        console.error("Error:", err);
      });
  };

  const handelReferToSage = () => {
    const referDetails = {
      referred_emp_id: clientDetail.emp_id,
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

  const handleOpenToaster = () => {
    toast.error(`No Invoice Generated`, {
      position: "top-center", // Set the position to top-right
      duration: 3000, // Display for 3 seconds (3000 ms)
      style: {
        fontWeight: "bold",
        fontSize: "14px", // Smaller text
      },
    });
  };

  const generatePdf = () => {
    // const { jsPDF } = window.jspdf;
    var doc = new jsPDF();

    // Set colors
    const greenColor = [200, 236, 108];
    const blackColor = [0, 0, 0];

    // Add a logo (use your logo here if needed)
    doc.addImage(ensolabLogo, "PNG", 25, 10, 40, 25);

    // Invoice Title
    doc.setFontSize(30);
    doc.setFont("Nunito", "bold");
    doc.text("Invoice", 180, 25, "right");

    // Invoice Number & Date on the Left
    doc.setFontSize(10);
    doc.setFont("Nunito", "normal");
    doc.text("Invoice Number:", 20, 50);
    doc.text("EIL/24/25/360765", 50, 50);

    doc.text("Invoice Date:", 20, 55);
    doc.text(getformatedDate(appointDetails?.created_at), 50, 55);

    // Company Information on the Right
    doc.text("Company Name:", 100, 50);
    doc.text("Enso Innovation Lab Pvt. Ltd.", 135, 50);

    doc.text("Address:", 100, 55);
    doc.text("B-503, ATS Bouquet , Noida Sector - 132", 135, 55);
    doc.text("U.P - 201304", 135, 60);

    // GST Number & Phone
    doc.text("GST No:", 20, 70);
    doc.text("GSTIN 07AAGCE434QI2B", 50, 70);
    doc.text("Phone:", 100, 70);
    doc.text("+91 9873020194", 135, 70);

    // Billed To
    doc.setFontSize(15);
    doc.setFont("Nunito", "bold");
    doc.text("Billed To:", 20, 85);

    doc.setFontSize(12);
    doc.setFont("Nunito", "normal");
    doc.text(`Name: ${clientDetail?.name}`, 20, 95);
    doc.text(`Address: ${clientDetail?.profile_details?.address}`, 20, 100);
    doc.text(`Phone: ${clientDetail?.phone_number}`, 20, 105);

    // Background for the 'Particulars' Section
    doc.setFillColor(...greenColor); // Green background
    doc.roundedRect(20, 120, 170, 10, 2, 2, "F"); // Draw green rectangle for heading

    // Particulars Section
    doc.setFontSize(12);
    doc.setFont("Nunito", "bold");
    doc.setTextColor(0, 0, 0); // White text
    doc.text("Particular", 25, 126);
    doc.text("Price", 180, 126, { align: "right" });

    // Set text color back to black
    doc.setTextColor(...blackColor);

    // Items with price
    doc.setFontSize(12);
    doc.setFont("Nunito", "normal");
    doc.text(
      `${appointDetails?.booking_type.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )} Counselling ${appointDetails?.type.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )}`,
      25,
      140
    );
    doc.text(`${appointDetails?.amount}`, 180, 140, null, null, "right");
    doc.line(20, 145, 190, 145);

    doc.line(20, 155, 190, 155);

    // Total Section
    doc.setFontSize(12);
    doc.setFont("Nunito", "bold");
    doc.text("Total", 25, 161);
    doc.text(`${appointDetails?.amount}`, 180, 161, null, null, "right");
    doc.line(20, 165, 190, 165);

    // Subtotal and total at the bottom
    doc.setFontSize(14);
    doc.setFont("Nunito", "bold");
    doc.text("Particulars", 130, 180);

    // Subtotal and total at the bottom
    doc.setFontSize(14);
    doc.setFont("Nunito", "normal");
    doc.text("Subtotal", 130, 189);
    doc.text(`${appointDetails?.amount}`, 180, 189, null, null, "right");

    doc.setFontSize(14);
    doc.setFont("Nunito", "normal");
    doc.text("GST (@18%)", 130, 197);
    doc.text("0", 180, 197, { align: "right" });

    // Add green background for 'Grand Total' with rounded corners
    doc.setFillColor(...greenColor); // Set the green background color
    doc.roundedRect(125, 201, 60, 8, 2, 2, "F"); // Draw rounded rectangle with 8px radius for 'Grand Total'

    // Grand Total Section
    doc.setFontSize(14);
    doc.setFont("Nunito", "bold");
    doc.text("Grand Total", 130, 206);
    doc.text(`${appointDetails?.amount}`, 180, 206, null, null, "right");

    // Reset text color to black for the rest of the document
    doc.setTextColor(...blackColor);

    // Notes section
    doc.setFontSize(12);
    doc.setFont("Nunito", "normal");
    doc.text(
      "Notes: This invoice is auto - generated no signature required",
      50,
      260
    );

    // Save the PDF
    doc.save("Invoice.pdf");
  };

  const data = {
    name: clientDetail?.name,
    email: clientDetail?.email,
    phone_number: clientDetail?.phone_number,
    amount: appointDetails?.amount,
    currency: "INR",
    therapist_id: appointDetails?.therapist_id,
    user_id: appointDetails?.user_id,
    payment_mode: appointDetails?.payment_mode,
    appointment_id: appointDetails?._id,
    type: appointDetails?.type,
  };

  const sendPaymentLink = () => {
    axios
      .post(`${API_URL}/payment/createPaymentLink`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Send Payment Link successfully");
        }
      })
      .catch((err) => {
        console.log(err);

        toast.error("Error in sending PaymentLink");
      });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 18,
          margin: "16px 24px",
        }}
      >
        <div className="flex items-center gap-6">
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
        <div className="flex flex-row justify-between gap-10">
          {appointDetails?.type == "preconsultation" ? (
            <></>
          ) : (
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={() => {
                  navigate(`/therapist/calendar/${appointDetails._id}`);
                }}
                disabled={appointDetails.booking_status == 5 ? true : false}
              >
                <span className="btn1">Reschedule</span>
              </Button>
            </div>
          )}
          <div>
            <Button
              variant="outlined"
              sx={{
                width: "196px",
                height: "48px",
                borderRadius: "8px",
                border: "1px solid #E83F40",
                textTransform: "capitalize",
                color: "#E83F40",
                "@media (max-width: 640px)": {
                  width: "100%",
                },
              }}
              onClick={() => {
                handleCancelOpenModal();
              }}
              disabled={
                appointDetails.booking_status == 5 ||
                new Date(appointDetails.booking_date) < new Date()
                  ? true
                  : false
              }
            >
              <span className="btn1">Cancel Appointment</span>
            </Button>
          </div>
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
                <h5 className="body3-reg">{appointDetails?.appointment_no ? appointDetails?.appointment_no : "APT00000"}</h5>
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
                        appointDetails.booking_status
                      ).color,
                      padding: "5px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    {
                      changeAppoitmentStatus(appointDetails.booking_status)
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
                <h5 className="body3-reg">{appointDetails?.booking_type}</h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="body2-sem">Time</h5>
                <h5 className="body3-reg">
                  <div>{appointDetails?.booking_slots?.[0]?.m_schd_from}</div>
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
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={handleOpenModal}
                disabled={appointDetails?.booking_status != 1 ? true : false}
              >
                <span className="btn1">Complete Consultation</span>{" "}
              </Button>
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
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "450px",
                      height: "350px",
                      bgcolor: "background.paper",
                      borderRadius: "16px",
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
                        Are you sure you want to change the appointment status ?
                      </h1>
                      <div className="w-full flex justify-end flex-row gap-5 mt-10">
                        <button
                          className="changeStatusButton cursor-pointer w-[160px]"
                          onClick={handleChangeStatus}
                        >
                          OK
                        </button>
                        <button
                          className="changeStatusButton cursor-pointer w-[160px] bg-[#fff] text-[#614298] border border-solid rounded-[8px] border-[#614298]"
                          onClick={handleCloseModal}
                        >
                          Cancel
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
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openCancelModal}
                onClose={handleCancelCloseModal}
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
                <Fade in={openCancelModal}>
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
                        Are you sure you want to cancel the appointment ?{" "}
                      </h1>
                      <p className="ovr1-reg text-[#9A93A5] mb-6">
                        Once the appointment status is finalized, you will not
                        be able to make any changes!
                      </p>
                      <div className="w-full flex justify-end gap-4">
                        <button
                          className="changeStatusButton cursor-pointer w-[50%]"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCancelAppointment();
                            // handleCancelCloseModal();
                          }}
                        >
                          OK
                        </button>
                        <button
                          className="changeReferCancelButton cursor-pointer w-[50%]"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCancelCloseModal();
                          }}
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
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                disabled={appointDetails.booking_status == 5 ? true : false}
                onClick={() => {
                  navigate(
                    `/therapist/clients/clientsDetails/${clientDetail._id}/clienthistory`
                  );
                }}
              >
                <span className="btn1">Client History</span>
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
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                disabled={appointDetails.booking_status == 5 ? true : false}
                onClick={() => {
                  navigate(
                    `/therapist/clientsessationnotes/${appointDetails._id}`
                  );
                }}
              >
                <span className="btn1">Session Note</span>
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
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                disabled={appointDetails.booking_status == 5 ? true : false}
                onClick={handleClickOpen}
              >
                <span className="btn1">Add Prescription</span>
              </Button>
            </div>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <AddPrescription
                handleClose={handleClose}
                appointId={id}
                getPrescription={() => getAppointmentDetails()}
              />
            </Dialog>
            <div>
              <Button
                variant="outlined"
                sx={{
                  width: "196px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "1px solid #614298",
                  textTransform: "capitalize",
                  color: "#614298",
                  "@media (max-width: 640px)": {
                    width: "100%",
                  },
                }}
                onClick={() =>
                  navigate(`/therapist/calendar/${appointDetails._id}`)
                }
                disabled={appointDetails.booking_status == 5 ? true : false}
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
              flexDirection: "row",
              justifyContent: "space-between",
              rowGap: 24,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h5 className="h5-bold">Payment</h5>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <h4
                className="body3-reg px-6 py-2 rounded-[6px]"
                style={{
                  background: getStatusColor(appointDetails?.payment_status)
                    .backgroundColor,
                  color: getStatusColor(appointDetails?.payment_status).color,
                }}
              >
                {appointDetails?.payment_status == 0 ? "Unpaid" : "Paid"}
              </h4>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
              <div>
                <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "196px",
                    gap: 0,
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: "#614298",
                    border: "1px solid #614298",
                    color: "#FCFCFC",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                    "&:hover": {
                      backgroundColor: "#614298", // Same as the normal state to remove hover effect
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#FCFCFC", // Set background color when disabled
                      color: "#B7B2BF", // Set text color when disabled
                      border: "1px solid #B7B2BF", // Optionally remove the border when disabled
                    },
                  }}
                  disabled={appointDetails?.payment_status == 1 ? true : false}
                  onClick={sendPaymentLink}
                >
                  <span className="btn1">Send Payment Link</span>
                </Button>
              </div>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="flex-col sm:flex-row sm:items-center"
            >
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
                    color: "#614298",
                    textTransform: "capitalize",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                  onClick={
                    appointDetails?.payment_status === 1
                      ? generatePdf
                      : handleOpenToaster
                  }
                >
                  <span className="btn1">Download Invoice</span>{" "}
                </Button>
              </div>
            </div>
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
                    color: "#614298",
                    "@media (max-width: 640px)": {
                      width: "100%",
                      marginTop: "5px",
                    },
                  }}
                  onClick={handleClickOpen}
                  disabled={appointDetails.booking_status == 5 ? true : false}
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
                                                  className="p1-sem"
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
                                                  className="p1-sem"
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
                                                  className="p1-sem"
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
                                                  className="p1-sem"
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
                                                  className="p1-sem"
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
                                        color: "#614298",
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
                                                className="p1-sem"
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
                                                className="p1-sem"
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
                                                className="p1-sem"
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
                                                className="p1-sem"
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
                                                className="p1-sem"
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
                Session Note
                <img src={CollapseArrow} alt="" />
              </h5>

              <div>
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
                          <h2 className="p1-sem" style={{ color: "#4A4159" }}>
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
                        <h2 className="p1-sem" style={{ color: "#4A4159" }}>
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
                        <h2 className="p1-sem" style={{ color: "#4A4159" }}>
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
                                      className="body3-reg flex flex-col gap-2"
                                    >
                                      {/* <span>
                                        {getformatedDate(row?.created_at)}
                                      </span> */}
                                      <span>
                                        {extractTimeFromCreatedAt(
                                          row?.created_at
                                        )}
                                      </span>
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
                                            `/therapist/clientsessationnotes/${row?.appointmentId}/${row?._id}`
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
                                                    Session Ids
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
                                                      color: "#614298",
                                                      background: "#614298",
                                                      gap: 1,
                                                      "&:hover": {
                                                        background: "#614298",
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
                                                    <span className="btn2 text-[#fff]">
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
                                                    Client Goals
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
                                  Session Ids
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
                                    {/* {item?.created_at} */}
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
                                                    color: "#fff", // Text color white
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
                                                />
                                                <span className="btn2 text-[#fff]">
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
                                                Client Goals
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
          {/* Assesment and Activites */}
          {/* <div className=" border rounded-3xl border-solid border-[#4A4159] bg-[#FCFCFC] flex flex-col gap-13">
            <div className=" rounded-[16px] p-[4rem] border border-[#4A4159] bg-[#FCFCFC] w-full">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-[3.4rem] font-nunito font-bold">
                  Assesment
                  
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:justify-between">
                <div className="flex flex-col w-[45%] h-[10rem] ">
                  <label  className="p1-sem text-[#4A4159]">
                    Type Activities
                  </label>
                  <select
                    className=" border-1 border-[#4A4159]  w-full text-[2.4rem] cursor-pointer h-[7rem] p-6 font-nunito rounded-2xl"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                  >
                    {activities.map((activity) => (
                      <option key={activity.value} value={activity.value}>
                        {activity.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col w-[45%]">
                  <label  className="p1-sem">
                    Client Name
                  </label>
                  <select
                    className=" border-1 border-[#4A4159]  w-full text-[2.4rem] cursor-pointer h-[7rem] p-6 font-nunito rounded-2xl"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    {clients.map((client) => (
                      <option key={client.value} value={client.value}>
                        {client.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
             
              <div className="flex justify-end mt-4">
                <button
                  className="flex items-center w-[25rem] text-[1.8rem] mt-8 font-bold  cursor-pointer font-nunito p-4 justify-center gap-6  h-[6rem]  text-[#614298] bg-white  border border-[#614298] rounded-2xl capitalize hover:bg-[#614298] hover:text-white transition duration-300"
                  onClick={handleSend}
                >
                  Send Assesment
                </button>
              </div>
            </div>
          </div> */}
          {/* <div className=" border rounded-3xl border-solid border-[#4A4159] bg-[#FCFCFC] flex flex-col gap-13">
            <div className=" rounded-[16px] p-[4rem] border border-[#4A4159] bg-[#FCFCFC] w-full">
              <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-[3.4rem] font-nunito font-bold">
                  Activites
                  
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:justify-between">
                <div className="flex flex-col w-[45%] h-[10rem] ">
                  <label  className="p1-sem text-[#4A4159]">
                    Type Activities
                  </label>
                  <select
                    className=" border-1 border-[#4A4159]  w-full text-[2.4rem] cursor-pointer h-[7rem] p-6 font-nunito rounded-2xl"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                  >
                    {activities.map((activity) => (
                      <option key={activity.value} value={activity.value}>
                        {activity.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col w-[45%]">
                  <label  className="p1-sem">
                    Client Name
                  </label>
                  <select
                    className=" border-1 border-[#4A4159]  w-full text-[2.4rem] cursor-pointer h-[7rem] p-6 font-nunito rounded-2xl"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    {clients.map((client) => (
                      <option key={client.value} value={client.value}>
                        {client.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
             
              <div className="flex justify-end mt-4">
                <button
                  className="flex items-center w-[25rem] text-[1.8rem] mt-8 font-bold  cursor-pointer font-nunito p-4 justify-center gap-6  h-[6rem]  text-[#614298] bg-white  border border-[#614298] rounded-2xl capitalize hover:bg-[#614298] hover:text-white transition duration-300"
                  onClick={handleSend}
                >
                  Send ACitivity
                </button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex flex-col space-y-7">
          <div className="right">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="rightContent">
                <div>
                  <h6 className="h6-bold" style={{ color: "#06030D" }}>
                    Client Overview
                  </h6>
                </div>
                <div>
                  <div>
                    <h5 className="body2-sem" style={{ color: "#06030D" }}>
                      Client Name:
                    </h5>
                    <p className="body3-reg" style={{ color: "#06030D" }}>
                      {clientDetail?.name}
                    </p>
                  </div>
                  <div>
                    <h5 className="body2-sem" style={{ color: "#06030D" }}>
                      Client No:
                    </h5>
                    <p className="body3-reg" style={{ color: "#06030D" }}>
                      {clientDetail?.client_no ? clientDetail?.client_no : "USR00000"}
                    </p>
                  </div>
                  <div>
                    <h5 className="body2-sem" style={{ color: "#06030D" }}>
                      Mobile No.
                    </h5>
                    <p className="body3-reg" style={{ color: "#06030D" }}>
                      {clientDetail?.phone_number}
                    </p>
                  </div>
                  <div>
                    <h5 className="body2-sem" style={{ color: "#06030D" }}>
                      DOB
                    </h5>
                    <p className="body3-reg" style={{ color: "#06030D" }}>
                      {getformatedDate(clientDetail?.profile_details?.dob)}
                    </p>
                  </div>
                  {/* <Button
                    variant="outlined"
                    sx={{
                      width: "196px",
                      height: "48px",
                      borderRadius: "8px",
                      border: "1px solid #614298",
                      textTransform: "capitalize",
                      color: "#614298",
                      gap: "10px",
                      "@media (max-width: 640px)": {
                        width: "100%",
                      },
                    }}
                    onClick={() => {
                      handleClickOpenedit();
                    }}
                    disabled={appointDetails.booking_status == 5 ? true : false}
                  >
                    <img src={EditIcon} />
                    <span className="btn1"> Edit Profile</span>
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="rightContent">
                <div>
                  <h6 className="h6-bold" style={{ color: "#06030D" }}>
                    Booking History
                  </h6>
                </div>
                <div>
                  <div className="flex flex-col space-y-4 h-[300px] overflow-auto">
                    <div>
                      {bookingHistory.map((booking) => (
                        <div key={booking._id} className="mb-3">
                          <h3 className="body2-sem">{booking.booking_type}</h3>
                          <p className="body3-reg">
                            {getformatedDate(booking.created_at)} at
                            {booking.booking_slots[0].m_schd_from}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Dialog
            open={opene}
            onClose={handleClosee}
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "100%" }}>
                    <label className="p1-sem" style={{ color: "#4A4159" }}>
                      Name
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="name"
                      value={updateClientProfile.name}
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
                    <label className="p1-sem" style={{ color: "#4A4159" }}>
                      Date of Birth
                    </label>
                    <DatePicker onChange={handleDateChange} value={dateValue} />
                  </div>
                  <div style={{ width: "48%" }}>
                    <label className="p1-sem" style={{ color: "#4A4159" }}>
                      Age
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="age"
                      value={calculateAge(updateClientProfile.dob)}
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
                    <label className="p1-sem" style={{ color: "#4A4159" }}>
                      Mobile No.
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="phone_number"
                      value={updateClientProfile.phone_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length <= 10) {
                          handelChage({
                            target: { name: "phone_number", value },
                          });
                        }
                      }}
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
                  <div style={{ width: "48%" }}>
                    <label className="p1-sem" style={{ color: "#4A4159" }}>
                      Email
                    </label>
                    <TextField
                      fullWidth
                      type="email"
                      required
                      name="email"
                      value={updateClientProfile.email}
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
                  <label className="p1-sem" style={{ color: "#4A4159" }}>
                    Address
                  </label>
                  <textarea
                    style={{ width: "100%", borderRadius: "8px" }}
                    id="myTextArea"
                    rows="4"
                    cols="500"
                    name="address"
                    value={updateClientProfile.address}
                    onChange={handelChage}
                  ></textarea>
                </div>
                <div className="flex gap-4 justify-end">
                  <button className="changeStatusButton cursor-pointer">
                    <span>Update</span>
                  </button>
                  <button
                    onClick={handleClosee}
                    autoFocus
                    className="changeReferCancelButton cursor-pointer"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </form>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetails;
