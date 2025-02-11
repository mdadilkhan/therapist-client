export const API_URL = "http://localhost:5001/api";
// export const API_URL = "https://therapist-server.onrender.com/api";
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
