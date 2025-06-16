// src/page/userpage/AppointmentsComponent.jsx
import React, { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../config/api";
import { useSelector } from "react-redux";

const AppointmentsComponent = () => {
  const userData = useSelector((state) => state.user) || {};
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get(`/appointments/${userData.id}`);
        setAppointments(response.data);
      } catch (error) {
        setAppointments([
          {
            id: 1,
            date: "20-03-2024",
            time: "10:00 Sáng",
            location: "Bệnh Viện Chợ Rẫy",
            status: "Đã Xác Nhận",
          },
        ]);
      }
    };

    if (userData.id) {
      fetchAppointments();
    }
  }, [userData.id]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch Hẹn Sắp Tới
      </h3>
      {appointments.length === 0 ? (
        <p className="text-gray-600">Chưa có lịch hẹn nào.</p>
      ) : (
        appointments.map((appointment, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaCalendar className="text-red-600 text-xl mr-3" />
                <span className="font-semibold text-lg">
                  {appointment.date}
                </span>
              </div>
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                {appointment.status}
              </span>
            </div>
            <div className="flex items-center text-gray-700 text-base mb-2">
              <FaClock className="mr-3" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center text-gray-700 text-base">
              <FaMapMarkerAlt className="mr-3" />
              <span>{appointment.location}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentsComponent;
