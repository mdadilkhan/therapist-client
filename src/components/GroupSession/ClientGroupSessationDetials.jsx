import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constant/ApiConstant";
import LeftArrow from "../../assets/LeftArrow.svg";
import toast from "react-hot-toast";
import ListIcon from "../../assets/List.svg";
import Phone from "../../assets/Phone.svg";
import { getTimeInterval } from "../../constant/constatnt";
import Select from "react-select";
import {
  DialogActions,
  TextField,
  Modal,
  Backdrop,
  Fade,
  Box,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const ClientGroupSessationDetials = () => {
  const { sessationId } = useParams();
  const navigate = useNavigate();
  const [sessationDetials, setSessationDetials] = useState({});










  const getGroupSessationDetials = () => {
    axios
      .post(`${API_URL}/groupSessation/getGroupSessationDetials`, {
        id: sessationId,
      })
      .then((res) => {
        if (res.status === 200) {
          setSessationDetials(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



 

  useEffect(() => {
    getGroupSessationDetials();
   
  }, []);



  return (
    <>
      <div className="pb-4 pt-16 pl-8 pr-16 flex justify-between gap-5">
        <div className="flex justify-center items-center gap-4">
          <div onClick={() => navigate(-1)} className="cursor-pointer">
            <img src={LeftArrow} alt="" />
          </div>
          <div>
            <h5 className="h5-bold">{sessationDetials?.topic}</h5>
          </div>
        </div>
      </div>

      <div className="pb-4 pt-16 pl-8 pr-16 flex flex-col justify-between gap-10 w-full">
        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Description</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.description}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%]">
            <p className="body1-bold">Time intervals</p>
          </div>
          <div className="w-[80%] flex flex-wrap gap-4">
            {Array.isArray(sessationDetials?.dateValue) &&
            sessationDetials?.dateValue.length > 0 ? (
              sessationDetials?.dateValue?.map((date, index) => (
                <div
                  key={index}
                  className="p1-reg px-[10px] py-[14px] rounded-lg bg-[#F4EDFF] text-[#635B73] border border-solid border-[#9C81CC]"
                >
                  {getTimeInterval(date)}
                </div>
              ))
            ) : (
              <p className="body2-reg">No time intervals available</p>
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Language</p>
          </div>
          <div className="w-[80%] flex gap-[22.5%]">
            <p className="body2-reg">{sessationDetials?.language}</p>
            <div className="flex  gap-32">
              <div>
                <p className="body1-bold">Type</p>
              </div>
              <div>
                <p className="body2-reg">{sessationDetials?.type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Duration</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.duration}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Amount</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.amount}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Community</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">{sessationDetials?.community}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] ">
            <p className="body1-bold">Guest Limit</p>
          </div>
          <div className="w-[80%]">
            <p className="body2-reg">
              {sessationDetials?.guestList?.length}/
              {sessationDetials?.guestLimit}
            </p>
          </div>
        </div>
      </div>

    </>
  );
};

export default ClientGroupSessationDetials;
