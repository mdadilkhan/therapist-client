import React, { useEffect, useState } from "react";
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

const ListOfTherapist = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedConcern, setSelectedConcern] = useState("");
  const [location, setLocation] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [concern, setConcern] = useState([]);
  const [selectedItemsArray, setSelectedItemsArray] = useState([]);
  const [therapistList, setTherapistList] = useState([]);

  useEffect(() => {
    setSelectedItemsArray([
      selectedGender,
      selectedLocation,
      selectedSpeciality,
      selectedConcern,
    ]);
  }, [selectedGender, selectedLocation, selectedSpeciality, selectedConcern]);

  const ListOfTherapist = () => {
    axios
      .get(`${API_URL}/listOfTherapist`)
      .then((res) => {
        if (res.status == 200) {
          setTherapistList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfConcern = () => {
    axios
      .get(`${API_URL}/getConcern`)
      .then((res) => {
        if (res.status == 200) {
          // Assuming the API response data is an array of objects with a 'name' property
          const concernNames = res.data.data.map((item) => item.name);
          setConcern(concernNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfSpeciality = () => {
    axios
      .get(`${API_URL}/getSpeciality`)
      .then((res) => {
        if (res.status == 200) {
          // Assuming the API response data is an array of objects with a 'name' property
          const specialityNames = res.data.data.map((item) => item.name);
          setSpeciality(specialityNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const ListOfLocation = () => {
    axios
      .get(`${API_URL}/getStateList`)
      .then((res) => {
        if (res.status == 200) {
          const locationNames = res.data.data.map((item) => item.state_name);
          setLocation(locationNames);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    ListOfTherapist();
    ListOfConcern();
    ListOfSpeciality();
    ListOfLocation();
  }, []);

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSpecialityChange = (e) => {
    setSelectedSpeciality(e.target.value);
  };

  const handleConcernChange = (e) => {
    setSelectedConcern(e.target.value);
  };

  const handleDeleteChip = (item) => {
    if (item === selectedGender) {
      setSelectedGender("");
    } else if (item === selectedLocation) {
      setSelectedLocation("");
    } else if (item === selectedSpeciality) {
      setSelectedSpeciality("");
    } else if (item === selectedConcern) {
      setSelectedConcern("");
    }
  };

  // Filter therapists based on selected criteria
  const filteredTherapists = therapistList.filter((therapist) => {
    return (
      (!selectedGender ||
        therapist?.profile_details?.gender.toLowerCase() ===
          selectedGender.toLowerCase()) &&
      (!selectedLocation ||
        therapist?.location?.toLowerCase() ===
          selectedLocation.toLowerCase()) &&
      (!selectedSpeciality ||
        therapist?.profile_details?.specialization.toLowerCase() ===
          selectedSpeciality.toLowerCase()) &&
      (!selectedConcern ||
        therapist?.concerns?.some(
          (concern) => concern.toLowerCase() === selectedConcern.toLowerCase()
        ))
    );
  });

  return (
    <div
      style={{
        padding: "16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h5 className="h5-bold ml-[32px]">Appointments</h5>

      <div className="flex w-[564px] p-4 items-start gap-[14px] sm:w-[45%] h-[335px] sm:h-[174px] rounded-[15px] bg-[#F4EDFF] shadow-custom ml-[32px] my-0 sm:my-8  sm:flex-row flex-col  px-4 py-6 relative ">
        <div className="flex items-center gap-12">
          <img
            src={getMatched}
            alt=""
            className="w-[181px] flex-shrink-0 self-stretch rounded-[8px]"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div>
            <h1 className="h6-bold hidden sm:block">Get Matched</h1>
          </div>
          <div>
            <h1 className="ovr1-bold">
              Preliminary consultation, help us find the perfect therapist for
              you
            </h1>
          </div>
        </div>

        <button
          className="w-[123px] h-[48px] bg-[#614298] rounded-[8px] border-none text-[#fff] p1-reg absolute bottom-7 left-[37%] cursor-pointer flex px-5 py-4 justify-center items-center gap-2"
          onClick={() => navigate("/client/appointments")}
        >
          Book Now
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-5 ml-[32px]">
        <h2 className="body3-sem">Filters :</h2>
        {/* Gender filter */}
        <div style={{ width: "15%", display: "flex", flexDirection: "column" }}>
          <select
            id="genderSelect"
            className="custom-select"
            value={selectedGender}
            onChange={handleGenderChange}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Location filter */}
        <div style={{ width: "15%", display: "flex", flexDirection: "column" }}>
          <select
            id="locationSelect"
            className="custom-select"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">Location</option>
            {/* Populate location options */}
            {location.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        {/* Speciality filter */}
        <div style={{ width: "15%", display: "flex", flexDirection: "column" }}>
          <select
            id="specialitySelect"
            className="custom-select"
            value={selectedSpeciality}
            onChange={handleSpecialityChange}
          >
            <option value="">Speciality</option>
            {/* Populate location options */}
            {speciality.map((Speciality, index) => (
              <option key={index} value={Speciality}>
                {Speciality}
              </option>
            ))}
          </select>
        </div>
        {/* Concern filter */}
        <div style={{ width: "15%", display: "flex", flexDirection: "column" }}>
          <select
            id="concernSelect"
            className="custom-select"
            value={selectedConcern}
            onChange={handleConcernChange}
          >
            <option value="">Concern</option>
            {concern.map((Concern, index) => (
              <option key={index} value={Concern}>
                {Concern}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected chips */}
      <div>
        <Stack direction="row" spacing={1} className="ml-[100px]">
          {selectedItemsArray
            .filter((item) => item)
            .map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleDeleteChip(item)}
                className="filterChip"
              />
            ))}
        </Stack>
      </div>

      {/* Therapist list */}
      <div className="flex flex-wrap">
        {filteredTherapists.map((therapist, index) => (
          <div
            key={index}
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
                    {therapist?.profile_details?.experience} years
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
        ))}
      </div>
    </div>
  );
};

export default ListOfTherapist;
