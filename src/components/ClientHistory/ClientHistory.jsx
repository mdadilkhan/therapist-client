import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import LeftArrow from "../../assets/LeftArrow.svg";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../constant/ApiConstant";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  Radio,
  RadioGroup,
  IconButton,
} from "@mui/material";
import AddPrescription from "../AddPrescription";
import AddIcon from "../../assets/AddIcon.svg";
import UploadIcon from "../../assets/UploadIcon.svg";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { calculateAge, getFormatDate, getformatedDate } from "../../constant/constatnt";
import toast from "react-hot-toast";
import { Spin } from "antd";
const concerns = [
  "Addiction",
  "ADHD",
  "Adjustment challenges",
  "Anger",
  "Family Therapy",
  "General well being",
  "Grief and Trauma",
  "Loneliness",
  "Overthinking",
  "Procastination",
  "Self Esteem",
  "Stress",
  "Bipolar Affective Disorder",
  "Career Counselling",
  "Couple Therapy",
  "Depression",
  "Eating disorders & Body image",
  "Loss of motivation",
  "Negative Thinking",
  "OCD",
  "Relationship & Marriage",
  "Sexual Dysfunction",
  "Sleep Disturbances",
];

const ClientHistory = () => {
  const [employeeHistory, setClientHistory] = useState({
    riskBehaviors: [],
    diagnostic: [""],
  });
  // const [selectedFileName, setSelectedFileName] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [openPrescription, setOpenPrescription] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [dateValue, setDateValue] = useState(employeeHistory?.dateOfIntake);
  const handleAddField = () => {
    setClientHistory({
      ...employeeHistory,
      diagnostic: [...employeeHistory.diagnostic, ""],
    });
  };

  const handleRemoveField = (index) => {
    const updatedDiagnostics = employeeHistory.diagnostic.filter(
      (_, i) => i !== index
    );
    setClientHistory({
      ...employeeHistory,
      diagnostic: updatedDiagnostics,
    });
  };

  const handleInputChange = (index, event) => {
    const newDiagnostics = [...employeeHistory.diagnostic];
    newDiagnostics[index] = event.target.value;
    setClientHistory({
      ...employeeHistory,
      diagnostic: newDiagnostics,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleclear = () => {
    navigate(-1);
  };

  const moveBack = () => {
    navigate(-1);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const newEmploye = {
      ...employeeHistory,
      userId: id,
    };
    axios
      .post(`${API_URL}/addClientHistory`, newEmploye)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Added Client History")
          handleclear()
          // navigate(`/therapist/clients/clientsDetails/${id}/clienthistory`);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handelChage = (e) => {
    setClientHistory({
      ...employeeHistory,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setDateValue(date);
    setClientHistory((prevHistory) => ({
      ...prevHistory,
      dateOfIntake: formattedDate,
    }));
  };

  const handleCheckboxChange = (checkboxName, value) => (event) => {
    const isChecked = event.target.checked;

    setClientHistory((prevClientHistory) => ({
      ...prevClientHistory,
      riskBehaviors: isChecked
        ? [...prevClientHistory.riskBehaviors, value]
        : prevClientHistory.riskBehaviors.filter((item) => item !== value),
    }));
  };

  const handleOpenPrescription = () => {
    setOpenPrescription(true);
  };

  const handleClosePrescription = () => {
    setOpenPrescription(false);
  };

  useEffect(() => { 
     axios
      .get(`${API_URL}/getUserDetails/${id}`)
      .then((res) => {
        setClientHistory((prevClientHistory) => ({
          ...prevClientHistory,
          name: res.data.data.name,
          age: calculateAge(res.data.data.profile_details.dob)
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



const [image, setImage] = useState(null);
const [selectedFileName, setSelectedFileName] = useState("");
const uploadImageToS3 = async (url) => {
  try {
    const res = await axios.put(url, image, {
      headers: {
        "Content-Type": image.type, // Ensure the correct Content-Type
        Authorization: undefined, // Explicitly override and remove the global Authorization header
      },
    });
    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image to S3", error.response || error);
    throw error;
  }
};

const getImageUrl = async () => {
  try {
    const { url, imageName } = await getSignedUrl();
    console.log("url", url);
    console.log("imageName", imageName);

    await uploadImageToS3(url);
    // setSelectedFileName("");
 
    const imageUrl = `https://corportal.s3.ap-south-1.amazonaws.com/upload/profilePic/${imageName}`;
    console.log("orignal image>>", imageUrl);
    setClientHistory((prevState) => ({
      ...prevState,
      imageUrl: imageUrl,
    }));
    setImage(null)
    toast.success("Save to Upload Document");
  } catch (error) {
    console.error("Error in image upload process", error);
    alert("Error uploading file");
  }
};

const getSignedUrl = async () => {
  try {
    const res = await axios.get(`${API_URL}/uploadImage`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to get signed URL");
    }
  } catch (error) {
    console.error("Error getting signed URL", error);
    throw error;
  }
};
useEffect(() => {
  if (image) {
    setSelectedFileName(image.name);
    getImageUrl();
  }
}, [image]);

console.log("cbhjsdbc>>",employeeHistory);

  return (
    <>
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <img
            style={{ cursor: "pointer" }}
            onClick={moveBack}
            src={LeftArrow}
            alt=""
          />
          <h5 className="h5-bold">Client History </h5>
        </div>
        {viewportWidth >= 640 ? (
          <div style={{ display: "flex" }}>
            <Button
              variant="outlined"
              style={{
                display: "flex",
                width: "196px",
                gap: 4,
                height: "48px",
                color: "#614298",
                borderRadius: "8px",
                border: "1px solid #614298",
                textTransform: "capitalize",
              }}
              onClick={handleOpenPrescription}
            >
              <img src={AddIcon} alt="" />
              <span className="btn1">Add Prescription</span>{" "}
            </Button>
          </div>
        ) : null}
        <Dialog
          open={openPrescription}
          onClose={handleClosePrescription}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AddPrescription
            handleClose={handleClosePrescription}
            appointId={id}
          />
        </Dialog>
      </div>

      <div
        style={{
          background: "#FCFCFC",
          padding: "0 16px 16px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            borderRadius: "16px",
            background: "#FCFCFC",
            padding: "16px",
          }}
        >
          <form
            onSubmit={handleSubmitForm}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Name
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="name"
                  value={employeeHistory?.name}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",

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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Age
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="age"
                  value={employeeHistory?.age}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Date of Intake
                </label>
                <DatePicker onChange={handleDateChange} value={dateValue} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Upload Attachment
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                
                <label
                  htmlFor="file-upload"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #ddd",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                   <label className="p2-sem" style={{ color: "#4A4159" }}>
                    {selectedFileName || "Choose Document"}
                  </label>
                  {image ? (
                    <Spin size="small" />
                  ) : (
                    <img src={UploadIcon} alt="Upload" />
                  )}
                </label>
              </div>
            </div>
          <h2 className="p2-sem text-center mt-8" style={{ color: "#9A93A5" }}>
            OR
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "full",
            }}
          >
            <label className="p2-sem" style={{ color: "#4A4159" }}>
              Write Notes
            </label>
            <textarea
              style={{ width: "100%", borderRadius: "8px" }}
              id="myTextArea"
              rows="4"
              cols="500"
              name="importantNotes"
              value={employeeHistory?.importantNotes}
              onChange={handelChage}
            ></textarea>
          </div>
          <h2
            className="p2-sem text-center mt-8 mb-3"
            style={{ color: "#9A93A5" }}
          >
            OR
          </h2>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Family (Current Situation)
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="familyCurrentSituation"
                  value={employeeHistory?.familyCurrentSituation}
                  onChange={handelChage}
                ></textarea>
              </div>
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Family History
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="familyHistory"
                  value={employeeHistory?.familyHistory}
                  onChange={handelChage}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Presenting Problem (Client's initial explanation of the
                  problem, duration and pertinent cause)
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="presentingProblem"
                  value={employeeHistory?.presentingProblem}
                  onChange={handelChage}
                ></textarea>
              </div>
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Pertinent History (Any prior therapy including family, social,
                  psychological, and/or medically-declared condition)
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="pertinentHistory"
                  value={employeeHistory?.pertinentHistory}
                  onChange={handelChage}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Tentative Goals and Plans
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="tentativeGoalsAndPlans"
                  value={employeeHistory?.tentativeGoalsAndPlans}
                  onChange={handelChage}
                ></textarea>
              </div>
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Observations
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="observations"
                  value={employeeHistory?.observations}
                  onChange={handelChage}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Special Needs of Client (e.g. Need for Interpreter,
                  Disability, Religious Consultant, etc. If yes, what?
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="specialNeeds"
                  value={employeeHistory?.specialNeeds}
                  onChange={handelChage}
                ></textarea>
              </div>
              <div className="flex flex-col w-full sm:w-[50%] mt-2">
                <label className="p2-sem mb-4" style={{ color: "#4A4159" }}>
                  Diagnostic Impression
                </label>
                {employeeHistory.diagnostic.map((input, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      value={input}
                      onChange={(event) => handleInputChange(index, event)}
                      style={{ flexGrow: 1, marginRight: "10px" }}
                    />
                    {index === 0 ? (
                      <IconButton onClick={handleAddField} color="primary">
                        <AddCircleOutlineIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleRemoveField(index)}
                        color="secondary"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-9 flex-col sm:flex-row">
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Initial Concern of Client
                </label>
                <RadioGroup
                  value={employeeHistory?.concern || ""}
                  onChange={(event) => {
                    const newConcern = event.target.value;
                    setClientHistory((prevHistory) => ({
                      ...prevHistory,
                      concern: newConcern,
                    }));
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  }}
                >
                  {concerns.map((concern) => (
                    <FormControlLabel
                      key={concern}
                      value={concern}
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          {concern}
                        </span>
                      }
                    />
                  ))}
                </RadioGroup>
              </div>
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Risk Behaviours (if any)
                </label>
                <div style={{ display: "flex", gap: 27 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Suicide
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Suicide"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Suicide"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Violence
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Violence"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Violence"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Physical abuse
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Physical abuse"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Physical abuse"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Psychotic breakdown
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Psychotic breakdown"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Psychotic breakdown"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Running away
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Running away"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Running away"
                      )}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Substance abuse
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Substance abuse"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Substance abuse"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Sexual abuse
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Sexual abuse"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Sexual abuse"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Self harm
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "Self harm"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "Self harm"
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          Other
                        </span>
                      }
                      onChange={handleCheckboxChange("riskBehaviors", "Other")}
                      checked={employeeHistory?.riskBehaviors.includes("Other")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="p1-reg" style={{ color: "#7D748C" }}>
                          None reported
                        </span>
                      }
                      onChange={handleCheckboxChange(
                        "riskBehaviors",
                        "None reported"
                      )}
                      checked={employeeHistory?.riskBehaviors.includes(
                        "None reported"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <h5 className="h5-bold" style={{ color: "06030D" }}>
              MSE
            </h5>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Appearance*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="appearance"
                  value={employeeHistory?.appearance}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",

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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Behaviour*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="behavior"
                  value={employeeHistory?.behavior}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Orientation*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="orientation"
                  value={employeeHistory?.orientation}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Speech*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="speech"
                  value={employeeHistory?.speech}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",

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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Affect*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="affect"
                  value={employeeHistory?.affect}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Mood*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="mood"
                  value={employeeHistory?.mood}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center gap-9 flex-col sm:flex-row">
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Thought Process and Content*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="thoughtProcessContent"
                  value={employeeHistory?.thoughtProcessContent}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",

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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Judgement*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="judgement"
                  value={employeeHistory?.judgement}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Sleep*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="sleep"
                  value={employeeHistory?.sleep}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "18px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",
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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex gap-9 flex-col sm:flex-row">
              <div className="w-full sm:w-[32%]">
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Appetite*
                </label>
                <TextField
                  fullWidth
                  type="text"
                  required
                  name="appetite"
                  value={employeeHistory?.appetite}
                  onChange={handelChage}
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontFamily: "Nunito",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "0.08px",
                      height: "48px",

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
                        color: `#d5d2d9`,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-[50px]">
              {viewportWidth >= 640 ? null : (
                <Button
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: 1,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                  }}
                  onClick={handleOpenPrescription}
                >
                  <img src={AddIcon} alt="" />
                  <span className="btn1">Add Prescription</span>{" "}
                </Button>
              )}
              <div className="flex flex-row items-center gap-5">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    margin: "16px 0px",
                    width: "250px",
                    height: "48px",
                    padding: "16px 20px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    background: "#614298",
                    fontSize: "14px",
                    fontFamily:"Nunito",
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
                  <span className="btn1">Save</span>
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    margin: "16px 0px",
                    width: "250px",
                    height: "48px",
                    padding: "16px 20px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    textTransform: "capitalize",
                    background: "#ffffff",
                    color:"#614298",
                    fontSize: "14px",
                    fontFamily:"Nunito",
                    "&:hover": {
                      background: "#ffffff",
                      border: "1px solid #614298",
                    },
                    "&:focus": {
                      background: "#ffffff",
                    },
                    "&:active": {
                      background: "#ffffff",
                    },
                  }}
                  onClick={handleclear}
                >
                  <span className="btn1">Cancel</span>{" "}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClientHistory;