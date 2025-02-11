import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LinearProgress from "@mui/material/LinearProgress";
import Sidebar from "./pages/Sidebar/Sidebar.jsx"; 
const ClientLogin = lazy(() => import("./components/ClientLogin"));
const TherapistLogin = lazy(() => import("./components/TherapistLogin"));
const ClientSignUp = lazy(() => import("./components/ClientSignUp"));
const TherapistSignUp = lazy(() => import("./components/TherapistSignUp"));
const TherapistDashboard = lazy(() =>
  import("./components/TherapistDashboard")
);
const ClientAppointmentDetails = lazy(() =>
  import("./components/ClientAppointment/AppointmentDetails.jsx")
);
const ClientDashboard = lazy(() => import("./components/ClientDashboard"));
const Calender = lazy(() => import("./components/Calender"));
const PastAppointment = lazy(() =>
  import("./components/Appointment/PastAppointments")
);
const PreClientAppointment = lazy(() =>
  import("./components/ClientAppointment/PreAppointment")
);
const ListOfTherapist = lazy(() => import("./components/ListOfTherapist"));
const PreClientAppointmentType = lazy(() =>
  import("./components/ClientAppointment/PreAppointmentType")
);
const UpcommingAppointment = lazy(() =>
  import("./components/Appointment/UpcommingAppointments")
);
const AppointmentDetails = lazy(() =>
  import("./components/Appointment/AppointmentDetails")
);
const Clients = lazy(() => import("./components/Client/Clients"));
const ClientDetails = lazy(() => import("./components/Client/ClientDetails"));
const SuperVisions = lazy(() => import("./components/SuperVision.jsx"));
const SelfTherapy = lazy(() => import("./components/SelfTherapy.jsx"));
const Referal = lazy(() => import("./components/Refrals"));
const ProfileDetails = lazy(() =>
  import("./components/Profile/ProfileDetails")
);
const ClientGroupSession = lazy(() =>
  import("./components/GroupSession/ClientGroupSession")
);
const TherapistGroupSession = lazy(() =>
  import("./components/GroupSession/TherapistGroupSession")
);
const SceduleSession = lazy(() =>
  import("./components/GroupSession/SceduleSession.jsx")
);
const AddClientInSessation = lazy(() =>
  import("./components/GroupSession/AddClientInSessation.jsx")
);
// const ClientWelcome=lazy(()=>{
//   import("./components/Clientwelcome.jsx")
// })
import ClientWelcome from "./components/Clientwelcome.jsx"

