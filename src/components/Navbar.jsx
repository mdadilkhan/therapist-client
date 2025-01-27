import { useState } from "react";
import Logo from "../assets/logo.svg";
import NotificationIcon from "../assets/NotificationIcon.svg";
import UserIcon from "../assets/UserIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import { Popover } from "@mui/material";
import ContactSupport from "../assets/ContactSupport.svg";
import Logout from "../assets/Logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../store/slices/userSlices";
import { setRole } from "../store/slices/smsSlices";

const Navbar = () => {
  const userDetail = useSelector((state) => state.userDetails);

  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const location = useLocation();
  const navigate = useNavigate();

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleRightSidebar = (open) => {
    setIsRightSidebarOpen(open);
  };

  const handleProfileNavigate = (profileDetail) => {
    setAnchorEl(null);
    navigate(`/${profileDetail}`);
  };

  const handleLogout = () => {
    dispatch(userDetails(null));
    dispatch(setRole(null));
    localStorage.clear();
    setAnchorEl(null);
    navigate("/therapist");
  };
  return (
    <div
      className="w-full p-6 border-b-2 border-t-0 border-solid border-gray-2 z-50"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <img src={Logo} alt="" />
      {location.pathname !== "/therapist" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/client" &&
        location.pathname !== "/contact-us" &&
        location.pathname !== "/forgotpassword" &&
        location.pathname !== "/validateotp" && (
          <>
            <div style={{ display: "flex", gap: 16 }}>
              <img
                style={{ cursor: "pointer" }}
                src={NotificationIcon}
                alt=""
                onClick={() => toggleRightSidebar(true)}
              />
              <img
                style={{ cursor: "pointer" }}
                src={UserIcon}
                alt=""
                onClick={handleProfileClick}
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                className="profilePopover"
              >
                <div className="w-[194px] h-[130px] mx-4 my-5 flex flex-col justify-between ">
                  <div
                    className="flex p-4 gap-6 border-4 items-center cursor-pointer"
                    onClick={() => {
                      navigate("/therapist/profileDetails");
                      setAnchorEl(null); // Close the popover
                    }}
                  >
                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden object-cover">
                      <img
                        className="h-full w-full"
                        src={userDetail?.profile_image}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <p className="text-base text-[#06030D]">
                        {userDetail?.name}
                      </p>
                      <h3 className="text-[10px] text-[#7D748C] font-normal">
                        {userDetail?.profile_details?.specialization}
                      </h3>
                    </div>
                  </div>
                  <hr className="px-4" />
                  <div className="flex pl-4">
                    <img src={ContactSupport} alt="" />
                    <p
                      className="h-[30px] flex items-center text-[#06030D] text-base px-6 cursor-pointer"
                      onClick={() => {
                        navigate("/contactsupport");
                        setAnchorEl(null); // Close the popover
                      }}
                    >
                      Contact Support
                    </p>
                  </div>

                  <div className="flex pl-4">
                    <img src={Logout} alt="" />
                    <p
                      className="h-[30px] flex items-center text-[#06030D] text-base px-6 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </Popover>
            </div>
            <RightSidebar
              isOpen={isRightSidebarOpen}
              toggleSidebar={toggleRightSidebar}
            />
          </>
        )}
    </div>
  );
};

export default Navbar;
