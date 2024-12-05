import React, { useState } from "react";
import LeftArrow from "../../assets/LeftArrow.svg";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { getformatedDate, getTimeInterval } from "../../constant/constatnt";
import { useDispatch } from "react-redux";
import { groupsessationDetails } from "../../store/slices/groupsessationSlice";
import axios from "axios";
import { API_URL } from "../../constant/ApiConstant";
import toast from "react-hot-toast";

const ScheduleSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessationSlot, setSessationSlot] = useState([]);
  const [formData, setFormData] = useState({
    category: "Group therapy",
    type: "Online",
    duration: "60 Mins",
    topic: "",
    description: "",
    timeSlot: "30",
    dateValue: sessationSlot,
    time: "12:00",
    language: "English",
    community: "N/A",
    guestLimit: "",
    googleMeet: "",
  });
 


  console.log(sessationSlot);

  // const handleRemoveSlot = (indexToRemove) => {
  //   setSessationSlot((prevSlots) =>
  //     prevSlots.filter((_, index) => index !== indexToRemove)
  //   );
  // };
  const handleRemoveSlot = (indexToRemove) => {
    const updatedSlots = sessationSlot.filter((_, index) => index !== indexToRemove);
  
    // Update the session slot and form data synchronously
    setSessationSlot(updatedSlots);
    setFormData((prevData) => ({
      ...prevData,
      dateValue: updatedSlots,
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddInterval = () => {
    const newSlot = {
      date: getformatedDate(selectedDate),
      time: formData.time,
    };

    // Add the new slot to the array
    const updatedSlots = [...sessationSlot, newSlot];

    // Update the sessationSlot state
    setSessationSlot(updatedSlots);

    // Update the formData with the new array
    setFormData((prevData) => ({
      ...prevData,
      dateValue: updatedSlots,
    }));
  };

  const createSessation = () => {
    axios
      .post(`${API_URL}/groupSessation/createGroupSessation`, formData)
      .then((res) => {
        if (res.status === 200) {
          const sessionId = res.data.sessionId;
          navigate(`/therapist/add-client-in-sessation/${sessionId}`);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error("All field are required");
        }
        console.log(err);
      });
  };

  return (
    <div className="p-10">
      <div className="flex items-center gap-6 mb-12">
        <div className=" flex items-center">
          <img
            src={LeftArrow}
            alt=""
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>

        <div className="flex items-center">
          <h6 className="text-13xl font-bold text-[#06030D] not-italic  font-quicksand leading-normal tracking-[0.16px]">
            Schedule a Session
          </h6>
        </div>
      </div>

      <div className="mb-6 gap-24 flex">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Category
        </h6>
        <div className="flex gap-[6.5rem]">
          {["Group therapy", "Workshop", "Peer 2 peer support"].map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                value={item}
                checked={formData.category === item}
                onChange={handleInputChange}
                className="appearance-none w-6 h-6 border border-solid border-[#614298] rounded-full checked:bg-[#614298]"
              />
              <span className="text-[#06030D] text-[18px] not-italic font-semibold leading-6">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-12 flex gap-[110px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Type
        </h6>
        <select
          name="type"
          className="w-[236px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none "
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value="Online" className="">
            Online
          </option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="mb-12 flex gap-[103px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Topic
        </h6>
        <input
          name="topic"
          type="text"
          className="w-full  h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
          placeholder="Enter topic"
          value={formData.topic}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-12 flex gap-[35px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Description
        </h6>
        <textarea
          name="description"
          className="w-full p-4 border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
          rows="4"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-12 flex flex-col gap-[58px] ">
        <div className="flex gap-[58px]">
          <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
            Time Slot
          </h6>

          <div className="flex flex-col mt-4">
            <select
              name="timeSlot"
              className="w-[236px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
              value={formData.timeSlot}
              onChange={handleInputChange}
            >
              <option value="30" className="">
                30 Min
              </option>
              <option value="50">50 Min</option>
              <option value="60">60 Min</option>
            </select>
          </div>
        </div>

        <div className="flex  flex-col  gap-10">
          <div className="flex ml-[165px] gap-20">
            <div className="w-[206px]">
              <DatePicker onChange={handleDateChange} value={new Date()} />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#7355A8] font-nunito text-base not-italic font-normal leading-6 tracking-[0.08px]">
                Time
              </span>
              <input
                name="time"
                type="time"
                className="w-[150px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none text-[#06030D] focus:ring-2 focus:ring-[#614298] shadow-sm"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>

            <button
              className="w-[177px] px-4 py-3 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298]  rounded-xl cursor-pointer"
              onClick={handleAddInterval}
            >
              Add Time Interval
            </button>
          </div>
          <div className="ml-[165px] flex gap-4 flex-wrap">
            {Array.isArray(sessationSlot) && sessationSlot.length > 0 ? (
              sessationSlot?.map((date, index) => (
                <div
                  key={index}
                  className="w-fit flex items-center gap-2 p1-reg px-[10px] py-[14px] rounded-xl bg-[#F2F2F2] text-[#635B73]"
                >
                  <p>{getTimeInterval(date)}</p>
                  <button
                    className="w-[25px] h-[25px] border-none  text-[#635B73] cursor-pointer"
                    onClick={() => handleRemoveSlot(index)}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="body2-reg"></p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-12 flex gap-[50px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Language
        </h6>
        <select
          name="language"
          className="w-[236px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
          value={formData.language}
          onChange={handleInputChange}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>

      <div className="mb-12 flex gap-[30px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Community
        </h6>
        <select
          name="community"
          className="w-[236px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
          value={formData.community}
          onChange={handleInputChange}
        >
          <option value="N/A">N/A</option>
          <option value="Community 1">Community 1</option>
        </select>
      </div>

      <div className="mb-12 flex gap-[30px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Guest Limit
        </h6>
        <input
          name="guestLimit"
          type="number"
          className="w-[236px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none text-[#06030D] focus:outline-none focus:ring-[#614298] shadow-sm"
          value={formData.guestLimit}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-12 flex  gap-[22px]">
        <h6 className="text-[#06030D] text-[24px] not-italic font-semibold leading-normal tracking-[0.12px]">
          Google Meet
        </h6>
        <input
          name="googleMeet"
          type="text"
          className="w-[400px] h-[48px] p-4 border border-solid border-[#D5D2D9] bg-[#FCFCFC] rounded-lg outline-none"
          placeholder="Meet Link"
          value={formData.googleMeet}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex space-x-4">
        <button
          className="w-[120px] px-5 py-4 bg-[#614298] text-[#FCFCFC] border border-solid border-[#614298]  rounded-xl cursor-pointer"
          onClick={() => {
            dispatch(groupsessationDetails(formData));
            createSessation();
          }}
        >
          Proceed
        </button>
        <button
          className="w-[120px] px-5 py-4 bg-[#fcfcfc] text-[#614298] rounded-xl border border-solidborder-[#614298] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ScheduleSession;
