import React, { useState, useEffect, lazy } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "../store/slices/userSlices";
import { setRole } from "../store/slices/smsSlices";
import { Box, Button, Drawer } from "@mui/material";
import Dashboard from "../assets/Dashboard.svg";
import Assessment from "../assets/Assessment.svg";
import Activities from "../assets/Activities.svg";
import Appointment from "../assets/Appointment.svg";
import Profile from "../assets/Profile.svg";
import Refrals from "../assets/Refrals.svg";
import ContactSupport from "../assets/ContactSupport.svg";
import Calendar from "../assets/Calendar.svg";
import Clients from "../assets/Students.svg";
import Logout from "../assets/Logout.svg";
import { useNavigate } from "react-router-dom";
import UpArrow from "../assets/UpArrow.svg"; // Import up arrow
import DownArrow from "../assets/DownArrow.svg";

import { NavLink, useLocation } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

const menuItem = [
  {
    path: "/therapist/dashboards",
    name: "Dashboard",
    icon: Dashboard,
    isAccordion: false,
  },
  {
    path: "/therapist/calendar",
    name: "Calendar",
    icon: Calendar,
    isAccordion: false,
  },
  {
    path: "/therapist/appointments",
    name: "Appointment",
    icon: Appointment,
    isAccordion: true,
  },
  {
    path: "/therapist/clients",
    name: "Clients",
    icon: Clients,
    isAccordion: false,
  },
  {
    path: "/therapist/group-session",
    name: "Group Session ",
    icon: Clients,
    isAccordion: false,
  },
  {
    path: "/therapist/live-chat",
    name: "Live Chat",
    icon: Assessment,
    isAccordion: false,
  },
  {
    path: "/therapist/referral",
    name: "Referral",
    icon: Refrals,
    isAccordion: false,
  },
  {
    path: "/therapist/profile",
    name: "Profile",
    icon: Profile,
    isAccordion: true,
  },
  {
    path: "/therapist/supervision",
    name: "Supervision",
    icon: Assessment,
    isAccordion: false,
  },
  {
    path: "/therapist/selftherapy",
    name: "Self therapy session",
    icon: Profile,
    isAccordion: false,
  },
  {
    path: "/therapist/assessments",
    name: "Assessments",
    icon: Assessment,
    isAccordion: false,
  },
  {
    path: "/therapist/activities",
    name: "Activities",
    icon: Activities,
    isAccordion: false,
  },
];

