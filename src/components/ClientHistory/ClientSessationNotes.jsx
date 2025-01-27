import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeftArrow from "../../assets/LeftArrow.svg";
import UploadIcon from "../../assets/UploadIcon.svg";
import { API_URL } from "../../constant/ApiConstant";
import { Button, Dialog } from "@mui/material";
import AddPrescription from "../AddPrescription";
import AddIcon from "../../assets/AddIcon.svg";
import { Spin } from "antd";
import toast from "react-hot-toast";

const ClientSessationNotes = () => {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [openPrescription, setOpenPrescription] = useState(false);

  const [insertSessationNote, setInsertSessationNote] = useState({
    appointmentId: id,
    diagnosticImpression: "",
    sessionFocus: "",
    observations: "",
    clientGoals: "",
    therapeuticIntervention: "",
    tasksGiven: "",
    plannedIntervention: "",
    importantNotes: "",
    imageName: "",
  });




  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      const session_id = {
        sessionId: sessionId,
      };
      axios
        .post(`${API_URL}/getSessionNotesById`, session_id)
        .then((res) => {
          if (res.status == 200) {
            setInsertSessationNote(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [sessionId]);

  const handleChange = (e) => {
    setInsertSessationNote({
      ...insertSessationNote,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiEndpoint = sessionId
      ? `${API_URL}/editSessionNotes`
      : `${API_URL}/addSessionNotes`;
    const data = sessionId
      ? { ...insertSessationNote, sessionId }
      : insertSessationNote;

    axios
      .post(apiEndpoint, data)
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          toast.success("Successfully Added")
          handleBack()
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenPrescription = () => {
    setOpenPrescription(true);
  };

  const handleClosePrescription = () => {
    setOpenPrescription(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const uploadImageToS3 = async (url) => {
    try {
      const res = await axios.put(url, image, {
        headers: {
          "Content-Type": image.type, // Ensure the correct Content-Type
          Authorization: undefined, // Explicitly override and remove the global Authorization header
        },
      });
      if (res.status === 200) {
        return true;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image to S3", error.response || error);
      throw error;
    }
  };

  const getImageUrl = async () => {
    try {
      const { url, imageName } = await getSignedUrl();

      await uploadImageToS3(url);
      // setSelectedFileName("");
   
      const imageUrl = `https://corportal.s3.ap-south-1.amazonaws.com/upload/profilePic/${imageName}`;
      setInsertSessationNote((prevState) => ({
        ...prevState,
        imageName: imageUrl,
      }));
      setImage(null)
      toast.success("Save to Upload Document");
    } catch (error) {
      console.error("Error in image upload process", error);
      alert("Error uploading file");
    }
  };

  const getSignedUrl = async () => {
    try {
      const res = await axios.get(`${API_URL}/uploadImage`);
      if (res.status === 200) {
        return res.data.data;
      } else {
        throw new Error("Failed to get signed URL");
      }
    } catch (error) {
      console.error("Error getting signed URL", error);
      throw error;
    }
  };
  useEffect(() => {
    if (image) {
      setSelectedFileName(image.name);
      getImageUrl();
    }
  }, [image]);

  console.log("session note>>",insertSessationNote);
  
  return (
    <>
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
            cursor:'pointer'
          }}
        >
          <div onClick={handleBack}>
            {" "}
            <img src={LeftArrow} alt="" />
          </div>
          <h5 className="h5-bold">Session Notes bcjhd</h5>
        </div>
        {viewportWidth >= 640 ? (
          <div style={{ display: "flex" }}>
            <Button
              variant="outlined"
              style={{
                display: "flex",
                width: "196px",
                gap: 4,
                height: "48px",
                borderRadius: "8px",
                color: "#614298",
                border: "1px solid #614298",
                textTransform: "capitalize",
              }}
              onClick={handleOpenPrescription}
            >
              <img src={AddIcon} alt="" />
              <span className="btn1">Add Prescription</span>{" "}
            </Button>
          </div>
        ) : null}
      </div>

      <div style={{ padding: "32px" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
          action=""
        >
          <div className="flex justify-center gap-9 flex-col sm:flex-row w-full">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Upload Attachment
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #ddd",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="p2-sem" style={{ color: "#4A4159" }}>
                    {selectedFileName || "Choose Document"}
                  </label>
                  {image ? (
                    <Spin size="small" />
                  ) : (
                    <img src={UploadIcon} alt="Upload" />
                  )}
                </label>
              </div>
            </div>
          </div>
          <h2 className="p2-sem text-center mt-8" style={{ color: "#9A93A5" }}>
            OR
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "full",
            }}
          >
            <label className="p2-sem" style={{ color: "#4A4159" }}>
              Write Notes
            </label>
            <textarea
              style={{ width: "100%", borderRadius: "8px" }}
              id="myTextArea"
              rows="4"
              cols="500"
              name="importantNotes"
              value={insertSessationNote.importantNotes}
              onChange={handleChange}
            ></textarea>
          </div>
          <h2
            className="p2-sem text-center mt-8 mb-3"
            style={{ color: "#9A93A5" }}
          >
            OR
          </h2>
          <div className="flex justify-center gap-9 flex-col sm:flex-row mb-8">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Diagnostic Impression
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="diagnosticImpression"
                value={insertSessationNote.diagnosticImpression}
                onChange={handleChange}
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Session Focus
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="sessionFocus"
                value={insertSessationNote.sessionFocus}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center gap-9 flex-col sm:flex-row mb-8">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Observations
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="observations"
                value={insertSessationNote.observations}
                onChange={handleChange}
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Client Goals
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="clientGoals"
                value={insertSessationNote.clientGoals}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center gap-9 flex-col sm:flex-row mb-8">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Therapeutic Intervention
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="therapeuticIntervention"
                value={insertSessationNote.therapeuticIntervention}
                onChange={handleChange}
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Tasks Given
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="tasksGiven"
                value={insertSessationNote.tasksGiven}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex gap-9 flex-col sm:flex-row mb-8">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
              }}
            >
              <label className="p2-sem" style={{ color: "#4A4159" }}>
                Planned Intervention
              </label>
              <textarea
                style={{ width: "100%", borderRadius: "8px" }}
                id="myTextArea"
                rows="4"
                cols="500"
                name="plannedIntervention"
                value={insertSessationNote.plannedIntervention}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="contained"
              type="submit"
              sx={{
                margin: "16px 0px",
                width: "250px",
                height: "48px",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #614298",
                textTransform: "capitalize",
                background: "#614298",
                fontSize: "14px",
                fontFamily: "Nunito",
                "&:hover": {
                  background: "#614298",
                  border: "1px solid #614298",
                },
                "&:focus": {
                  background: "#614298",
                },
                "&:active": {
                  background: "#614298",
                },
              }}
            >
              {sessionId ? "Update Session Notes" : "Add Session Notes"}
            </Button>

            <Button
              sx={{
                margin: "16px 0px",
                width: "250px",
                height: "48px",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #614298",
                textTransform: "capitalize",
                background: "#ffffff",
                color: "#614298",
                fontSize: "14px",
                fontFamily: "Nunito",
                "&:hover": {
                  background: "#ffffff",
                  border: "1px solid #614298",
                },
                "&:focus": {
                  background: "#ffffff",
                },
                "&:active": {
                  background: "#ffffff",
                },
              }}
              onClick={handleBack}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={openPrescription} onClose={handleClosePrescription}>
        <AddPrescription appointId={id} handleClose={handleClosePrescription} />
      </Dialog>
    </>
  );
};

export default ClientSessationNotes;