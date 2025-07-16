import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserAlt, FaCalendarAlt, FaTimes, FaEdit, FaHospital, FaPhone, FaSave, FaBan, FaExclamationCircle, FaTint } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";
import { MdOutlineVolunteerActivism, MdBloodtype } from "react-icons/md";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { Modal } from "antd";

// Component con cho Card hiển thị thông tin
const AppointmentCard = ({ appointment, handleEdit, handleCancel }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
          dotColor: "bg-yellow-500",
          text: "Chờ duyệt"
        };
      case "APPROVED":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          dotColor: "bg-green-500",
          text: "Đã duyệt"
        };
      case "COMPLETED":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          dotColor: "bg-blue-500",
          text: "Hoàn thành"
        };
      case "CANCELED":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
          text: "Đã hủy"
        };
      case "INCOMPLETED":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
          dotColor: "bg-orange-500",
          text: "Chưa hoàn tất"
        };
      case "REJECTED":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
          text: "Bị từ chối"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          dotColor: "bg-gray-500",
          text: "Không xác định"
        };
    }
  };

  const formatBloodType = (bloodType) => {
    if (!bloodType) return "Không xác định";
    
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
      ONEGATIVE: "O-"
    };
    
    return bloodTypeMap[bloodType.toString().toUpperCase()] || bloodType;
  };

  const statusInfo = getStatusInfo(appointment.status);

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {appointment.type === "DONATE" ? (
            <MdOutlineVolunteerActivism className="text-2xl text-blue-600" />
          ) : (
            <MdBloodtype className="text-2xl text-red-600" />
          )}
          <div>
            <h3 className="font-bold text-xl text-gray-800">
              {appointment.type === "DONATE" ? "Lịch Hiến Máu" : "Lịch Nhận Máu"}
            </h3>
            <p className="text-sm text-red-700 font-medium flex items-center">
              <GiDroplets className="mr-1.5"/> 
              {appointment.type === "DONATE" ? "Hiến máu" : "Nhận máu"}
            </p>
          </div>
        </div>
        <div className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
          <span className={`w-2 h-2 mr-2 rounded-full ${statusInfo.dotColor}`}></span>
          {statusInfo.text}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="flex-grow space-y-5">
        <dl>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</dt>
          <dd className="text-gray-900 font-semibold flex items-center mt-1">
            <FaCalendarAlt className="text-red-400 mr-2"/>
            {appointment.wantedDate && appointment.wantedHour ? 
              `${appointment.wantedDate} lúc ${appointment.wantedHour}` :
              "Chưa xác định"
            }
          </dd>
        </dl>

        <dl>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</dt>
          <dd className="text-gray-900 font-semibold flex items-center mt-1">
             <FaHospital className="text-red-400 mr-2" />
             Nhóm máu: {formatBloodType(appointment.bloodType)}
          </dd>
          {appointment.quantity && (
            <dd className="text-gray-700 flex items-center mt-1">
               <MdBloodtype className="text-red-400 mr-2" />
               Số lượng: {appointment.quantity} đơn vị
            </dd>
          )}
        </dl>
        
        <hr className="border-red-100"/>

        <dl>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ khẩn cấp</dt>
          <dd className="text-gray-900 font-semibold flex items-center mt-1">
            <FaUserAlt className="text-red-400 mr-2"/>
            {appointment.emergencyName || "Chưa cập nhật"}
          </dd>
           <dd className="text-gray-700 flex items-center mt-1">
            <FaPhone className="text-red-400 mr-2" />
            {appointment.emergencyPhone || "Chưa cập nhật"}
          </dd>
        </dl>

        {appointment.medicalHistory && (
          <dl>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền sử bệnh lý</dt>
            <dd className="text-gray-900 flex items-start mt-1">
              <FaTint className="text-red-400 mr-2 mt-0.5" />
              {appointment.medicalHistory}
            </dd>
          </dl>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="mt-6">
        {appointment.status === "PENDING" && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handleEdit(appointment.id)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              <FaEdit className="mr-2" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => handleCancel(appointment.id)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              <FaTimes className="mr-2" />
              Hủy lịch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component con cho Form chỉnh sửa
const EditForm = ({ appointment, onSubmit, onCancel, isLoading, userData }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      wantedDate: appointment.wantedDate || "",
      wantedHour: appointment.wantedHour || "",
      bloodType: appointment.bloodType || "",
      emergencyName: appointment.emergencyName || userData?.emergencyName || "",
      emergencyPhone: appointment.emergencyPhone || userData?.phone || "",
      medicalHistory: appointment.medicalHistory || ""
    }
  });

  useEffect(() => {
    reset({
      wantedDate: appointment.wantedDate || "",
      wantedHour: appointment.wantedHour || "",
      bloodType: appointment.bloodType || "",
      emergencyName: appointment.emergencyName || userData?.emergencyName || "",
      emergencyPhone: appointment.emergencyPhone || userData?.phone || "",
      medicalHistory: appointment.medicalHistory || ""
    });
  }, [appointment, userData, reset]);

  const handleFormSubmit = async (data) => {
    const selectedDate = new Date(data.wantedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      Modal.error({
        title: "Lỗi ngày hẹn",
        content: "Ngày hẹn không thể trong quá khứ. Vui lòng chọn ngày hợp lệ.",
      });
      return;
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(data.emergencyPhone.replace(/\s/g, ''))) {
      Modal.error({
        title: "Lỗi số điện thoại",
        content: "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.",
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <div className="p-6 bg-red-50/50">
      <h4 className="font-bold text-lg text-red-800 mb-4">Chỉnh sửa Lịch hẹn</h4>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="wantedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày hẹn <span className="text-red-500">*</span>
          </label>
          <input
            id="wantedDate"
            {...register("wantedDate", { 
              required: "Ngày hẹn là bắt buộc",
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || "Ngày hẹn không thể trong quá khứ";
              }
            })}
            type="date"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.wantedDate && <p className="text-red-600 text-sm mt-1">{errors.wantedDate.message}</p>}
        </div>
        
        <div>
           <label htmlFor="wantedHour" className="block text-sm font-medium text-gray-700 mb-1">
             Thời gian <span className="text-red-500">*</span>
           </label>
           <input
            id="wantedHour"
            {...register("wantedHour", { required: "Thời gian là bắt buộc" })}
            type="time"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.wantedHour && <p className="text-red-600 text-sm mt-1">{errors.wantedHour.message}</p>}
        </div>

        <div>
          <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
            Nhóm máu <span className="text-red-500">*</span>
          </label>
          <select
            id="bloodType"
            {...register("bloodType", { required: "Vui lòng chọn nhóm máu" })}
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
          {errors.bloodType && <p className="text-red-600 text-sm mt-1">{errors.bloodType.message}</p>}
        </div>

        <div>
           <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-1">
             Tên liên hệ khẩn cấp <span className="text-red-500">*</span>
           </label>
           <input
            id="emergencyName"
            {...register("emergencyName", { 
              required: "Tên liên hệ là bắt buộc",
              minLength: {
                value: 2,
                message: "Tên phải có ít nhất 2 ký tự"
              }
            })}
            placeholder="Tên liên hệ khẩn cấp"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
           {errors.emergencyName && <p className="text-red-600 text-sm mt-1">{errors.emergencyName.message}</p>}
        </div>
        
        <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              SĐT liên hệ khẩn cấp <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(Mặc định: {userData?.phone})</span>
            </label>
            <input
            id="emergencyPhone"
            {...register("emergencyPhone", {
                required: "SĐT là bắt buộc",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại phải có 10-11 chữ số"
                }
            })}
            placeholder="SĐT liên hệ khẩn cấp"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {errors.emergencyPhone && <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone.message}</p>}
        </div>

        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
            Tiền sử bệnh lý
          </label>
          <textarea
            id="medicalHistory"
            {...register("medicalHistory")}
            rows={3}
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nhập tiền sử bệnh lý (nếu có)"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          >
            <FaBan className="mr-2"/>
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200"
          >
            <FaSave className="mr-2"/>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Component chính
