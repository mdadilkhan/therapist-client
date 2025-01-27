import React from "react";
import axios from "axios";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { API_URL } from "../constant/ApiConstant";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  InputLabel,
} from "@mui/material";
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;
const VerifyOtp = () => {
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.userDetails);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(true);
  const [password, setPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [error, setError] = useState(false);
  const handleChange = (code) => setCode(code);
  const [resetForm, setResetForm] = useState({});
  const [matchPassword, setMatchPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handlecChangePassword = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };
  const onSubmitResetPassword = (e) => {
    e.preventDefault();
    if (resetForm.password === resetForm.cofirm_password) {
      const data = {
        emp_gmail: email,
        new_password: resetForm.password,
        confirm_new_password: resetForm.cofirm_password,
      };
      axios
        .post(`${API_URL}/resetPassword`, data)
        .then((res) => {
          if (res.data.success == true) {
            setVerifyOtp(false);
            setPassword(false);
            setPasswordReset(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Password doesn't match");
      setMatchPassword(false);
    }
  };
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      otp: +code,
    };
    axios
      .post(`${API_URL}/validateOTP`, data)
      .then((res) => {
        if (res.data.success == true) {
          setVerifyOtp(false);
          setPassword(true);
          setPasswordReset(false);
        } else if (res.data.response === "error") {
          setError(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const resendOtp = () => {
    axios
      .post(`${API_URL}/generateOTP`, { email: email })
      .then((res) => {
        if (res.data.success == true) {
          console.log("OTP sent");
        } else if (res.data.response === "error") {
          alert("error");
          setError(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        height: "calc(100vh - 66.5px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {password && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "500px",
            width: "500px",
            borderRadius: "8px",
            border: " 1px solid #D5D2D9",
            boxShadow: "0px 1px 2px 0px #0000000d",
            padding: "24px",
          }}
        >
          <form onSubmit={onSubmitResetPassword} style={{ width: "100%" }}>
            <h5 className="h5-bold">Enter a New Password</h5>
            <div style={{ marginTop: "16px" }}>
              <InputLabel className="p2-sem">
                New Password<span style={{ color: "#E83F40" }}>*</span>
              </InputLabel>
              <TextField
                id="outlined-password-input"
                //   label="Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
                required
                name="password"
                value={resetForm.password}
                onChange={handlecChangePassword}
                sx={{ marginTop: "10px" }}
                //   error={errorPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{
                              cursor: "pointer",
                              color: "#d5d2d9",
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              cursor: "pointer",
                              color: "#d5d2d9",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: "48px",
                    fontSize: "16px",
                    color: `#181126`,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${"#d5d2d9"}`,
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
            <div style={{ marginTop: "16px" }}>
              <InputLabel className="p2-sem">
                Confirm New Password<span style={{ color: "#E83F40" }}>*</span>
              </InputLabel>
              <TextField
                id="outlined-password-input"
                //   label="Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
                required
                name="cofirm_password"
                value={resetForm.cofirm_password}
                onChange={handlecChangePassword}
                sx={{ marginTop: "10px" }}
                //   error={errorPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{
                              cursor: "pointer",
                              color: "#d5d2d9",
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              cursor: "pointer",
                              color: "#d5d2d9",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: "48px",
                    fontSize: "16px",
                    color: `#181126`,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${"#d5d2d9"}`,
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
            {matchPassword ? (
              ""
            ) : (
              <p className="text-red-600 text-sm">Please doesn't match</p>
            )}
            <Button
              variant="contained"
              type="submit"
              sx={{
                marginTop: "24px",
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                border: "1px solid #614298",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#614298",
                },
              }}
            >
              <span className="btn1">Reset</span>
            </Button>
          </form>
        </div>
      )}
      {verifyOtp && (
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
                border: "1px solid #D5D2D9",
                outline: "none",
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
                    color: "#9A93A5",
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "20px",
                    letterSpacing: "0.32px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    resendOtp();
                  }}
                >
                  Resend OTP
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
              }}
            >
              <span className="btn1">Verify</span>
            </Button>
          </form>

          <StyledLink to="/">
            <p
              className="mixed-style5"
              style={{ textAlign: "center", marginTop: "8px" }}
            >
              <br />
              <br />
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
      )}
      {passwordReset && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <h5 className="h5-bold">Password Reset Complete</h5>
          <StyledLink to="/">
            <p className="mixed-style5">
              Your password is successfully{" "}
              <reset
                style={{
                  color: "#614298",
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 800,
                  lineGeight: "20px",
                  letterSppacing: "0.28px",
                }}
              >
                Sign In
              </reset>{" "}
              Sign In using your <br /> primary email addressss.
            </p>
          </StyledLink>
        </div>
      )}
    </div>
  );
};

export default VerifyOtp;
