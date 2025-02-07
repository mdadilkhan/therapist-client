// export const API_URL = "http://localhost:5001/api";
// export const API_URL = "https://therapist.sageturtle.in/api";
export const API_URL = "https://therapist-server.onrender.com/api";

export const API_URI = "https://practice.sageturtle.in/corporate/";

export const getLoggedInUserDetails = () => {
  const storedData = localStorage.getItem("persist:root");
  if (storedData) {
    const parsedData = JSON.parse(storedData);

    if (parsedData.userDetails) {
      const userDetails = JSON.parse(parsedData.userDetails);

      const currentUser = userDetails.currentUser;
      return currentUser;
    } else {
      console.error("userDetails not found in the stored data.");
    }
  } else {
    console.error("No data found in localStorage for the key 'persist:root'.");
  }
};

// {viewportWidth >= 640 ? (
//     <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
//             <TableContainer sx={{ maxHeight: 440 }}>
//               <Table stickyHeader aria-label="sticky table">
//                 <TableHead>
//                   <TableRow>
//                     {columns.map((column) => (
//                       <TableCell key={column.id} className="body3-sem">
//                         {column.id}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Array.isArray(newAppointment) && newAppointment.slice(
//                       page * rowsPerPage,
//                       page * rowsPerPage + rowsPerPage
//                     )
//                     .map((row) => {
//                       return (
//                         <TableRow
//                           hover
//                           role="checkbox"
//                           tabIndex={-1}
//                           key={row.id}
//                           sx={{ padding: "16px",cursor:'pointer' }}
//                           onClick={()=>{
//                           navigate(`/appointment/appointmentdetails/${row.t_appt_id}`, { replace: true })
//                       }}
//                         >
//                           <TableCell align="left" className="body3-reg">
//                               <div style={{ textDecoration: "none" }}>
//                                 {row.t_appt_id}
//                               </div>
//                           </TableCell>

//                           <TableCell align="left" className="body3-reg">
//                               <div>{row.m_user_name}</div>
//                           </TableCell>
//                           <TableCell align="left" className="body3-reg">
//                               <div>{getformatedDate(row.t_appt_date)}</div>
//                           </TableCell>
//                           <TableCell align="left" className="body3-reg">
//                               <div>{convertTo12HourFormat(row.t_appt_time)}</div>
//                           </TableCell>
//                           <TableCell align="left" className="body3-reg">
//                               <div>{row.m_session_name}</div>
//                           </TableCell>
//                           <TableCell align="left" className="body3-reg">
//                               <div>{row.t_appt_duration} Min</div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               className="body3-sem"
//               rowsPerPageOptions={[10, 25, 100, 125]}
//               component="div"
//               count={newAppointment.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               labelRowsPerPage="Show:"
//               labelDisplayedRows={({ from, to, count }) =>
//                 `${from}-${to} of ${count} items`
//               }
//               sx={{
//                 "& .MuiTablePagination-select": {
//                   color: "var(--Black, #06030D)",
//                   fontFamily: "Nunito",
//                   fontSize: "16px",
//                   fontStyle: "normal",
//                   fontWeight: 600,
//                   lineHeight: "24px",
//                   letterSpacing: "0.08px",
//                 },
//               }}
//             />
//           </Paper>
//           ) : (
//       <div>
//           {Array.isArray(newAppointment) && newAppointment.slice(
//             page * rowsPerPage,
//             page * rowsPerPage + rowsPerPage
//           )
//             .map((item, index) => (
//               <div key={index}>
//             <div
//               className="flex justify-between cursor-pointer items-center"
//               onClick={() => handleClick(index)}
//             >
//               <div className="w-full px-2 py-3 flex flex-row justify-between">
//                 <div className="body3-sem w-[40%]">Student</div>
//                 <div className="body3-reg pr-2 w-[60%]">
//                   {item.m_user_name}
//                 </div>
//               </div>
//               {index === activeIndex ? (
//                 <KeyboardArrowUpIcon fontSize="large" />
//               ) : (
//                 <KeyboardArrowDownIcon fontSize="large" />
//               )}
//             </div>
//             {index === activeIndex && (
//               <div className="w-full flex flex-col justify-between">
//                 <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
//                   <div className="body3-sem w-[40%]">Appointment Id</div>
//                   <div className="body3-reg pr-2 w-[60%]">
//                     {item.t_appt_id}
//                   </div>
//                 </div>
//                 <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
//                   <div className="body3-sem w-[40%]">Date</div>
//                   <div className="body3-reg pr-2 w-[60%]">
//                     {getformatedDate(item.t_appt_date)}
//                   </div>
//                 </div>
//                 <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
//                   <div className="body3-sem w-[40%]">Time</div>
//                   <div className="body3-reg pr-2 w-[60%]">
//                     {convertTo12HourFormat(item.t_appt_time)}
//                   </div>
//                 </div>
//                 <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
//                   <div className="body3-sem w-[40%]">Type</div>
//                   <div className="body3-reg pr-2 w-[60%]">
//                     {item.m_session_name}
//                   </div>
//                 </div>
//                 <div className="flex flex-row flex-wrap pl-2 pr-11 py-3 justify-between">
//                   <div className="body3-sem w-[40%]">Duration</div>
//                   <div className="body3-reg pr-2 w-[60%]">
//                     {item.t_appt_duration} Min
//                   </div>
//                 </div>
//                 <div className="flex flex-row flex-wrap py-3 justify-between">
//                   <Button sx={{
//                     width:"100%",
//                     background:"#614298",
//                     color:"#FCFCFC",
//                     "&:hover": {
//                       background: "#614298",
//                     },
//                   }}
//                   onClick={()=> navigate(`/appointment/appointmentdetails/${item.t_appt_id}`)}
//                   >
//                     View More
//                   </Button>
//                 </div>
//               </div>
//             )}
//             <hr className="h-0.5 text-[#D9D9D9]" />
//           </div>
//         ))}
//         <TablePagination
//           className="body3-sem"
//           rowsPerPageOptions={[10, 25, 100, 125]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           labelRowsPerPage="Show:"
//           labelDisplayedRows={({ from, to, count }) =>
//             `${from}-${to} of ${count} items`
//           }
//         />
//       </div>
//     )}