const AppointmentManager = () => {
  const userData = useSelector((state) => state.user) || {};
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      if (!userData?.id) {
        console.log("No user ID found");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const results = await Promise.allSettled([
          api.get(`/blood-register/user/${userData.id}`),
          api.get(`/blood-receive/get-blood-receive-by-user-id`, {
            params: { userId: userData.id },
          }),
        ]);

        let donateAppointments = [];
        if (results[0].status === 'fulfilled') {
          const donateData = results[0].value.data;
          if (Array.isArray(donateData)) {
            donateAppointments = donateData.map((item) => ({
              ...item,
              type: "DONATE",
            }));
          } else if (donateData && typeof donateData === 'object') {
            const dataArray = donateData.data || donateData.appointments || donateData.result || [];
            if (Array.isArray(dataArray)) {
              donateAppointments = dataArray.map((item) => ({
                ...item,
                type: "DONATE",
              }));
            }
          }
        }

        let receiveAppointments = [];
        if (results[1].status === 'fulfilled') {
          const receiveData = results[1].value.data;
          if (Array.isArray(receiveData)) {
            receiveAppointments = receiveData.map((item) => ({
              ...item,
              type: "RECEIVE",
            }));
          } else if (receiveData && typeof receiveData === 'object') {
            const dataArray = receiveData.data || receiveData.appointments || receiveData.result || [];
            if (Array.isArray(dataArray)) {
              receiveAppointments = dataArray.map((item) => ({
                ...item,
                type: "RECEIVE",
              }));
            }
          }
        }

        const combined = [...donateAppointments, ...receiveAppointments];
        const sortedAppointments = combined.sort((a, b) => {
          const dateA = new Date(a.wantedDate);
          const dateB = new Date(b.wantedDate);
          return dateB - dateA;
        });
        
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Lỗi khi lấy lịch hẹn:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAppointments();
  }, [userData?.id]);
  
  const handleEdit = (id) => {
    setEditingId(id);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCancelAppointment = (id) => {
    const appointment = appointments.find(app => app.id === id);
    if (!appointment) {
      setError("Không tìm thấy lịch hẹn");
      return;
    }

    const endpoint =
      appointment.type === "DONATE"
        ? `/blood-register/update-status/${id}`
        : `/blood-receive/update-status/${id}`;

    Modal.confirm({
      title: "Xác nhận hủy lịch hẹn",
      content: "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      okText: "Hủy lịch",
      cancelText: "Thoát",
      okType: "danger",
      onOk: async () => {
        try {
          setIsLoading(true);
          setError(null);

          await api.patch(endpoint, null, {
            params: { status: "CANCELED" },
          });

          setAppointments((prev) =>
            prev.map((app) =>
              app.id === id ? { ...app, status: "CANCELED" } : app
            )
          );
          
          Modal.success({
            title: "Thành công",
            content: "Lịch hẹn đã được hủy thành công!",
          });
        } catch (err) {
          console.error("Lỗi khi hủy lịch hẹn:", err);
          const errorMessage = err.response?.data?.message || "Không thể hủy lịch hẹn. Vui lòng thử lại.";
          setError(errorMessage);
          Modal.error({
            title: "Lỗi",
            content: errorMessage,
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const onSubmitEdit = async (data) => {
  if (!editingId) {
    setError("Không tìm thấy lịch hẹn để chỉnh sửa");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    const appointment = appointments.find(app => app.id === editingId);
    if (!appointment) {
      throw new Error("Không tìm thấy lịch hẹn");
    }

    // Định dạng wantedHour chỉ cho type "RECEIVE", giữ nguyên cho "DONATE"
    const formattedHour = appointment.type === "RECEIVE" && data.wantedHour ? `${data.wantedHour}:00` : data.wantedHour || "";

    const payload = {
      wantedDate: data.wantedDate,
      wantedHour: formattedHour,
      bloodType: data.bloodType,
      emergencyName: data.emergencyName.trim(),
      emergencyPhone: data.emergencyPhone.trim(),
      medicalHistory: data.medicalHistory?.trim() || null
    };

    const endpoint = appointment.type === "DONATE"
      ? `/blood-register/update/${editingId}`
      : `/blood-receive/update/${editingId}`;

    console.log("Payload being sent:", payload);
    const response = await api.put(endpoint, payload);
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app.id === editingId ? { ...app, ...payload } : app
      )
    );
    setEditingId(null);
    Modal.success({
      title: "Thành công",
      content: "Lịch hẹn đã được cập nhật thành công!",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật lịch hẹn:", err.response?.data);
    let errorMessage = "Không thể cập nhật lịch hẹn. Vui lòng thử lại.";
    if (err.response?.data?.message) errorMessage = err.response.data.message;
    setError(errorMessage);
    Modal.error({
      title: "Lỗi cập nhật",
      content: errorMessage,
    });
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-red-800 tracking-tight">
            Quản lý Lịch hẹn
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Theo dõi, sắp xếp và quản lý tất cả các lịch hẹn hiến và nhận máu một cách dễ dàng.
          </p>
        </header>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <img
              src="https://i.pinimg.com/1200x/a7/2a/15/a72a151f7c3df828974251a7a7e80393.jpg"
              alt="Không có lịch hẹn"
              className="w-48 h-48 object-cover mx-auto mb-4 rounded-full"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Không Tìm Thấy Lịch Hẹn
            </h2>
            <p className="text-gray-500">Bạn chưa có lịch hẹn nào được tạo</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {appointments.map((appointment) => (
                <motion.div
                  key={`${appointment.type}-${appointment.id}`}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80 flex flex-col"
                >
                  {editingId === appointment.id ? (
                    <EditForm
                      appointment={appointment}
                      onSubmit={onSubmitEdit}
                      onCancel={handleCancelEdit}
                      isLoading={isLoading}
                      userData={userData}
                    />
                  ) : (
                    <AppointmentCard
                      appointment={appointment}
                      handleEdit={handleEdit}
                      handleCancel={handleCancelAppointment}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AppointmentManager;