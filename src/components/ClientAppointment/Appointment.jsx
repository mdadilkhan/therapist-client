import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "@emotion/styled";
import DatePicker from "react-date-picker";
import axios from "axios";
import Frame from "../../assets/Frame.png";
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
import { appointmentDetails } from "../../store/slices/appointmentSlice";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../constant/ApiConstant";
import Trans from "../../assets/Translate.svg";
import grad from "../../assets/GraduationCap.svg";
import exp from "../../assets/CalendarCheck.svg";
import { convertTo12HourFormat } from "../../constant/constatnt";

const Appointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointmentId } = useParams();
  const [slotList, setSlotList] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [duration, setDuration] = useState("30");
  const [dateValue, setDateValue] = useState(new Date());
  const [inHouseCounselor, setInHouseCounselor] = useState("");
  const [appDetails, setAppDetails] = useState({
    m_counselor_id: inHouseCounselor.emp_id,
    t_appointment_date: dateValue,
    t_appointment_time: selectedSlot,
    sel_min: duration,
  });
  const handleDateChange = (date) => {
    setDateValue(date);
  };

  const getInHouseCounselor = () => {
    axios
      .get(`${API_URL}/getInHouseCounselorDetails`)
      .then((res) => {
        if (res.data.success == true) {
          setInHouseCounselor(res.data.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getInHouseCounselor();
  }, []);

  const getSlots = () => {
    axios
      .post(`${API_URL}/getPreconsultationSlots`, { date: dateValue })
      .then((res) => {
        if (res.data.success === true) {
          setSlotList(res.data.data.slots);
        }
      })
      .catch((err) => {
        console.log("err:", err);
        setSlotList([]);
      });
  };

  useEffect(() => {
    getSlots();
  }, [dateValue]);

  const durationChange = (e) => {
    setDuration(e.target.value);
  };

  const StyledLink = styled(Link)`
    text-decoration: none;
    color: #06030d;
  `;

  const handleSlotClick = (index) => {
    const clickedSlot = slotList[index];
    if (clickedSlot.m_booked_status === 0) {
      if (selectedSlot === clickedSlot) {
        setSelectedSlot(null);
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
      m_counselor_id: inHouseCounselor.emp_id,
      t_appointment_date: dateValue,
      t_appointment_time: duration == "30" ? [selectedSlot] : selectedSlots,
      sel_min: duration,
    });
  }, [selectedSlot, selectedSlots, dateValue, duration]);

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
        <div
          style={{ border: "1px solid #D5D2D9" }}
          className="w-[85%] sm:w-[45%] h-[335px] sm:h-[228px] rounded-[15px] bg-[#FCFAFF] ml-[32px] my-0 sm:my-8 flex sm:flex-row flex-col gap-5 px-4 py-6"
        >
          <div>
            <img
              src={Frame}
              alt=""
              className=" h-[194px] w-[181px] flex-shrink-0 self-stretch rounded-[8px]"
            />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <h3 className="h6-bold">Shruti Ramakrishnan</h3>
            <h3 className="body3-sem text-[#635B73]">REBT Practicioner</h3>
            <div className="flex gap-3">
              <img src={grad} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                M.A. Psychology, B.A. (Hons.) Psychology
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={exp} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Experience :</span>4 Years
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={Trans} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Language :</span>English,Hindi
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
                            {convertTo12HourFormat(item.m_schd_from)} - {convertTo12HourFormat(item.m_schd_to)}
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
                            {convertTo12HourFormat(item.m_schd_from)} - {convertTo12HourFormat(item.m_schd_to)}
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
              textTransform: "capitalize",
              background: "#614298",
              cursor: "pointer",
              "&:hover": {
                background: "#614298",
              },
            }}
            onClick={() => {
              dispatch(appointmentDetails(appDetails));
              if (appointmentId) {
                navigate(`/client/appointmenttype/${appointmentId}`);
              } else {
                navigate(`/client/appointmenttype`);
              }
            }}
          >
            <span className="btn1">Proceed</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Appointment;
