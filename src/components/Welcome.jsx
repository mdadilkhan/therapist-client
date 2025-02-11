import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import Sage from "../assets/sage.svg";
import Back from "../assets/back.svg";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tag } from "antd";

const Welcome = ({ open, handleClose, id }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [allTypes, SetAllTypes] = useState([]);
  const [concernLists, setConcernLists] = useState([]);
  const [activeConcern, setActiveConcern] = useState(null);
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
          console.log(concernLists, "smdalfmlasdmlfml");
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

  const toggleConcern = (concern) => {
    if (!selectedConcerns.some((c) => c._id === concern._id)) {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
    setActiveConcern(concern._id);
  };

  const removeConcern = (concernId) => {
    setSelectedConcerns(selectedConcerns.filter((c) => c._id !== concernId));
    const newSubConcerns = { ...selectedSubConcerns };
    delete newSubConcerns[concernId];
    setSelectedSubConcerns(newSubConcerns);
    if (activeConcern === concernId) setActiveConcern(null);
  };

  const toggleSubConcern = (concernId, subConcern) => {
    setSelectedSubConcerns((prev) => {
      const currentSubConcerns = prev[concernId] || [];
      const exists = currentSubConcerns.some((sc) => sc._id === subConcern._id);
      return {
        ...prev,
        [concernId]: exists
          ? currentSubConcerns.filter((sc) => sc._id !== subConcern._id)
          : [...currentSubConcerns, subConcern],
      };
    });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleContinue = () => {
    if (step === 1 && !type) return alert("Please select an option.");
    if (step === 2 && !name) return alert("Please enter your full name.");
    setStep(step + 1);
    console.log(step, "Number of  step");

    if (step >= 3) {
      updateProfile();
      setStep(1);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{padding: "0"}}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "16px",
          boxShadow: 24,
          p: { xs: 2, sm: 4 }, // Padding adjusts based on screen size
          maxWidth: { xs: "90%", sm: "750px", md: "750px" }, // Different max width for different screens
          width: "90%",
          height: "50%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className={`${step==3 ? "p-0":"p-3"} items-center justify-center mx-auto relative`}>
          <div className="flex items-center justify-between cursor-pointer">
            {step > 1 && (
              <button
                className="border-none h-[3.2rem] text-[1.8rem] cursor-pointer bg-[#EADDFF] w-[3.2rem] rounded-full absolute left-[-1rem] top-[-1rem]"
                onClick={handleBack}
              >
                <img src={Back} alt="Back" />
              </button>
            )}
            {step > 2 && (
              <button
                className="border-none font-nunito text-[#620498] h-[4rem] text-[2rem] cursor-pointer bg-[#EADDFF] w-[10rem] rounded-full absolute right-[-1rem] top-[-1rem]"
                onClick={handleContinue}
              >
                Skip
              </button>
            )}
          </div>

          {step === 3 && concernLists?.length > 0 ? (
            <div className="flex flex-col gap-6 font-nunito justify-center items-center mt-[5rem]">
              <p className="text-gray-600 text-[2.4rem] font-nunito font-normal flex justify-start w-full">
                What are you here for?
              </p>

              {/* Selected Concerns Row */}
              {selectedConcerns.length > 0 && (
                <div className="flex flex-wrap gap-4 w-full">
                  {selectedConcerns.map((concern) => (
                    <Tag
                      key={concern._id}
                      className={`px-4 font-nunito text-white cursor-pointer text-[1.4rem] rounded-full h-[3.8rem] w-auto flex items-center gap-2 ${
                        activeConcern === concern._id
                          ? "bg-[#482885]"
                          : "bg-[#614298]"
                      }`}
                      onClick={() => toggleConcern(concern)}
                    >
                      {concern.concern}
                      <span
                        className="cursor-pointer text-white font-bold ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeConcern(concern._id);
                        }}
                      >
                        x
                      </span>
                    </Tag>
                  ))}
                </div>
              )}

              {/* Show Sub-Concerns only for the active concern */}
              {activeConcern && (
                <div className="flex flex-wrap gap-2 mt-2 w-full">
                  {concernLists
                    .find((c) => c._id === activeConcern)
                    ?.subConcerns.map((subConcern) => (
                      <Tag
                        key={subConcern._id}
                        onClick={() =>
                          toggleSubConcern(activeConcern, subConcern)
                        }
                        className={`px-5 py-2 border rounded-full w-auto cursor-pointer h-[3.3rem] text-[1.4rem] font-normal ${
                          selectedSubConcerns[activeConcern]?.some(
                            (sc) => sc._id === subConcern._id
                          )
                            ? "bg-[#ECFFBF] text-[#655973] border-[#AADB36]"
                            : "border-[#9c81cc] text-[#655973]"
                        }`}
                      >
                        {subConcern.subConcern}
                      </Tag>
                    ))}
                </div>
              )}

              {/* Separator */}
              {selectedConcerns.length > 0 && (
                <div className="h-[1px] w-[100%] bg-[#DBDBDB]" />
              )}

              {/* Available Concerns */}
              <div className="w-full flex flex-wrap gap-2">
                {concernLists
                  .filter(
                    (concern) =>
                      !selectedConcerns.some((c) => c._id === concern._id)
                  )
                  .map((concern) => (
                    <Tag
                      key={concern._id}
                      onClick={() => toggleConcern(concern)}
                      className="px-4 pt-[0.8rem] border border-[#9C81CC] font-nunito text-[1.4rem] rounded-full h-[3.8rem] w-auto cursor-pointer"
                    >
                      {concern.concern}
                    </Tag>
                  ))}
              </div>

              {/* Continue Button */}
              <div className="w-full flex justify-start items-center">
                <button
                  type="submit"
                  className="w-[40%] bg-[#614298] cursor-pointer text-white py-3 h-[4.8rem] rounded-xl transition-colors font-medium mt-8 text-[1.6rem] border-none font-nunito"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="flex justify-center items-center">
              <div className="w-[90%] flex flex-col items-center relative">
                <h1 className="text-[3.2rem] font-normal text-gray-800 font-nunito">
                  Hi! This is{" "}
                  <span className="text-[#614298] font-semibold">
                    Sage Turtle
                  </span>
                </h1>
                <p className="text-gray-600 text-[2.2rem] font-normal mt-[1rem]">
                  Who are you?
                </p>
                <img
                  src={Sage}
                  className="absolute h-[7rem] top-[8rem] left-[10rem]"
                />

                <select
                  name="type"
                  value={type?._id || ""} // Ensure we set the value based on _id
                  onChange={(e) => {
                    const selectedType = allTypes.find(
                      (item) => item._id === e.target.value
                    ); // Find the full object
                    setType(selectedType); // Store full object in state
                  }}
                  className="w-[70%] font-nunito mt-[7rem] px-4 py-3 cursor-pointer h-[4.8rem] rounded-xl border border-gray-200 text-[1.6rem]"
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
                  className="w-[70%] bg-[#614298] cursor-pointer text-white py-3 h-[4.8rem] rounded-xl transition-colors font-medium mt-8 text-[1.6rem] border-none font-nunito"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="w-[90%] flex flex-col items-center relative">
                <h1 className="text-[3.2rem] font-normal text-gray-800 font-nunito">
                  Hi! This is{" "}
                  <span className="text-[#614298] font-semibold">
                    Sage Turtle
                  </span>
                </h1>

                <h1 className="text-gray-600 text-[2.2rem] font-normal mt-[0.5rem]">
                  Enter Your Full Name
                </h1>
                <img
                  src={Sage}
                  className="absolute h-[7rem] top-[8.5rem] left-[10rem]"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[70%] font-nunito px-4 py-3 h-[4.8rem] rounded-xl border border-solid border-gray-200 text-[1.6rem] mt-[8rem]"
                />

                <button
                  onClick={handleContinue}
                  className="w-[70%] bg-[#614298] cursor-pointer text-white py-3 h-[4.8rem] rounded-xl transition-colors font-medium mt-8 text-[1.6rem] border-none font-nunito"
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
