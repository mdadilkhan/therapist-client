import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LeftArrow from "../../assets/LeftArrow.svg";
import DummyImg from "../../assets/Frame.png";
import Clock from "../../assets/Clock.svg";
import CalnedarCheck from "../../assets/Calendar1.svg";
import Translate from "../../assets/Language copy.svg";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import RazorPay from "../RazorPay.jsx";
import Check from "../../assets/Clock.svg";
import {
  convertTo12HourFormat,
  formatDateAndDay,
  getNamedDate,
} from "../../constant/constatnt.js";
import { API_URL } from "../../constant/ApiConstant.js";
import WalletGif from "../../assets/WalletGif.gif";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
import { useSocket } from "../../getSocket.js";
import toast from "react-hot-toast";

const TherapistAppointmentType = () => {
  const navigate = useNavigate();
  const [profileDetials, setProfileDetials] = useState({});
  const [agree, setAgree] = useState(false);
  const [selectedButton, setSelectedButton] = useState("in_person");
  const [payVia, setPayVia] = useState("online");
  const [selectedSessationType, setSelectedSessationType] =
    useState("one-sessation");
  const [sessationPrice, setSessationPrice] = useState("");
  const [totalPay, setTotalPay] = useState();
  const appointmentDetails = useSelector((state) => state.appointmentDetails);
  const therapistId = appointmentDetails.m_counselor_id;
  const [selectedSessionType, setSelectedSessionType] = useState("one-session");
  const [openModal2, setOpenModal2] = useState(false);
  const socket = useSocket();
  const userDetails = useSelector((state) => state.userDetails);

  const handleOpenModal2 = () => {
    setOpenModal2(true);
    setTimeout(() => {
      bookAppointment();
      handleCloseModal2();
    }, 4000);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const therapistProfile = () => {
    axios
      .get(`${API_URL}/therapistDetail/${therapistId}`)
      .then((res) => {
        if (res.status === 200) {
          setProfileDetials(res.data?.data);
          setSessationPrice(res.data?.data.sessionPricing?.in_person?.["30"]);
          setTotalPay(
            parseFloat(res.data?.data?.sessionPricing) +
              parseFloat(res.data?.data?.sessionPricing) * 0.18
          );
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const bookAppointment = () => {
    const data = {
      therapistId: updatedAppointmentDetails?.m_counselor_id,
      bookingDate: formatDate(updatedAppointmentDetails?.t_appointment_date),
      bookingType: selectedButton,
      bookingSlots: updatedAppointmentDetails.t_appointment_time,
      duration: updatedAppointmentDetails?.sel_min,
      paymentMode: updatedAppointmentDetails?.paymentMode,
      amount: updatedAppointmentDetails?.totalPay,
    };
    axios
      .post(`${API_URL}/bookAppointment`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`Appointment book Successfull`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
          socket.emit("therapist", {
            title: "Upcoming Appointment",
            message: `${
              userDetails.name
            } book  a session to you at ${formatDate(
              updatedAppointmentDetails?.t_appointment_date
            )} on ${updatedAppointmentDetails.t_appointment_time} `,
            role: "therapist",
            userId: data.therapistId,
          });
          navigate("/client/appointment-booked");
        }
      })
      .catch((err) => {
        toast.error(`${err.response.data.message}`, {
          position: "top-center",
          duration: 3000,
          style: {
            fontWeight: "bold",
            fontSize: "14px",
          },
        });
        console.error("Error:", err);
      });
  };

  const handleSessionTypeClick = (sessionType, duration) => {
    setSelectedSessionType(sessionType);
    const selectedPrice =
      profileDetials?.sessionPricing?.[selectedButton]?.[duration];
    setSessationPrice(selectedPrice);
  };
  useEffect(() => {
    therapistProfile();
  }, []);
  const changePaymentMethod = (e) => {
    setPayVia(e.target.value);
  };
  useEffect(() => {
    if (selectedSessionType === "one-session") {
      setTotalPay(sessationPrice + sessationPrice * 0.18);
    } else {
      const basePay = sessationPrice * 6;
      const totalWithTax = basePay + basePay * 0.18;
      setTotalPay(totalWithTax);
    }
  }, [selectedSessionType, sessationPrice]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckBox = (e) => {
    setAgree(e.target.checked);
  };

  // const changePaymentMethod = (e) => {
  //   setPayVia(e.target.value);
  // };
  const updatedAppointmentDetails = {
    ...appointmentDetails,
    totalPay: totalPay,
    paymentMode: payVia,
    bookingType: selectedButton,
    type: "sess",
  };

  return (
    <div className="px-8 py-8 sm:py-4 sm:px-8">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <img src={LeftArrow} alt="" onClick={handleBack} />
        <h5 className="h5-bold">Appointments</h5>
      </div>

      <div className="flex w-full">
        <div className="w-[60%]">
          <div className="w-[75%] h-[228px] rounded-[15px] border border-[#D5D2D9] border-solid ml-[32px] my-8 flex gap-5 px-4 py-6">
            <div>
              <img className="w-[100%] h-[210px] mb-5" src={DummyImg} alt="" />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <h2 className="h6-bold">{profileDetials?.name}</h2>
              {/* <h3 className="body3-sem text-[#635B73]">
                {profileDetials.m_spec_title}
              </h3> */}
              <div className="flex gap-3">
                <img src={Clock} alt="" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Duration :</span>
                  {appointmentDetails?.sel_min} mins
                </h4>
              </div>
              <div className="flex gap-3">
                <img src={CalnedarCheck} alt="" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Consultation Fee :</span>
                  {
                    profileDetials?.sessionPricing?.in_person?.[
                      appointmentDetails.sel_min
                    ]
                  }
                  /-(inclusive of all taxes)
                </h4>
              </div>
              <div className="flex gap-3">
                <img src={Translate} alt="" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Language :</span>
                  {Array.isArray(profileDetials?.profile_details?.languages) ? (
                    profileDetials.profile_details.languages.map(
                      (language, index) => (
                        <span key={index}>{language + " "}</span>
                      )
                    )
                  ) : (
                    <span>No languages available</span>
                  )}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-6 mt-[20px] ml-[35px]">
            {["in_person", "video", "audio"].map((type) => (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: "170px",
                  height: "48px",
                  borderRadius: "8px",
                  textTransform: "capitalize",
                  background:
                    selectedButton === type ? "#614298" : "transparent",
                  color: selectedButton === type ? "#fff" : "#614298",
                  "&:hover": {
                    background: "#614298",
                    color: "#ffffff",
                  },
                }}
                key={type}
                onClick={() => {
                  setSelectedButton(type);
                  const updatedPrice =
                    profileDetials?.sessionPricing?.[type]?.[
                      appointmentDetails.sel_min
                    ];
                  setSessationPrice(updatedPrice);
                }}
              >
                <h2 className="ovr1-sem">{type}</h2>
              </Button>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              // flexWrap: "wrap",
              marginTop: "32px",
              flexDirection: "row",
              gap: 24,
              marginLeft: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "48px 24px",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: "16px",
                border:
                  selectedSessionType === "one-session"
                    ? "3px solid #614298"
                    : "",
                background: "var(--White, #FCFCFC)",
                boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.16)",
                cursor: "pointer",
              }}
              onClick={() =>
                handleSessionTypeClick(
                  "one-session",
                  appointmentDetails.sel_min
                )
              }
              className="w-full sm:w-[322px]"
            >
              <h6 className="h6-bold">1 Session</h6>
              <p className="p1-sem">Sub heading text</p>
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <img src={Check} alt="" />
                  <p
                    style={{
                      color: "#635B73",
                      fontFamily: "Nunito",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                    }}
                  >
                    {appointmentDetails.sel_min} minute {selectedButton} Session
                  </p>
                </div>
              </div>
              <div
                style={{
                  background: "#635B73",
                  height: "2px",
                  alignSelf: "stretch",
                  marginTop: "96px",
                }}
              />
              <h5 className="h5-bold">₹{sessationPrice}</h5>
            </div>

            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border:
                  selectedSessionType === "six-session"
                    ? "3px solid #614298"
                    : "",
                background: "var(--White, #FCFCFC)",
                boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.16)",
                cursor: "pointer",
              }}
              onClick={() =>
                handleSessionTypeClick(
                  "six-session",
                  appointmentDetails?.sel_min
                )
              }
              className="w-full sm:w-[322px]"
            >
              <div
                className="btn1"
                style={{
                  width: "100%",
                  background: "#9C81CC",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                Most Popular
              </div>
              <div
                style={{
                  padding: "12px 24px 48px 24px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <h6 className="h6-bold">6 Sessions</h6>
                <p className="p1-sem">Sub heading text</p>
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <img src={Check} alt="" />
                    <p
                      style={{
                        color: "#635B73",
                        fontFamily: "Nunito",
                        fontSize: "13px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                      }}
                    >
                      {appointmentDetails.sel_min} minute {selectedButton}{" "}
                      Session
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    background: "#635B73",
                    height: "2px",
                    alignSelf: "stretch",
                    marginTop: "60px",
                  }}
                />
                <h5 className="h5-bold">₹{sessationPrice * 6}</h5>
              </div>
            </div>
          </div>
          <div className="ml-[32px] mb-5">
            <h4 className="body1-bold">Pay Via</h4>
            <FormControl sx={{ marginTop: "16px" }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={payVia}
                onChange={changePaymentMethod}
              >
                <FormControlLabel
                  value="wallet"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="Wallet"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                    },
                  }}
                />
                <FormControlLabel
                  value="online"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="Online"
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
          <div className="flex flex-col  ">
            <div className="ml-[20px] flex gap-1 items-center">
              <Checkbox
                className="checkbox"
                {...label}
                size="large"
                sx={{ borderRadius: "6px" }}
                defaultChecked={agree}
                name="agree"
                onChange={handleCheckBox}
              />
              <h3 className="body3-sem">
                I have read and accept the{" "}
                <a
                  className="text-[#614298]"
                  href="https://sageturtle.in/privacyPolicyPage"
                >
                  Terms & Conditions
                </a>
              </h3>
            </div>

            <div className="ml-[32px] mt-[10px]">
              {payVia == "wallet" ? (
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      width: "170px",
                      height: "48px",
                      borderRadius: "8px",
                      textTransform: "capitalize",
                      background: "#614298",
                      "&:hover": {
                        background: "#614298",
                      },
                    }}
                    disabled={!agree}
                    onClick={() => handleOpenModal2()}
                  >
                    <span className="btn1">Proceed </span>
                  </Button>
                </div>
              ) : (
                <RazorPay
                  appointmentData={updatedAppointmentDetails}
                  agree={agree}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[40%] flex flex-col items-center left-60px  absolute top-40 right-0 ">
        <div className="flex justify-between w-[60%] mb-7">
          <h2 className="body1-sem">Sage Turtle</h2>
          <h3 className="body3-sem">
            X {selectedSessationType == "one-sessation" ? 1 : 6} Session
          </h3>
        </div>
        <div className="flex justify-between w-[60%] mb-7">
          <h2 className="body1-sem">Session Duration</h2>
          <h3 className="body3-sem">{appointmentDetails?.sel_min} Min</h3>
        </div>
        <div className="flex justify-between w-[60%] mb-7">
          <h2 className="body1-sem">Session Date</h2>
          <h3 className="body3-sem">
            {getNamedDate(appointmentDetails?.t_appointment_date)}
          </h3>
        </div>
        <div className="flex justify-between w-[60%] mb-14">
          <h2 className="body1-sem">Session Slot</h2>
          <h3 className="body3-sem">
            {convertTo12HourFormat(
              appointmentDetails?.t_appointment_time.m_schd_from
            )}
          </h3>
        </div>
        <div className="flex justify-between w-[60%] mb-7">
          <h2 className="body1-sem">Price</h2>
          <h3 className="body3-sem">₹ {sessationPrice}</h3>
        </div>
        <div className="flex justify-between w-[60%] mb-7">
          <h2 className="body1-sem">GST(18%)</h2>
          <h3 className="body3-sem">₹ {sessationPrice * 0.18}</h3>
        </div>
        <div className="bg-[#F2F2F2] w-[60%] rounded-[16px] p-[16px]">
          <h2 className="p2-sem">Insert your discount coupon</h2>
          <TextField
            name="name"
            placeholder="Apply Coupon"
            fullWidth
            margin="normal"
            className="my-textfield"
          />
          <Button variant="outlined" className="w-full sm:w-[150px] h-[48px]">
            <span className="btn1 capitalize">Apply</span>
          </Button>
        </div>
        <div className="flex justify-between w-[60%] mt-7">
          <h2 className="body1-sem">Total</h2>
          <h3 className="h6-sem text-[#614298]">₹ {totalPay}</h3>
        </div>
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
              backgroundColor: "rgba(0, 0, 0, 0.3)",
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
            <div className="flex flex-col gap-4 justify-center items-center">
              <img
                src={WalletGif}
                alt="Wallet Animation"
                style={{ width: 150, height: 150 }}
              />

              <h1 className="body3-reg">
                Your Appointment is booked please wait?
              </h1>
              <span className="text-gray-600 font-nunito text-xs font-normal leading-[1.4] tracking-[0.06px]">
                The appointment will be confirmed in 4 seconds.
              </span>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TherapistAppointmentType;
