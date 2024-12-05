import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/LeftArrow.svg";
import DummyImg from "../../assets/GetMatched.svg";
import Clock from "../../assets/Clock.svg";
import CalnedarCheck from "../../assets/Calendar1.svg";
import Translate from "../../assets/Language.svg";
import WalletGif from "../../assets/WalletGif.gif";
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
import RazorPay from "../RazorPay";
import {
  convertTo12HourFormat,
  formatDateAndDay,
} from "../../constant/constatnt";
import { API_URL } from "../../constant/ApiConstant";
import { useSocket } from "../../getSocket";
import toast from "react-hot-toast";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PreAppointmentType = () => {
  const navigate = useNavigate();
  // const appointmentDetails = useSelector(
  //   (state) => state.preAppointmentDetails
  // );

  const socket = useSocket();
  const userDetails = useSelector((state) => state.useDetails);

  const appointmentDetails = useSelector(
    (state) => state.preAppointmentDetails
  );
  const [agree, setAgree] = useState(false);
  const [payVia, setPayVia] = useState("online");
  const [sessationPrice, setSessationPrice] = useState(750);
  const [totalPay, setTotalPay] = useState(
    parseFloat(sessationPrice) + parseFloat(sessationPrice) * 0.18
  );
  const [openModal2, setOpenModal2] = useState(false);

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

  const handleBack = () => {
    navigate(-1);
  };
  const bookAppointment = () => {
    const data = {
      bookingDate: updatedAppointmentDetails.t_appointment_date,
      bookingSlots: [
        {
          m_schd_from:
            updatedAppointmentDetails?.t_appointment_time.m_schd_from,
          m_schd_to: updatedAppointmentDetails?.t_appointment_time.m_schd_to,
        },
      ],
      paymentMode: updatedAppointmentDetails.payVia,
      amount: updatedAppointmentDetails?.totalPay,
    };

    axios
      .post(`${API_URL}/bookPreconsultationAppointment`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(` Pre consulatation Appointment book Successfull`, {
            position: "top-center",
            duration: 3000,
            style: {
              fontWeight: "bold",
              fontSize: "14px",
            },
          });
          navigate("/client/appointment-booked");

          socket.emit("therapist", {
            title:"Upcoming Appointment",
            message: `${userDetails.name} book for preconsultation`,
            role: "therapist",
          });
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

  const handleCheckBox = (e) => {
    setAgree(e.target.checked);
  };

  const changePaymentMethod = (e) => {
    setPayVia(e.target.value);
  };

  const updatedAppointmentDetails = {
    ...appointmentDetails,
    totalPay: totalPay,
    payVia: payVia,
    type: "pre", //pre , post , group
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

      <div className="flex w-full justify-between">
        <div className="w-[50%]">
          <div
            style={{ border: "1px solid #D5D2D9" }}
            className="w-[85%] h-[335px] sm:h-[190px] rounded-[15px] bg-[#FCFAFF] shadow-custom ml-[32px] my-0 sm:my-8 flex sm:flex-row flex-col gap-5 px-4 py-6"
          >
            <div className="flex items-center justify-center">
              <img src={DummyImg} alt="" />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <h2 className="h6-bold">Sage Turtle</h2>
              <h3 className="body3-sem text-[#635B73]">
                Preliminary Consultation
              </h3>
              <div className="flex gap-3">
                <img src={Clock} alt="" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Duration :</span> 30 mins
                </h4>
              </div>
              <div className="flex gap-3">
                <img src={CalnedarCheck} alt="" className="w-[20px]" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Consultation Fee :</span>{" "}
                  750/-(inclusive of all taxes)
                </h4>
              </div>
              <div className="flex gap-3">
                <img src={Translate} alt="" />
                <h4 className="body4-reg text-[#635B73]">
                  <span className="ovr1-bold">Language :</span> English,Hindi
                </h4>
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
        <div className="w-[40%] flex flex-col items-center card py-[50px]">
          <div className="flex justify-between w-[75%] mb-7">
            <h2 className="body1-sem">Sage Turtle</h2>
            <h3 className="body3-sem">X1 Session</h3>
          </div>
          <div className="flex justify-between w-[75%] mb-7">
            <h2 className="body1-sem">Session Duration</h2>
            <h3 className="body3-sem">30 Min</h3>
          </div>
          <div className="flex justify-between w-[75%] mb-7">
            <h2 className="body1-sem">Session Date</h2>
            {/* <h3 className="body3-sem">{formatDateAndDay(appointmentDetails?.t_appointment_date)}</h3> */}
          </div>
          <div className="flex justify-between w-[75%] mb-14">
            <h2 className="body1-sem">Session Slot</h2>
            <h3 className="body3-sem">
              {convertTo12HourFormat(
                appointmentDetails?.t_appointment_time?.m_schd_from
              )}
            </h3>
          </div>
          <div className="flex justify-between w-[75%] mb-7">
            <h2 className="body1-sem">Price</h2>
            <h3 className="body3-sem">₹ {sessationPrice}</h3>
          </div>
          <div className="flex justify-between w-[75%] mb-7">
            <h2 className="body1-sem">GST(18%)</h2>
            <h3 className="body3-sem">₹ {sessationPrice * 0.18}</h3>
          </div>
          <div className="bg-[#F2F2F2] w-[75%] rounded-[16px] p-[16px]">
            <h2 className="p2-sem">Insert your discount coupon</h2>
            <TextField
              name="name"
              // value={userData.name}
              // onChange={handleChange}
              placeholder="Apply Coupon"
              fullWidth
              margin="normal"
              className="my-textfield"
            />
            <Button variant="outlined" className="w-full sm:w-[150px] h-[48px]">
              <span className="btn1 capitalize">Apply</span>
            </Button>
          </div>
          <div className="flex justify-between w-[75%] mt-7">
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
                {/* GIF Animation */}
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
    </div>
  );
};

export default PreAppointmentType;
