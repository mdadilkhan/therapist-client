import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Email, HelpOutline } from "@mui/icons-material";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import styled from "@emotion/styled";
import location from "../assets/Pin.svg";
import call from "../assets/Phone1.svg";
import envelope from "../assets/Envelope.svg";
import insta from "../assets/InstagramLogo.svg";
import facebook from "../assets/FacebookLogo.svg";
import twitterNewLogo from "../assets/TwitterNewLogo.svg";
import linkedin from "../assets/LinkedinLogo.svg";
import youtube from "../assets/YoutubeLogo.svg";
import axios from "axios";
import contact from "../assets/Contactus.png";
import { useState } from "react";

const SendMessageButton = styled(Button)`
  background: #614298;
  color: #fcfcfc;
  width: 320px;
  height: 60px;
  border-radius: 32px;
  padding: 1.6rem 2rem;

  text-transform: none;

  &:hover {
    background-color: #614298;
    box-shadow: 0px 1px 3px 1px rgba(131, 87, 157, 0.15),
      0px 1px 2px 0px rgba(131, 87, 157, 0.5);
  }
`;
const Label = styled("label")`
  position: relative;
  top: 15px;
  color: #4a4159;
`;
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ContactSupport = () => {
  const initialData = {
    name: "",
    email: "",
    phone: "",
    description: "",
    agree: false,
  };
  const [userData, setUserData] = useState(initialData);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handlePhone = (value) => {
    setUserData({
      ...userData,
      phone: value,
    });
  };
  const handleCheckBox = (e) => {
    setUserData({
      ...userData,
      agree: e.target.checked,
    });
  };

  const sendMessage = () => {
    axios
      .post(
        "https://onekeycare.com/smportal/Counsellor_Api/contact_submission",
        formData
      )
      .then(function (res) {
        if (res.data.response === "success") {
          navigate("/dashboards");
        } else {
          console.log("something went wrong");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    sendMessage();
  };
  const color = {
    backgroundColor: "#F2F2F2",
  };
  const email = "info@ensolab.in";
  return (
    <>
      <div className="sm:hidden px-6">
        <h5 className="h5-bold">Contact Support</h5>
      </div>

      <div className="flex  flex-col-reverse rounded-2xl mx-6 sm:flex-row sm:justify-between sm:w-full sm:px-16 sm:py-4 sm:gap-7 bg-[#F4EDFF]">
        <div className="flex flex-col justify-center  sm:justify-between w-full sm:w-3/4 py-16">
          <h5 className="h5-bold hidden sm:block">Contact Support</h5>
          <div className="w-full  px-4">
            <p className=" sm:hidden text-[14px] text-[#240D4D] font-headline-5-bold font-normal leading-8 tracking-[0.28px] ">
              If you've a question about Sage Turtle in general, or ABCD in
              particular, chances are you can find the answer in our FAQ
              section.
            </p>
            <p className="body1-reg hidden sm:block">
              If you've a question about Sage Turtle in general, or ABCD in
              particular, chances are you can find the answer in our FAQ
              section.
            </p>
          </div>
        </div>

        <div className="flex px-6 pt-6 sm:flex-row sm:justify-end sm:w-4/12 ">
          <img className="w-full" src={contact} alt="" />
        </div>
      </div>

      <Box className="flex flex-col sm:flex-row justify-around my-6">
        <Box className="sm:w-[44.8rem] py-[3.2rem] px-6 sm:px-[6.4rem]">
          <Box className>
            <h5
              className="h5-bold"
              style={{
                color: "#06030D",
                marginBottom: "0.8rem",
                width: "32rem",
              }}
            >
              Happy to help
            </h5>
            <p className="p1-reg" style={{ color: "#4A4159" }}>
              Our squad is here to help you
            </p>
          </Box>
          <Box>
            <form onSubmit={onSubmitForm}>
              <Label className="p2-sem" htmlFor="">
                Name
              </Label>
              <TextField
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Sage turtle"
                required
                fullWidth
                margin="normal"
                className="my-textfield"
              />
              <Label className="p2-sem" htmlFor="">
                Email
              </Label>
              <TextField
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                fullWidth
                placeholder="sageturtle@gmail.com"
                margin="normal"
                className="my-textfield"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => alert("Enter Your Email")}
                      >
                        <HelpOutline />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <label style={{ color: "#4A4159" }} className="p2-sem" htmlFor="">
                Phone
              </label>
              <PhoneInput
                country={"in"}
                placeholder="Enter phone number"
                name="phone"
                value={userData.phone}
                onChange={handlePhone}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "16px",
                  paddingLeft: "40px",
                }}
                buttonStyle={{
                  borderRadius: "0",
                }}
              />
              <Label className="p2-sem" htmlFor="">
                Description
              </Label>
              <TextField
                name="description"
                value={userData.description}
                onChange={handleChange}
                placeholder="Enter your query..."
                multiline
                rows={7}
                required
                fullWidth
                margin="normal"
              />
              <Checkbox
                className="checkbox"
                {...label}
                size="large"
                sx={{ borderRadius: "6px" }}
                defaultChecked={userData.agree}
                name="agree"
                onChange={handleCheckBox}
              />

              <p
                className="p1-reg"
                style={{
                  position: "relative",
                  left: "35px",
                  bottom: "32px",
                  color: "#7D748C",
                }}
              >
                By continuing, you agree to Sage <br /> Turtle's Terms and
                Conditions
              </p>
              <br />
              <SendMessageButton
                disableElevation
                type="submit"
                variant="contained"
                disableRipple={true}
                disabled={!userData.agree}
              >
                <span className="btn1">Send Notes</span>
              </SendMessageButton>
            </form>
          </Box>
        </Box>
        <Box
          sx={{ height: "698px", border: "0.5px solid #9A93A5" }}
          className="hidden sm:block"
        ></Box>

        <Box className=" sm:w-[500px] sm:h-[500px] pt-[3.2rem] pr-[6.4rem] pb-[3.2rem] pl-[2.4rem]">
          <Box>
            <h5 className="h5-bold">Let's connect</h5>
          </Box>
          <Box sx={{ marginBottom: "2.4rem" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", margin: "2.4rem 0" }}
            >
              <span>
                <img src={location} alt="call icon" />
              </span>
              <p
                className="p1-reg"
                style={{ marginLeft: "1rem", color: "#4A4159" }}
              >
                C-47, Shivalik, Malviya Nagar,
                <br /> New Delhi, Delhi -110017
              </p>
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", margin: "2.4rem 0" }}
            >
              <span>
                <img src={call} alt="call icon" />
              </span>
              <p
                className="p1-reg"
                style={{ marginLeft: "10px", color: "#4A4159" }}
              >
                +91 - 98 73 020 194
              </p>
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", margin: "2.4rem 0" }}
            >
              <span>
                <img src={envelope} alt="envelope icon" />
              </span>
              <a
                href={`mailto:${email}`}
                className="p1-reg"
                style={{
                  marginLeft: "10px",
                  color: "#4A4159",
                  textDecoration: "none",
                }}
              >
                {email}
              </a>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: "2.4rem" }} />

          <h6 className="h7-bold" style={{ marginBottom: "1.6rem" }}>
            Where can you find us
          </h6>
          <span style={{ marginRight: "2.4rem" }}>
            <Link to="https://www.instagram.com/_sageturtle_/" target="blank">
              <img src={insta} alt="" />
            </Link>
          </span>
          <span style={{ marginRight: "2.4rem" }}>
            <Link
              to="https://www.linkedin.com/company/enso-innovation-lab/"
              target="blank"
            >
              <img src={linkedin} alt="" />
            </Link>
          </span>
          <span style={{ marginRight: "2.4rem" }}>
            <img
              style={{ width: "28px", height: "28px" }}
              src={twitterNewLogo}
              alt=""
            />
          </span>
          <span style={{ marginRight: "2.4rem" }}>
            <Link to="https://www.youtube.com/@sageturtle_mh" target="blank">
              <img src={youtube} alt="" />
            </Link>
          </span>
          <span style={{ marginRight: "2.4rem" }}>
            <Link
              to="https://www.facebook.com/EnsoInnovationLab/"
              target="blank"
            >
              <img src={facebook} alt="" />
            </Link>
          </span>
        </Box>
      </Box>
    </>
  );
};

export default ContactSupport;
