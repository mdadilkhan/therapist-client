import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../constant/ApiConstant";

const ProfileConsultationPricing = () => {
  const [sessionPricing, setSessionPricing] = useState(null);
  const consultationTypes = [
    { name: "Clinic appointment", type: "in_person" },
    { name: "Online", type: "video" },
    { name: "On Call Appointment", type: "audio" },
  ];

  useEffect(() => {
    // Fetch therapist details including session pricing
    const getProfileDetails = () => {
      axios
        .get(`${API_URL}/getProfileDetail`)
        .then((res) => {
          if (res.status === 200) {
            setSessionPricing(res.data.data.sessionPricing);
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    };

    getProfileDetails();
  }, []);

  return (
    <div className="mx-auto p-8">
      <h2 className="h5-bold mb-16">Manage Consultation Pricing</h2>
      {consultationTypes.map((consultation, index) => (
        <div
          key={index}
          className="mb-8 p-6 border rounded-lg border-solid border-[#D5D2D9] bg-white"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <TextField
                fullWidth
                type="text"
                required
                name="title"
                value={consultation.name}
                readOnly
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
                      borderColor: "#d5d2d9",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d5d2d9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d5d2d9",
                    },
                    "& input::placeholder": {
                      color: "#d5d2d9",
                    },
                  },
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <TextField
                fullWidth
                type="text"
                required
                name="title"
                value={consultation.type}
                readOnly
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
                      borderColor: "#d5d2d9",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d5d2d9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d5d2d9",
                    },
                    "& input::placeholder": {
                      color: "#d5d2d9",
                    },
                  },
                }}
              />
            </div>
          </div>

          {sessionPricing && sessionPricing[consultation.type] && (
            <div className="flex gap-8">
              {Object.keys(sessionPricing[consultation.type]).map((duration) => {
                // Debug: Log each consultation type and pricing for each duration
                const priceData = sessionPricing[consultation.type][duration];
                const price = priceData?.$numberInt || priceData; // Extract number properly

                return (
                  <React.Fragment key={duration}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (mins)
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="title"
                        value={duration}
                        readOnly
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
                              borderColor: "#d5d2d9",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d5d2d9",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d5d2d9",
                            },
                          },
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing (INR)
                      </label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        name="title"
                        value={price || "N/A"} // Default to N/A if price is undefined
                        readOnly
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
                              borderColor: "#d5d2d9",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d5d2d9",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d5d2d9",
                            },
                          },
                        }}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileConsultationPricing;
