import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FaUserClock,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendar,
  FaClock,
  FaTint,
} from "react-icons/fa";
import { MdOutlineVolunteerActivism, MdBloodtype } from "react-icons/md";
import api from "../../config/api";
import { useSelector } from "react-redux";

const AppointmentsComponent = () => {
  const userData = useSelector((state) => state.user) || {};
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    wantedDate: "",
    wantedHour: "",
    status: "",
    type: "",
    bloodType: "",
    emergencyName: "",
    emergencyPhone: "",
    medicalHistory: "",
    quantity: "",
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  // Lấy danh sách lịch hẹn từ API
  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setLoading(true);
        const [donateRes, receiveRes] = await Promise.all([
          api.get(`/blood-register/user/${userData.id}`),
          api.get(`/blood-receive/get-blood-receive-by-user-id`, {
            params: { userId: userData.id },
          }),
        ]);

        const donateAppointments = (donateRes.data || []).map((item) => ({
          ...item,
          type: "DONATE",
        }));
        const receiveAppointments = (receiveRes.data || []).map((item) => ({
          ...item,
          type: "RECEIVE",
        }));

        const combined = [...donateAppointments, ...receiveAppointments];
        setAppointments(combined);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy lịch hẹn:", err);
        setError("Không thể tải dữ liệu lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };

    if (userData.id) {
      fetchAllAppointments();
    }
  }, [userData.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    case "INCOMPLETED":
      return "Chưa hoàn tất";
    case "REJECTED":
      return "Bị từ chối";
    default:
      return status;
  }
};


  // Hàm định dạng nhóm máu
  const formatBloodType = (bloodType) => {
    if (!bloodType) return "Không xác định";

    // Chuyển đổi các định dạng khác nhau về chuẩn AB+
    const formatted = bloodType.toString().toUpperCase();

    // Xử lý các trường hợp: A_POSITIVE -> A+, B_NEGATIVE -> B-, etc.
    const bloodTypeMap = {
      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      O_POSITIVE: "O+",
      O_NEGATIVE: "O-",
      APOSITIVE: "A+",
      ANEGATIVE: "A-",
      BPOSITIVE: "B+",
      BNEGATIVE: "B-",
      ABPOSITIVE: "AB+",
      ABNEGATIVE: "AB-",
      OPOSITIVE: "O+",
      ONEGATIVE: "O-",
    };

    return bloodTypeMap[formatted] || formatted;
  };

  const handleEdit = (appointment) => {
    setEditMode(appointment.id);
    setEditForm({
      wantedDate: appointment.wantedDate,
      wantedHour: appointment.wantedHour,
      status: appointment.status,
      type: appointment.type,
      bloodType: appointment.bloodType || "",
      emergencyName: appointment.emergencyName || "",
      emergencyPhone: appointment.emergencyPhone || "",
      medicalHistory: appointment.medicalHistory || "",
      quantity: appointment.quantity || "",
    });

    // Thiết lập giá trị form
    setValue("wantedDate", appointment.wantedDate);
    setValue("wantedHour", appointment.wantedHour);
    setValue("bloodType", appointment.bloodType || "");
    setValue("emergencyName", appointment.emergencyName || "");
    setValue("emergencyPhone", appointment.emergencyPhone || "");
    setValue("medicalHistory", appointment.medicalHistory || "");
    setValue("quantity", appointment.quantity || "");
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditForm({
      wantedDate: "",
      wantedHour: "",
      status: "",
      type: "",
      bloodType: "",
      emergencyName: "",
      emergencyPhone: "",
      medicalHistory: "",
      quantity: "",
    });
    reset();
  };

  const handleDelete = async (appointment) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
      try {
        setLoading(true);
        const endpoint =
          appointment.type === "DONATE"
            ? `/blood-register/update-status/${appointment.id}`
            : `/blood-receive/update-status/${appointment.id}`;

        await api.patch(endpoint, null, {
          params: { status: "CANCELED" },
        });

        setAppointments((prev) =>
          prev.map((app) =>
            app.id === appointment.id ? { ...app, status: "CANCELED" } : app
          )
        );
      } catch (err) {
        console.error("Lỗi khi hủy lịch hẹn:", err);
        setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const appointment = appointments.find((app) => app.id === editMode);
      const { type } = editForm;
      const endpoint =
        type === "DONATE"
          ? `/blood-register/update/${editMode}`
          : `/blood-receive/update/${editMode}`;

      const payload = {
        wantedDate: data.wantedDate,
        wantedHour: data.wantedHour,
      };

      await api.put(endpoint, payload);

      setAppointments((prev) =>
        prev.map((app) => (app.id === editMode ? { ...app, ...payload } : app))
      );

      handleCancelEdit();
      setError(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật lịch hẹn:", err);
      setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FaUserClock className="text-red-600" />
          Quản Lý Lịch Hẹn Hiến và Nhận Máu
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-center">{error}</p>
          </motion.div>
        )}

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <img
              src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500"
              alt="Không có lịch hẹn"
              className="w-48 h-48 object-cover mx-auto mb-4 rounded-full"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Không Tìm Thấy Lịch Hẹn
            </h2>
            <p className="text-gray-500">Bạn chưa có lịch hẹn nào được tạo</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <motion.div
                key={`${appointment.type}-${appointment.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div
                  className={`p-6 ${
                    appointment.type === "DONATE"
                      ? "bg-gradient-to-r from-blue-50 to-blue-100"
                      : "bg-gradient-to-r from-red-50 to-red-100"
                  }`}
                >
                  {editMode === appointment.id ? (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày mong muốn
                          </label>
                          <input
                            type="date"
                            {...register("wantedDate", {
                              required: "Vui lòng chọn ngày",
                            })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời gian mong muốn
                          </label>
                          <input
                            type="time"
                            {...register("wantedHour", {
                              required: "Vui lòng chọn thời gian",
                            })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nhóm máu
                        </label>
                        <select
                          {...register("bloodType", {
                            required: "Vui lòng chọn nhóm máu",
                          })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        >
                          <option value="">Chọn nhóm máu</option>
                          <option value="A_POSITIVE">A+</option>
                          <option value="A_NEGATIVE">A-</option>
                          <option value="B_POSITIVE">B+</option>
                          <option value="B_NEGATIVE">B-</option>
                          <option value="AB_POSITIVE">AB+</option>
                          <option value="AB_NEGATIVE">AB-</option>
                          <option value="O_POSITIVE">O+</option>
                          <option value="O_NEGATIVE">O-</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên người liên hệ khẩn cấp
                          </label>
                          <input
                            type="text"
                            {...register("emergencyName", {
                              required: "Vui lòng nhập tên người liên hệ",
                            })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            placeholder="Nhập tên người liên hệ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại khẩn cấp
                          </label>
                          <input
                            type="tel"
                            {...register("emergencyPhone", {
                              required: "Vui lòng nhập số điện thoại",
                              pattern: {
                                value: /^[0-9+\-\s\(\)]{10,15}$/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiền sử bệnh lý
                        </label>
                        <textarea
                          {...register("medicalHistory")}
                          rows={3}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          placeholder="Nhập tiền sử bệnh lý (nếu có)"
                        />
                      </div>

                      {editForm.type === "RECEIVE" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số lượng máu cần nhận (đơn vị)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            {...register("quantity", {
                              required: "Vui lòng nhập số lượng",
                              min: {
                                value: 1,
                                message: "Số lượng tối thiểu là 1",
                              },
                              max: {
                                value: 10,
                                message: "Số lượng tối đa là 10",
                              },
                            })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            placeholder="Nhập số lượng"
                          />
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                          <FaCheck className="text-sm" />
                          {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <FaTimes className="text-sm" />
                          Hủy bỏ
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          {appointment.type === "DONATE" ? (
                            <MdOutlineVolunteerActivism className="text-2xl text-blue-600" />
                          ) : (
                            <MdBloodtype className="text-2xl text-red-600" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.type === "DONATE"
                              ? "Lịch Hiến Máu"
                              : "Lịch Nhận Máu"}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <FaCalendar className="mr-3 text-red-600 flex-shrink-0" />
                          <span className="font-medium">Ngày hẹn:</span>
                          <span className="ml-2 text-gray-900">
                            {appointment.wantedDate || "Chưa xác định"}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <FaClock className="mr-3 text-red-600 flex-shrink-0" />
                          <span className="font-medium">Thời gian:</span>
                          <span className="ml-2 text-gray-900">
                            {appointment.wantedHour || "Chưa xác định"}
                          </span>
                        </div>

                        {appointment.bloodType && (
                          <div className="flex items-center text-gray-700">
                            <FaTint className="mr-3 text-red-600 flex-shrink-0" />
                            <span className="font-medium">Nhóm máu:</span>
                            <span className="ml-2 font-bold text-red-600 text-lg">
                              {formatBloodType(appointment.bloodType)}
                            </span>
                          </div>
                        )}

                        {appointment.quantity && (
                          <div className="flex items-center text-gray-700">
                            <MdBloodtype className="mr-3 text-red-600 flex-shrink-0" />
                            <span className="font-medium">Số lượng:</span>
                            <span className="ml-2 text-gray-900">
                              {appointment.quantity} đơn vị
                            </span>
                          </div>
                        )}

                        {appointment.emergencyName && (
                          <div className="flex items-center text-gray-700">
                            <FaUserClock className="mr-3 text-red-600 flex-shrink-0" />
                            <span className="font-medium">
                              Liên hệ khẩn cấp:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {appointment.emergencyName}
                            </span>
                          </div>
                        )}

                        {appointment.emergencyPhone && (
                          <div className="flex items-center text-gray-700">
                            <FaClock className="mr-3 text-red-600 flex-shrink-0" />
                            <span className="font-medium">SĐT khẩn cấp:</span>
                            <span className="ml-2 text-gray-900">
                              {appointment.emergencyPhone}
                            </span>
                          </div>
                        )}

                        {appointment.medicalHistory && (
                          <div className="flex items-start text-gray-700">
                            <FaTint className="mr-3 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="font-medium">Tiền sử bệnh:</span>
                            <span className="ml-2 text-gray-900">
                              {appointment.medicalHistory}
                            </span>
                          </div>
                        )}
                      </div>

                      {appointment.status === "PENDING" && (
                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2.5 rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200 font-medium"
                          >
                            <FaEdit className="text-sm" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDelete(appointment)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-md hover:bg-red-100 transition-colors border border-red-200 font-medium"
                          >
                            <FaTrash className="text-sm" />
                            Hủy lịch
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsComponent;





















