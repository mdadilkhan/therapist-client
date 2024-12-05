import { useState, useEffect, lazy } from "react";
import axios from "axios";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Briefcase from "../assets/Briefcase.svg";
import BriefcaseBold from "../assets/BriefcaseBold.svg";
import Buildings from "../assets/Buildings.svg";
import UserSwitch from "../assets/UserSwitch.svg";
import Calendar1 from "../assets/Calendar1.svg";
import Designation from "../assets/Designation.svg";
import Email from "../assets/Email.svg";
import FingerprintSimple from "../assets/FingerprintSimple.svg";
import Key from "../assets/Key.svg";
import Language from "../assets/Language.svg";
import Phone from "../assets/Phone.svg";
import DegreeCap from "../assets/DegreeCap.svg";
import { useParams } from "react-router-dom";
import DummyImg from "../assets/Frame.png";
import { API_URL } from "../constant/ApiConstant";

const Navbar = lazy(() => import("./Navbar"));

const TherapistProfile = () => {
  const { therapistId } = useParams();
  const [profileDetails, setProfileDetails] = useState({});
  const getTherapistProfile = () => {
    axios
      .get(`${API_URL}/therapistDetail/${therapistId}`)
      .then((res) => {
        const userProfile = res.data.data;
        if (res.status === 200) {
          setProfileDetails(userProfile);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getTherapistProfile();
  }, []);

  return (
    <>
      <div style={{ padding: "16px 32px" }}>
        <h5 className="h5-bold">Therapist Profile</h5>
      </div>

      <div className="w-full flex justify-evenly gap-[16px] px-[24px] pt-[24px] sm:flex-row flex-col">
        <div className="flex justify-between flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[24px] w-full sm:w-[50%]">
          <div className="w-full flex flex-col gap-16">
            <div className="relative flex sm:justify-start justify-center">
              <img
                className="cursor-pointer w-[168px] h-[168px] object-cover rounded-full"
                width={168}
                src={profileDetails?.profile_image}
                alt=""
              />
            </div>
            <div className="flex w-full justify-between sm:flex-row flex-col">
              <div>
                <h6 className="h6-bold">{profileDetails?.name}</h6>
                <p className="body4-bold">{profileDetails?.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-wrap gap-8 rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[16px] w-full sm:w-[50%]">
          <div>
            <p className="body1-bold">Profile Details</p>
          </div>

          <div style={{ display: "flex", width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "40%",
              }}
            >
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Phone} alt="" />
                <p className="body4-reg">Cont. No.</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Email} alt="" />
                <p className="body4-reg">Email ID</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={UserSwitch} alt="" />
                <p className="body4-reg">Referral Code</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Designation} alt="" />
                <p className="body4-reg">Designation</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Designation} alt="" />
                <p className="body4-reg">Specialization</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Language} alt="" />
                <p className="body4-reg">Language</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Briefcase} alt="" />
                <p className="body4-reg">Experience</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <img src={Buildings} alt="" />
                <p className="body4-reg">Organization</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
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
              <div>
                <p className="body4-reg">
                  {profileDetails?.phone_number}
                </p>
              </div>
              <div>
                <p className="body4-reg truncate">
                  {profileDetails?.email}
                </p>
              </div>
              <div>
                <p className="body4-reg">
                  {profileDetails.profile_details?.referral_code ? profileDetails.profile_details?.referral_code : "####"}
                </p>
              </div>
              <div>
                <p className="body4-reg">
                  {profileDetails.profile_details?.designation}
                </p>
              </div>
              <div>
                <p className="body4-reg">
                  {profileDetails?.profile_details?.specialization}
                </p>
              </div>
              <div>
                <p className="body4-reg">
                  {profileDetails.profile_details?.languages}
                </p>
              </div>
              <div>
                <p className="body4-reg">
                  {profileDetails.profile_details?.experience}
                </p>
              </div>

              <div>
                <p className="body4-reg">{profileDetails?.organization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-evenly gap-[16px] p-[24px] sm:flex-row flex-col">
        <div className="flex justify-between flex-col sm:flex-row flex-wrap rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[24px] w-full sm:w-[50%] h-[5%] gap-8">
          <div className="w-full flex flex-col gap-4">
            <div style={{ display: "flex", gap: 8 }}>
              <img src={DegreeCap} alt="" />
              <p className="body1-bold">Educational Qualification</p>
            </div>
            <p className="body4-reg">
              {profileDetails?.educational_qualification?.degrees?.join(", ")}
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div style={{ display: "flex", gap: 8 }}>
              <img src={BriefcaseBold} alt="" />
              <p className="body1-bold">Expertise</p>
            </div>
            <p className="body4-reg">{profileDetails?.expertise?.join(", ")}</p>
          </div>
        </div>
        <div className="flex flex-col flex-wrap gap-8 rounded-[16px] border border-solid border-[#D5D2D9] bg-[#FCFCFC] p-[16px] w-full sm:w-[50%]">
          <div>
            <p className="body1-bold">Biography</p>
          </div>
          <p className="body4-reg">{profileDetails?.profile_details?.biography}</p>
        </div>
      </div>
    </>
  );
};

export default TherapistProfile;
