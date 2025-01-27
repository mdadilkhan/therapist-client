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
import Wallet from "../assets/Wallet.svg";
import ContactSupport from "../assets/ContactSupport.svg";
import Logout from "../assets/Logout.svg";
import Clients from "../assets/Students.svg";
import { useNavigate } from "react-router-dom";
const Navbar = lazy(() => import("./Navbar"));

import { NavLink, useLocation } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

// import './Sidebar.css'
const menuItem = [
  {
    path: "/client/dashboards",
    name: "Dashboard",
    icon: Dashboard,
    isAccordion: false,
  },
  {
    path: "/client/appointments",
    name: "Appointment",
    icon: Appointment,
    isAccordion: false,
  },
  {
    path: "/client/group-session",
    name: "Group Session ",
    icon: Clients,
    isAccordion: false,
  },
  {
    path: "/client/refered-therapist-list",
    name: "Refered Therapist",
    icon: Profile,
    isAccordion: false,
  },
  {
    path: "/client/live-chat",
    name: "Live Chat",
    icon: Assessment,
    isAccordion: false,
  },
  {
    path: "/client/profileDetails",
    name: "Profile",
    icon: Profile,
    isAccordion: false,
  },
  {
    path: "/client/assessments",
    name: "Assessments",
    icon: Assessment,
    isAccordion: false,
  },
  {
    path: "/client/activities",
    name: "Activities",
    icon: Activities,
    isAccordion: false,
  },
  {
    path: "/client/wallet",
    name: "Wallet",
    icon: Wallet,
    isAccordion: false,
  },
];

const ClientSidebar = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [profileAccordionOpen, setProfileAccordionOpen] = useState(false);
  const [profileMargin, setProfileMargin] = useState(false);
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
    setSelectedDiv(divId);
    setProfileAccordionOpen(false);
  };
  const handleProfileAccordionToggle = () => {
    setProfileAccordionOpen(!profileAccordionOpen);
    setProfileMargin(!profileMargin);
  };

  const [state, setState] = useState(false);

  const toggleDrawer = () => {
    setState((prevState) => !prevState);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == "1") {
      navigate("/client/profileDetails");
    } else if (newValue == "2") {
      navigate("/client/profileTimeline");
    }
  };

  return (
    <>
      {viewportWidth >= 640 ? (
        <div
          style={{ display: "flex", height: "100vh-64px" }}
        >
          <div
            style={{
              display:
                location.pathname === "/client" ||
                location.pathname === "/client/forgotpassword" ||
                location.pathname === "/client/verifyotp" ||
                location.pathname === "/client/form" ||
                location.pathname === "/client/thank" ||
                location.pathname === "/signup"
                  ? "none"
                  : undefined,
              width: "235px",
              borderRight: "2px solid #D5D2D9",
              padding: "2px 16px 16px 0px",
              height: "91vh",
            }}
          >
            {menuItem.map((item, index) => (
              <div key={index} style={{ position: "relative" }}>
                {item.isAccordion ? (
                  <>
                    <div
                      className="link"
                      onClick={handleProfileAccordionToggle}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="gap-4 deactive sidebar-navigation">
                        <img src={item.icon} alt="" />
                        {item.name}
                      </div>
                    </div>
                    {profileAccordionOpen && (
                      <>
                        <NavLink
                          to="/client/profileDetails"
                          className="deactive sidebar-navigation2"
                          activeClassName="active"
                        >
                          Profile Details
                        </NavLink>
                        <NavLink
                          to="/client/profileTimeline"
                          className="deactive sidebar-navigation2"
                          activeClassName="active"
                        >
                          Time Schedule
                        </NavLink>
                      </>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="deactive sidebar-navigation"
                    onClick={handleDivClick}
                    activeClassName="active"
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
                top: "26vh",
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
                top: "26vh",
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
                  navigate("/client");
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
              location.pathname === "/client" ||
              location.pathname === "/forgotpassword" ||
              location.pathname === "/verifyotp" ||
              location.pathname === "/client/assessments" ||
              location.pathname === "/client/form" ||
              location.pathname === "/client/thank"
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
                      navigate(menu.path);
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
            {currentPath == "/client/profileDetails" ||
            currentPath == "/client/profileTimeline" ? (
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
                              ? navigate("/client/profileDetails")
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

export default ClientSidebar;