const TherapistSidebar = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [profileAccordionOpen, setProfileAccordionOpen] = useState(false);
  const [profileMargin, setProfileMargin] = useState(false);
  const [appointmentAccordionOpen, setAppointmentAccordionOpen] =
    useState(false);
  const [appointmentMargin, setAppointmentMargin] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const initialSelectedDiv = selectedMenuItem
    ? selectedMenuItem.name
    : "Dashboard";
  const [selectedDiv, setSelectedDiv] = useState(initialSelectedDiv);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [value, setValue] = useState("1");

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
    setSelectedMenuItem(
      menuItem.find((item) => currentPath.includes(item.path))
    );
    setSelectedDiv(
      menuItem.find((item) => currentPath.includes(item.path))?.name
    );
  }, [location.pathname]);

  const handleDivClick = (divId) => {
    setAppointmentAccordionOpen(false);
    setProfileAccordionOpen(false);
    setSelectedDiv(divId);
  };
  const handleProfileAccordionToggle = () => {
    setProfileAccordionOpen(!profileAccordionOpen);
    setProfileMargin(!profileMargin);
  };

  const handleAppointmentAccordionToggle = () => {
    setAppointmentAccordionOpen(!appointmentAccordionOpen);
    setAppointmentMargin(!appointmentMargin);
  };

  const [state, setState] = useState(false);

  const toggleDrawer = () => {
    setState((prevState) => !prevState);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == "1") {
      navigate("/therapist/profileDetails");
    } else if (newValue == "2") {
      navigate("/therapist/profileTimeline");
    } else if (newValue == "3") {
      navigate("/therapist/pricing");
    }
  };

  return (
    <>
      {viewportWidth >= 640 ? (
        <div
          style={{
            width: "235px",
            display: "flex",
            height: "100vh-64px",
            overflow: "auto",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none",
          }}
        >
          <div
            style={{
              display:
                location.pathname === "/therapist" ||
                location.pathname === "/therapist/forgotpassword" ||
                location.pathname === "/therapist/verifyotp" ||
                location.pathname === "/signup/therapist"
                  ? "none"
                  : undefined,
              width: "235px",
              borderRight: "2px solid #D5D2D9",
              padding: "2px 16px 16px 0px",
              height: "100vh",
            }}
          >
            {menuItem.map((item, index) => (
              <div key={index} style={{ position: "relative" }}>
                {item.isAccordion ? (
                  <>
                    <div
                      className="link"
                      onClick={
                        item.name == "Profile"
                          ? handleProfileAccordionToggle
                          : handleAppointmentAccordionToggle
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="gap-4 deactive sidebar-navigation">
                        <img src={item.icon} alt="" />
                        {item.name}
                        <img
                          src={
                            (item.name === "Profile" && profileAccordionOpen) ||
                            (item.name === "Appointment" &&
                              appointmentAccordionOpen)
                              ? UpArrow
                              : DownArrow
                          }
                          alt="Arrow"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                    {profileAccordionOpen &&
                      (item.name == "Profile" ? (
                        <>
                          <NavLink
                            to="/therapist/profileDetails"
                            className="deactive sidebar-navigation2"
                            activeClassName="active"
                          >
                            Profile Details
                          </NavLink>
                          <NavLink
                            to="/therapist/profileTimeline"
                            className="deactive sidebar-navigation2"
                            activeClassName="active"
                          >
                            Time Schedule
                          </NavLink>
                          <NavLink
                            to="/therapist/pricing"
                            className="deactive sidebar-navigation2"
                            activeClassName="active"
                          >
                            Pricing
                          </NavLink>
                        </>
                      ) : (
                        <></>
                      ))}
                    {appointmentAccordionOpen &&
                      (item.name == "Appointment" ? (
                        <>
                          <NavLink
                            to="/therapist/upcomming-appointments"
                            className="deactive sidebar-navigation2"
                            activeClassName="active"
                          >
                            Upcoming
                          </NavLink>
                          <NavLink
                            to="/therapist/past-appointments"
                            className="deactive sidebar-navigation2"
                            activeClassName="active"
                          >
                            Past
                          </NavLink>
                        </>
                      ) : (
                        <></>
                      ))}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="deactive sidebar-navigation"
                    activeClassName="active"
                    onClick={handleDivClick}
                  >
                    <div className="icon">
                      <img src={item.icon} alt="" />
                    </div>
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                top: "3vh",
              }}
            >
              <NavLink
                to={"/contactsupport"}
                className="deactive sidebar-navigation"
                activeClassName="active"
              >
                <div className="icon">
                  <img src={ContactSupport} alt="" />
                </div>
                Contact Support
              </NavLink>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                top: "3vh",
                paddingLeft: "16px",
                height: "40px",
              }}
            >
              <img src={Logout}></img>
              <Button
                className="body3-bold deactive"
                style={{ textTransform: "capitalize" }}
                onClick={() => {
                  dispatch(userDetails(null));
                  dispatch(setRole(null));
                  localStorage.clear();
                  navigate("/therapist");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col gap-5 p-4 w-full overflow-x-auto ${
              location.pathname === "/therapist" ||
              location.pathname === "/therapist/forgotpassword" ||
              location.pathname === "/therapist/verifyotp"
                ? "hidden"
                : ""
            }`}
          >
            <div className="flex flex-row gap-5 p-4 w-full overflow-x-auto">
              {menuItem.map((menu, index) => (
                <div
                  onClick={() => {
                    handleDivClick(menu.name);
                    {
                      menu.name == "Profile"
                        ? navigate("/therapist/profileDetails")
                        : navigate(menu.path);
                    }
                  }}
                  className={`flex flex-col cursor-pointer justify-center items-center gap-4 w-[30%] rounded-lg px-2 py-3  ${
                    selectedDiv === menu.name ? "bg-[#C0ACE0]" : "bg-[#F4EDFF]"
                  }`}
                  key={index}
                >
                  <img className="w-[24px]" src={menu.icon} alt="" />
                  <p className="overline-sem w-[65px] text-center">
                    {menu.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <p
                onClick={toggleDrawer}
                className="overline-sem text-[#341766] cursor-pointer w-fit"
              >
                view all
              </p>
            </div>
            {currentPath == "/therapist/profileDetails" ||
            currentPath == "/therapist/pricing" ||
            currentPath == "/therapist/profileTimeline" ? (
              <TabContext value={value}>
                <Box
                  className="w-full flex justify-center"
                  style={{ borderBottom: "1px solid #D5D2D9" }}
                >
                  <TabList
                    onChange={handleTabChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="Profile Details"
                      value="1"
                      sx={{
                        color: "#06030D",
                        fontFamily: "Quicksand",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "normal",
                        letterSpacing: "0.1px",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          fontSize: "16px",
                        },
                        "&.Mui-selected": {
                          color: "#06030D",
                          fontFamily: "Quicksand",
                          fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: "700",
                          lineHeight: "normal",
                          letterSpacing: "0.1px",
                          "@media (max-width: 640px)": {
                            fontSize: "16px",
                          },
                        },
                      }}
                    />
                    <Tab
                      label="Time Scheduling"
                      value="2"
                      sx={{
                        color: "#06030D",
                        fontFamily: "Quicksand",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "normal",
                        letterSpacing: "0.1px",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          fontSize: "16px",
                        },
                        "&.Mui-selected": {
                          color: "#06030D",
                          fontFamily: "Quicksand",
                          fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: "700",
                          lineHeight: "normal",
                          letterSpacing: "0.1px",
                          "@media (max-width: 640px)": {
                            fontSize: "16px",
                          },
                        },
                      }}
                    />
                    <Tab
                      label="Pricing"
                      value="3"
                      sx={{
                        color: "#06030D",
                        fontFamily: "Quicksand",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "normal",
                        letterSpacing: "0.1px",
                        textTransform: "capitalize",
                        "@media (max-width: 640px)": {
                          fontSize: "16px",
                        },
                        "&.Mui-selected": {
                          color: "#06030D",
                          fontFamily: "Quicksand",
                          fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: "700",
                          lineHeight: "normal",
                          letterSpacing: "0.1px",
                          "@media (max-width: 640px)": {
                            fontSize: "16px",
                          },
                        },
                      }}
                    />
                  </TabList>
                </Box>
              </TabContext>
            ) : null}
            <div>
              <Drawer
                className="relative drawer-top-view"
                anchor="top"
                open={state}
                onClose={toggleDrawer}
              >
                <div className="py-20">
                  <div className="flex flex-wrap justify-center gap-5 p-4 w-full overflow-x-auto">
                    {menuItem.map((menu, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleDivClick(menu.name);
                          {
                            menu.name == "Profile"
                              ? navigate("/therapist/profileDetails")
                              : navigate(menu.path);
                          }
                          toggleDrawer();
                        }}
                        className={`flex flex-col cursor-pointer justify-center items-center gap-4 w-[40%] rounded-lg px-2 py-3  ${
                          selectedDiv === menu.name
                            ? "bg-[#C0ACE0]"
                            : "bg-[#F4EDFF]"
                        }`}
                      >
                        <img className="w-[24px]" src={menu.icon} alt="" />
                        <p className="overline-sem">{menu.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Drawer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TherapistSidebar;
