
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import api from "../../config/api";
import { useSelector } from "react-redux";

const HistoryComponent = ({ userId: propUserId }) => {
  const [donationHistory, setDonationHistory] = useState([]);
  const user = useSelector((state) => state.user);
const userId = propUserId || user.id;

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        if (!userId) {
          setDonationHistory([]);
          return;
        }
        const response = await api.get(`/blood-register/history/${userId}`);
        setDonationHistory(response.data);
      } catch {
        setDonationHistory([]);
      }
    };
    fetchDonationHistory();
  }, [userId]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch sử hiến máu
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
                    {donation.fullName || "Ẩn danh"}
                  </p>
                  <p className="text-gray-600">{donation.completedDate}</p>
                </div>
                <div className="text-red-600 font-bold text-lg">
                  {donation.unit} ml
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