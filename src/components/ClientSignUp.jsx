import { useState, useEffect, createContext, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "../store/slices/userSlices";
import { API_URL } from "../constant/ApiConstant";
const Navbar = lazy(() => import("./Navbar"));
import { toast } from "react-toastify";

import axios from "axios";
import {
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/Signup.png";
import Envelope from "../assets/Envelope.svg";
import Cratedown from "../assets/CaretDown.svg";

const ClientSignUp = () => {
  const dispatch = useDispatch();
  const initialValue = {
    name: "",
    phoneNumber: "",
    email: "",
    referralCode: "",
  };
  const [signUp, setSignUp] = useState(initialValue);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setSignUp({ ...signUp, [e.target.name]: e.target.value });
  };

  const notify = (message) => toast(message);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/auth/userSignup`, signUp)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          dispatch(userDetails(res.data.data));
          navigate("/client");
        } else {
          console.log("Invalid data");
        }
      })
      .catch((err) => {
        console.error("Error:", err);

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
          <h5 className="h5-bold text-black mb-4">Client's Sign up</h5>
          <h6 className="p1-reg mb-10">Welcome to Therapist Portal</h6>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <h2 className="p2-sem mt-2 text-[#4A4159]">Name</h2>
              <TextField
                id="outlined-text-input-name"
                placeholder="Enter your name"
                fullWidth
                type="text"
                required
                name="name"
                value={signUp.name}
                onChange={handleChange}
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
              <h2 className="p2-sem mt-2 text-[#4A4159]">Contact</h2>
              <TextField
                id="outlined-text-input"
                placeholder="Enter your phoneNumber number"
                fullWidth
                type="tel"
                required
                name="phoneNumber" // Update this line
                value={signUp.phoneNumber} // Update this line
                onChange={(e) => {
                  // Allow only numbers and limit to 10 digits
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    handleChange(e); // Only update state if the value meets the condition
                  }
                }}
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
              <h2 className="p2-sem mt-2 text-[#4A4159]">Email</h2>
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
              <h2 className="p2-sem mt-2 text-[#4A4159]">Referal Code</h2>
              <TextField
                id="outlined-text-input"
                //   label="Contact Number"
                placeholder="Enter Referalcode"
                fullWidth
                type="tel"
                name="referralCode"
                value={signUp.referralCode}
                onChange={handleChange}
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
            <div className="w-full mb-8 px-10 h-16 btn1 bg-[#614289] text-[#fcfcfc] rounded-[4px] border-none cursor-pointer">
              <button
                type="submit"
                className="w-full px-10 mb-8 h-16 btn1 bg-[#614289] text-[#fcfcfc] rounded-[4px] border-none cursor-pointer"
              >
                Sign Up
              </button>
            </div>
            <div className="flex flex-row items-center">
              <h2 className="p2-sem text-[#4A4159]">Already have an account</h2>
              <p
                className=" p2-sem w-fit cursor-pointer ml-2"
                style={{ color: `#614298` }}
                onClick={() => navigate("/client")}
              >
                Login here
              </p>
            </div>
            <p
              className="p2-sem mt-2 w-fit cursor-pointer"
              style={{ color: `#614298` }}
              onClick={() => navigate("/therapist")}
            >
              Go to Therapist Login ?
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClientSignUp;
