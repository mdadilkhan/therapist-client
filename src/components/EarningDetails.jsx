import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Invoice from "../assets/Invoice.svg";
import { getformatedDate } from "../constant/constatnt";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuarterDropdown from "./Quarter";
import axios from "axios";
import { API_URL } from "../constant/ApiConstant";
import { useNavigate } from "react-router-dom";

const getStartAndEndDate = (quarter) => {
  // Sanitize the quarter string by removing parentheses
  const sanitizedQuarter = quarter.replace(/[()]/g, "").trim();

  // Extract the parts (e.g., "JUL-SEP" and "2024")
  const [monthsRange, year] = sanitizedQuarter.split(" ");

  // Define month mapping
  const monthMapping = {
    JAN: 0, // January is 0 in JavaScript Date
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  // Extract the start month and end month (e.g., "JUL" and "SEP")
  const [startMonth, endMonth] = monthsRange.split("-");

  // Create startDate as the first day of the start month at 00:00:00
  const startDate = new Date(
    Date.UTC(year, monthMapping[startMonth], 1, 0, 0, 0)
  ).toISOString();

  // Create endDate as the last day of the end month at 00:00:00
  const endDate = new Date(
    Date.UTC(year, monthMapping[endMonth] + 1, 0, 0, 0, 0)
  ).toISOString();

  return { startDate, endDate };
};

const dummyTransactions = [
  {
    _id: "342345",
    amount: 5000,
    date: "09/10/2023",
    type: "Credit",
    mode: "Online",
  },
  {
    _id: "874354",
    amount: 500,
    date: "09/10/2023",
    type: "Debit",
    mode: "Wallet",
  },
  {
    _id: "134567",
    amount: 7000,
    date: "08/10/2023",
    type: "Debit",
    mode: "Online",
  },
  // Add more dummy transactions as needed
];

const liveChatData = [
  { name: "Jan", Minutes: 100 },
  { name: "Feb", Minutes: 200 },
  { name: "Mar", Minutes: 300 },
  { name: "Apr", Minutes: 400 },
  { name: "May", Minutes: 500 },
  { name: "Jun", Minutes: 600 },
  { name: "Jul", Minutes: 700 },
  { name: "Aug", Minutes: 800 },
  { name: "Sep", Minutes: 900 },
  { name: "Oct", Minutes: 1000 },
  { name: "Nov", Minutes: 1000 },
  { name: "Dec", Minutes: 1000 },
];

const COLORS = {
  "Session Appointments": "#AA14B6",
  "Group Sessions": "#FF9100",
  "Live Chat": "#4100F7",
  "Pre Consultations": "#ED1069",
};

const columns = [
  {
    id: "Transaction Id",
    align: "right",
  },
  {
    id: "Amount",
    align: "right",
  },
  {
    id: "Date",
    align: "right",
  },
  {
    id: "Type",
    align: "right",
  },
  {
    id: "Mode",
    align: "right",
  },
  {
    id: "Invoice",
    align: "right",
  },
];

const EarningDetails = () => {
  const [therapistDetail, setTherapistDetail] = useState({});
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState("1");
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [data, setData] = useState([]);
  const getMonthlyAppointment = () => {
    axios
      .get(`${API_URL}/getAppoitnmentEaringpermonth`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getEarningAndAppointmentCount = (quarter) => {
    // Get the startDate and endDate from the quarter
    const { startDate, endDate } = getStartAndEndDate(quarter);

    axios
      .post(`${API_URL}/getEarningsAndCounts`, { startDate, endDate })
      .then((res) => {
        if (res.status === 200) {
          setTherapistDetail((prevState) => ({
            ...prevState,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getAppointmentEarningsByType = () => {
    axios
      .get(`${API_URL}/getAppointmentEarningsByType`)
      .then((res) => {
        if (res.status === 200) {
          setTherapistDetail((prevState) => ({
            ...prevState,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const earningsData = useMemo(() => {
    return [
      {
        name: "Session Appointments",
        value: therapistDetail.totalAppointmentEarning,
      },
      {
        name: "Group Sessions",
        value: therapistDetail.totalGroupSessionsEarning,
      },
      { name: "Live Chat", value: therapistDetail.totalLiveChatEarning },
      {
        name: "Pre Consultations",
        value: therapistDetail.totalPreConsultationEarning,
      },
    ].filter((item) => item.value > 0);
  }, [therapistDetail]);

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
    getMonthlyAppointment();
    getAppointmentEarningsByType();
  }, []);

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
    getEarningAndAppointmentCount(quarter);
  };

  return (
    <div>
      <h5 className="h5-bold px-[20px] sm:px-[35px] py-6">Earnings</h5>
      <div className="flex sm:flex-row flex-col w-full justify-between sm:gap-0 gap-5 px-[20px] sm:px-[35px]">
        <div className="sm:w-[35%] w-full dashboard-details-card p-[16px] sm:p-[32px]">
        <div className="flex justify-between items-center mb-[14px]">
              <div className="flex flex-col gap-2">
                <div className="p1-reg">Total Earning</div>
                <QuarterDropdown getQuarter={handleQuarterChange} />
              </div>
            </div>
            <h1 className="dashboard-detils-amount text-left">
              ₹{therapistDetail?.totalEarnings}/-
            </h1>
            <div className="flex justify-between mb-[14px] mt-4">
              <div>
                <div className="body4-reg">Received Amount</div>
                <h1 className="body1-reg text-[#1EAF6E] font-bold">
                  ₹{therapistDetail?.receivedAmount}
                </h1>
              </div>
              <div>
                <div className="body4-reg">Due Amount</div>
                <h1 className="body1-reg text-[#E83F40] font-bold">
                  ₹{therapistDetail?.dueAmount}
                </h1>
              </div>
            </div>
        </div> 
        <div className="sm:w-[64%] w-full dashboard-details-card p-[16px] sm:p-[32px]">
          <div className="flex sm:flex-row flex-col-reverse gap-[35px]">
            <div className="flex flex-col w-[75%]">
              <h2 className="p1-reg mb-4">Expense Breakdown</h2>
              <div className="flex flex-wrap sm:gap-10 gap-2">
                <div className="flex gap-5 items-center">
                  <div className="w-[16px] h-[16px] bg-[#AA14B6] rounded-[50%]"></div>
                  <div className="flex flex-col gap-2">
                    <h1 className="ovr1-reg text-[14px] text-[#000]">
                      Total Appointment Earning
                    </h1>
                    <h2 className="body4-bold text-[14px] text-[#635B73]">
                      ₹{therapistDetail?.totalAppointmentEarning}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="w-[16px] h-[16px] bg-[#ED1069] rounded-[50%]"></div>
                  <div className="flex flex-col gap-2">
                    <h1 className="ovr1-reg text-[14px] text-[#000]">
                      Total Pre consultation Earning
                    </h1>
                    <h2 className="body4-bold text-[14px] text-[#635B73]">
                      ₹{therapistDetail?.totalPreConsultationEarning}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="w-[16px] h-[16px] bg-[#FF9100] rounded-[50%]"></div>
                  <div className="flex flex-col gap-2">
                    <h1 className="ovr1-reg text-[14px] text-[#000]">
                      Total Group Sessions Earning
                    </h1>
                    <h2 className="body4-bold text-[14px] text-[#635B73]">
                      ₹{therapistDetail?.totalGroupSessionsEarning}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="w-[16px] h-[16px] bg-[#4100F7] rounded-[50%]"></div>
                  <div className="flex flex-col gap-2">
                    <h1 className="ovr1-reg sm:text-[14px] text-[#000]">
                      Total Live chat Earning
                    </h1>
                    <h2 className="body4-bold text-[14px] text-[#635B73]">
                      ₹{therapistDetail?.totalLiveChatEarning}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="charts w-[85%] flex justify-center sm:w-[25%]">
              <PieChart width={150} height={150}>
                <Pie
                  data={earningsData}
                  cx={70}
                  cy={70}
                  innerRadius={40}
                  outerRadius={55}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                >
                  {earningsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F2F2F2",
                    borderRadius: "10px",
                  }}
                  itemStyle={{ color: "#000" }}
                />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col w-full justify-between sm:gap-0 gap-5 px-[20px] sm:px-[35px] pt-6">
        <div className="sm:w-[49.5%] w-full dashboard-details-card p-[16px] sm:p-[32px]">
          <h2 className="p4-bold text-[14px] font-bold mb-4">Appointments</h2>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col gap-1">
              <p className="ovr1-sem font-semibold text-[12px] text-[#000]">
                Total no of Appointments
              </p>
              <h3 className="p1-bold text-[20px] text-[#1F2A37]">{data?.totalAppointment}</h3>
            </div>
            <div className="flex flex-col gap-1">
              <p className="ovr1-sem font-semibold text-[12px] text-[#000]">
                Total Earning
              </p>
              <h3 className="p1-bold text-[20px] text-[#1F2A37]">₹{data?.overallTotalEarning}</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data?.monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F2F2F2",
                  borderRadius: "10px",
                }}
                itemStyle={{ color: "#000" }}
              />
              <Bar dataKey="appointment" fill="#C6B5E2" radius={[20, 20, 20, 20]} />
              <Bar
                dataKey="preconsultation"
                fill="#E83F40"
                radius={[20, 20, 20, 20]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-8 items-center">
            <div className="flex gap-3 items-center">
              <div className="w-[8px] h-[8px] bg-[#C6B5E2] rounded-[50%]"></div>
              <h1 className="ovr1-reg text-[10px] sm:text-[14px] text-[#000]">
                Total Session Earning
              </h1>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[8px] h-[8px] bg-[#E83F40] rounded-[50%]"></div>
              <h1 className="ovr1-reg text-[10px] sm:text-[14px] text-[#000]">
                Total Pre consultation Earning
              </h1>
            </div>
          </div>
        </div>
        <div className="sm:w-[49.5%] w-full dashboard-details-card p-[16px] sm:p-[32px]">
          <h2 className="p4-bold text-[14px] font-bold mb-4">Live chat</h2>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col gap-1">
              <p className="ovr1-sem font-semibold text-[12px] text-[#000]">
                Total no of Live chat
              </p>
              <h3 className="p1-bold text-[20px] text-[#1F2A37]">65</h3>
            </div>
            <div className="flex flex-col gap-1">
              <p className="ovr1-sem font-semibold text-[12px] text-[#000]">
                Total Earning
              </p>
              <h3 className="p1-bold text-[20px] text-[#1F2A37]">₹20,654</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={liveChatData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F2F2F2",
                  borderRadius: "10px",
                }}
                itemStyle={{ color: "#000" }}
              />
              <Bar
                dataKey="Minutes"
                fill="#C6B5E2"
                radius={[20, 20, 20, 20]}
                barSize={17}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-8 items-center">
            <div className="flex gap-3 items-center">
              <div className="w-[8px] h-[8px] bg-[#C6B5E2] rounded-[50%]"></div>
              <h1 className="ovr1-reg text-[10px] sm:text-[14px] text-[#000]">
                No of minutes Spent
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[20px] sm:px-[35px] mt-6">
        <TabContext value={value}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Transaction History"
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
            </TabList>
            <div className="w-[15%] flex items-center gap-4 ">
              <h1 className="ovr1-bold text-[10px] sm:text-[14px] text-[#000]">
                Filters:
              </h1>
              <FormControl
                variant="outlined"
                sx={{
                  width: "100%",
                  height: "40px",
                  border: "1px solid #787486",
                  display: "flex",
                  gap: "10px",
                  borderRadius: "6px",
                  flexDirection: "row",
                }}
              >
                <Select
                  id="dropdown"
                  value={value}
                  onChange={handleChange}
                  sx={{
                    width: "90%",
                    fontSize: "16px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="pre-consultation">Pre consultation</MenuItem>
                  <MenuItem value="sessions">Sessions</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
          <TabPanel value="1">
            {viewportWidth >= 640 ? (
              <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
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
                      {Array.isArray(transactions) &&
                        transactions
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
                                key={row.id}
                                sx={{ padding: "16px", cursor: "pointer" }}
                                // onClick={() => {
                                //   navigate(
                                //     `/appointment/appointmentdetails/${row?._id}`
                                //   );
                                // }}
                              >
                                <TableCell align="left" className="body3-reg">
                                  <div style={{ textDecoration: "none" }}>
                                    {row?._id}
                                  </div>
                                </TableCell>

                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.amount}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{getformatedDate(row.date)}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  {row?.type}
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <div>{row?.mode}</div>
                                </TableCell>
                                <TableCell align="left" className="body3-reg">
                                  <img
                                    src={Invoice}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                    }}
                                  />
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
                  count={transactions.length}
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
                {Array.isArray(transactions) &&
                  transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <div key={index}>
                        <div
                          className="flex justify-between cursor-pointer items-center"
                          onClick={() => handleClick(index)}
                        >
                          <div className="w-full px-2 py-3 flex flex-row justify-between">
                            <div className="body3-sem w-[50%]">
                              Transaction Id
                            </div>
                            <div className="body3-reg pr-2 w-[50%]">
                              {item?._id}
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
                              <div className="body3-sem w-[50%]">Amount</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?.amount}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                              <div className="body3-sem w-[50%]">Date</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {getformatedDate(item?.date)}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                              <div className="body3-sem w-[50%]">Type</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?.type}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                              <div className="body3-sem w-[50%]">Mode</div>
                              <div className="body3-reg pr-2 w-[50%]">
                                {item?.mode}
                              </div>
                            </div>
                            <div className="flex flex-row flex-wrap py-3 justify-between">
                              <Button
                                sx={{
                                  width: "100%",
                                  background: "#F4EDFF",
                                  color: "#7355A8",
                                  "&:hover": {
                                    background: "#7355A8",
                                    color: "#F4EDFF",
                                    border: "1px solid #614298",
                                  },
                                }}
                                // onClick={() =>
                                //   navigate(`/transactiondetails/${item?._id}`)
                                // }
                              >
                                View More
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
                  count={transactions.length}
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
      </div>
    </div>
  );
};

export default EarningDetails;
