import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../constant/ApiConstant";
import toast from "react-hot-toast";

const GroupTherapyPayment = ({ bookingDetails }) => {
  const [paymentStatus, setPaymentStatus] = useState("undefined");
  const location = useLocation();
  const navigate = useNavigate();

  // Updated clientSignupForGroupTherapy to accept additional parameters
  const clientSignupForGroupTherapy = (order_id, payment_id) => {
    axios
      .post(`${API_URL}/groupSessation/clientsignupForGroupTherapy`, {
        sessionId: bookingDetails.sessionId, // Assuming bookingDetails contains sessionId
        amount: bookingDetails.amount,
        drcr: bookingDetails.drcr,
        type: bookingDetails.type,
        order_id,
        payment_id,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Signed up successfully");
          // You may want to navigate to another page or update the UI
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to sign up");
      });
  };

  const checkoutHandler = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/payment/createOrder`, {
        amount: bookingDetails?.amount,
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
              if (verificationResponse.status === 200) {
                // Pass the additional data to the function
                clientSignupForGroupTherapy(
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
        <button
          className="bg-[#614298] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer"
          onClick={checkoutHandler}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default GroupTherapyPayment;
