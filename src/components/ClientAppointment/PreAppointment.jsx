import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "@emotion/styled";
import Translate from "../../assets/Language.svg";
import CalnedarCheck from "../../assets/Calendar1.svg";
import Clock from "../../assets/Clock.svg";
import DatePicker from "react-date-picker";
import dayjs from "dayjs";
import axios from "axios";
import DummyImg from "../../assets/GetMatched.svg";
import grayDot from "../../assets/grayDot.svg";
import greenDot from "../../assets/greenDot.svg";
import redDot from "../../assets/redDot.svg";
import { Button } from "@mui/material";
import { preAppointmentDetails } from "../../store/slices/preAppointmentSlice";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../constant/ApiConstant";
import { convertTo12HourFormat } from "../../constant/constatnt";
import toast from "react-hot-toast";

const PreAppointment = () => {
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [slotList, setSlotList] = useState([]);
  const [preBooking, setPreBooking] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const duration = "30";
  const [dateValue, setDateValue] = useState(new Date());
  const [appDetails, setAppDetails] = useState({
    t_appointment_date: dateValue,
    t_appointment_time: selectedSlot,
    sel_min: duration,
    language: "English",
  });
  const handleDateChange = (date) => {
    setDateValue(date);
  };
  const getSlots = () => {
    axios
      .post(`${API_URL}/getPreconsultationSlots`, {
        date: formatDate(dateValue),
      })
      .then((res) => {
        if (res.status == 200) {
          setSlotList(res.data.data.slots);
        }
        console.log(res);
      })
      .catch((err) => {
        console.log("err:", err);
        setSlotList([]);
      });
  };

  useEffect(() => {
    getSlots();
  }, [dateValue]);

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
  // language is hard coded
  useEffect(() => {
    setAppDetails({
      t_appointment_date: formatDate(dateValue),
      t_appointment_time: selectedSlot,
      sel_min: duration,
      language: "English",
    });
  }, [selectedSlot, dateValue, duration]);

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
          className="w-[85%] sm:w-[45%] h-[335px] sm:h-[178px] rounded-[15px] bg-[#FCFAFF] shadow-custom ml-[32px] my-0 sm:my-8 flex sm:flex-row flex-col gap-5 px-4 py-6"
        >
          <div>
            <img src={DummyImg} alt="" />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <h2 className="h6-bold">Sage Turtle</h2>
            <h3 className="body3-sem text-[#635B73]">
              Preliminary Consultation
            </h3>
            <div className="flex gap-3">
              <img src={Clock} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Duration :</span> 30 mins
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={CalnedarCheck} alt="" />
              <h4 className="body4-reg text-[#635B73]">
                <span className="ovr1-bold">Consultation Fee :</span>
                750/-(inclusive of all taxes)
              </h4>
            </div>
            <div className="flex gap-3">
              <img src={Translate} alt="" />
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
        </div>
        <div className="mt-[16px] sm:mt-[32px] ml-[32px]">
          <h4 className="body3-sem">Slots</h4>
          <div style={{ padding: "16px" }}>
            {slotList.length !== 0 ? (
              <div className="flex flex-wrap sm:gap-[10px] gap-[6px]">
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
              background: selectedSlot ? "#614298" : "#D3D3D3",
              cursor: selectedSlot ? "pointer" : "not-allowed",
              "&:hover": {
                background: selectedSlot ? "#614298" : "#D3D3D3",
              },
            }}
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot) {
                dispatch(preAppointmentDetails(appDetails));
                setTimeout(() => {
                  navigate("/client/preappointmenttype");
                }, 100);
              }
            }}
          >
            <span className="btn1">Proceeds</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PreAppointment;
