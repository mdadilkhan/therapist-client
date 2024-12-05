import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../constant/ApiConstant";

const Overview = () => {
  const [data, setData] = useState([]);

  const getMonthlyAppointment = () => {
    axios
      .get(`${API_URL}/getMonthlyAppointmentData`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    getMonthlyAppointment();
  }, []);
  return (
    <div className="overview w-[100%] h-[230px]">
      <div className="flex justify-between sm:mb-0 mb-4">
        <h2 className="sm:h6-bold p4-bold text-[#4A2D7F] mb-0 sm:mb-[17px]">
          Overview
        </h2>
        <div className="flex gap-5">
          <div className="flex gap-2 items-center">
            <div className="w-[16px] h-[16px] bg-[#9C81CC] rounded"></div>
            <h1 className="sm:para-bold body4-reg text-[14px] text-[#000]">
              Appointment
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-[16px] h-[16px] bg-[#C0ACE0] rounded"></div>
            <h1 className="sm:para-bold body4-reg text-[14px] text-[#000]">
              Preconsultations
            </h1>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="8 4" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#F2F2F2", borderRadius: "10px" }}
            itemStyle={{ color: "#000" }}
          />
          <Bar dataKey="appointment" fill="#9C81CC" radius={[20, 20, 20, 20]} />
          <Bar
            dataKey="preconsultation"
            fill="#C0ACE0"
            radius={[20, 20, 20, 20]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Overview;
