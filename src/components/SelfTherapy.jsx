import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Paper,
  TableBody,
  TableContainer,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import {
  convertTo12HourFormat,
  getformatedDate,
} from "../constant/constatnt.js";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant.js";
import { useSelector } from "react-redux";

const columns = [
  {
    id: "Self Therapy Id",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "Time",
    align: "right",
  },
  {
    id: "Duration",
    align: "right",
  },
  {
    id: "Reschedule",
    align: "right",
  },
];

function SelfTherapy() {
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const {id} = useParams();
  const [selfTherapyList, setSelfTherapyList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState("1");
  const [slotList, setSlotList] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [dateValue, setDateValue] = useState(new Date());
  const [duration, setDuration] = useState("30");
  const [agree, setAgree] = useState(false);
  const details = useSelector((state) => state.userDetails);
  const handleCheckBox = (e) => {
    setAgree(e.target.checked);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if(newValue == "1"){
      getSelfTherapySlots();
    }else{
      getAllSelfTherapy();
    }
  };

  const handleDateChange = (date) => {
    setDateValue(date);
  };

  const durationChange = (e) => {
    setDuration(e.target.value);
    setSelectedSlots([]);
  };

  const handleSlotClick = (index) => {
    const clickedSlot = slotList[index];
  
    // Calculate the required number of slots based on duration
    let slotsRequired = 1; // Default to 1 slot for 30 minutes
    if (duration > 30 && duration <= 60) {
      slotsRequired = 2; // Pick 2 slots for duration between 31 and 60 minutes
    } else {
      slotsRequired = duration / 30; // Use the existing calculation for other durations
    }
  
    if (clickedSlot.m_booked_status === 0) {
      // Check if the required number of slots are available
      let availableSlots = [];
      for (let i = 0; i < slotsRequired; i++) {
        const currentSlot = slotList[index + i];
        if (currentSlot && currentSlot.m_booked_status === 0) {
          availableSlots.push(currentSlot);
        } else {
          break; // Stop if we find an unavailable slot
        }
      }
  
      if (availableSlots.length === slotsRequired) {
        // If the correct number of available slots are found
        const areSlotsSelected = availableSlots.every((slot) =>
          selectedSlots.some((selectedSlot) => selectedSlot.id === slot.id)
        );
  
        if (areSlotsSelected) {
          // Deselect the slots if all are selected
          setSelectedSlots(
            selectedSlots.filter(
              (slot) =>
                !availableSlots.some(
                  (availableSlot) => availableSlot.id === slot.id
                )
            )
          );
        } else {
          // Select the slots if not all are selected
          setSelectedSlots([...selectedSlots, ...availableSlots]);
        }
      } else {
        console.log("Required number of contiguous available slots not found");
      }
    } else {
      console.log("Clicked slot is not available");
    }
  };
  

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getSelfTherapySlots = () => {
    const data = {
      date: formatDate(dateValue),
      therapistId: details?.id,
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

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const handleSubmit = () => {
    console.log(dateValue, duration, selectedSlots);
  
    const data = {
      bookingDate: formatDate(dateValue),
      bookingSlots: selectedSlots,
      duration: duration,
    };
  
    const apiUrl = id 
      ? `${API_URL}/rescheduleSelfTherapyAppointment/${id}` 
      : `${API_URL}/bookSelfTherapyAppointment`;
  
    axios
      .post(apiUrl, data)
      .then((res) => {
        if (res.status === 200) {
          getAllSelfTherapy();
          setValue("2");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };  

  const getAllSelfTherapy = () => {
    axios
      .get(`${API_URL}/getAllSelfTherapy`)
      .then((res) => {
        if (res.status == 200) {
          setSelfTherapyList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getSelfTherapySlots();
  }, [dateValue]);

  useEffect(() => {
    getAllSelfTherapy();
  }, [dateValue]);

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, width: "420px" , marginLeft:"20px"}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label="Schedule SelfTherapy"
              value="1"
              sx={{
                color: "#06030D",
                fontFamily: "Quicksand",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "normal",
                letterSpacing: "0.1px",
                textTransform: "capitalize",
                "@media screen and (min-width: 641px)": {
                  fontSize: "20px",
                },
                "&.Mui-selected": {
                  color: "#06030D",
                  fontFamily: "Quicksand",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "normal",
                  letterSpacing: "0.1px",
                },
              }}
            />
            <Tab
              label="SelfTherapy list"
              value="2"
              sx={{
                color: "#06030D",
                fontFamily: "Quicksand",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "normal",
                letterSpacing: "0.1px",
                textTransform: "capitalize",
                "@media screen and (min-width: 641px)": {
                  fontSize: "20px",
                },
                "&.Mui-selected": {
                  color: "#06030D",
                  fontFamily: "Quicksand",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "normal",
                  letterSpacing: "0.1px",
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingTop: "0px" }}>
          <div>
            <div className="mt-10 w-[10%]">
              <h4 className="body3-sem">Date</h4>
              <DatePicker onChange={handleDateChange} value={dateValue} minDate={new Date()}/>
            </div>
            <div style={{ marginTop: "24px" }}>
              <h4 className="body3-sem mb-3">Duration (in minutes)</h4>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={duration}
                  onChange={durationChange}
                >
                  <FormControlLabel
                    value="50"
                    control={<Radio sx={{ fontSize: "16px" }} />}
                    label="50"
                    sx={{
                      fontSize: "16px",
                      "& .MuiFormControlLabel-label": {
                        fontSize: "16px",
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
                        fontSize: "16px",
                      },
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 className="body3-sem">Slots</h4>
              <div className="py-7">
                {slotList.length !== 0 ? (
                  <div className="flex flex-wrap gap-[6px] sm:gap-[10px]">
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
                          className={`${chipClass} ${selectedBox}`}
                          key={index}
                          style={{
                            width: "max-content",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleSlotClick(index);
                          }}
                        >
                          <p className={`${paraClass} ${selectedPara}`}>
                            {convertTo12HourFormat(item.m_schd_from)} -{" "}
                            {convertTo12HourFormat(item.m_schd_to)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <Checkbox
                className="checkbox"
                {...label}
                size="large"
                sx={{ borderRadius: "6px" }}
                defaultChecked={agree}
                name="agree"
                onChange={handleCheckBox}
              />
              <h3 className="body3-sem text-[#6A6A6A]">
                I hereby certify, that i will be taking self therapy on the
                aforementioned date
              </h3>
            </div>
            <Button
              variant="contained"
              sx={{
                width: "170px",
                height: "48px",
                borderRadius: "8px",
                textTransform: "capitalize",
                background: "#614298",
                marginRight: "12px",
                "&:hover": {
                  background: "#614298",
                },
              }}
              disabled={!agree}
              onClick={handleSubmit}
            >
              <span className="btn1">Save</span>
            </Button>
            <button
              style={{
                width: "160px",
                cursor: "pointer",
                height: "48px",
                border: "2px solid #614298",
                borderRadius: "8px",
                color: "#614298",
                fontFamily: "Nunito",
                fontSize: "1.1rem",
                fontWeight: "700",
                lineHeight: "14px",
              }}
            >
              <span>Close</span>
            </button>
          </div>
        </TabPanel>
        <TabPanel value="2">
          {viewportWidth >= 640 ? (
            <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" , marginLeft:"20px"}}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} className="body3-sem">
                          {column.id}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(selfTherapyList) &&
                      selfTherapyList
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row._id}
                              sx={{ padding: "16px", cursor: "pointer" }}
                            >
                              <TableCell align="left" className="body3-reg">
                                <div style={{ textDecoration: "none" }}>
                                  {row?._id?.slice(-10)}
                                </div>
                              </TableCell>

                              <TableCell align="left" className="body3-reg">
                                <div>{getformatedDate(row.booking_date)}</div>
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                <div>{row?.booking_slots[0].m_schd_from}</div>
                              </TableCell>
                              <TableCell align="left" className="body3-reg">
                                <div>{row.booking_duration} Min</div>
                              </TableCell>
                              <TableCell
                                align="left"
                                className="body3-reg"
                                sx={{ width: "250px" }}
                              >
                                <button
                                  style={{
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    padding: "6px 24px",
                                    border: "1px solid #7355A8",
                                    cursor: "pointer",
                                    background: "#fff",
                                    color: "#7355A8",
                                  }}
                                  onClick={() => {
                                    getSelfTherapySlots();
                                    navigate(
                                      `/therapist/selftherapy/${row._id}`
                                    );
                                    setValue("1");
                                  }}
                                >
                                  Reschedule
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                className="body3-sem"
                rowsPerPageOptions={[10, 25, 100, 125]}
                component="div"
                count={selfTherapyList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Show:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count} items`
                }
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "var(--Black, #06030D)",
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "0.08px",
                  },
                  "& .MuiTablePagination-input": {
                    color: "var(--Black, #06030D)",
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "0.08px",
                  },
                  "& .MuiTablePagination-select": {
                    color: "var(--Black, #06030D)",
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "0.08px",
                  },
                  "& .MuiTypography-root": {
                    color: "var(--Black, #06030D)",
                    fontFamily: "Nunito",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "0.08px",
                  },
                }}
              />
            </Paper>
          ) : (
            <div>
              {Array.isArray(selfTherapyList) &&
                selfTherapyList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <div key={index}>
                      <div
                        className="flex justify-between cursor-pointer items-center"
                        onClick={() => handleClick(index)}
                      >
                        <div className="w-full px-2 py-3 flex flex-row justify-between">
                          <div className="body3-sem w-[40%]">Client</div>
                          <div className="body3-reg pr-2 w-[60%]">
                            {item.emp_name}
                          </div>
                        </div>
                        {index === activeIndex ? (
                          <KeyboardArrowUpIcon fontSize="large" />
                        ) : (
                          <KeyboardArrowDownIcon fontSize="large" />
                        )}
                      </div>
                      {index === activeIndex && (
                        <div className="w-full flex flex-col justify-between">
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[40%]">Sl No.</div>
                            <div className="body3-reg pr-2 w-[60%]">
                              {item.slno}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[40%]">Date</div>
                            <div className="body3-reg pr-2 w-[60%]">
                              {item.date}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[40%]">Time</div>
                            <div className="body3-reg pr-2 w-[60%]">
                              {item?.time}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                            <div className="body3-sem w-[40%]">Duration</div>
                            <div className="body3-reg pr-2 w-[60%]">
                              {item?.duration}
                            </div>
                          </div>
                          <div className="flex flex-row flex-wrap py-3 justify-between">
                            <Button
                              sx={{
                                width: "100%",
                                background: "#F4EDFF",
                                color: "#7355A8",
                              }}
                              onClick={() =>
                                navigate(
                                  `/therapist/selfTherapyList/${item.emp_id}`
                                )
                              }
                            >
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      )}
                      <hr className="h-0.5 text-[#D9D9D9]" />
                    </div>
                  ))}
              <TablePagination
                className="body3-sem"
                rowsPerPageOptions={[10, 25, 100, 125]}
                component="div"
                count={selfTherapyList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Show:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count} items`
                }
              />
            </div>
          )}
        </TabPanel>
      </TabContext>
    </>
  );
}

export default SelfTherapy;
