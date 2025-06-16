// src/page/userpage/RemindersComponent.jsx
import React from "react";
import { FaClock, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const RemindersComponent = () => {
  const userData = useSelector((state) => state.user) || {};

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Nhắc nhở hiến máu
      </h3>
      <div className="space-y-4">
        <p className="text-gray-600">
          Thời gian phù hợp tiếp theo:{" "}
          {userData.lastDonation
            ? new Date(
                new Date(userData.lastDonation).setMonth(
                  new Date(userData.lastDonation).getMonth() + 3
                )
              ).toLocaleDateString()
            : "Chưa có thông tin"}
        </p>
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
          onClick={() => toast.info("Nhắc nhở đã được gửi!")}
        >
          <FaBell className="mr-2" /> Nhận nhắc nhở
        </button>
      </div>
    </div>
  );
};

export default RemindersComponent;
