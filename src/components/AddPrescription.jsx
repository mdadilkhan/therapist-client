import {
  Checkbox,
  DialogActions,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant";
import toast from "react-hot-toast";

export default function AddPrescription({
  handleClose,
  appointId,
  getPrescription,
}) {
  const prescription_initial_Value = {
    title: "",
    dosage: "",
    instructions: {
      morning: false,
      afternoon: false,
      night: false,
    },
    description: "",
    appointmentId: appointId, // Set the appointmentId here
  };

  const [prescriptionValue, setPrescriptionValue] = useState(
    prescription_initial_Value
  );

  const handleChangePrescribtion = (e) => {
    const { name, value } = e.target;
    setPrescriptionValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name) => (e) => {
    const { checked } = e.target;
    setPrescriptionValue((prevValue) => ({
      ...prevValue,
      instructions: {
        ...prevValue.instructions,
        [name]: checked,
      },
    }));
  };

  const handleclose = () => {
    handleClose();
  };

  const insertPrescription = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/addPrescription`, prescriptionValue)
      .then((res) => {
        if (res.status == 200) {
          toast.success(`you added the prescription`, {
            position: "top-center", // Set the position to top-right
            duration: 3000, // Display for 3 seconds (3000 ms)
            style: {
              fontWeight: "bold",
              fontSize: "14px", // Smaller text
            },
          });

          handleclose();
          getPrescription();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className="w-[100%] sm:w-[532px] p-[16px]">
      <h5
        style={{ marginBottom: "24px", textAlign: "center" }}
        className="h5-bold"
      >
        Add Prescription
      </h5>
      <form
        onSubmit={insertPrescription}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
        action=""
      >
        <div className="flex justify-between sm:flex-row flex-col gap-[24px]">
          <div className="flex sm:w-[48%] w-full flex-col">
            <label className="p2-sem" style={{ color: "#4A4159" }}>
              Title
            </label>
            <TextField
              fullWidth
              type="text"
              required
              name="title"
              value={prescriptionValue.title}
              onChange={handleChangePrescribtion}
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
                    borderColor: `#d5d2d9`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `#d5d2d9`,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `#d5d2d9`,
                  },
                  "& input::placeholder": {
                    color: `#d5d2d9`,
                  },
                },
              }}
            />
          </div>
          <div className="flex sm:w-[48%] w-full flex-col">
            <label className="p2-sem" style={{ color: "#4A4159" }}>
              Dosage
            </label>
            <TextField
              fullWidth
              type="text"
              required
              name="dosage"
              value={prescriptionValue.dosage}
              onChange={handleChangePrescribtion}
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
                    borderColor: `#d5d2d9`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `#d5d2d9`,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `#d5d2d9`,
                  },
                  "& input::placeholder": {
                    color: `#d5d2d9`,
                  },
                },
              }}
            />
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <p className="p2-sem" style={{ color: "#4A4159" }}>
            Instruction
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={prescriptionValue.instructions.morning}
                  onChange={handleCheckboxChange("morning")}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 24,
                      padding: "0px",
                      margin: "0px",
                    },
                  }}
                />
              }
              label={
                <span className="p1-reg" style={{ color: "#7D748C" }}>
                  Morning
                </span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={prescriptionValue.instructions.afternoon}
                  onChange={handleCheckboxChange("afternoon")}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 24,
                      padding: "0px",
                      margin: "0px",
                    },
                  }}
                />
              }
              label={
                <span className="p1-reg" style={{ color: "#7D748C" }}>
                  Afternoon
                </span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={prescriptionValue.instructions.night}
                  onChange={handleCheckboxChange("night")}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 24,
                      padding: "0px",
                      margin: "0px",
                    },
                  }}
                />
              }
              label={
                <span className="p1-reg" style={{ color: "#7D748C" }}>
                  Night
                </span>
              }
            />
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <label className="p2-sem" style={{ color: "#4A4159" }}>
            Description
          </label>
          <textarea
            style={{
              width: "100%",
              borderRadius: "8px",
              fontSize: "16px",
              fontFamily: "Nunito",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "0.08px",
            }}
            id="myTextArea"
            rows="4"
            cols="500"
            name="description"
            value={prescriptionValue.description}
            onChange={handleChangePrescribtion}
          ></textarea>
        </div>
        <DialogActions>
          <button className="changeStatusButton cursor-pointer" type="submit">
            Save
          </button>
          <div
            className="changeReferCancelButton cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </div>
        </DialogActions>
      </form>
    </div>
  );
}
