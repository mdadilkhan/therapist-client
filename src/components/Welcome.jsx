import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Select, MenuItem, TextField } from "@mui/material";
import Sage from "../assets/sage.svg";
import Back from "../assets/back.svg";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const options = [
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
  { label: "Other", value: "other" },
];

const concernsData = {
  "Academic Pressure": ["Pressure to perform", "Not motivated to take exams"],
  "I am Confused": ["Unsure of my choice", "I feel lost"],
};

const Welcome = ({ open, handleClose,id }) => {
    const navigate=useNavigate();

  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [allTypes, SetAllTypes] = useState([]);
  const [concernLists, setConcernLists] = useState([]);
  const [selectedConcerns, setSelectedConcerns] = useState([]); // Store selected concern IDs
  const [selectedSubConcerns, setSelectedSubConcerns] = useState({});
  const updateProfile = async () => {
    try {
      const response = await axios.post(`${API_URL}/updateUserProfileDetail`, {
        userId: id,
        subConcerns: Object.values(selectedSubConcerns)
          .flat()
          .map((subConcern) => subConcern._id),
        concerns: selectedConcerns?.map((spec) => spec._id) || [],
        userType: type._id,
        name: name,
      });
      toast.success("Concern added successfully");
      console.log(response.data.data, "Profile update successful");
  
      navigate("/client/dashboards");
      handleClose();
    } catch (error) {
      navigate("/client/dashboards");
      console.error("Profile update failed:", error);
      toast.error("Failed to add concern. Please try again.");
    }
  };
  
  const concernList = () => {
    axios
      .post(`${API_URL}/getConcernByRole`, {
        userType: type._id,
      })
      .then((res) => {
        if (res.status == 200) {
          const concerns = res?.data?.data?.concerns;
          setConcernLists(concerns);
          console.log(concernLists,"smdalfmlasdmlfml");
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllUserTypes = () => {
    axios
      .get(`${API_URL}/getAllUserTypes`)
      .then((res) => {
        if (res.status == 200) {
          SetAllTypes(res.data?.userType);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (open == true) {
      concernList();
      getAllUserTypes();
    }
  }, [open]);
  useEffect(() => {
    concernList();
  }, [type]);
 // Store sub-concern IDs per concern

  // Fetch concerns
  useEffect(() => {
    if (type?._id) {
      axios
        .post(`${API_URL}/getConcernByRole`, { userType: type._id })
        .then((res) => {
          if (res.status === 200) {
            setConcernLists(res.data.data.concerns || []);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [type]);

  // Toggle concern selection
  const toggleConcern = (concern) => {
    setSelectedConcerns((prev) =>
      prev.some((c) => c._id === concern._id)
        ? prev.filter((c) => c._id !== concern._id)
        : [...prev, { _id: concern._id, name: concern.concern }]
    );

    // Remove associated sub-concerns when a concern is removed
    if (selectedConcerns.some((c) => c._id === concern._id)) {
      const updatedSubConcerns = { ...selectedSubConcerns };
      delete updatedSubConcerns[concern._id];
      setSelectedSubConcerns(updatedSubConcerns);
    }
  };

  // Toggle sub-concern selection
  const toggleSubConcern = (concernId, subConcern) => {
    setSelectedSubConcerns((prev) => ({
      ...prev,
      [concernId]: prev[concernId]?.some((sc) => sc._id === subConcern._id)
        ? prev[concernId].filter((sc) => sc._id !== subConcern._id)
        : [...(prev[concernId] || []), { _id: subConcern._id, name: subConcern.subConcern }],
    }));
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleContinue = () => {
    if (step === 1 && !type) return alert("Please select an option.");
    if (step === 2 && !name) return alert("Please enter your full name.");
    setStep(step + 1);
        console.log(step,"Number of  step");
        
    if (step >= 3) {
    updateProfile();
      setStep(1);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="p-10 bg-white mx-auto w-[50%] rounded-xl shadow-lg mt-20">
        <div className="p-[5rem] bg-white items-center justify-center mx-auto">
          <div className="flex items-center justify-between cursor-pointer py-6">
            {step > 1 && (
              <button
                className=" py-2 h-[5rem] text-[1.8rem] cursor-pointer bg-[#EADDFF] w-[5rem] rounded-full mb-4"
                onClick={handleBack}
              >
                <img src={Back} alt="Back" />
              </button>
            )}
            {step > 2 && (
              <button
                className=" py-2 h-[5rem]  text-[1.8rem] cursor-pointer bg-[#EADDFF] w-[10rem] rounded-full mb-4"
                onClick={handleContinue}
              >
                Skip
              </button>
            )}
          </div>

          {step === 3 && concernLists?.length > 0 ?(
            <div className="flex flex-col gap-6 font-sans items-center">
            {/* Title */}
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-[4rem] font-sans font-normal">
                What are you here for?
              </p>
            </div>
      
            {/* Selected Concerns & Sub-Concerns */}
            {selectedConcerns.length > 0 && (
              <div className="flex flex-col w-full items-start gap-4">
                {selectedConcerns.map((concern) => (
                  <div key={concern._id} className="w-full">
                    <div className="flex items-center gap-3">
                      <button
                        className="px-4 py-2 bg-[#614298] text-white text-[2.4rem] rounded-full h-[6rem] w-auto"
                        onClick={() => toggleConcern(concern)}
                      >
                        {concern.name} <span className="text-red-700"> x</span>
                      </button>
                    </div>
                    {/* Sub-Concerns */}
                    <div className="flex flex-wrap gap-6 mt-2">
                      {concernLists
                        .find((c) => c._id === concern._id)
                        ?.subConcerns.map((subConcern) => (
                          <button
                            key={subConcern._id}
                            onClick={() => toggleSubConcern(concern._id, subConcern)}
                            className={`px-5 py-2 border rounded-full w-auto cursor-pointer h-[5rem] text-[2.4rem] font-normal ${
                              selectedSubConcerns[concern._id]?.some(
                                (sc) => sc._id === subConcern._id
                              )
                                ? "bg-[#ECFFBF] text-[#655973]"
                                : "border-[#9c81cc] text-[#655973]"
                            }`}
                          >
                            {subConcern.subConcern}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
      
            {/* Separator */}
            {selectedConcerns.length > 0 && (
              <div className="h-[.5rem] w-[10%] rounded-2xl bg-slate-500" />
            )}
      
            {/* Remaining Concerns */}
            <div className="w-full flex flex-wrap gap-6 mt-8">
              <h2 className="text-[2.8rem] font-medium text-gray-700 mb-4">
                Select More Concerns:
              </h2>
              {concernLists
                .filter((concern) => !selectedConcerns.some((c) => c._id === concern._id))
                .map((concern) => (
                  <button
                    key={concern._id}
                    onClick={() => toggleConcern(concern)}
                    className="px-4 py-2 border border-[#9C81CC] cursor-pointer text-[2.4rem] rounded-full h-[6rem] w-auto"
                  >
                    {concern.concern}
                  </button>
                ))}
            </div>
      
            {/* Continue Button */}
            <button
              type="submit"
              className="mt-8 bg-[#614298] text-white py-3 h-[6rem] cursor-pointer rounded-full transition-colors font-medium text-[2.4rem] px-12"
              onClick={() =>{
                handleContinue();
              }}
            >
              Continue
            </button>
          </div>
          ) : step === 1 ? (
            <div className="flex justify-center items-center">
              <div className="w-[70%] flex flex-col items-center">
                <h1 className="text-[5rem] font-sans font-medium text-gray-800">
                  Hi! This is{" "}
                  <span className="text-[#614298]">Sage Turtle</span>
                </h1>
                <p className="text-gray-600 text-[3rem] font-normal">
                  Who are you?
                </p>
                <img src={Sage} className="py-4 mx-auto" />

                <select
                  name="type"
                  value={type?._id || ""} // Ensure we set the value based on _id
                  onChange={(e) => {
                    const selectedType = allTypes.find(
                      (item) => item._id === e.target.value
                    ); // Find the full object
                    setType(selectedType); // Store full object in state
                  }}
                  className="w-[60%] px-4 py-3 cursor-pointer h-[6rem] rounded-xl border border-gray-200 text-[2.4rem]"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {allTypes.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  onClick={handleContinue}
                  className="w-[60%] bg-[#614298] cursor-pointer text-white py-3 h-[6rem] rounded-xl transition-colors font-medium mt-8 text-[2.4rem]"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="w-[70%] flex flex-col items-center">
                <h1 className="text-[5rem] font-sans font-medium text-gray-800">
                  Hi! This is{" "}
                  <span className="text-[#614298]">Sage Turtle</span>
                </h1>

                <h1 className="text-[3rem] font-medium">
                  Enter Your Full Name
                </h1>
                <img src={Sage} className="mx-auto items-start justify-start" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[60%] px-4 py-3 h-[6rem] rounded-xl border border-gray-200 text-[2.4rem]"
                />

                <button
                  onClick={handleContinue}
                  className="w-[60%] bg-[#614298] cursor-pointer text-white py-3 h-[6rem] rounded-xl transition-colors font-medium mt-8 text-[2.4rem]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default Welcome;
