import React, { useState } from "react";
import Sage from "../assets/sage.svg";
import Back from "../assets/back.svg";

const options = [
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
  { label: "Other", value: "other" },
];

const concernsData = {
  "Academic Pressure": ["Pressure to perform", "Not motivated to take exams"],
  "I am Confused": ["Unsur of my choice", "I feel lost"],
  "I am onfused": ["Unsure of my choice", "I feel lost"],
  "I am Confuse": ["Unure of my choice", "I feel lost"],
  "Academic Presre": ["Presure to perform", "Not motivated to take exams"],
};

const ClientWelcome = () => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedSubConcerns, setSelectedSubConcerns] = useState({});

  const toggleConcern = (concern) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );

    // Remove sub-concerns when a concern is deselected
    if (selectedConcerns.includes(concern)) {
      const updatedSubConcerns = { ...selectedSubConcerns };
      delete updatedSubConcerns[concern];
      setSelectedSubConcerns(updatedSubConcerns);
    }
  };

  const toggleSubConcern = (concern, subConcern) => {
    setSelectedSubConcerns((prev) => ({
      ...prev,
      [concern]: prev[concern]?.includes(subConcern)
        ? prev[concern].filter((sc) => sc !== subConcern)
        : [...(prev[concern] || []), subConcern],
    }));
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleContinue = () => {
    if (step === 1 && !type) return alert("Please select an option.");
    if (step === 2 && !name) return alert("Please enter your full name.");
    if (step === 3 && selectedConcerns.length === 0)
      return alert("Please select at least one concern.");
    setStep(step + 1);

    if (step > 3) {
      console.log("Form submitted");
      setStep(1);
    }
  };

  return (
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

      {step === 3 ? (
        <div className="flex flex-col gap-6 font-sans items-center">
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-[4rem] font-sans font-normal">
              What are you here for?
            </p>
          </div>

          {/* Selected Concerns */}
          {selectedConcerns.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedConcerns.map((concern) => (
                <button
                  key={concern}
                  className="px-4 py-2 bg-[#614298] text-white text-[2.4rem] rounded-full h-[6rem] w-auto"
                  onClick={() => toggleConcern(concern)}
                >
                  {concern} <span className="text-red-700"> x</span>
                </button>
              ))}
            </div>
          )}
          {selectedConcerns.map((concern) => (
            <div
              key={concern}
              className="mt-4 w-full flex flex-col text-center"
            >
              <h3 className="font-medium text-[1.8rem] text-left mb-3 text-gray-700">
    {concern}
  </h3>
              <div className="flex flex-wrap gap-6">
                {concernsData[concern].map((subConcern) => (
                  <button
                    key={subConcern}
                    onClick={() => toggleSubConcern(concern, subConcern)}
                    className={`px-5 py-2 border rounded-full w-auto cursor-pointer h-[5rem] text-[2.4rem] font-normal ${
                      selectedSubConcerns[concern]?.includes(subConcern)
                        ? "bg-[#ECFFBF] text-[#655973]"
                        : "border-[#9c81cc] text-[#655973]"
                    }`}
                  >
                    {subConcern}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {selectedConcerns.length > 0 && (
            <div className="h-[.5rem] w-[10%] rounded-2xl  bg-slate-500" />
          )}
          <div className="w-full flex  items-center  gap-8 mt-8">
            {/* Section Title */}
            <h2 className="text-[2.8rem] font-medium text-gray-700 mb-4">
               Concerns:
            </h2>
            {Object.keys(concernsData)
              .filter((concern) => !selectedConcerns.includes(concern))
              .map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className="px-4 py-2 border border-[#9C81CC] cursor-pointer text-[2.4rem] rounded-full h-[6rem] w-auto"
                >
                  {concern}
                </button>
              ))}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="mt-8 bg-[#614298] text-white py-3 h-[6rem] cursor-pointer rounded-full transition-colors font-medium text-[2.4rem] px-12"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      ) : step === 1 ? (
        <div className="flex justify-center items-center">
          <div className="w-[70%] flex flex-col items-center">
            <h1 className="text-[5rem] font-sans font-medium text-gray-800">
              Hi! This is <span className="text-[#614298]">Sage Turtle</span>
            </h1>
            <p className="text-gray-600 text-[3rem] font-normal">
              Who are you?
            </p>
            <img src={Sage} className="py-4 mx-auto" />

            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-[60%] px-4 py-3 cursor-pointer h-[6rem] rounded-xl border border-gray-200 text-[2.4rem]"
            >
              <option value="" disabled>
                Select an option
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              Hi! This is <span className="text-[#614298]">Sage Turtle</span>
            </h1>

            <h1 className="text-[3rem] font-medium">Enter Your Full Name</h1>
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
  );
};

export default ClientWelcome;
