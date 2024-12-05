import React, { useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import Email from "../assets/Envelope.svg";
import Question from "../assets/Question.svg";
import { setUserEmail } from "../store/slices/userSlices";
import { useDispatch } from "react-redux";
import { TextField, Button, InputAdornment, InputLabel } from "@mui/material";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #06030d;
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/generateOTP`, { email: email })
      .then((res) => {
        if (res.data.success == true) {
          dispatch(setUserEmail(email));
          navigate("/verifyotp");
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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h5 className="h5-bold">Forgot your Password?</h5>
        <form onSubmit={onSubmit}>
          <InputLabel className="p2-sem" style={{ marginTop: "24px" }}>
            Enter your primary email address and we’ll send you <br /> a link to
            reset yur password.
          </InputLabel>
          <TextField
            id="outlined-text-input"
            placeholder="Sage Turtle"
            fullWidth
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
            InputProps={{
              sx: {
                height: "48px",
                fontSize: "16px",
                margin: "4px 0px",
                color: `#181126`,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: `#d5d2d9`,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: `#d5d2d9`,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: `#d5d2d9`,
                },
                "& input::placeholder": {
                  color: `#181126`,
                },
              },
              startAdornment: (
                <InputAdornment position="start">
                  <img src={Email} alt="" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <img src={Question} alt="" />
                </InputAdornment>
              ),
            }}
          />

          {error ? (
            <p className="text-red-600 text-sm">Email is not registered</p>
          ) : (
            <p className="ovr2-reg" style={{ color: "#7D748C" }}>
              This is a hint text to help user.
            </p>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: "124px",
              width: "443px",
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #614298",
              textTransform: "capitalize",
              "&:hover": {
                background: "#614298",
              },
            }}
          >
            <span className="btn1">Send Otp</span>
          </Button>
        </form>

        <StyledLink to="/">
          <p
            className="body3-bold"
            style={{ textAlign: "center", marginTop: "8px" }}
          >
            Login
          </p>
        </StyledLink>
      </div>
    </div>
  );
};

export default ForgotPassword;
