import { useState, useEffect, lazy, Suspense, useRef } from "react";
import axios from "axios";
const Navbar = lazy(() => import("../Navbar"));
import { useNavigate } from "react-router-dom";
import EditIconList from "../../assets/EditIconList.svg";
import Briefcase from "../../assets/Briefcase.svg";
import Buildings from "../../assets/Buildings.svg";
import Calendar1 from "../../assets/Calendar1.svg";
import Designation from "../../assets/Designation.svg";
import Email from "../../assets/Email.svg";
import FingerprintSimple from "../../assets/FingerprintSimple.svg";
import Key from "../../assets/Key.svg";
import Language from "../../assets/Language.svg";
import Phone from "../../assets/Phone.svg";
import DegreeCap from "../../assets/DegreeCap.svg";
import EditProfileIcon from "../../assets/EditProfile.svg";
import { API_URL } from "../../constant/ApiConstant";

import {
  Button,
  colors,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Select,
} from "@mui/material";
import { getformatedDate } from "../../constant/constatnt";
import toast from "react-hot-toast";
import DatePicker from "react-date-picker";

const editButtonStyle = {
  display: "flex",
  width: "196px",
  gap: 0.5,
  height: "48px",
  borderRadius: "8px",
  border: "1px solid #614298",
  textTransform: "capitalize",
  color: "#614298",
  "@media (max-width: 640px)": {
    width: "50%",
    marginTop: "10px",
  },
};

