import { parse, format } from "date-fns";
import { enGB } from "date-fns/locale";

export function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);

  // Get the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has occurred this year
  const todayMonth = today.getMonth();
  const birthMonth = birthDate.getMonth();

  if (
    todayMonth < birthMonth ||
    (todayMonth === birthMonth && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Handle NaN or negative age
  return isNaN(age) || age < 0 ? 0 : age;
}

export const getDayName = (day) => {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "";
  }
};

export const getDayIndex = (dayAbbreviation) => {
  switch (dayAbbreviation) {
    case "Sun":
      return 0;
    case "Mon":
      return 1;
    case "Tue":
      return 2;
    case "Wed":
      return 3;
    case "Thu":
      return 4;
    case "Fri":
      return 5;
    case "Sat":
      return 6;
    default:
      return -1;
  }
};

export const changeAppoitmentStatus = (status) => {
  switch (status) {
    case 1:
      return { status: "Pending", color: "#F4EDFF" };
    case 2:
      return { status: "Complete", color: "#ECFFBF" };
    case 3:
      return { status: "Refer to Sage", color: "#f2f2f2" };
    case 5:
      return { status: "Cancelled", color: "#F8DDDF" };
    default:
      return { status: "", color: "#000000" };
  }
};

export function getReportType(value) {
  switch (value) {
    case 1:
      return "Brief";
    case 2:
      return "Intervention";
    case 3:
      return "Assessment";
    case 4:
      return "Activities";
    default:
      return "Unknown MB Type";
  }
}
export function extractTimeFromCreatedAt(createdAt) {
  const date = new Date(createdAt);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
export function getBookingType(value) {
  switch (value) {
    case "1":
      return "In-Person";
    case "2":
      return "Video";
    case "3":
      return "Call";
    default:
      return "None";
  }
}
export function convertTo12HourFormat(time24) {
  if (!time24) {
    return time24;
  }
  const [hours, minutes] = time24.split(":");

  let hours12 = parseInt(hours, 10);
  const ampm = hours12 >= 12 ? "PM" : "AM";
  hours12 = hours12 % 12 || 12;

  const time12 = `${hours12}:${minutes} ${ampm}`;

  return time12;
}

export function getformatedDate(inputDate) {
  const dateObject = new Date(inputDate);

  if (isNaN(dateObject.getTime())) {
    return "Invalid date";
  }

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(dateObject.getFullYear());

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function getNamedDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if dateString is a string
  if (typeof dateString !== "string") {
    throw new Error("Input must be a string");
  }
  const parts = dateString.split("-");
  if (parts.length !== 3) {
    throw new Error('Input must be in the format "YYYY-MM-DD"');
  }

  const day = parseInt(parts[2], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[0], 10);

  if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) {
    throw new Error("Date parts must be valid numbers");
  }

  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error("Month must be between 1 and 12");
  }

  const formattedDate = `${day} ${months[monthIndex]} ${year}`;
  return formattedDate;
}

export function truncateString(str, numWords) {
  // Split the string into words
  const words = str.split(" ");

  // Return the truncated string with ellipsis if there are more words than numWords
  return (
    words.slice(0, numWords).join(" ") + (words.length > numWords ? "..." : "")
  );
}

export function formatDateAndDay(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [year, month, day] = dateString.split("-");
  const monthName = months[parseInt(month, 10) - 1];

  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

export function getTimeInterval(dateValue) {
  console.log(dateValue);
  
  if(dateValue){
    const { date, time } = dateValue;
    // Parse the date and time
    const parsedDate = parse(`${date} ${time}`, "dd-MM-yyyy HH:mm", new Date());
  
    // Format the date and time
    const formattedDate = format(parsedDate, "dd-MM-yyyy, hh:mm a, EEEE", {
      locale: enGB,
    });

    return formattedDate;
  }else{
    return ""
  }

 

}

export function getFormatDate(isoString) {
  const date = new Date(isoString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-11
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
export function getDaysDifference(dateString) {
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifference = currentDate - givenDate;

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return "today";
  } else if (daysDifference === 1) {
    return "1 day ago";
  } else {
    return `${daysDifference} days ago`;
  }
}

export function getJoinMeet(row) {
  console.log("asdjgajdgfh", row);
  
  const currentDate = new Date().toDateString();
  const bookingDate = new Date(row.booking_date).toDateString();
  const scheduledTime = new Date(`${currentDate} ${row?.booking_slots[0].m_schd_from}`).getTime();
  const currentTime = new Date().getTime();
  const bookingDuration = row?.booking_duration * 60000;
  
  // Subtract 30 minutes (in milliseconds) from the scheduled time
  const joinTime = scheduledTime - 30 * 60000;

  return (
    bookingDate === currentDate &&
    joinTime <= currentTime && // Join enabled 30 mins before scheduledTime
    currentTime <= scheduledTime + bookingDuration // Join allowed until booking duration ends
  );
}