const TherapistLiveChat = lazy(() =>
  import("./components/TherapistLiveChat/TherapistLiveChat.jsx")
);
const AppointmentBooked = lazy(() =>
  import("./components/ClientAppointment/AppointmentBooked")
);
const ClientLiveChat = lazy(() =>
  import("./components/ClientLiveChat/ClientLiveChat.jsx")
);
const ClientProfileDetails = lazy(() =>
  import("./components/ClientProfileDetails")
);
const ProfileTimeLine = lazy(() =>
  import("./components/Profile/ProfileTimeLine")
);
const Assessments = lazy(() => import("./components/Assessment"));
const Activities = lazy(() => import("./components/Activities"));
const Reports = lazy(() => import("./components/Reports"));
const ContactSupport = lazy(() => import("./components/ContactSupport"));
const EarningDetails = lazy(() => import("./components/EarningDetails"));
const ClientSessationNotes = lazy(() =>
  import("./components/ClientHistory/ClientSessationNotes")
);
const VerifyOtp = lazy(() => import("./components/VerifyOtp"));
const ValidateOtp = lazy(() => import("./components/ValidateOtp.jsx"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
import "./App.css";
import axios from "axios";
import Navbar from "./components/Navbar.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import ProfileConsultationPricing from "./components/Profile/ProfileConsultationPricing.jsx";
import ReferedTherapistList from "./components/ReferedTherapistList.jsx";
import { HelmetProvider } from "react-helmet-async";
import DynamicTitle from "./SEO/DynamicTitle.jsx";
const Wallet = lazy(() => import("./components/Wallet.jsx"));

const ClientHistory = lazy(() =>
  import("./components/ClientHistory/ClientHistory.jsx")
);
const TherapistAppointmentType = lazy(() =>
  import("./components/ClientAppointment/TherapistAppointmentType.jsx")
);
const TherapistAppointment = lazy(() =>
  import("./components/ClientAppointment/TherapistAppointment.jsx")
);
const TherapistProfile = lazy(() =>
  import("./components/TherapistProfile.jsx")
);
const GrpupSessationDetails = lazy(() =>
  import("./components/GroupSession/SessionDetials.jsx")
);
const ClientGroupSessationDetials = lazy(() =>
  import("./components/GroupSession/ClientGroupSessationDetials.jsx")
);

const PrivateRoute = ({ allowedRoles }) => {
  const { role } = useSelector((state) => state.userDetails);
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    const redirectPath = "/client";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const { role } = useSelector((state) => state.userDetails);
  const location = useLocation();

  if (role) {
    // Redirect to the appropriate dashboard based on the role
    return <Navigate to={role === "therapist" ? "/therapist/dashboards" : "/client/dashboards"} replace />;
  }

  return <Outlet />; // Render public route if no user is authenticated
};
const Layout = ({ children }) => {
  const { role } = useSelector((state) => state.userDetails);

  const location = useLocation();
  const noSidebarPaths = [
    "/client",
    "/client/",
    "/therapist/",
    "/therapist",
    "/verifyotp",
    "/verifyotp/",
    "/forgotpassword",
    "/forgotpassword/",
    "/signup/therapist",
    "/signup/therapist/",
    "/signup",
    "/signup/",
    "/validateotp",
    "/validateotp/",
    "/contact-us/",
    "/contact-us",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {!noSidebarPaths.includes(location.pathname) && <Sidebar role={role} />}
      <main style={{ overflowY: "auto", maxHeight: "90vh" }} className="w-full">
        {children}
      </main>
    </div>
  );
};



function App() {
  const { token } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

console.log(token);


  useEffect(() => {
    let logoutTimer;

    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      const currentTime = Date.now() / 1000; // Current time in seconds
      const timeLeft = decodedToken.exp - currentTime; // Remaining time in seconds

      if (timeLeft <= 0) {
        handleLogout(); // If token is already expired
      } else {
        logoutTimer = setTimeout(() => {
          handleLogout();
        }, timeLeft * 1000); // Set timer to log out when token expires
      }

      console.log("Token expiry in:", timeLeft, "seconds");
    }
    return () => clearTimeout(logoutTimer);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "USER_LOGOUT" }); // Adjust based on your Redux actions
    window.location.href = "/client";
  };

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <DynamicTitle />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <Suspense fallback={<LinearProgress />}>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <Layout>
            <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/client" element={<ClientLogin />} />
              <Route path="/therapist" element={<TherapistLogin />} />
              <Route path="/verifyotp" element={<VerifyOtp />} />
              <Route path="/validateotp" element={<ValidateOtp />} />
              <Route path="/contactsupport" element={<ContactSupport />} />
              <Route path="/contact-us" element={<ContactSupport />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/signup" element={<ClientSignUp />} />
              <Route path="/signup/therapist" element={<TherapistSignUp />} />
              </Route>
              
              {/* Protected Routes for therapist*/}
              <Route element={<PrivateRoute allowedRoles={["therapist"]} />}>

                <Route
                  path="/therapist/dashboards"
                  element={<TherapistDashboard />}
                />
                <Route
                  path="/therapist/group-session"
                  element={<TherapistGroupSession />}
                />
                <Route
                  path="/therapist/schedule-session"
                  element={<SceduleSession />}
                />
                <Route
                  path="/therapist/add-client-in-sessation/:sessationId"
                  element={<AddClientInSessation />}
                />
                <Route
                  path="/therapist/groupDetails/:sessationId"
                  element={<GrpupSessationDetails />}
                />

                <Route
                  path="/therapist/live-chat"
                  element={<TherapistLiveChat />}
                />
                <Route
                  path="/therapist/supervision/:id?"
                  element={<SuperVisions />}
                />
                <Route
                  path="/therapist/selftherapy/:id?"
                  element={<SelfTherapy />}
                />
                <Route
                  path="/therapist/earning-details"
                  element={<EarningDetails />}
                />
                <Route path="/therapist/calendar/:id?" element={<Calender />} />
                <Route
                  path="/therapist/calendar/client/:empId?"
                  element={<Calender />}
                />
                <Route
                  path="/therapist/pricing"
                  element={<ProfileConsultationPricing />}
                />

                <Route
                  path="/therapist/pricing"
                  element={<ProfileConsultationPricing />}
                />
                <Route
                  path="/therapist/past-appointments"
                  element={<PastAppointment />}
                />

                <Route
                  path="/therapist/upcomming-appointments"
                  element={<UpcommingAppointment />}
                />
                <Route
                  path="/therapist/clients/clientsDetails/:id/clienthistory"
                  element={<ClientHistory />}
                />
                <Route path="/therapist/referral" element={<Referal />} />
                <Route
                  path="/therapist/profileDetails"
                  element={<ProfileDetails />}
                />
                <Route
                  path="/therapist/profileTimeline"
                  element={<ProfileTimeLine />}
                />
                <Route
                  path="/therapist/assessments"
                  element={<Assessments />}
                />
                <Route path="/therapist/activities" element={<Activities />} />
                <Route path="/therapist/reports" element={<Reports />} />
                <Route
                  path="/therapist/appointment/appointmentdetails/:id"
                  element={<AppointmentDetails />}
                />
                <Route path="/therapist/clients" element={<Clients />} />
                <Route
                  path="/therapist/clientDetails/:id/:type"
                  element={<ClientDetails />}
                />
                <Route
                  path="/therapist/clientDetails/employeehistory/:id"
                  element={<ClientHistory />}
                />
                <Route
                  path="/therapist/clientsessationnotes/:id/:sessionId?"
                  element={<ClientSessationNotes />}
                />
                <Route
                  path="/therapist/clientsessationnotes/:id"
                  element={<ClientSessationNotes />}
                />
                 <Route path="*" element={<Navigate to="/therapist/dashboards"/>} />
              </Route>
              <Route element={<PrivateRoute allowedRoles={["user"]} />}>

              {/* Protected Routes for user*/}
             
                <Route path="/client/wallet" element={<Wallet />} />
                <Route
                  path="/client/therapist-list"
                  element={<ListOfTherapist />}
                />
                <Route
                  path="/client/profileDetails"
                  element={<ClientProfileDetails />}
                />
                <Route
                  path="/client/therapistprofile/:therapistId"
                  element={<TherapistProfile />}
                />
                <Route path="/client/live-chat" element={<ClientLiveChat />} />
                <Route
                  path="/client/dashboards"
                  element={<ClientDashboard />}
                />
                <Route
                  path="/client/appointments"
                  element={<PreClientAppointment />}
                />
                <Route
                  path="/client/preappointmenttype"
                  element={<PreClientAppointmentType />}
                />
                <Route
                  path="/client/appointments/therapist/:therapistId?"
                  element={<TherapistAppointment />}
                />
                <Route
                  path="/client/appointment/appointmentdetails/:id"
                  element={<ClientAppointmentDetails />}
                />
                <Route
                  path="/client/appointment-booked"
                  element={<AppointmentBooked />}
                />
                <Route
                  path="/client/therapistappointmenttype/:therapistId?"
                  element={<TherapistAppointmentType />}
                />
                <Route
                  path="/client/group-session"
                  element={<ClientGroupSession />}
                />
                <Route
                  path="/client/refered-therapist-list"
                  element={<ReferedTherapistList />}
                />
                <Route
                  path="/client/dashboards"
                  element={<ClientDashboard />}
                />
                <Route path="/client/assessments" element={<Assessments />} />
                <Route path="/client/activities" element={<Activities />} />
                <Route
                  path="/client/client-group-sessation-details/:sessationId"
                  element={<ClientGroupSessationDetials />}
                />
                <Route path="*" element={<Navigate to="/client/dashboards"/>} />
              </Route>
              <Route path="*" element={<Navigate to="/client"/>} />
            </Routes>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
