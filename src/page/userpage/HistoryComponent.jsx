// src/page/userpage/HistoryComponent.jsx
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import api from "../../config/api";

const HistoryComponent = () => {
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await api.get("/api/blood-register/list-all");
        setDonationHistory(response.data);
      } catch (error) {
        setDonationHistory([
          {
            date: "05-19-2023",
            location: "Bệnh Viện Chợ Rẫy",
            amount: "210ml",
          },
        ]);
      }
    };

    fetchDonationHistory();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch Sử Hiến Máu
      </h3>
      <div className="space-y-6">
        {donationHistory.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
        ) : (
          donationHistory.map((donation, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {donation.location}
                  </p>
                  <p className="text-gray-600">{donation.date}</p>
                </div>
                <div className="text-red-600 font-bold text-lg">
                  {donation.amount}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryComponent;
