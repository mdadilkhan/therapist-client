import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URI, API_URL } from "../constant/ApiConstant";
import { useSocket } from "../getSocket";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { appointmentDetails, detailsStore } from "../store/slices/appointmentSlice";
import { preAppointmentDetails } from "../store/slices/preAppointmentSlice";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const RazorPay = ({ appointmentData, agree }) => {
  const userDetails = useSelector((state) => state.userDetails);
  const dispatch=useDispatch();
  const [paymentStatus, setPaymentStatus] = useState("undefined");
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const bookAppointment = (orderId, paymentId) => {
    const data =
      appointmentData?.type == "pre"
        ? {
          userId:userDetails?._id,
            bookingDate: appointmentData.t_appointment_date,
            bookingSlots: [
              {
                m_schd_from: appointmentData?.t_appointment_time.m_schd_from,
                m_schd_to: appointmentData?.t_appointment_time.m_schd_to,
              },
            ],
            paymentMode: appointmentData.payVia,
            orderId: paymentId,
            paymentId: orderId,
            // amount: appointmentData?.totalPay,
            amount:1
          }
        : {
          userId:userDetails?._id,
            therapistId: appointmentData?.m_counselor_id,
            bookingDate: formatDate(appointmentData?.t_appointment_date),
            bookingType: appointmentData?.bookingType,
            bookingSlots: appointmentData.t_appointment_time,
            duration: appointmentData?.sel_min,
            paymentMode: appointmentData?.paymentMode,
            orderId: paymentId,
            paymentId: orderId,
            // amount: appointmentData?.totalPay,
            amount:1
          };

    axios
      .post(
        appointmentData?.type == "pre"
          ? `${API_URL}/bookPreconsultationAppointment`
          : `${API_URL}/bookAppointment`,
        data
      )
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
          // appointmentData?.type == "pre"? dispatch(preAppointmentDetails(res?.data?.data)):dispatch(appointmentDetails(res?.data?.data));
           dispatch(detailsStore(res?.data?.data));
          //dispatch(preAppointmentDetails(res?.data?.data));
          navigate("/client/appointment-booked");

          // appointmentData?.type == "pre"
          //   ? socket.emit("therapist", {
          //       title: "Upcoming Appointment",
          //       message: `${userDetails.name} book for preconsultation  at ${
          //         appointmentData?.t_appointment_time.m_schd_from
          //       } on ${formatDate(appointmentData?.t_appointment_date)}`,
          //       role: "therapist",
          //     })
          //   : socket.emit("therapist", {
          //       title: "Upcoming Appointment",
          //       message: `${userDetails.name} book  a session to you at ${
          //         appointmentData?.t_appointment_time[0]?.m_schd_from
          //       } on ${formatDate(appointmentData?.t_appointment_date)}`,
          //       role: "therapist",
          //       userId: data.therapistId,
          //     });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  // using handler method
  const checkoutHandler = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/payment/createOrder`, {
        // amount: appointmentData.totalPay,
        amount:1
      });
      const options = {
          key: "rzp_live_IIwhdZvx1c4BGz",
      //  key:"rzp_test_IqmS1BltCU4SFU",
        amount: data.amount,
        currency: "INR",
        name: "Sage Turtle",
        description: "Test Transaction",
        payment_capture: true,
        image:
          "https://firebasestorage.googleapis.com/v0/b/sage-turtle-website.appspot.com/o/logo.jpeg?alt=media&token=97d30b20-63fb-461e-8063-ca619ffaa7e3",
        order_id: data.id,
        handler: function (response) {
          let paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          axios
            .post(`${API_URL}/payment/verifyOrder`, paymentData)
            .then((verificationResponse) => {
              if (verificationResponse.status == 200) {
                bookAppointment(
                  response.razorpay_order_id,
                  response.razorpay_payment_id
                );
                setPaymentStatus("success");
              } else {
                setPaymentStatus("verification-failure");
              }
            })
            .catch((error) => {
              setPaymentStatus("verification-error");
            });
        },
        prefill: {
          name: "Sumeet",
          email: "sumeet.singh@ensolab.in",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#614298",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
          onClick={checkoutHandler}
        >
          <span className="btn1">Proceed </span>
        </Button>
      </div>
    </div>
  );
};

export default RazorPay;
