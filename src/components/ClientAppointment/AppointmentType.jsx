import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "@emotion/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeftArrow from "../assets/LeftArrow.svg";
import Check from "../assets/Check.svg";
import { Button } from "@mui/material";
import { API_URL } from "../constant/ApiConstant";
import Frame from "../assets/Frame.png";
import grad from "../assets/GraduationCap.svg";
import exp from "../assets/CalendarCheck.svg";
import Trans from "../assets/Translate.svg";
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;
import { socket } from "../constant/socket";
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
const selectedButtonStyles = {
  // width: "150px",
  height: "48px",
  borderRadius: "8px",
  border: "1px solid #614298",
  textTransform: "capitalize",
  "&:hover": {
    background: "#614298",
  },
};

const unSelectedButtonStyles = {
  // width: "150px",
  gap: 4,
  height: "48px",
  borderRadius: "8px",
  border: "1px solid #614298",
  textTransform: "capitalize",
};
const AppointmentType = () => {
  const details = useSelector((state) => state.userDetails);
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const appointmentDetails = useSelector((state) => state.appointmentDetails);
  const [selectedButton, setSelectedButton] = useState("1");
  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  const handleBookedAppointment = () => {
    const appointmentData = {
      date: formatDate(appointmentDetails?.t_appointment_date),
      slots: appointmentDetails?.t_appointment_time,
      duration: appointmentDetails?.sel_min,
      appointmentType: selectedButton,
      counselorId: appointmentDetails.m_counselor_id,
    };

    if (appointmentId) {
      const rescheduleData = {
        appointmentId: appointmentId,
        date: formatDate(appointmentDetails?.t_appointment_date),
        slots: appointmentDetails?.t_appointment_time,
        duration: appointmentDetails?.sel_min,
        appointmentType: selectedButton,
        counselorId: appointmentDetails.m_counselor_id,
      };
      axios
        .post(`${API_URL}/rescheduleAppointment`, rescheduleData)
        .then((res) => {
          if (res.data.success === true) {
            // socket.emit();
            navigate("/client/appointmentbooked");
            navigate('/client/dashboard')
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      axios
        .post(`${API_URL}/bookAppointment`, appointmentData)
        .then((res) => {
          if (res.data.success === true) {
            socket.emit("newAppointment ", {
              title: "you have an new appointment",
              slots: appointmentDetails?.t_appointment_time,
              emp_id: details?.emp_id,
              organisation_Id: details?.organisation_Id,
              role: "counsellor",
            });
            navigate("/client/appointmentbooked");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
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
        <div onClick={() => navigate(-1)}>
          <img src={LeftArrow} alt="" />
        </div>
        <h5 className="h5-bold">Appointments</h5>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: "8px",
        }}
      >
        <div className="w-[85%] sm:w-[45%] h-[335px] sm:h-[228px] rounded-[15px] bg-[#FCFAFF] shadow-custom ml-[32px] my-0 sm:my-8 flex sm:flex-row flex-col gap-5 px-4 py-6">
          <div>
            <img
              src={Frame}
              alt=""
              className=" h-[194px] w-[181px] flex-shrink-0 self-stretch rounded-[8px]"
            />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <h3 className="h6-bold">Shruti Ramakrishnan</h3>
            <h3 className="body3-sem text-[#635B73]">REBT Practicioner</h3>
            <div className="flex gap-3">
              <img src={grad} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                M.A. Psychology, B.A. (Hons.) Psychology
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={exp} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Experience :</span>4 Years
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={Trans} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Language :</span>English,Hindi
              </h4>
            </div>
          </div>
        </div>
        <div className="hidden sm:block" style={{ position: "relative" }}>
          <p className="body1-bold">Type</p>
        </div>

        <div style={{ width: "fit-content" }}>
          <div
            style={{ gap: 16 }}
            className="flex flex-col flex-wrap sm:flex-row sm:gap-4"
          >
            <Button
              variant={selectedButton === "1" ? "contained" : "outlined"}
              sx={
                selectedButton === "1"
                  ? selectedButtonStyles
                  : unSelectedButtonStyles
              }
              onClick={() => handleButtonClick("1")}
              className="w-full sm:w-[150px]"
            >
              <span className="btn1">In person</span>
            </Button>
            <Button
              variant={selectedButton === "2" ? "contained" : "outlined"}
              sx={
                selectedButton === "2"
                  ? selectedButtonStyles
                  : unSelectedButtonStyles
              }
              onClick={() => handleButtonClick("2")}
              className="w-full sm:w-[150px]"
            >
              <span className="btn1">Video</span>{" "}
            </Button>
            <Button
              variant={selectedButton === "3" ? "contained" : "outlined"}
              sx={
                selectedButton === "3"
                  ? selectedButtonStyles
                  : unSelectedButtonStyles
              }
              onClick={() => handleButtonClick("3")}
              className="w-full sm:w-[150px]"
            >
              <span className="btn1">Call</span>{" "}
            </Button>
          </div>
          <p className="body1-bold" style={{ margin: "24px 0px 8px 0px" }}>
            Session package
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "48px 24px",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: "16px",
                border: "3px solid #614298",
                background: "var(--White, #FCFCFC)",
                boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.16)",
                cursor: "pointer",
              }}
              className="w-full sm:w-[322px]"
            >
              <h6 className="h6-bold">{`${appointmentDetails?.sel_min} mins session`}</h6>
              <p className="p1-sem">Inhouse Counselling session</p>
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
                    {`${selectedButton} Session`}
                  </p>
                </div>
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
                    Pick time at your convenience
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            className="w-full sm:w-[150px] h-[48px] rounded-3xl"
            onClick={handleBookedAppointment}
          >
            <span className="btn1 capitalize">Booked</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentType;
