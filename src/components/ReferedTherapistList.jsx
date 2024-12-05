import React, { useEffect, useState } from 'react'
import LeftArrow from '../assets/LeftArrow.svg'
import DummyImg from "../assets/Frame.png";
import Translate from "../assets/Language.svg";
import CalnedarCheck from "../assets/Calendar1.svg";
import GraduationCap from "../assets/GraduationCap.svg";
import Briefcase from "../assets/Briefcase.svg";
import { Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URI, API_URL } from "../constant/ApiConstant";
import axios from "axios";
import { truncateString } from "../constant/constatnt";
import getMatched from "../assets/GetMatched.svg";

const Header = () => {
  const navigate=useNavigate()
    return (
      <div className="flex  gap-2">
        {/* <img src={LeftArrow} alt="" onClick={()=>{navigate(-1)}} className='cursor-pointer'/> */}
        <h1 className="tet-[#06030D]  text-13xl not-italic font-bold font-quicksand leading-normal tracking-[0.16px]">
          Referred therapists
        </h1>
      </div>
    );
  };

const Card = ({therapist})=>{

   console.log(therapist);
   
  const navigate=useNavigate()
  return(
    <div
    // key={index}
    className="w-[45%] gap-10 rounded-[15px] border border-[#D5D2D9] border-solid ml-[32px] my-8 flex flex-col px-6 py-6 "
  >
    {/* Therapist details */}
    <div className="flex gap-[25px]">
      {/* Therapist image */}
      <div>
        <img src={therapist?.profile_image} alt="" className='w-[210px] h-[250px] rounded-[8px]'/>
      </div>
      {/* Therapist information */}
      <div className="flex flex-col gap-3 justify-center">
        <h2
          className="h6-bold mb-2 cursor-pointer"
          onClick={() =>
            navigate(`/client/therapistprofile/${therapist?._id}`)
          }
        >
          {therapist?.name}
        </h2>
        <h3 className="ovr1-sem text-[#635B73] mb-4">
          {therapist?.profile_details?.specialization}

        </h3>
        {/* Other details */}
        <div className="flex items-center gap-3 mb-2 h-[30px]">
          <img src={GraduationCap} alt="" />
          <h4 className="ovr1-reg text-[#635B73]">
            {therapist?.educational_qualification?.degrees[0]}
          </h4>
        </div>
        <div className="flex items-center gap-3 mb-2 h-[20px]">
          <img src={CalnedarCheck} alt="" />
          <h4 className="ovr1-reg text-[#635B73]">
            <span className="ovr1-bold">Experience :</span>{" "}
            {therapist?.profile_details?.experience}
          </h4>
        </div>
        <div className="flex items-center gap-3 mb-2 h-[20px]">
          <img src={Translate} alt="" />
          <h4 className="ovr1-reg text-[#635B73]">
            <span className="ovr1-bold">Languages :</span>{" "}
            {/* {therapist?.profile_details?.languages.map(
              (language, index) => (
                <span key={index}>{language + " "}</span>
              )
            )} */}
            {therapist?.profile_details?.languages}

          </h4>
        </div>
        <div className="flex items-start gap-3 mb-2 h-[60px]">
          <img src={Briefcase} alt="" />
          <h4 className="ovr1-reg text-[#635B73]">
            <span className="ovr1-bold">Expertise :</span>{" "}
            {therapist?.expertise?.map((language, index) => (
              <span key={index}>{language + " "}</span>
            ))}
          </h4>
        </div>
      </div>
    </div>
    {/* Book now button */}
    <div className="flex justify-between items-center">
      <h2 className="body3-reg">
        Start At :{" "}
        <span>₹{therapist?.sessionPricing?.in_person?.["30"]}</span>
      </h2>
      <button
        className="w-[123px] h-[48px] bg-[#614298] rounded-[8px] border-none text-[#fff] p1-reg cursor-pointer"
        onClick={() =>
          navigate(
            `/client/appointments/therapist/?therapistId=${therapist?._id}`
          )
        }
      >
        Book Now
      </button>
    </div>
  </div>
  )
}
const ReferedTherapistList = () => {
  const [therapist,setTherapist]=useState([])

  useEffect(()=>{
     axios.get(`${API_URL}//getListOfTherapistSuggestedToUser`).then((res)=>{
      if(res.status===200){
        setTherapist(res.data.data)
      }
     }).catch((err)=>{
        console.log(err);
     })
  },[])
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="">
        <Header />
        <div className='flex gap-4 flex-wrap'>
        {
          therapist?.map((item)=>{
            return <>
              <Card therapist={item}/>
            </>
          })
        }
        </div>
      
      </div>
    </div>
  )
}

export default ReferedTherapistList