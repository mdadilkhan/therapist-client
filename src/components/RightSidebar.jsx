import React, { useState, useEffect, useCallback } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import CrossLogo from "../assets/CrossLogo.svg";
import NotificationImage from "../assets/NotificationImage.svg";
import { API_URL } from "../constant/ApiConstant";
import { useSocket } from "../getSocket";
import { getDaysDifference } from "../constant/constatnt";
import { useSelector } from "react-redux";
const RightSidebar = ({ isOpen, toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationDeleted, setNotificationDeleted] = useState(false); // Track notification deletion
  const details = useSelector((state) => state.userDetails);
  console.log(details);
  const socket = useSocket();

  const handleNotifications = useCallback((data) => {
    console.log("Received notification data:", data);
    setNotifications((prevNotifications) => {
      const newNotifications = data?.filter(
        (newNotif) =>
          !prevNotifications.some((prevNotif) => prevNotif._id === newNotif._id)
      );
      return [...prevNotifications, ...newNotifications];
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("notif", details.id);
  }, [socket, details.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("notifications", handleNotifications);

    socket.on("notifications", (data) => {
      console.log(data, "emitted data from server");
    });

    return () => {
      socket.off("notifications", handleNotifications);
      console.log("notifications listener removed");
    };
  }, [socket, handleNotifications]);

  const deleteNotification = (notificationId) => {
    socket.emit("deleteNotification", {
      userId: details.id, 
      notificationId: notificationId,
    });
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif._id !== notificationId)
    );
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onClose={() => toggleSidebar(false)}
      onOpen={() => toggleSidebar(true)}
    >
      <div className="bg-[#F2F2F2] h-screen sm:w-[500px] w-full px-2">
        <div className="p-8">
          <div className="flex flex-row items-center gap-16 text-[#4A2D7F]">
            <div
              className=" flex flex-row justify-center items-center w-12 h-12 border border-solid rounded-full p-4 cursor-pointer"
              onClick={() => {
                toggleSidebar(false);
              }}
            >
              <img className="w-5" src={CrossLogo} alt="" />
            </div>
            <h5 className="h5-bold">Notifications</h5>
          </div>
        </div>

        <div className="mt-4">
          {notifications.length <= 0 ? (
            <p>No notifications available</p>
          ) : (
            notifications.map((item, index) => (
              <div
                key={index}
                className="mt-2 bg-[#F4EDFF] border border-solid shadow-md border-[#B7B2BF]"
                style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
              >
                <div className="flex items-center py-2 pl-6 pr-4 gap-4">
                  <div>
                    <img src={NotificationImage} alt="" />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="body1-bold text-[#06030D]">{item?.title}</p>
                      <p className="over1-sem">{item?.message}</p>
                      {/* <p className="over1-sem">{item?.userId}</p>
                      <p className="over1-sem">patient {item?.message}</p> */}
                    </div>
                    <p className="over1-sem">
                      {getDaysDifference(item?.createdAt)}
                    </p>
                  </div>
                  <div className="ml-auto pr-4 cursor-pointer">
                    <img
                      src={CrossLogo}
                      alt=""
                      onClick={() => {
                        deleteNotification(item._id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default RightSidebar;