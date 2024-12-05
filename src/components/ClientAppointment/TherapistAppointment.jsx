import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "@emotion/styled";
import Translate from "../../assets/Language.svg";
import CalnedarCheck from "../../assets/Calendar1.svg";
import Clock from "../../assets/Clock.svg";
import DatePicker from "react-date-picker";
import axios from "axios";
import DummyImg from "../../assets/Frame.png";
import grayDot from "../../assets/grayDot.svg";
import greenDot from "../../assets/greenDot.svg";
import redDot from "../../assets/redDot.svg";
import {
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useSelector } from "react-redux";
import { appointmentDetails } from "../../store/slices/appointmentSlice";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../constant/ApiConstant";
import { useSearchParams } from "react-router-dom";
import { convertTo12HourFormat } from "../../constant/constatnt";
import { useSocket } from "../../getSocket";
import toast from "react-hot-toast";
const TherapistAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const userDetails = useSelector((state) => state.userDetails);
  const [searchParams, setSearchParams] = useSearchParams();
  const [slotList, setSlotList] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [profileDetials, setProfileDetials] = useState({});
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [duration, setDuration] = useState("30");
  const [dateValue, setDateValue] = useState(new Date());
  const [appDetails, setAppDetails] = useState({
    m_therapist_id: searchParams.get("therapistId") || 0,
    t_appointment_date: dateValue,
    t_appointment_time: selectedSlot,
    sel_min: duration,
  });

  const [params, setParams] = useState({
    therapistId: searchParams.get("therapistId") || 0,
    appointmentId: searchParams.get("appointmentId") || 0,
    type: searchParams.get("type") || "pre",
  });

  useEffect(() => {
    setParams({
      therapistId: searchParams.get("therapistId") || 0,
      appointmentId: searchParams.get("appointmentId") || 0,
      type: searchParams.get("type") || "pre",
    });
  }, []);
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const handleDateChange = (date) => {
    setDateValue(date);
  };
  const getSlots = () => {
    const data = {
      therapistId: params.therapistId,
      date: formatDate(dateValue),
    };
    axios
      .post(`${API_URL}/getTherapistSlots`, data)
      .then((res) => {
        if (res.status == 200) {
          setSlotList(res.data.data.slots);
        }
      })
      .catch((err) => {
        console.log("err:", err);
        setSlotList([]);
      });
  };

  const therapistProfile = () => {
    axios
      .get(`${API_URL}/therapistDetail/${params.therapistId}`)
      .then((res) => {
        if (res.status === 200) {
          setProfileDetials(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    therapistProfile();
  }, []);

  useEffect(() => {
    getSlots();
  }, [dateValue]);

  const durationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSlotClick = (index) => {
    const clickedSlot = slotList[index];
    if (clickedSlot.m_booked_status === 0) {
      if (selectedSlot === clickedSlot) {
        setSelectedSlot([]);
      } else {
        setSelectedSlot(clickedSlot);
      }
    } else {
      toast.error(
        <div>
          <span style={{ fontWeight: "bold" }}>
            Clicked slot is not available
          </span>
        </div>
      );
    }
  };

  const handleMultipleSlot = (index) => {
    const clickedSlot = slotList[index];
    if (clickedSlot.m_booked_status === 0) {
      if (selectedSlots.some((slot) => slot.id === clickedSlot.id)) {
        setSelectedSlots(
          selectedSlots.filter((slot) => slot.id !== clickedSlot.id)
        );
      } else {
        const adjacentIndex = index + 1;
        const adjacentSlot = slotList[adjacentIndex];
        if (adjacentSlot && adjacentSlot.m_booked_status === 0) {
          const areBothSelected =
            selectedSlots.some((slot) => slot.id === clickedSlot.id) &&
            selectedSlots.some((slot) => slot.id === adjacentSlot.id);

          if (areBothSelected) {
            setSelectedSlots(
              selectedSlots.filter(
                (slot) =>
                  slot.id !== clickedSlot.id && slot.id !== adjacentSlot.id
              )
            );
          } else {
            setSelectedSlots([...selectedSlots, clickedSlot, adjacentSlot]);
          }
        } else {
          console.log("Adjacent slot is not available");
        }
      }
    } else {
      console.log("Clicked slot is not available");
    }
  };

  useEffect(() => {
    setAppDetails({
      m_counselor_id: params.therapistId,
      t_appointment_date: formatDate(dateValue),
      t_appointment_time: duration == "30" ? [selectedSlot] : selectedSlots,
      sel_min: duration,
      appointmentId: searchParams.get("appointmentId") || 0,
      type: searchParams.get("type") || "pre",
    });
  }, [selectedSlot, selectedSlots, dateValue, duration]);

  const reschedule = () => {
    if (params?.appointmentId != 0) {
      if (params.type == "pre") {
        const data = {
          therapistId: params.therapistId,
          newDate: formatDate(dateValue),
          newSlots: [selectedSlot],
          appointmentId: params?.appointmentId,
        };
        axios
          .post(`${API_URL}/reschedulePreconsultationAppointment`, data)
          .then((res) => {
            if (res.status == 200) {
              navigate("client/dashboards");
            }
          })
          .catch((err) => {
            console.log("err:", err);
          });
      } else {
        const data = {
          therapistId: params.therapistId,
          newDate: formatDate(dateValue),
          newSlots: [selectedSlot],
          appointmentId: params?.appointmentId,
          newDuration: duration,
          bookingType: "video",
        };

        axios
          .post(`${API_URL}/rescheduleAppointment`, data)
          .then((res) => {
            if (res.status == 200) {
              socket.emit("therapist", {
                title:"Upcoming Appointment",
                message: `this  appoint has been  reshcdule by ${
                  userDetails.name
                } on  ${formatDate(dateValue)} at ${selectedSlot} `,
                userId: params.therapistId,
                role: "therapist",
              });
              navigate("/client/dashboards");
            }
          })
          .catch((err) => {
            console.log("err:", err);
          });
      }
    }
  };
  return (
    <>
      <div
        style={{
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h5 className="h5-bold ml-[32px]">Appointments</h5>
        <div className="w-[85%] sm:w-[45%] h-[335px] sm:h-[228px] rounded-[15px] bg-[#FCFAFF] shadow-custom ml-[32px] my-0 sm:my-8 flex sm:flex-row flex-col gap-5 px-4 py-6">
          <div>
            <img src={DummyImg} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <h2
              className="h6-bold cursor-pointer"
              onClick={() =>
                navigate(`/client/therapistprofile/${params.therapistId}`)
              }
            >
              {profileDetials?.name}
            </h2>

            <div className="flex gap-3">
              <img src={Clock} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Duration :</span>
                {duration} mins
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={CalnedarCheck} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Consultation Fee :</span>
                {profileDetials?.sessionPricing?.in_person?.["30"]}/-(inclusive
                of all taxes)
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={Translate} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Language :</span>
                {Array.isArray(profileDetials?.profile_details?.languages) ? (
                  profileDetials.profile_details.languages.map(
                    (language, index) => (
                      <span key={index}>{language + " "}</span>
                    )
                  )
                ) : (
                  <span>No languages available</span>
                )}
              </h4>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            marginLeft: "32px",
          }}
        >
          <div>
            <h4 className="body3-sem">Date</h4>
            <DatePicker
              onChange={handleDateChange}
              value={dateValue}
              format="dd/MM/yyyy"
              minDate={new Date()}
            />
          </div>
          <div>
            <h4 className="body3-sem">Duration</h4>
            <FormControl sx={{ marginTop: "16px" }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={duration}
                onChange={durationChange}
              >
                <FormControlLabel
                  value="30"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="30"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px", // Increase the font size of the label
                    },
                  }}
                />
                <FormControlLabel
                  value="50"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="50"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px", // Increase the font size of the label
                    },
                  }}
                />
                <FormControlLabel
                  value="60"
                  control={<Radio sx={{ fontSize: "16px" }} />}
                  label="60"
                  sx={{
                    fontSize: "16px",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px", // Increase the font size of the label
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="mt-[16px] sm:mt-[32px] ml-[32px]">
          <h4 className="body3-sem">Slots</h4>
          <div style={{ padding: "16px" }}>
            {slotList.length !== 0 ? (
              <div className="flex flex-wrap sm:gap-[10px] gap-[6px]">
                {duration === "30" && (
                  <>
                    {slotList.map((item, index) => {
                      let chipClass, paraClass;

                      if (item.m_booked_status === 0) {
                        chipClass = "chip-available";
                        paraClass = "available";
                      } else if (item.m_booked_status === 1) {
                        chipClass = "chip-booked";
                        paraClass = "booked";
                      } else {
                        chipClass = "chip-unavailable";
                        paraClass = "unavailbale";
                      }
                      const isSelected = selectedSlot === item;
                      const selectedBox = isSelected ? "selected-box" : "";
                      const selectedPara = isSelected ? "selected-para" : "";
                      return (
                        <div
                          // className={chipClass}
                          className={`${chipClass} ${selectedBox}`}
                          key={index}
                          style={{ width: "max-content", cursor: "pointer" }}
                          onClick={() => handleSlotClick(index)}
                        >
                          <p className={`${paraClass} ${selectedPara}`}>
                            {convertTo12HourFormat(item.m_schd_from)} -{" "}
                            {convertTo12HourFormat(item.m_schd_to)}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
                {(duration === "50" || duration === "60") && (
                  <>
                    {slotList.map((item, index) => {
                      let chipClass, paraClass;

                      if (item.m_booked_status === 0) {
                        chipClass = "chip-available";
                        paraClass = "available";
                      } else if (item.m_booked_status === 1) {
                        chipClass = "chip-booked";
                        paraClass = "booked";
                      } else {
                        chipClass = "chip-unavailable";
                        paraClass = "unavailbale";
                      }
                      const isSelected = selectedSlots.includes(item);
                      const selectedBox = isSelected ? "selected-box" : "";
                      const selectedPara = isSelected ? "selected-para" : "";
                      return (
                        <div
                          // className={chipClass}
                          className={`${chipClass} ${selectedBox}`}
                          key={index}
                          style={{ width: "max-content", cursor: "pointer" }}
                          onClick={() => {
                            handleMultipleSlot(index);
                          }}
                        >
                          <p className={`${paraClass} ${selectedPara}`}>
                            {convertTo12HourFormat(item.m_schd_from)} -{" "}
                            {convertTo12HourFormat(item.m_schd_to)}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ) : (
              <div>no Data found</div>
            )}
          </div>
        </div>
        <div className="ml-[32px]">
          <h4 className="body3-sem" style={{ marginTop: "16px" }}>
            Status
          </h4>

          <div
            style={{
              display: "flex",
              width: "max-content",
              marginTop: "8px",
              textAlign: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={grayDot} alt="" />
              <p className="unavailbale">Unavailable</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={greenDot} alt="" />
              <p className="available">Available</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={redDot} alt="" />
              <p className="booked" style={{}}>
                Booked
              </p>
            </div>
          </div>
        </div>
        <div className="ml-[32px]">
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "170px",
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #614298",
              background: "#614298",
              textTransform: "capitalize",
              cursor:
                (selectedSlot && selectedSlot.length > 0) ||
                (selectedSlots && selectedSlots.length > 0)
                  ? "pointer"
                  : "not-allowed",
              "&:hover": {
                background: "#7355A8",
                color: "#F4EDFF",
                border: "1px solid #614298",
              },
            }}
            disabled={
              (!selectedSlot || selectedSlot.length === 0) &&
              (!selectedSlots || selectedSlots.length === 0)
            }
            onClick={() => {
              if (params.appointmentId !== 0) {
                reschedule();
              } else {
                dispatch(appointmentDetails(appDetails));
                navigate(
                  `/client/therapistappointmenttype/${params.therapistId}`
                );
              }
            }}
          >
            <span className="btn1 cursor-pointer">
              {params.appointmentId !== 0 ? "Reschedule" : "Proceed"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default TherapistAppointment;
