import { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { API_URL } from "../constant/ApiConstant";
import { setEmailSignIn, setMobileSignIn, setRole } from "../store/slices/smsSlices";
import axios from "axios";
import {
  TextField,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/Login.svg";
import mobilee from "../assets/mobile.svg";
import emaill from "../assets/Email.svg";
import toast from "react-hot-toast";

const TherapistLogin = () => {
  const dispatch = useDispatch();
  const initialValue = {
    email: "",
  };
  const [signin, setSignin] = useState(initialValue);
  const [errorEmail, setErrorEmail] = useState(false);
  const [email, setEmail] = useState(true);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const input = event.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setPhoneNumber(input);
    }
  };

  const handelChage = (e) => {
    setSignin({
      ...signin,
      [e.target.name]: e.target.value,
    });
  };

  const handelmobile = () => {
    setMobile(true);
    setEmail(false);
  };

  const handelemail = () => {
    setEmail(true);
    setMobile(false);
  };

  useEffect(() => {
    setSignin((prev) => ({
      ...prev,
      email: "",
    }));
  }, [email, mobile]);

  const validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    // Check if the phone number is at least 10 digits
    return phoneNumber.length === 10;
  };

  const handleSendtOtp = (e) => {
    e.preventDefault();

    if (email && !validateEmail(signin.email)) {
      setErrorEmail(true);
      return;
    }

    if (mobile && (!validatePhoneNumber(phoneNumber) || !countryCode)) {
      return;
    }

    // Proceed with the API call if validation passes
    axios
      .post(
        email
          ? `${API_URL}/auth/sendOtpWithEmail`
          : `${API_URL}/auth/sendOtpWithSms`,
        email
          ? { email: signin.email , role:"therapist"}
          : { phoneNumber: phoneNumber, countryCode: countryCode , role:"therapist"}
      )
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            email === true
              ? setEmailSignIn(signin.email)
              : setMobileSignIn({ phoneNumber, countryCode })
          );
          dispatch(setRole("therapist"))
          setCountryCode("");
          setPhoneNumber("");
          setSignin({});
          toast.success(`OTP sent. Please check your ${email ? "Email" : "Phone Number"}`, {
            position: 'top-right',  // Set the position to top-right
            duration: 3000,         // Display for 3 seconds (3000 ms)
            style: {
              fontSize: '14px',
              fontWeight:"bold"
            },
          });
          navigate(`/validateotp?email=${email}&mobile=${mobile}`);
        } else {
          toast.error(`Please check your ${email ? "Email" : "Phone Number"} its not valid`, {
            position: 'top-right',  // Set the position to top-right
            duration: 3000,         // Display for 3 seconds (3000 ms)
            style: {
              fontWeight:"bold",
              fontSize: '14px',     // Smaller text
            },
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          toast.error(`Please check your ${email ? "Email" : "Phone Number"} its not valid`, {
            position: 'top-right',  // Set the position to top-right
            duration: 3000,         // Display for 3 seconds (3000 ms)
            style: {
              fontWeight:"bold",
              fontSize: '14px',     // Smaller text
            },
          });
        } else if (err.response && err.response.status === 401) {
          toast.error(`Please check your ${email ? "Email" : "Phone Number"} its not valid`, {
            position: 'top-right',  // Set the position to top-right
            duration: 3000,         // Display for 3 seconds (3000 ms)
            style: {
              fontWeight:"bold",
              fontSize: '14px',     // Smaller text
            },
          });
        } else {
          console.error("Unexpected error:", err);
          toast.error(`Please check your ${email ? "Email" : "Phone Number"} its not valid`, {
            position: 'top-right',  // Set the position to top-right
            duration: 3000,         // Display for 3 seconds (3000 ms)
            style: {
              fontWeight:"bold",
              fontSize: '14px',     // Smaller text
            },
          });
        }
      });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "50px",
          height: "calc(100vh - 66.5px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "25%",
          }}
        >
          <img src={LoginImg} className="w-full" alt="" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "25%",
          }}
        >
          <h5 className="h5-bold text-black mb-4">Therapist's Login</h5>
          <h6 className="p1-reg mb-10">Welcome to Therapist Portal</h6>
          <div>
            {mobile && (
              <>
                <h2 className="p2-sem mb-2 text-[#4A4159]">
                  Enter Your Mobile Number
                </h2>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <TextField
                      select
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      InputProps={{
                        sx: {
                          height: "48px",
                          fontSize: "16px",
                          color: `#181126`,
                          marginBottom: "16px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#d5d2d9`,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#614298`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#614298`,
                          },
                          "& input::placeholder": {
                            color: `#181126`,
                          },
                        },
                      }}
                      fullWidth
                    >
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                      <MenuItem value="+91">+91</MenuItem>
                      {/* Add more country codes as needed */}
                    </TextField>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      InputProps={{
                        sx: {
                          height: "48px",
                          fontSize: "16px",
                          color: `#181126`,
                          marginBottom: "16px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#d5d2d9`,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#614298`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#614298`,
                          },
                          "& input::placeholder": {
                            color: `#181126`,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </div>
          {!mobile && (
            <div>
              <h2 className="p2-sem mb-2 text-[#4A4159]">Enter Your Email</h2>
              <TextField
                id="outlined-text-input"
                //   label="Email"
                placeholder="Sage Turtle"
                fullWidth
                type="text"
                required
                name="email"
                value={signin.email}
                onChange={handelChage}
                error={errorEmail}
                InputProps={{
                  sx: {
                    height: "48px",
                    fontSize: "16px",
                    color: `#181126`,
                    marginBottom: "16px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `#d5d2d9`,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: `#614298`,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: `#614298`,
                    },
                    "& input::placeholder": {
                      color: `#181126`,
                    },
                  },
                }}
              />
            </div>
          )}
          <div className="flex flex-col justify-between">
            {mobile ? (
              <>
                {/* Mobile login button */}
                <button
                  type="submit"
                  className="w-full mb-8 px-10 h-16 btn1 bg-[#614289] text-[#fcfcfc] rounded-[4px] border-none cursor-pointer"
                  onClick={handleSendtOtp} // Replace with your OTP handler for mobile
                >
                  Log in
                </button>
                <div className="flex gap-4 items-center justify-center">
                  <div className="w-[45%] bg-[#E1E1E1] h-[1px]" />
                  <p>or</p>
                  <div className="w-[45%] bg-[#E1E1E1] h-[1px]" />
                </div>
                <div className="mt-8 w-[100%]">
                  <button
                    className="flex items-center justify-start gap-[20%] w-full mb-8 px-10 h-16 btn1 bg-[#fcfcfc] text-[#612498] border border-solid border-[#612498] rounded-[4px] cursor-pointer"
                    onClick={handelemail}
                  >
                    <img src={emaill} className="w-[20px]" />
                    <h2 className="p2-sem">Continue with email</h2>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Email login button */}
                <button
                  type="submit"
                  className="w-full px-10 mb-8 h-16 btn1 bg-[#614289] text-[#fcfcfc] rounded-[4px] border-none cursor-pointer"
                  onClick={handleSendtOtp}
                >
                  Log in
                </button>
                <div className="flex gap-4 items-center justify-center">
                  <div className="w-[45%] bg-[#E1E1E1] h-[1px]" />
                  <p>or</p>
                  <div className="w-[45%] bg-[#E1E1E1] h-[1px]" />
                </div>
                <div className="mt-8 w-[100%]">
                  <button
                    className="flex items-center justify-start gap-[20%] w-full mb-8 px-10 h-16 btn1 bg-[#fcfcfc] text-[#612498] border border-solid border-[#612498] rounded-[4px] cursor-pointer"
                    onClick={handelmobile}
                  >
                    <img src={mobilee} className="w-[12px]" />
                    <h2 className="p2-sem">Continue with Mobile</h2>
                  </button>
                </div>
              </>
            )}
          </div>

          <p
            className="p3-bold w-fit cursor-pointer"
            style={{ color: `#614298` }}
            onClick={() => navigate("/client")}
          >
            Go to Client Login?
          </p>
          {/* <p
            className="p3-bold mt-6 w-fit cursor-pointer"
            style={{ color: `#614298` }}
            onClick={() => navigate("/signup/therapist")}
          >
            Don't have an account Register here ?
          </p> */}
        </div>
      </div>
    </>
  );
};

export default TherapistLogin;
