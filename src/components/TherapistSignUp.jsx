import { useState, useEffect, createContext, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "../store/slices/userSlices";
import { API_URL } from "../constant/ApiConstant";
const Navbar = lazy(() => import("./Navbar"));
import axios from "axios";
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
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../assets/Signup.png";
import styled from "@emotion/styled";
import Envelope from "../assets/Envelope.svg";
import Cratedown from "../assets/CaretDown.svg";
import { toast } from "react-toastify";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;
const TherapistSignUp = () => {
  const dispatch = useDispatch();
  const initialValue = {
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmpassword: "",
    referalcode: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, setSignUp] = useState(initialValue);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errormessageEmail, setErrorMessageEmail] = useState("");
  const [errormessagePassword, setErrorMessagePassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorData, setErrorData] = useState("");
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    e.preventDefault();

    setSignUp({ ...signUp, [e.target.name]: e.target.value });
    if (
      e.target.name === "conformpassword" &&
      e.target.value !== signUp.password
    ) {
      setErrorConfirmPassword(true);
    } else {
      setErrorConfirmPassword(false);
    }
  };

  const notify = (message) => toast(message);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/auth/therapistSignUp`, signUp)
      .then((res) => {
        if (res.status === 201) {
          localStorage.setItem("token", res.data.token);
          dispatch(userDetails(res.data.data));
          navigate("/therapist");
        } else {
          setErrorData("Invalid data");
        }
      })
      .catch((err) => {
        notify(err?.response?.data?.message);
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
          <h5 className="h5-bold text-black mb-4">Therapist's Sign up</h5>
          <h6 className="p1-reg mb-10">Welcome to Therapist Portal</h6>
          <form onSubmit={handleSubmit}>
            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Name
              </InputLabel>
              <TextField
                id="outlined-text-input-name"
                placeholder="Enter your name"
                fullWidth
                type="text"
                required
                name="name"
                value={signUp.name}
                onChange={handleChange}
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
            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Contact
              </InputLabel>
              <TextField
                id="outlined-text-input"
                //   label="Contact Number"
                placeholder="Enter your contact number"
                fullWidth
                type="tel"
                required
                name="contactNumber"
                value={signUp.contactnumber}
                onChange={handleChange}
                error={errorEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <p>IN</p>
                      <img src={Cratedown} />
                    </InputAdornment>
                  ),
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
            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Email
              </InputLabel>
              <TextField
                id="outlined-text-input"
                //   label="Email"

                placeholder="Sage Turtle"
                fullWidth
                type="text"
                required
                name="email"
                value={signUp.email}
                onChange={handleChange}
                error={errorEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={Envelope} />
                    </InputAdornment>
                  ),
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

            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Create Password
              </InputLabel>
              <TextField
                id="outlined-password-input"
                placeholder="Password"
                type={showPassword ? "text" : "password"} // Switches between text and password
                autoComplete="new-password"
                fullWidth
                required
                name="password"
                value={signUp.password}
                onChange={handleChange}
                error={errorPassword}
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
            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Confirm Password
              </InputLabel>
              <TextField
                id="outlined-confirm-password-input"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                // autoComplete="new-password"
                fullWidth
                required
                name="confirmpassword"
                value={signUp.confirmpassword}
                onChange={handleChange}
                error={errorConfirmPassword}
                helperText={
                  errorConfirmPassword ? "Passwords do not match" : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff
                            sx={{ cursor: "pointer", color: "#d5d2d9" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ cursor: "pointer", color: "#d5d2d9" }}
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
            <div>
              <InputLabel className="p2-sem" style={{ marginBottom: "4px" }}>
                Referalcode
              </InputLabel>
              <TextField
                id="outlined-text-input"
                //   label="Contact Number"
                placeholder="Enter Referalcode"
                fullWidth
                type="tel"
                name="referalcode"
                value={signUp.referalcode}
                onChange={handleChange}
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
            <p className="mt-8 text-[red] font-bold text-[12px]">
              {errorData}{" "}
            </p>
            <div className="mt-8">
              <Button
                type="submit"
                className="w-full px-10 py-20 h-16 btn1"
                style={{
                  background: `#614298`,
                  color: `#fcfcfc`,
                }}
              >
                Sign Up
              </Button>
            </div>
            <div className="flex flex-row">
              <p>Alreay have account</p>
              <p
                className="p3-bold mt-6 w-fit cursor-pointer"
                style={{ color: `#614298` }}
                onClick={() => navigate("/therapist")}
              >
                Login here
              </p>
            </div>
            <p
              className="p3-bold mt-6 w-fit cursor-pointer"
              style={{ color: `#614298` }}
              onClick={() => navigate("/client")}
            >
              Go to Client login?
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default TherapistSignUp;
