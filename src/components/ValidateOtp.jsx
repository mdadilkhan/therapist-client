import React from "react";
import { useEffect } from "react";
import axios from "axios";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { userDetails } from "../store/slices/userSlices";
import styled from "@emotion/styled";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../constant/ApiConstant";
import {
  Button,
} from "@mui/material";
import toast from "react-hot-toast";

        import Welcome from "./Welcome"
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;
const ValidateOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { phoneNumber, countryCode, email,role } = useSelector(
    (state) => state.smsData
  );
// const userDetails = useSelector((state) => state.userDetails);
  const [code, setCode] = useState("");
  const[details,setDetails]=useState({});
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true); // Button disabled state
  const [counter, setCounter] = useState(10);
  const handleChange = (code) => setCode(code);

  const[open,setOpen]=useState(false);
  const handleClose=()=>{
    setOpen(false);
  }

  const [params] = useSearchParams();
  const eml = params.get("email");
  const mob = params.get("mobile");

  // Explicitly check for string "true" or "false"
  const isEmail = eml === "true";
  const isMobile = mob === "true";

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [counter]);

  const handleResendSendtOtp = () => {
    axios
      .post(
        isEmail // Check if isEmail is true
          ? `${API_URL}/auth/sendOtpWithEmail`
          : `${API_URL}/auth/sendOtpWithSms`,
        isEmail
          ? { email: email,role:role }
          : { phoneNumber: phoneNumber, countryCode: countryCode , role:role}
      )
      .then((res) => {
        if (res.status === 200) {
          navigate(`/validateotp?email=${eml}&mobile=${mob}`);
          setDisabled(true);
          setCounter(59);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
  
    const payload = isEmail
      ? { otp: +code, email: email }
      : { otp: +code, phoneNumber: phoneNumber, countryCode: countryCode };
  
    try {
      const res = await axios.post(`${API_URL}/auth/validateOTP`, payload);
  
      if (res.status === 200) {
        setCode("");
        toast.success(`OTP verified successfully`, {
          position: "top-right",
          duration: 3000,
          style: { fontSize: "14px", fontWeight: "bold" },
        });
  
        localStorage.setItem("token", res.data.data.token);
        dispatch(userDetails(res.data.data));
        setDetails(res?.data?.data);
        const userRole=res?.data?.data?.role;
        if (userRole === "user" && !res?.data?.data?.userType) {
          setOpen(true);
        } else if (userRole === "user") {
          navigate("/client/dashboards");
        } else if (userRole === "therapist") {
          navigate("/therapist/dashboards");
        }
      } else if (res.data.response === "error") {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(`OTP is incorrect`, {
        position: "top-right",
        duration: 3000,
        style: { fontSize: "14px", fontWeight: "bold" },
      });
    }
  };
  useEffect(() => {
    console.log(open, "modal condition updated"); // Ensure this logs when state changes
  }, [open]);
  
  return (
    <>
      <div className="flex w-full h-full justify-center align-center flex-row">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "500px",
          }}
        >
          <h5 className="h5-bold" style={{ margin: "24px 0px" }}>
            Verify your OTP
          </h5>

          <form
            className="flex flex-col justify-between items-center"
            onSubmit={handleVerifyOtp}
          >
            <OtpInput
              value={code}
              onChange={handleChange}
              numInputs={6}
              separator={<span style={{ width: "100px" }}></span>}
              isInputNum={true}
              shouldAutoFocus={true}
              renderInput={(props) => <input inputMode="numeric" {...props} />}
              inputStyle={{
                margin: "0 4px",
                border: "1px solid transparent",
                borderRadius: "8px",
                width: "70px",
                height: "70px",
                fontSize: "16px",
                color: "#000",
                fontWeight: "400",
                caretColor: "#614298",
                background: "#F2F2F2",
              }}
              focusStyle={{
                border: "1px solid #614298",
                // outline: "none",
              }}
            />
            <div style={{ width: "92%", margin: "12px 0px" }} className="w-fit">
              {error ? (
                <p className="text-red-600 text-sm">Please enter a valid OTP</p>
              ) : (
                ""
              )}
              <div className="flex flex-row-reverse">
                <p
                  style={{
                    display: "inline",
                    textAlign: "right",
                    color: disabled ? "#9A93A5" : "#000", // Change color if disabled
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "20px",
                    letterSpacing: "0.32px",
                    cursor: disabled ? "not-allowed" : "pointer", // Disable cursor when button is disabled
                  }}
                  onClick={!disabled ? handleResendSendtOtp : null} // Disable click if disabled
                >
                  {disabled ? `Resend OTP in ${counter}s` : "Resend OTP"}{" "}
                </p>
              </div>
            </div>

            <Button
              variant="contained"
              type="submit"
              sx={{
                margin: "16px 0px",
                width: "403px",
                height: "48px",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #614298",
                textTransform: "capitalize",
                background: "#614298",
                "&:hover": {
                  background: "#614298",
                  border: "1px solid #614298",
                },
                "&:focus": {
                  background: "#614298",
                },
                "&:active": {
                  background: "#614298",
                },
              }}
            >
              <span className="btn1">Verify</span>
            </Button>
          </form>

          <StyledLink to="/contact-us">
            <p
              className="mixed-style5"
              style={{
                color: "#000",
                fontFamily: "Nunito",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "20px",
                letterSpacing: "0.28px",
                textAlign: "center", 
                marginTop: "8px"
              }}
            >
              If you don’t receive the email, check your spam folder, or{" "}
              <span
                style={{
                  color: "#614298",
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 800,
                  lineHeight: "20px",
                  letterSpacing: "0.28px",
                }}
              >
                Contact Us
              </span>
            </p>
          </StyledLink>
        </div>
        <Welcome open={open} handleClose={handleClose} id={details?._id} />
      </div>
    </>
  );
};

export default ValidateOtp;
