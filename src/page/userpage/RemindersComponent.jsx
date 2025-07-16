// src/page/userpage/RemindersComponent.jsx
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import api from "../../config/api"; // ← Đảm bảo đúng đường dẫn

const RemindersComponent = () => {
  const userData = useSelector((state) => state.user) || {};
  const [reminderMessage, setReminderMessage] = useState("");

  const getNextDonationDate = (lastDonation) => {
    if (!lastDonation) return "Chưa có thông tin";
    const nextDate = new Date(
      new Date(lastDonation).setMonth(new Date(lastDonation).getMonth() + 3)
    );
    return nextDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleReminderClick = async () => {
    try {
      const response = await api.get("/user/get-remind"); // chỉ cần endpoint
      const msg = response.data?.message || "Đã nhận thông tin nhắc nhở.";
      toast.success(msg);
      setReminderMessage(msg);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi khi lấy thông tin nhắc nhở.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Nhắc nhở hiến máu
      </h3>
      <div className="space-y-4">
        <p className="text-gray-600">
          Thời gian phù hợp tiếp theo:{" "}
          <strong>{getNextDonationDate(userData.lastDonation)}</strong>
        </p>
        {reminderMessage && (
          <p className="text-green-600 font-medium">{reminderMessage}</p>
        )}
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
          onClick={handleReminderClick}
        >
          <FaBell className="mr-2" /> Nhận nhắc nhở
        </button>
      </div>
    </div>
  );
};

export default RemindersComponent;
