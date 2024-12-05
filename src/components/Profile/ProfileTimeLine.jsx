import { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Box, FormControl } from "@mui/material";
import FilterIcon from "../../assets/filter.svg";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { MenuItem, Select } from "@mui/material";
import DropdownArrowClosed from "../../assets/DropdownArrowClosed.svg";
import DropdownArrowOpen from "../../assets/DropdownArrowOpen.svg";
import axios from "axios";
import { getDayIndex, getDayName } from "../../constant/constatnt";
import { API_URL } from "../../constant/ApiConstant";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const ProfileTimeline = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState({});
  const [isApiCall, setIsApiCall] = useState(false);
  const [values, setValues] = useState("session");

  const handleCloseModal = () => {
    setFromTime("");
    setToTime("");
    setOpenModal(false);
  };

  const handleOpenModal = (day) => {
    setOpenModal(true);
    setSelectedDay(day);
  };
  const handleChangepre = (event) => {
    setValues(event.target.value);
  };
  const handleFromOpen = () => {
    setIsFromDropdownOpen(true);
  };

  const handleFromClose = () => {
    setIsFromDropdownOpen(false);
  };

  const handleToOpen = () => {
    setIsToDropdownOpen(true);
  };

  const handleToClose = () => {
    setIsToDropdownOpen(false);
  };

  const generateToTimeSlots = () => {
    const timeSlots = [];
    const fromTimeParts = fromTime.split(":");
    const isPM = fromTime.includes("PM");
    const startTime = new Date();
    startTime.setHours(
      isPM
        ? parseInt(fromTimeParts[0], 10) === 12
          ? 12
          : parseInt(fromTimeParts[0], 10) + 12
        : parseInt(fromTimeParts[0], 10),
      parseInt(fromTimeParts[1], 10),
      0,
      0
    );
    startTime.setMinutes(startTime.getMinutes() + 30);

    const endTime = new Date();
    endTime.setHours(21, 0, 0, 0);

    while (startTime <= endTime) {
      const formattedTime = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeSlots.push(
        <MenuItem
          key={formattedTime}
          value={formattedTime}
          className="timelineMenuItem p1-reg"
        >
          {formattedTime}
        </MenuItem>
      );

      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return timeSlots;
  };

  const generateFromTimeSlots = () => {
    const timeSlots = [];
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(21, 0, 0, 0);

    while (startTime <= endTime) {
      const formattedTime = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeSlots.push(
        <MenuItem
          key={formattedTime}
          value={formattedTime}
          className="timelineMenuItem p1-reg"
        >
          {formattedTime}
        </MenuItem>
      );

      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return timeSlots;
  };

  const handleSaveTimeline = () => {
    const formatTimeToHHMMSS = (time) => {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":");
      hours = parseInt(hours, 10);
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      hours = String(hours).padStart(2, "0");
      minutes = String(minutes).padStart(2, "0");

      return `${hours}:${minutes}:00`;
    };

    const fromTimeWithSeconds = formatTimeToHHMMSS(fromTime);
    const toTimeWithSeconds = formatTimeToHHMMSS(toTime);

    const body = {
      start_time: fromTimeWithSeconds,
      end_time: toTimeWithSeconds,
      day: selectedDay,
    };

    axios
      .post(
        values == "session"
          ? `${API_URL}/generateTherapistSlots`
          : `${API_URL}/generateTherapistPreconsultationSlots`,
        body
      )
      .then((res) => {
        if (res.status == 200) {
          getTimeSlots();
        }
      })
      .catch((err) => {
        toast.error(`${err.response.data.message}`, {
          position: "top-center", // Set the position to top-right
          duration: 7000, // Display for 3 seconds (3000 ms)
          style: {
            fontWeight: "bold",
            fontSize: "14px", // Smaller text
          },
        });
      });
    setOpenModal(false);
    setIsApiCall(true);
    setFromTime("");
    setToTime("");
  };
  const getTimeSlots = () => {
    axios
      .get(
        values == "session"
          ? `${API_URL}/getTherapistSessionSlots`
          : `${API_URL}/getPreconsultationSlotsByTherapist`
      )
      .then((res) => {
        const slots =
          values == "session"
            ? res.data.data?.slots
            : res.data.data?.preconsultation_slots;

        if (Array.isArray(slots)) {
          const formattedSlots = slots.reduce((acc, curr) => {
            if (curr === null) {
              acc[acc.length] = [];
            } else if (curr && curr.day !== undefined && curr.slots) {
              acc[curr.day] = curr.slots;
            }
            return acc;
          }, []);
          setTimeSlots(formattedSlots);
        } else {
          console.log("Slots is not an array or is null");
          // Handle the case where slots is not an array or is null
          setTimeSlots([]); // or any other fallback logic
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
    setOpenModal(false);
  };

  const deleteTimeSlot = (day, slot) => {
    const body = {
      day: day,
      start_time: slot.m_schd_from,
      end_time: slot.m_schd_to,
    };
    axios
      .post(
        values == "session"
          ? `${API_URL}/deleteTherapistSlot`
          : `${API_URL}/deleteTherapistPreconsultationSlots`,
        body
      )
      .then((res) => {
        if (res.status == 200) {
          getTimeSlots();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
    setOpenModal(false);
    setIsApiCall(true);
  };

  useEffect(() => {
    getTimeSlots();
  }, [values]);

  useEffect(() => {
    setIsApiCall(false);
  }, [isApiCall]);

  const renderDaySchedule = (day) => {
    const dayIndex = getDayIndex(day);
    if (timeSlots[dayIndex]?.length > 0) {
      return timeSlots[dayIndex].map((schedule, index) => (
        <div key={index} className="timelineItem">
          <h2 className="p1-reg">{schedule.m_schd_from}</h2>
          <h3 className="p1-reg">to</h3>
          <h2 className="p1-reg">{schedule.m_schd_to}</h2>
          <button
            onClick={() => {
              deleteTimeSlot(dayIndex, schedule);
            }}
            className="cursor-pointer"
          >
            |
          </button>
        </div>
      ));
    } else {
      return (
        <p>
          No schedule available for {day.charAt(0).toUpperCase() + day.slice(1)}
        </p>
      );
    }
  };

  return (
    <div className="timelineContainer">
      <div className="flex flex-row gap-16">
        <h1 className="h5-bold">Manage Timing Schedule</h1>
        <FormControl
          variant="outlined"
          sx={{
            width: "20%",
            height: "40px",
            border: "1px solid #787486",
            display: "flex",
            gap: "10px",
            borderRadius: "6px",
            flexDirection: "row",
          }}
        >
          <img src={FilterIcon} className="w-[20px] pl-2" />
          <Select
            id="dropdown"
            value={values}
            onChange={handleChangepre}
            sx={{
              width: "90%",
              fontSize: "16px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="preconsultation" sx={{ fontSize: "14px" }}>
              Pre consultation
            </MenuItem>
            <MenuItem value="session" sx={{ fontSize: "14px" }}>
              Sessions
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
        (dayAbbreviation, index) => (
          <div className="timelineContent" key={index}>
            <div className="timelineHeadingContent">
              <div>
                <h2 className="h5-bold">
                  {getDayName(getDayIndex(dayAbbreviation))}
                </h2>
                <h3 className="body4-reg">8:00 AM - 9:00 PM</h3>
              </div>
              <button
                onClick={() => handleOpenModal(getDayIndex(dayAbbreviation))}
                className="cursor-pointer body3-bold"
              >
                + Add More
              </button>
            </div>
            <div className="timelineSaperator"></div>
            <div className="timelineItems">
              {renderDaySchedule(dayAbbreviation)}
            </div>
          </div>
        )
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            style: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <div className="timelinePopupHeading">
              <div>
                <h2 className="h5-bold">{getDayName(selectedDay)}</h2>
                <h3 className="body4-reg">8:00 AM - 9:00 PM</h3>
              </div>
              <button onClick={handleSaveTimeline} className="cursor-pointer">
                Save
              </button>
            </div>
            <div className="timelineSaperator mt-3"></div>
            <div className="timelinePopup">
              <Select
                id="demo-simple-select-helper"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                name="m_sch_from"
                required
                open={isFromDropdownOpen}
                onOpen={handleFromOpen}
                onClose={handleFromClose}
                IconComponent={() => (
                  <img
                    src={
                      isFromDropdownOpen
                        ? DropdownArrowOpen
                        : DropdownArrowClosed
                    }
                    alt="Dropdown Arrow"
                    width="16"
                    height="16"
                    style={{ marginRight: "12px" }}
                  />
                )}
              >
                {generateFromTimeSlots()}
              </Select>
              <h3 className="p1-reg">to</h3>
              <Select
                id="demo-simple-select-helper"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                name="m_sch_to"
                required
                open={isToDropdownOpen}
                onOpen={handleToOpen}
                onClose={handleToClose}
                IconComponent={() => (
                  <img
                    src={
                      isToDropdownOpen ? DropdownArrowOpen : DropdownArrowClosed
                    }
                    alt="Dropdown Arrow"
                    width="16"
                    height="16"
                    style={{ marginRight: "12px" }}
                  />
                )}
              >
                {generateToTimeSlots()}
              </Select>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ProfileTimeline;