const ProfileDetails = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);

  const [indianStates, setIndianStates] = useState([]);

  const ListOfLocation = () => {
    axios
      .get(`${API_URL}/getStateList`)
      .then((res) => {
        if (res.status == 200) {
          const locationNames = res.data.data.map((item) => item.state_name);
          setIndianStates(locationNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
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
  const updateProfilePicture = async (imageUrl) => {
    try {
      const res = await axios.post(`${API_URL}/uploadProfilePicture`, {
        imageUrl: imageUrl,
      });
      if (res.status === 200) {
        console.log("Profile picture updated successfully", res);
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture", error);
      throw error;
    }
  };

  const getImageUrl = async () => {
    try {
      const { url, imageName } = await getSignedUrl();
      await uploadImageToS3(url);
      const imageUrl = `https://corportal.s3.ap-south-1.amazonaws.com/upload/profilePic/${imageName}`;
      await updateProfilePicture(imageUrl);
      getProfileDetails();
    } catch (error) {
      console.error("Error in image upload process", error);
      alert("Error uploading file");
    }
  };

  useEffect(() => {
    ListOfLocation();
  }, []);
  useEffect(() => {
    if (image) {
      getImageUrl();
    }
  }, [image]);

  const [editProfile, setEditProfile] = useState(false);
  const [show, setShow] = useState(true);
  const [profileDetails, setProfileDetails] = useState({});
  const [expertss, setExpertList] = useState([]);
  const [concernss, setconcertList] = useState([]);
  const [updateProfile, setUpdateProfile] = useState({
    concerns: [],
    expertise: [],
    educationQualification: [],
  });

  const navigate = useNavigate();
  const expertList = () => {
    axios
      .get(`${API_URL}//getSpeciality`)
      .then((res) => {
        if (res.status == 200) {
          const experts = res.data.data.map((item) => item.name);
          console.log(experts, "OOOOOOOOOOOO");
          setExpertList(experts);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const concernList = () => {
    axios
      .get(`${API_URL}/getConcern`)
      .then((res) => {
        if (res.status == 200) {
          const concerns = res.data.data.map((item) => item.name);
          setconcertList(concerns);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setUpdateProfile((prevProfile) => {
      const newConcerns = prevProfile?.concerns?.includes(value)
        ? prevProfile.concerns?.filter((item) => item !== value)
        : [...(prevProfile?.concerns || []), value];
      return {
        ...prevProfile,
        concerns: newConcerns,
      };
    });
  };
  const handleCheckboxChange1 = (event) => {
    const value = event.target.value;
    setUpdateProfile((prevProfile) => {
      const newExpertise = prevProfile?.expertise?.includes(value)
        ? prevProfile.expertise.filter((item) => item !== value)
        : [...(prevProfile?.expertise || []), value]; // Provide fallback empty array

      return {
        ...prevProfile,
        expertise: newExpertise,
      };
    });
  };

  const handleEditProfile = () => {
    setEditProfile(true);
    setShow(false);

    const data = {
      name: profileDetails.name,
      phoneNumber: profileDetails.phone_number,
      email: profileDetails.email,
      gender: profileDetails.profile_details?.gender,
      dob: profileDetails.profile_details?.dob,
      languages: profileDetails.profile_details?.languages,
      specialization: profileDetails.profile_details?.specialization,
      designation: profileDetails.profile_details?.designation,
      googleMeetLink: profileDetails.profile_details?.google_meet_link,
      biography: profileDetails.profile_details?.biography,
      experience: profileDetails.profile_details?.experience,
      address: profileDetails.profile_details?.address,
      city: profileDetails.profile_details?.city,
      state: profileDetails.profile_details?.state,
      educationQualification: profileDetails.educational_qualification?.degrees,
      organiztion: profileDetails.organization,
      concerns: profileDetails.concerns,
      expertise: profileDetails.expertise,
      accountHolderName:
        profileDetails.bank_details?.account_holder_name,
      accountNumber: profileDetails.bank_details?.account_number,
      bankName: profileDetails.bank_details?.bank_name,
      branchAddress: profileDetails.bank_details?.branch_address,
      ifscCode: profileDetails.bank_details?.ifsc_code,
    };

    setUpdateProfile(data);
  };
  const cancelEditMode = () => {
    setEditProfile(false);
    setShow(true);
  };

  const getProfileDetails = () => {
    axios
      .get(`${API_URL}/getProfileDetail`)
      .then((res) => {
        if (res.status === 200) {
          setProfileDetails(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/updateTherapistDetail`, updateProfile)
      .then((res) => {
        if (res.status === 200) {
          // handleClose();
          toast.success(`your profile has been updated`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });
          getProfileDetails();
          setEditProfile(false);
          setShow(true);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  useEffect(() => {
    getProfileDetails();
    concernList();
    expertList();
  }, []);

  const handelChage = (e) => {
    const { name, value } = e.target;
    setUpdateProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDOBChange = (date) => {
    setUpdateProfile({
      ...updateProfile,
      dob: date,
    });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    const qualificationsArray = value.trim().split(/\s+/).filter(Boolean);

    setUpdateProfile((prevProfile) => ({
      ...prevProfile,
      educationQualification: qualificationsArray,
    }));
  };
  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <h5 className="h5-bold">Profile Details</h5>
      </div>

      <div className="w-full flex justify-evenly gap-[16px] p-[24px] sm:flex-row flex-col">
        <div
          className={`flex justify-between flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[24px] h-[300px] w-full sm:w-[${
            !show ? "100%" : "50%"
          }]`}
        >
          <div className="flex flex-col gap-16 w-full">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <div className="relative flex sm:justify-start justify-center">
              <img
                className="cursor-pointer w-[168px] h-[168px] object-cover rounded-full"
                onClick={() => {
                  fileRef.current.click();
                }}
                width={168}
                src={profileDetails.profile_image}
                alt=""
              />
              <img
                className="absolute left-[0%] top-[0%] cursor-pointer w-[168px] opacity-0 hover:opacity-50"
                onClick={() => {
                  fileRef.current.click();
                }}
                src={EditProfileIcon}
                alt=""
              />
            </div>
            <div className="flex w-full flex-col sm:flex-row justify-between w-full">
              <div>
                <h6 className="h6-bold">{profileDetails.name}</h6>
                <p className="body4-bold">{profileDetails.email}</p>
              </div>
              <div className="mt-auto">
                {editProfile ? (
                  <span>Edit Mode</span>
                ) : (
                  <Button
                    variant="outlined"
                    sx={editButtonStyle}
                    onClick={handleEditProfile}
                  >
                    <img src={EditIconList} alt="" />
                    <span className="btn1">Edit Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {show ? (
          <div className="flex flex-col gap-8 w-full sm:w-[50%]">
            {/* Biography Section */}

            {/* Profile Details Section */}
            <div className="flex flex-col gap-8 rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[16px] h-[300px]">
              <div>
                <p className="body1-bold">Profile Details</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px",
                }}
              >
                {/* Labels Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "40%",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Phone} alt="Phone icon" />
                    <p className="body4-reg">Cont. No.</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Email} alt="Email icon" />
                    <p className="body4-reg">Email ID</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Designation} alt="Designation icon" />
                    <p className="body4-reg">Designation</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Language} alt="Language icon" />
                    <p className="body4-reg">Language</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Briefcase} alt="Briefcase icon" />
                    <p className="body4-reg">Experience</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={FingerprintSimple} alt="Login ID icon" />
                    <p className="body4-reg">Login ID</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={Calendar1} alt="Calendar icon" />
                    <p className="body4-reg">Added On:</p>
                  </div>
                </div>

                {/* Values Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "60%",
                  }}
                >
                  <div>
                    <p className="body4-reg">
                      {profileDetails?.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="body4-reg">{profileDetails?.email}</p>
                  </div>
                  <div>
                    <p className="body4-reg">
                      {profileDetails?.profile_details?.designation}
                    </p>
                  </div>
                  <div>
                    <p className="body4-reg">
                      {profileDetails?.profile_details?.languages}
                    </p>
                  </div>
                  <div>
                    <p className="body4-reg">
                      {profileDetails?.profile_details?.experience}
                    </p>
                  </div>
                  <div>
                    <p className="body4-reg">{profileDetails?.email}</p>
                  </div>
                  <div>
                    <p className="body4-reg">
                      {getformatedDate(profileDetails?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {show ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#FCFCFC",
              padding: "0 16px 16px 16px",
              margin: "0 10px 0px 10px",
              gap: "16px",
            }}
          >
            <div className="flex justify-between gap-3 flex-row flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[10px] w-[50%]">
              <div style={{ display: "flex flex-row", gap: 2 }}>
                <p className="body1-bold">Expertise</p>
              </div>
              <div className="body4-reg flex flex-row  gap-4 flex-shrink flex-wrap">
                {profileDetails?.expertise?.length > 0 ? (
                  profileDetails?.expertise.map((expertise, index) => (
                    <div key={index} className="p-1  rounded-md">
                      {expertise}
                    </div>
                  ))
                ) : (
                  <p>No expertise available</p>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3 flex-col flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[24px] w-[50%]">
              <div style={{ display: "flex", gap: 8 }}>
                <img src={DegreeCap} alt="" />
                <p className="body1-bold">Educational Qualification</p>
              </div>
              <p className="body4-reg">
                {profileDetails?.educational_qualification?.degrees}
              </p>
            </div>
          </div>
          <div className="ml-10 w-[47.5%] flex flex-col gap-8 rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[16px] font-bold">
            <h1>Biography</h1>
            <p className="body4-reg">
              {profileDetails?.profile_details?.biography}
            </p>
          </div>
        </>
      ) : (
        ""
      )}
      {show ? (
        ""
      ) : (
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
              border: "1px solid #D5D2D9",
              background: "#FCFCFC",
              padding: "16px",
            }}
          >
            <form
              onSubmit={handleSubmitForm}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Name
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="name"
                    value={updateProfile?.name}
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
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Phone
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="phoneNumber"
                    value={updateProfile.phoneNumber}
                    onChange={handelChage}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*",
                    }}
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
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Email
                  </label>
                  <TextField
                    fullWidth
                    type="email"
                    required
                    name="email"
                    value={updateProfile?.email}
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

              <div style={{ display: "flex", gap: 25 }}>
                <div
                  style={{
                    width: "32%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Gender
                  </label>
                  <select
                    id="mySelect"
                    className="custom-select"
                    name="gender"
                    value={updateProfile?.gender}
                    onChange={handelChage}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Date of Birth
                  </label>
                  <DatePicker onChange={handleDOBChange} value={updateProfile.dob} />
                </div>

                {/* <div
                  style={{
                    width: "32%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Designation
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="designation"
                    value={updateProfile.designation}
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
                </div> */}
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Languages
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="languages"
                    value={updateProfile?.languages}
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Specilization
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="specialization"
                    value={updateProfile?.specialization}
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
                <div
                  style={{
                    width: "32%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Designation
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="designation"
                    value={updateProfile?.designation}
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
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Google meet Link
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="googleMeetLink"
                    value={updateProfile?.googleMeetLink}
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "32%",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Educational Qualification
                  </label>
                  <textarea
                    style={{ width: "100%", borderRadius: "8px" }}
                    id="myTextArea"
                    rows="4"
                    cols="500"
                    name="educationQualification"
                    value={updateProfile?.educationQualification}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "32%",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Biogarphy
                  </label>
                  <textarea
                    style={{ width: "100%", borderRadius: "8px" }}
                    id="myTextArea"
                    rows="4"
                    cols="500"
                    name="biography"
                    value={updateProfile?.biography}
                    onChange={handelChage}
                  ></textarea>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "32%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: "60px", // Optional spacing between elements
                    }}
                  >
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Experience
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "50px",
                      }} // Added height to make equal
                      id="myTextArea"
                      rows="4"
                      cols="500"
                      name="experience"
                      value={updateProfile?.experience}
                      onChange={handelChage}
                    ></textarea>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: "60px", // Optional spacing between elements
                    }}
                  >
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Organisation
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "50px",
                      }} // Added height to make equal
                      id="myTextArea"
                      rows="4"
                      cols="500"
                      name="organiztion"
                      value={updateProfile?.organiztion}
                      onChange={handelChage}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div style={{ width: "100%", height: "75px" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Address
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="address"
                    value={updateProfile?.address}
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    City
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="city"
                    value={updateProfile?.city}
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
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    State
                  </label>
                  <Select
                    fullWidth
                    name="state"
                    value={updateProfile?.state || ""} // Default to an empty string if no value is selected
                    onChange={(e) =>
                      handelChage({
                        target: {
                          name: "state",
                          value: e.target.value,
                        },
                      })
                    }
                    displayEmpty
                    sx={{
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
                    }}
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontSize: "12px",
                          fontFamily: "Nunito",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "24px",
                          letterSpacing: "0.08px",
                        }}
                      >
                        Select a State
                      </em>
                    </MenuItem>
                    {indianStates.map((state) => (
                      <MenuItem
                        sx={{
                          fontSize: "18px",
                          fontFamily: "Nunito",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          letterSpacing: "0.08px",
                        }}
                        key={state}
                        value={state}
                      >
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="w-full">
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Initial Concern
                  </label>
                  <div
                    style={{
                      display: "grid",
                      //  gridTemplateColumns: "repeat(2, 1fr)",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {concernss.map((concern) => (
                      <FormControlLabel
                        key={concern}
                        control={
                          <Checkbox
                            value={concern}
                            checked={updateProfile?.concerns?.includes(concern)}
                            onChange={handleCheckboxChange}
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
                  </div>
                </div>

                <div className="w-full">
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Expertise
                  </label>
                  <div
                    style={{
                      display: "grid",
                      //  gridTemplateColumns: "repeat(2, 1fr)",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {expertss.map((expert) => (
                      <FormControlLabel
                        key={expert}
                        control={
                          <Checkbox
                            value={expert}
                            checked={updateProfile?.expertise?.includes(expert)}
                            onChange={handleCheckboxChange1}
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
                            {expert}
                          </span>
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="p2-bold text-6xl">Account Details</p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "32%" }}>
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Account Holder Name
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="accountHolderName"
                      value={updateProfile?.accountHolderName}
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
                  <div style={{ width: "32%" }}>
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Account Number
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="accountNumber"
                      value={updateProfile?.accountNumber}
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
                  <div style={{ width: "32%" }}>
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Bank Name
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="bankName"
                      value={updateProfile?.bankName}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-end",
                    gap: "22px",
                  }}
                >
                  <div style={{ width: "32%" }}>
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      Branch Address
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="branchAddress"
                      value={updateProfile?.branchAddress}
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
                  <div style={{ width: "32%" }}>
                    <label className="p2-sem" style={{ color: "#4A4159" }}>
                      IFSC Code
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      name="ifscCode"
                      value={updateProfile?.ifscCode}
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
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 20,
                  marginTop: "50px",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "368px",
                    height: "48px",
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
                  <span className="btn1">Update Profile</span>
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    width: "368px",
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #614298",
                    color: "#614298",
                    textTransform: "capitalize",
                  }}
                  onClick={cancelEditMode}
                >
                  <span className="btn1">Cancel</span>{" "}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;
