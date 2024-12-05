import React, { useEffect, useState } from "react";
import DummyImg from "../assets/WalletImg.svg";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Box,
  Fade,
  TextField,
} from "@mui/material";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Credit from "../assets/Credit.svg";
import Debit from "../assets/Debit.svg";
import vertical3dots from "../assets/vertical3dots.svg";
import { API_URL } from "../constant/ApiConstant";
import { convertTo12HourFormat, getformatedDate } from "../constant/constatnt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "564px",
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid #D5D2D9",
  p: 4,
  "@media (max-width: 640px)": {
    width: "90%",
    marginTop: "5px",
  },
};

const sageColumn = [
  {
    id: "Transaction ID",
    align: "right",
  },
  {
    id: "Amount",
    align: "right",
  },
  {
    id: "Recipient Name",
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
    id: "Debit/Credit",
    align: "right",
  },
];

const Wallet = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [appointmentList, setAppointmentList] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);

  // Open and close modal functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle amount change
  const handleChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      console.error("Invalid amount entered.");
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      console.error("Amount must be greater than zero.");
      return;
    }
    console.log("Amount submitted:", amount);
  };

  // Handle table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value || 10);
    setPage(0);
  };

  // Fetch wallet details
  const getWalletDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/getWalletDetails`);
      if (res.status === 200 && res.data.wallet_amount !== undefined) {
        setCurrentAmount(res.data.wallet_amount);
        setPaymentHistory(res.data.paymentDetails);
      } else {
        console.error("Failed to retrieve wallet details.");
      }
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    }
  };

  // Add wallet amount
  const addWalletAmount = async (oid, pid, amt) => {
    try {
      const res = await axios.post(`${API_URL}/addWalletAmount`, {
        amount: amt,
        order_id: oid,
        payment_id: pid,
      });
      if (res.status === 200) {
        getWalletDetails(); // Refresh wallet details
        handleClose();
      } else {
        console.error("Failed to add wallet amount.");
      }
    } catch (error) {
      console.error("Error adding wallet amount:", error);
    }
  };

  // Handle Razorpay checkout
  const checkoutHandler = async () => {
    if (amount <= 0) {
      console.error("Amount must be greater than zero for checkout.");
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/payment/createOrder`, {
        amount: amount,
      });

      const options = {
        key: "rzp_test_IqmS1BltCU4SFU",
        amount: data.amount,
        currency: "INR",
        name: "Sage Turtle",
        description: "Test Transaction",
        payment_capture: true,
        image:
          "https://firebasestorage.googleapis.com/v0/b/sage-turtle-website.appspot.com/o/logo.jpeg?alt=media&token=97d30b20-63fb-461e-8063-ca619ffaa7e3",
        order_id: data.id,
        handler: function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          axios
            .post(`${API_URL}/payment/verifyOrder`, paymentData)
            .then((verificationResponse) => {
              if (verificationResponse.status === 200) {
                addWalletAmount(
                  response.razorpay_order_id,
                  response.razorpay_payment_id,
                  amount
                );
                console.log("Amount successfully added.");
              } else {
                console.error("Order verification failed.");
              }
            })
            .catch((error) => {
              console.error("Error during order verification:", error);
            });
        },
        prefill: {
          name: "Sumeet",
          email: "sumeet.singh@ensolab.in",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#614298",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Fetch appointment list
  const AppointmentList = async () => {
    try {
      let formData = new FormData();
      formData.append("m_student_id", 43);

      const res = await axios.post(
        "https://practice.sageturtle.in/sageturtle/appintment_list",
        formData
      );

      if (res.status === 200 && res.data.data) {
        setAppointmentList(res.data.data);
      } else {
        console.error("Failed to retrieve appointment list.");
      }
    } catch (error) {
      console.error("Error fetching appointment list:", error);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    // AppointmentList();
    getWalletDetails();
  }, []);
  paymentHistory?.sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div>
      <div className="relative">
        <h1 className="h5-bold pl-[32px] mt-4">Wallet</h1>
        <div className="w-[45%] sm:w-[45%] h-[228px] items-center rounded-[15px] bg-[#F4EDFF] shadow-custom ml-[32px] my-8 flex gap-5 px-4 py-6">
          <div>
            <img src={DummyImg} alt="" />
          </div>
          <div className="flex flex-col gap-3 h-full">
            <h1 className="h6-bold sm:text-[24px] text-[16px]">
              Add balance to your wallet
            </h1>
            <h2 className="over1-sem sm:text[18px] text-[14px]">
              Add wallet balance to use later
            </h2>
            <button
              className="w-full sm:w-[100px] h-[48px] bg-[#614298] rounded-[8px] border-none text-[#fff] p1-reg cursor-pointer"
              onClick={handleOpen}
            >
              Add
            </button>
            <div className="absolute left-[410px] bottom-5 sm:block hidden">
              <h1 className="h4-sem">₹{currentAmount}</h1>
              <p className="p3-reg">Wallet Balance</p>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Fade in={open}>
                <Box sx={style}>
                  <div className="text-[20px]   flex item-start leading-normal tracking-[0.16px] text-[#06030D] ">
                    <h2 className="text-xl font-bold">Add Balance</h2>
                  </div>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col gap-3"
                  >
                    <label className="p2-sem text-left" htmlFor="amount">
                      Enter Amount (INR)
                    </label>
                    <TextField
                      fullWidth
                      type="number"
                      required
                      name="amount"
                      value={amount}
                      onChange={handleChange}
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
                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={handleClose}
                        autoFocus
                        className="changeReferCancelButton cursor-pointer w-[150px]"
                      >
                        <span>Close</span>
                      </button>
                      <button
                        className="changeStatusButton cursor-pointer w-[150px]"
                        onClick={checkoutHandler}
                      >
                        <span>Add</span>
                      </button>
                    </div>
                  </form>
                </Box>
              </Fade>
            </Modal>
          </div>
        </div>
      </div>
      <h1 className="h5-bold pl-[32px] mb-3">History</h1>
      {paymentHistory?.length !== 0 ? (
        <>
          <Paper
            elevation={0}
            className="hidden sm:block"
            sx={{ width: "100%", overflow: "hidden", marginLeft: "20px" }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {sageColumn.map((column) => (
                      <TableCell key={column.id} className="body3-sem">
                        {column.id}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paymentHistory?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          sx={{ padding: "16px" }}
                        >
                          <TableCell align="left" className="body3-reg">
                            {row?.payment_id}
                          </TableCell>
                          <TableCell align="left" className="body3-reg">
                            {row?.amount}
                          </TableCell>
                          <TableCell align="left" className="body3-reg">
                            {row?.name}
                          </TableCell>
                          <TableCell align="left" className="body3-reg">
                            {getformatedDate(row?.date)}
                          </TableCell>
                          <TableCell align="left" className="body3-reg">
                            {row?.time ? convertTo12HourFormat(row?.time) : convertTo12HourFormat("00:00:00")}
                          </TableCell>
                          <TableCell align="left" className="body3-reg">
                            {row?.drcr === "Credit" ? (
                              <span
                                style={{
                                  color: "green",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                Credit <img src={Credit} className="ml-4" />
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "red",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                Debit <img src={Debit} className="ml-4" />
                              </span>
                            )}
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
              count={appointmentList.length}
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

          <div className="sm:hidden">
            {appointmentList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <div key={item.title}>
                  <div
                    className="flex justify-between cursor-pointer items-center"
                    onClick={() => handleClick(index)}
                  >
                    <div className="w-full px-2 py-3 flex flex-row justify-between">
                      <div className="body3-sem w-[40%]">Therapist</div>
                      <div className="body3-reg pr-2 w-[60%]">
                        {item.m_therapist_name}
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
                        <div className="body3-sem w-[50%]">Appointment no.</div>
                        <div className="body3-reg pr-2 w-[50%]">
                          {item.t_appointment_no}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                        <div className="body3-sem w-[50%]">Date</div>
                        <div className="body3-reg pr-2 w-[50%]">
                          {/* {getformatedDate(item.t_appointment_date)} */}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
                        <div className="body3-sem w-[50%]">Time</div>
                        <div className="body3-reg pr-2 w-[50%]">
                          {/* {convertTo12HourFormat(item.t_appointment_time)} */}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                        <div className="body3-sem w-[50%]">Type</div>
                        <div className="body3-reg pr-2 w-[50%]">
                          {item.m_session_name}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                        <div className="body3-sem w-[50%]">Duration</div>
                        <div className="body3-reg pr-2 w-[50%]">
                          {item.m_appointment_duration}
                          <span className="body3-reg">Min</span>
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                        <div className="body3-sem w-[50%]">Payment</div>
                        {item?.m_appoinment_paystaus}
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                        <div className="body3-sem w-[50%]">Status</div>
                        {item?.m_appointment_status == "2" && (
                          <div
                            style={{
                              borderRadius: "4px",
                              background: "#ECFFBF",
                              padding: "4px 8px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "#385000" }}>Completed</span>
                          </div>
                        )}
                        {item?.m_appointment_status == "0" && (
                          <div
                            style={{
                              borderRadius: "4px",
                              background: "#F4EDFF",
                              padding: "4px 8px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "#614298" }}>Pending</span>
                          </div>
                        )}
                        {item?.m_appointment_status == "3" && (
                          <div
                            onClick={() => {
                              const googleMeetURL = `https://${item.m_therapist_meetlink}`;
                              window.open(googleMeetURL, "_blank");
                            }}
                            style={{
                              borderRadius: "4px",
                              background: "#614298",
                              padding: "4px 8px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ color: "#FCFCFC" }}>Join Now</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-start">
                        <div className="body3-sem w-[43%]">More</div>
                        <Button>
                          <img src={vertical3dots} alt="" />
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
              count={appointmentList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Show:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count} items`
              }
              sx={
                {
                  // Your styling for TablePagination here
                }
              }
            />
          </div>
        </>
      ) : (
        <div
          style={{
            height: "30vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="sm:hidden"
        >
          <span className="body1-reg">No Records Found</span>
        </div>
      )}
    </div>
  );
};

export default Wallet;
