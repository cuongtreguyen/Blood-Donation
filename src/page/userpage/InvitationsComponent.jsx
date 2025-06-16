// src/page/userpage/InvitationsComponent.jsx
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector } from "react-redux";

const InvitationsComponent = () => {
  const userData = useSelector((state) => state.user) || {};
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await api.get(`/invitations/${userData.id}`);
        setInvitations(res.data);
      } catch (error) {
        setInvitations([]);
      }
    };

    if (userData.id) {
      fetchInvitations();
    }
  }, [userData.id]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lời mời hiến máu
      </h3>
      {invitations.length === 0 ? (
        <p className="text-gray-600">Chưa có lời mời nào.</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((inv, idx) => (
            <li
              key={idx}
              className="p-4 bg-gradient-to-r from-red-50 to-white rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {inv.message || "Mời hiến máu"}
                </span>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() => toast.success("Đã chấp nhận lời mời!")}
                >
                  Chấp nhận
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {inv.date} - {inv.location}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationsComponent;
