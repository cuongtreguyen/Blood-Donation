// src/page/userpage/AppointmentsComponent.jsx
import React, { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaEdit } from "react-icons/fa";
import api from "../../config/api";
import { useSelector } from "react-redux";

const AppointmentsComponent = () => {
  const userData = useSelector((state) => state.user) || {};
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    wantedDate: "",
    wantedHour: "",
    status: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for userId:", userData.id);
        const response = await api.get(`/blood-register/user/${userData.id}`);
        console.log("API Response:", response.data);
        setAppointments(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setError(
          "Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra lại server hoặc liên hệ quản trị viên."
        );
      }
    };

    if (userData.id) {
      fetchAppointments();
    } else {
      console.log("userData.id is undefined");
    }
  }, [userData.id]);

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setEditForm({
      wantedDate: appointment.wantedDate,
      wantedHour: appointment.wantedHour,
      status: appointment.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ wantedDate: "", wantedHour: "", status: "" });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/blood-register/${editingId}`, editForm);
      setAppointments(appointments.map((app) =>
        app.id === editingId ? { ...app, ...editForm } : app
      ));
      setEditingId(null);
      setEditForm({ wantedDate: "", wantedHour: "", status: "" });
    } catch (error) {
      setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
    }
  };

  const handleCancelAppointment = async () => {
  try {
    // Gọi đúng API PATCH /update-status/{id}?status=CANCELED
    await api.patch(`/blood-register/update-status/${editingId}`, null, {
      params: { status: "CANCELED" },
    });

    setAppointments(appointments.map((app) =>
      app.id === editingId ? { ...app, status: "CANCELED" } : app
    ));

    setEditingId(null);
    setEditForm({ wantedDate: "", wantedHour: "", status: "" });
  } catch (error) {
    setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
    console.error("Error cancelling appointment:", error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto mt-8">
      <h3 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-red-200 pb-2">
        Lịch Hẹn Sắp Tới
      </h3>
      {error ? (
        <p className="text-red-600 text-center py-4 bg-red-50 rounded-lg">
          {error}
        </p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
          Chưa có lịch hẹn nào.
        </p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl shadow-md mb-4 hover:shadow-lg transition-shadow duration-300 relative"
          >
            {editingId === appointment.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="wantedDate"
                  value={editForm.wantedDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Ngày muốn hiến (VD: 2025-06-23)"
                />
                <input
                  type="text"
                  name="wantedHour"
                  value={editForm.wantedHour}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Giờ muốn hiến (VD: 10:00)"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Hủy Đơn
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaCalendar className="text-red-600 text-2xl mr-3" />
                    <span className="font-semibold text-xl text-gray-800">
                      {appointment.wantedDate || "N/A"}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {appointment.status || "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-lg mb-2">
                  <FaClock className="mr-3" />
                  <span>{appointment.wantedHour || "N/A"}</span>
                </div>
                {appointment.status === "PENDING" && (
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors duration-200"
                  >
                    <FaEdit />
                  </button>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentsComponent;
