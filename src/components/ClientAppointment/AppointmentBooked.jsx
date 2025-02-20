import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12HourFormat, getNamedDate } from "../../constant/constatnt";
import { resetPreAppointmentDetails } from "../../store/slices/preAppointmentSlice";
import { resetAppointmentDetails } from "../../store/slices/appointmentSlice";
const normalizeAppointmentData = (data) => {
  if (!data) return null;
  let startTime, endTime;

  // If `t_appointment_time` is an array (like in `appointmentDetails`)
  if (Array.isArray(data.t_appointment_time) && data.t_appointment_time.length > 0) {
    startTime = data.t_appointment_time[0].m_schd_from;
    endTime = data.t_appointment_time[data.t_appointment_time.length-1].m_schd_to;
  }
  // If `t_appointment_time` is an object (like in `preAppointmentDetails`)
  else if (typeof data.t_appointment_time === "object" && data.t_appointment_time !== null) {
    startTime = data.t_appointment_time.m_schd_from;
    endTime = data.t_appointment_time.m_schd_from;
  }

  return {
    appointmentDate: data.t_appointment_date,
    startTime,
    endTime,
    duration: data.sel_min,
  };
};

const AppointmentBooked = () => {
  const dispatch = useDispatch();
  const appointmentData = useSelector((state) => ({
    preAppointmentDetails: state.preAppointmentDetails,
    appointmentDetails: state.appointmentDetails,
  }));
  console.log(appointmentData, "in Got to dashboard");
  const selectedAppointmentDetails =
  appointmentData?.preAppointmentDetails && 
  Object.keys(appointmentData.preAppointmentDetails).length > 0
    ? appointmentData.preAppointmentDetails
    : appointmentData?.appointmentDetails || {};
    console.log(selectedAppointmentDetails,"selectedAppointmentDetails");

    const {
      appointmentDate,
      startTime,
      endTime,
      duration
    }=normalizeAppointmentData(selectedAppointmentDetails)

    console.log(  appointmentDate,
      startTime,
      endTime,
      duration,"destruct the data");
    
  const navigate = useNavigate();
  const handleReset = () => {
    dispatch(resetAppointmentDetails()); // Resetting Redux state
    dispatch(resetPreAppointmentDetails());
    localStorage.removeItem("appointmentDetails");
    localStorage.removeItem("preAppointmentDetails");
    navigate("/client/dashboards");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h5 className="h5-bold" style={{ marginBottom: "8px" }}>
        Appointment Booked Successfully!
      </h5>
      <p className="body2-reg">Appointment has been booked </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span className="body3-reg">for</span>
        <span
          style={{
            color: "#614298",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "nunito",
          }}
        >
          {getNamedDate(appointmentDate)}
        </span>
        <span className="body3-reg">at</span>
        <span
          style={{
            color: "#614298",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "nunito",
          }}
        >
          {convertTo12HourFormat(
           startTime
          )}

          <span className="body3-reg"> to</span>
          {convertTo12HourFormat(
            endTime
          )}
        </span>
      </div>
      <Button
        variant="contained"
        sx={{
          marginTop: "8px",
          width: "321px",
          height: "48px",
          borderRadius: "8px",
          border: "1px solid #614298",
          textTransform: "capitalize",
          background: "#614298",
          cursor: "pointer",
          "&:hover": {
            background: "#614298",
          },
        }}
        onClick={handleReset}
      >
        <span className="btn1">Go to Dashboard</span>
      </Button>
    </div>
  );
};

export default AppointmentBooked;
