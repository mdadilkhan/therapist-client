import React, { useState, useEffect } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Button, Drawer } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import Frame from "../../assets/Frame.png";
import axios from "axios";
import { API_URL } from "../../constant/ApiConstant";
import { useNavigate } from "react-router-dom";
import { getTimeInterval } from "../../constant/constatnt";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import GroupTherapyPayment from "./GroupTherapyPayment.jsx";
const Header = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="tet-[#06030D]  text-13xl not-italic font-bold font-quicksand leading-normal tracking-[0.16px]">
        Group Therapy
      </h1>
    </div>
  );
};

const Tabs = () => {
  const [value, setValue] = useState("1");
  const [groupSessation, setGroupSessation] = useState([]);
  const [workshopSessation, setWorkshopSessation] = useState([]);
  const [peertopeerSessation, setPeerToPeerSessation] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getAllSessations();
  }, []);
  const getAllSessations = () => {
    axios
      .get(`${API_URL}/groupSessation/getAllGroupSessionsForClient`)
      .then((res) => {
        if (res.status === 200) {
          setGroupSessation(res.data.groupTherapy);
          setWorkshopSessation(res.data.workshops);
          setPeerToPeerSessation(res.data.peerSupport);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <div className="">
        <div className="">
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                width: "45%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Group Therapy"
                  value="1"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media screen and (min-width: 641px)": {
                      fontSize: "20px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                    },
                  }}
                />
                <Tab
                  label="Workshop"
                  value="2"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media screen and (min-width: 641px)": {
                      fontSize: "20px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                    },
                  }}
                />
                <Tab
                  label="Peer 2 Peer Support"
                  value="3"
                  sx={{
                    color: "#06030D",
                    fontFamily: "Quicksand",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    letterSpacing: "0.1px",
                    textTransform: "capitalize",
                    "@media screen and (min-width: 641px)": {
                      fontSize: "20px",
                    },
                    "&.Mui-selected": {
                      color: "#06030D",
                      fontFamily: "Quicksand",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                      letterSpacing: "0.1px",
                    },
                  }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="flex flex-row gap-4 flex-wrap">
                {groupSessation.map((sessation, ind) => (
                  <Card key={ind} sessation={sessation} />
                ))}
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="flex flex-row gap-4 flex-wrap">
                {workshopSessation.map((sessation, ind) => (
                  <Card key={ind} sessation={sessation} />
                ))}
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="flex flex-row gap-4 flex-wrap">
                {peertopeerSessation.map((sessation, ind) => (
                  <Card key={ind} sessation={sessation} />
                ))}
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  );
};



const Card = ({ sessation }) => {
  const sessionId = sessation._id;
  console.log(sessation,"cbdsjch");
  
  const { id } = useSelector((state) => state.userDetails);

  const navigate = useNavigate();
  const data = {
    sessionId: sessionId,
    amount: sessation.amount,
    type: "group",
    drcr: "debited",
  };

  console.log(data);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col w-[546px] h-[280px] ">
      <div
        className="flex gap-4 w-full cursor-pointer"
        onClick={() => {
          navigate(`/client/client-group-sessation-details/${sessionId}`);
        }}
      >
        <div className="">
          <img
            src={Frame}
            alt="sessation thumbnail"
            className="w-[180px] h-[200px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[#06030D] text-[20px] font-bold font-quicksand leading-normal tracking-[0.1px]">
            {sessation?.topic}
          </p>
          <p className="text-[#635B73] text-sm  font-normal font-nunito leading-normal  tracking-[0.28px] line-clamp-4">
            {sessation?.description}
          </p>
          <div className="flex flex-row gap-1">
            <p className="text-[#07030f] text-sm font-bold not-italic  leading-normal tracking-[0.28px]">
              Duration :{" "}
            </p>
            <span className="text-[#635B73] text-sm font-normal not-italic  tracking-[0.28px]">
              {" "}
              {sessation?.timeSlot} Mins
            </span>
          </div>
          <div className="flex flex-row">
            <p className="text-[#07030f] text-sm font-bold not-italic font-nunito leading-normal tracking-[0.28px]">
              Type:{" "}
            </p>
            <span className="text-[#635B73] text-sm font-normal not-italic font-nunito leading-normal tracking-[0.28px]">
              {" "}
              {sessation?.type}
            </span>
          </div>
          <div className="flex flex-row">
            <p className="text-[#07030f] text-sm font-bold not-italic font-nunito leading-normal tracking-[0.28px]">
              Time slot :{" "}
            </p>
            <span className="text-[#635B73] text-sm font-normal not-italic font-nunito leading-normal tracking-[0.28px]">
              {`(${getTimeInterval(sessation?.dateValue[0])})${
                sessation?.dateValue?.length > 1
                  ? ` +${sessation?.dateValue?.length}`
                  : ""
              }`}
            </span>
          </div>
          {/*          
          <p className=""> </p>
          <p className=""> </p> */}
        </div>
      </div>
      <hr className="bg-[#D5D2D9] my-2" />
      <div className="flex items-center justify-between mt-4">
        <span className="text-[#06030D] font-nunito text-[18px] not-italic font-semibold leading-[26px]">
          Starts at: ₹{sessation?.amount}
        </span>

        {/* Check if guest limit is reached */}
        {sessation?.guestList?.length >= sessation?.guestLimit ? (
          <button className="bg-white border border-solid border-[#E83F40] text-[#E83F40] px-4 py-4 rounded-lg font-semibold cursor-not-allowed">
            Slot Not Available
          </button>
        ) : (
          // Find the current user's guest info in the guestList
          (() => {
            // Replace this with dynamic userId
            const currentGuest = sessation?.guestList?.find(
              (guest) => guest._id === id
            );
            console.log("current guest", currentGuest);
            // If payment is true, show "Join Now" button, else show payment component
            if (currentGuest?.payment) {
              return (
                <a
                  href={sessation?.googleMeet}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-[#614298] border border-solid border-[#614298] text-white px-4 py-4 rounded-lg font-semibold cursor-pointer">
                    Join Now
                  </button>
                </a>
              );
            } else {
              return <GroupTherapyPayment bookingDetails={data} />;
            }
          })()
        )}
      </div>
    </div>
  );
};

{
  /* onClick={clientSignupForGroupTherapy}  */
}
const TherapistGroupSession = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="">
        <Header />
        <Tabs />
      </div>
    </div>
  );
};

export default TherapistGroupSession;
