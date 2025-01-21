import { useState, useEffect, lazy, Suspense, useRef } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import EditIconList from "../assets/EditIconList.svg";
import Briefcase from "../assets/Briefcase.svg";
import Buildings from "../assets/Buildings.svg";
import Calendar1 from "../assets/Calendar1.svg";
import Designation from "../assets/Designation.svg";
import Email from "../assets/Email.svg";
import FingerprintSimple from "../assets/FingerprintSimple.svg";
import Key from "../assets/Key.svg";
import Language from "../assets/Language.svg";
import Phone from "../assets/Phone.svg";
import DegreeCap from "../assets/DegreeCap.svg";
import EditIcon from "../assets/EditProfileIcon.svg";
import { API_URL } from "../constant/ApiConstant";
import { useDispatch } from "react-redux";
import { userDetails } from "../store/slices/userSlices";

import { Button, TextField } from "@mui/material";
import { getformatedDate } from "../constant/constatnt";
import DatePicker from "react-date-picker";

const editButtonStyle = {
  display: "flex",
  width: "196px",
  gap: 0.5,
  height: "48px",
  borderRadius: "8px",
  border: "1px solid #614298",
  color: "#614298",
  textTransform: "capitalize",
  "@media (max-width: 640px)": {
    width: "50%",
    marginTop: "10px",
  },
};

const ClientProfileDetails = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [editProfile, setEditProfile] = useState(false);
  const [show, setShow] = useState(true);
  const [profileDetails, setProfileDetails] = useState({});
  const [updateProfile, setUpdateProfile] = useState({});
  const [stateList, setStateList] = useState([]);
  const [image, setImage] = useState(null);
  const ListOfLocation = () => {
    axios
      .get(`${API_URL}/getStateList`)
      .then((res) => {
        if (res.status == 200) {
          const locationNames = res.data.data.map((item) => item.state_name);
          setStateList(locationNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    ListOfLocation();
  }, []);

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
          "Content-Type": image.type,
          Authorization: undefined,
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
    if (image) {
      getImageUrl();
    }
  }, [image]);

  const getStateList = () => {
    axios
      .get(`${API_URL}/getStateList`)
      .then((res) => {
        if (res.data.success === true) {
          setStateList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleEditProfile = () => {
    setEditProfile(true);
    setShow(false);
    setUpdateProfile({
      name: profileDetails?.name || "",
      email: profileDetails?.email || "",
      phoneNumber: profileDetails?.phone_number || "",
      gender: profileDetails?.profile_details?.gender || "",
      designation: profileDetails?.designation || "",
      bloodGroup: profileDetails?.profile_details?.blood_group || "",
      address: profileDetails?.profile_details?.address || "",
      city: profileDetails?.profile_details?.city || "",
      state: profileDetails?.profile_details?.state || "",
      dob: profileDetails?.profile_details?.dob || "",
    });
  };
  const cancelEditMode = () => {
    setEditProfile(false);
    setShow(true);
  };

  const navigate = useNavigate();

  const handleDOBChange = (date) => {
    setUpdateProfile({
      ...updateProfile,
      dob: date,
    });
  };

  const getProfileDetails = () => {
    axios
      .get(`${API_URL}/getProfileDetail`)
      .then((res) => {
        const userProfile = res.data.data;
        if (res.status === 200) {
          setProfileDetails(userProfile);
          dispatch(userDetails(userProfile));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/updateUserProfileDetail`, updateProfile)
      .then((res) => {
        if (res.status == 200) {
          setEditProfile(false);
          setShow(true);
          cancelEditMode();
          getProfileDetails();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  useEffect(() => {
    getProfileDetails();
    getStateList();
  }, []);

  const handelChage = (e) => {
    setUpdateProfile({
      ...updateProfile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <h5 className="h5-bold">Profile Details</h5>
      </div>

      <div className="w-full flex justify-evenly gap-[16px] p-[24px] sm:flex-row flex-col">
        <div
          className={`flex justify-between flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[24px] w-full sm:w-[${
            !show ? "100%" : "50%"
          }]`}
        >
          <div class="w-full flex flex-col gap-16">
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
                src={profileDetails?.profile_image}
                alt=""
              />
              <img
                  className="absolute left-[75%] top-[70%] cursor-pointer"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                  src={EditIcon}
                  alt=""
                />
            </div>
            <div className="flex w-full justify-between sm:flex-row flex-col">
              <div>
                <h6 className="h6-bold">{profileDetails.name}</h6>
                <p className="body4-bold">{profileDetails.email}</p>
              </div>
              <div>
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
          <div className="flex flex-col flex-wrap gap-8 rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[16px] w-full sm:w-[50%]">
            <div>
              <p className="body1-bold">Profile Details</p>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "40%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Phone} alt="" />
                  <p className="body4-reg">Client Id</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Phone} alt="" />
                  <p className="body4-reg">Cont. No.</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Email} alt="" />
                  <p className="body4-reg">Email ID</p>
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Designation} alt="" />
                  <p className="body4-reg">Designation</p>
                </div> */}
                {/* <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Buildings} alt="" />
                  <p className="body4-reg">Organisation Name</p>
                </div> */}
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Buildings} alt="" />
                  <p className="body4-reg">Address</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={FingerprintSimple} alt="" />
                  <p className="body4-reg">Login ID</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Key} alt="" />
                  <p className="body4-reg">Password</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <img src={Calendar1} alt="" />
                  <p className="body4-reg">Added On:</p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "60%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">{profileDetails?._id}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">{profileDetails?.phone_number}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">{profileDetails?.email}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">
                    {profileDetails?.profile_details?.address}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">{profileDetails?.email}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">##########</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: "20px",
                    alignItems: "center",
                  }}
                >
                  <p className="body4-reg">
                    {getformatedDate(profileDetails?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

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
                    value={updateProfile.name}
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
                    disabled
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
                    value={updateProfile.email}
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
                    Date of Birth
                  </label>
                  <DatePicker onChange={handleDOBChange} value={updateProfile.dob} />
                </div>
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
                    required
                    value={updateProfile.gender}
                    onChange={handelChage}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div
                  style={{
                    width: "32%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    Blood Group
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="bloodGroup"
                    value={updateProfile.bloodGroup}
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
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <label className="p2-sem" style={{ color: "#4A4159" }}>
                  Address
                </label>
                <textarea
                  style={{ width: "100%", borderRadius: "8px" }}
                  id="myTextArea"
                  rows="4"
                  cols="500"
                  name="address"
                  value={updateProfile?.address}
                  onChange={handelChage}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    States/UT
                  </label>
                  <select
                    id="mySelect"
                    className="custom-select w-full"
                    name="state"
                    value={updateProfile?.state}
                    onChange={handelChage}
                  >
                    {stateList.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                    ;
                  </select>
                </div>
                <div style={{ width: "32%" }}>
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    City
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="city"
                    value={updateProfile.city}
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
                    Pin Code
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    required
                    name="pinCode"
                    value={updateProfile.pinCode}
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
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 20,
                  marginTop: "50px",
                }}
              >
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

export default ClientProfileDetails;
