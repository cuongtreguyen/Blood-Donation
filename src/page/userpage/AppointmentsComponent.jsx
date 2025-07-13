// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import {
//   FaUserClock,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaCalendar,
//   FaClock,
//   FaTint,
// } from "react-icons/fa";
// import { MdOutlineVolunteerActivism, MdBloodtype } from "react-icons/md";
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// const AppointmentsComponent = () => {
//   const userData = useSelector((state) => state.user) || {};
//   const [appointments, setAppointments] = useState([]);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editForm, setEditForm] = useState({
//     wantedDate: "",
//     wantedHour: "",
//     status: "",
//     type: "",
//     bloodType: "",
//     emergencyName: "",
//     emergencyPhone: "",
//     medicalHistory: "",
//     quantity: "",
//   });

//   const { register, handleSubmit, reset, setValue } = useForm();

//   // Lấy danh sách lịch hẹn từ API
//   useEffect(() => {
//     const fetchAllAppointments = async () => {
//       try {
//         setLoading(true);
//         const [donateRes, receiveRes] = await Promise.all([
//           api.get(`/blood-register/user/${userData.id}`),
//           api.get(`/blood-receive/get-blood-receive-by-user-id`, {
//             params: { userId: userData.id },
//           }),
//         ]);

//         const donateAppointments = (donateRes.data || []).map((item) => ({
//           ...item,
//           type: "DONATE",
//         }));
//         const receiveAppointments = (receiveRes.data || []).map((item) => ({
//           ...item,
//           type: "RECEIVE",
//         }));

//         const combined = [...donateAppointments, ...receiveAppointments];
//         setAppointments(combined);
//         setError(null);
//       } catch (err) {
//         console.error("Lỗi khi lấy lịch hẹn:", err);
//         setError("Không thể tải dữ liệu lịch hẹn.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userData.id) {
//       fetchAllAppointments();
//     }
//   }, [userData.id]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "APPROVED":
//         return "bg-green-100 text-green-800";
//       case "COMPLETED":
//         return "bg-blue-100 text-blue-800";
//       case "CANCELED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusText = (status) => {
//   switch (status) {
//     case "PENDING":
//       return "Chờ duyệt";
//     case "APPROVED":
//       return "Đã duyệt";
//     case "COMPLETED":
//       return "Hoàn thành";
//     case "CANCELED":
//       return "Đã hủy";
//     case "INCOMPLETED":
//       return "Chưa hoàn tất";
//     case "REJECTED":
//       return "Bị từ chối";
//     default:
//       return status;
//   }
// };


//   // Hàm định dạng nhóm máu
//   const formatBloodType = (bloodType) => {
//     if (!bloodType) return "Không xác định";

//     // Chuyển đổi các định dạng khác nhau về chuẩn AB+
//     const formatted = bloodType.toString().toUpperCase();

//     // Xử lý các trường hợp: A_POSITIVE -> A+, B_NEGATIVE -> B-, etc.
//     const bloodTypeMap = {
//       A_POSITIVE: "A+",
//       A_NEGATIVE: "A-",
//       B_POSITIVE: "B+",
//       B_NEGATIVE: "B-",
//       AB_POSITIVE: "AB+",
//       AB_NEGATIVE: "AB-",
//       O_POSITIVE: "O+",
//       O_NEGATIVE: "O-",
//       APOSITIVE: "A+",
//       ANEGATIVE: "A-",
//       BPOSITIVE: "B+",
//       BNEGATIVE: "B-",
//       ABPOSITIVE: "AB+",
//       ABNEGATIVE: "AB-",
//       OPOSITIVE: "O+",
//       ONEGATIVE: "O-",
//     };

//     return bloodTypeMap[formatted] || formatted;
//   };

//   const handleEdit = (appointment) => {
//     setEditMode(appointment.id);
//     setEditForm({
//       wantedDate: appointment.wantedDate,
//       wantedHour: appointment.wantedHour,
//       status: appointment.status,
//       type: appointment.type,
//       bloodType: appointment.bloodType || "",
//       emergencyName: appointment.emergencyName || "",
//       emergencyPhone: appointment.emergencyPhone || "",
//       medicalHistory: appointment.medicalHistory || "",
//       quantity: appointment.quantity || "",
//     });

//     // Thiết lập giá trị form
//     setValue("wantedDate", appointment.wantedDate);
//     setValue("wantedHour", appointment.wantedHour);
//     setValue("bloodType", appointment.bloodType || "");
//     setValue("emergencyName", appointment.emergencyName || "");
//     setValue("emergencyPhone", appointment.emergencyPhone || "");
//     setValue("medicalHistory", appointment.medicalHistory || "");
//     setValue("quantity", appointment.quantity || "");
//   };

//   const handleCancelEdit = () => {
//     setEditMode(null);
//     setEditForm({
//       wantedDate: "",
//       wantedHour: "",
//       status: "",
//       type: "",
//       bloodType: "",
//       emergencyName: "",
//       emergencyPhone: "",
//       medicalHistory: "",
//       quantity: "",
//     });
//     reset();
//   };

//   const handleDelete = async (appointment) => {
//     if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
//       try {
//         setLoading(true);
//         const endpoint =
//           appointment.type === "DONATE"
//             ? `/blood-register/update-status/${appointment.id}`
//             : `/blood-receive/update-status/${appointment.id}`;

//         await api.patch(endpoint, null, {
//           params: { status: "CANCELED" },
//         });

//         setAppointments((prev) =>
//           prev.map((app) =>
//             app.id === appointment.id ? { ...app, status: "CANCELED" } : app
//           )
//         );
//       } catch (err) {
//         console.error("Lỗi khi hủy lịch hẹn:", err);
//         setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const appointment = appointments.find((app) => app.id === editMode);
//       const { type } = editForm;
//       const endpoint =
//         type === "DONATE"
//           ? `/blood-register/update/${editMode}`
//           : `/blood-receive/update/${editMode}`;

//       const payload = {
//         wantedDate: data.wantedDate,
//         wantedHour: data.wantedHour,
//       };

//       await api.put(endpoint, payload);

//       setAppointments((prev) =>
//         prev.map((app) => (app.id === editMode ? { ...app, ...payload } : app))
//       );

//       handleCancelEdit();
//       setError(null);
//     } catch (err) {
//       console.error("Lỗi khi cập nhật lịch hẹn:", err);
//       setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && appointments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
//           <FaUserClock className="text-red-600" />
//           Quản Lý Lịch Hẹn Hiến và Nhận Máu
//         </h1>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
//           >
//             <p className="text-red-600 text-center">{error}</p>
//           </motion.div>
//         )}

//         {appointments.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12"
//           >
//             <img
//               src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500"
//               alt="Không có lịch hẹn"
//               className="w-48 h-48 object-cover mx-auto mb-4 rounded-full"
//             />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Không Tìm Thấy Lịch Hẹn
//             </h2>
//             <p className="text-gray-500">Bạn chưa có lịch hẹn nào được tạo</p>
//           </motion.div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {appointments.map((appointment) => (
//               <motion.div
//                 key={`${appointment.type}-${appointment.id}`}
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//               >
//                 <div
//                   className={`p-6 ${
//                     appointment.type === "DONATE"
//                       ? "bg-gradient-to-r from-blue-50 to-blue-100"
//                       : "bg-gradient-to-r from-red-50 to-red-100"
//                   }`}
//                 >
//                   {editMode === appointment.id ? (
//                     <form
//                       onSubmit={handleSubmit(onSubmit)}
//                       className="space-y-4"
//                     >
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Ngày mong muốn
//                           </label>
//                           <input
//                             type="date"
//                             {...register("wantedDate", {
//                               required: "Vui lòng chọn ngày",
//                             })}
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Thời gian mong muốn
//                           </label>
//                           <input
//                             type="time"
//                             {...register("wantedHour", {
//                               required: "Vui lòng chọn thời gian",
//                             })}
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Nhóm máu
//                         </label>
//                         <select
//                           {...register("bloodType", {
//                             required: "Vui lòng chọn nhóm máu",
//                           })}
//                           className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                         >
//                           <option value="">Chọn nhóm máu</option>
//                           <option value="A_POSITIVE">A+</option>
//                           <option value="A_NEGATIVE">A-</option>
//                           <option value="B_POSITIVE">B+</option>
//                           <option value="B_NEGATIVE">B-</option>
//                           <option value="AB_POSITIVE">AB+</option>
//                           <option value="AB_NEGATIVE">AB-</option>
//                           <option value="O_POSITIVE">O+</option>
//                           <option value="O_NEGATIVE">O-</option>
//                         </select>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Tên người liên hệ khẩn cấp
//                           </label>
//                           <input
//                             type="text"
//                             {...register("emergencyName", {
//                               required: "Vui lòng nhập tên người liên hệ",
//                             })}
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                             placeholder="Nhập tên người liên hệ"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Số điện thoại khẩn cấp
//                           </label>
//                           <input
//                             type="tel"
//                             {...register("emergencyPhone", {
//                               required: "Vui lòng nhập số điện thoại",
//                               pattern: {
//                                 value: /^[0-9+\-\s\(\)]{10,15}$/,
//                                 message: "Số điện thoại không hợp lệ",
//                               },
//                             })}
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                             placeholder="Nhập số điện thoại"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Tiền sử bệnh lý
//                         </label>
//                         <textarea
//                           {...register("medicalHistory")}
//                           rows={3}
//                           className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                           placeholder="Nhập tiền sử bệnh lý (nếu có)"
//                         />
//                       </div>

//                       {editForm.type === "RECEIVE" && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Số lượng máu cần nhận (đơn vị)
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             max="10"
//                             {...register("quantity", {
//                               required: "Vui lòng nhập số lượng",
//                               min: {
//                                 value: 1,
//                                 message: "Số lượng tối thiểu là 1",
//                               },
//                               max: {
//                                 value: 10,
//                                 message: "Số lượng tối đa là 10",
//                               },
//                             })}
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                             placeholder="Nhập số lượng"
//                           />
//                         </div>
//                       )}

//                       <div className="flex gap-3 pt-2">
//                         <button
//                           type="submit"
//                           disabled={loading}
//                           className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
//                         >
//                           <FaCheck className="text-sm" />
//                           {loading ? "Đang lưu..." : "Lưu thay đổi"}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={handleCancelEdit}
//                           className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
//                         >
//                           <FaTimes className="text-sm" />
//                           Hủy bỏ
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <>
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex items-center gap-2">
//                           {appointment.type === "DONATE" ? (
//                             <MdOutlineVolunteerActivism className="text-2xl text-blue-600" />
//                           ) : (
//                             <MdBloodtype className="text-2xl text-red-600" />
//                           )}
//                           <h3 className="text-lg font-semibold text-gray-800">
//                             {appointment.type === "DONATE"
//                               ? "Lịch Hiến Máu"
//                               : "Lịch Nhận Máu"}
//                           </h3>
//                         </div>
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                             appointment.status
//                           )}`}
//                         >
//                           {getStatusText(appointment.status)}
//                         </span>
//                       </div>

//                       <div className="space-y-3">
//                         <div className="flex items-center text-gray-700">
//                           <FaCalendar className="mr-3 text-red-600 flex-shrink-0" />
//                           <span className="font-medium">Ngày hẹn:</span>
//                           <span className="ml-2 text-gray-900">
//                             {appointment.wantedDate || "Chưa xác định"}
//                           </span>
//                         </div>

//                         <div className="flex items-center text-gray-700">
//                           <FaClock className="mr-3 text-red-600 flex-shrink-0" />
//                           <span className="font-medium">Thời gian:</span>
//                           <span className="ml-2 text-gray-900">
//                             {appointment.wantedHour || "Chưa xác định"}
//                           </span>
//                         </div>

//                         {appointment.bloodType && (
//                           <div className="flex items-center text-gray-700">
//                             <FaTint className="mr-3 text-red-600 flex-shrink-0" />
//                             <span className="font-medium">Nhóm máu:</span>
//                             <span className="ml-2 font-bold text-red-600 text-lg">
//                               {formatBloodType(appointment.bloodType)}
//                             </span>
//                           </div>
//                         )}

//                         {appointment.quantity && (
//                           <div className="flex items-center text-gray-700">
//                             <MdBloodtype className="mr-3 text-red-600 flex-shrink-0" />
//                             <span className="font-medium">Số lượng:</span>
//                             <span className="ml-2 text-gray-900">
//                               {appointment.quantity} đơn vị
//                             </span>
//                           </div>
//                         )}

//                         {appointment.emergencyName && (
//                           <div className="flex items-center text-gray-700">
//                             <FaUserClock className="mr-3 text-red-600 flex-shrink-0" />
//                             <span className="font-medium">
//                               Liên hệ khẩn cấp:
//                             </span>
//                             <span className="ml-2 text-gray-900">
//                               {appointment.emergencyName}
//                             </span>
//                           </div>
//                         )}

//                         {appointment.emergencyPhone && (
//                           <div className="flex items-center text-gray-700">
//                             <FaClock className="mr-3 text-red-600 flex-shrink-0" />
//                             <span className="font-medium">SĐT khẩn cấp:</span>
//                             <span className="ml-2 text-gray-900">
//                               {appointment.emergencyPhone}
//                             </span>
//                           </div>
//                         )}

//                         {appointment.medicalHistory && (
//                           <div className="flex items-start text-gray-700">
//                             <FaTint className="mr-3 text-red-600 flex-shrink-0 mt-0.5" />
//                             <span className="font-medium">Tiền sử bệnh:</span>
//                             <span className="ml-2 text-gray-900">
//                               {appointment.medicalHistory}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {appointment.status === "PENDING" && (
//                         <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
//                           <button
//                             onClick={() => handleEdit(appointment)}
//                             className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2.5 rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200 font-medium"
//                           >
//                             <FaEdit className="text-sm" />
//                             Chỉnh sửa
//                           </button>
//                           <button
//                             onClick={() => handleDelete(appointment)}
//                             className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-md hover:bg-red-100 transition-colors border border-red-200 font-medium"
//                           >
//                             <FaTrash className="text-sm" />
//                             Hủy lịch
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentsComponent;










// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaUserAlt, FaCalendarAlt, FaTimes, FaEdit, FaHospital, FaPhone, FaSave, FaBan, FaExclamationCircle, FaUserClock, FaTrash, FaCheck, FaCalendar, FaClock, FaTint } from "react-icons/fa";
// import { GiDroplets } from "react-icons/gi";
// import { MdOutlineVolunteerActivism, MdBloodtype } from "react-icons/md";
// // Removed date-fns import
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// // Component con cho Card hiển thị thông tin
// const AppointmentCard = ({ appointment, handleEdit, handleCancel }) => {
//   const getStatusInfo = (status) => {
//     switch (status) {
//       case "PENDING":
//         return {
//           bgColor: "bg-yellow-100",
//           textColor: "text-yellow-800",
//           borderColor: "border-yellow-200",
//           dotColor: "bg-yellow-500",
//           text: "Chờ duyệt"
//         };
//       case "APPROVED":
//         return {
//           bgColor: "bg-green-100",
//           textColor: "text-green-800",
//           borderColor: "border-green-200",
//           dotColor: "bg-green-500",
//           text: "Đã duyệt"
//         };
//       case "COMPLETED":
//         return {
//           bgColor: "bg-blue-100",
//           textColor: "text-blue-800",
//           borderColor: "border-blue-200",
//           dotColor: "bg-blue-500",
//           text: "Hoàn thành"
//         };
//       case "CANCELED":
//         return {
//           bgColor: "bg-red-100",
//           textColor: "text-red-800",
//           borderColor: "border-red-200",
//           dotColor: "bg-red-500",
//           text: "Đã hủy"
//         };
//       case "INCOMPLETED":
//         return {
//           bgColor: "bg-orange-100",
//           textColor: "text-orange-800",
//           borderColor: "border-orange-200",
//           dotColor: "bg-orange-500",
//           text: "Chưa hoàn tất"
//         };
//       case "REJECTED":
//         return {
//           bgColor: "bg-red-100",
//           textColor: "text-red-800",
//           borderColor: "border-red-200",
//           dotColor: "bg-red-500",
//           text: "Bị từ chối"
//         };
//       default:
//         return {
//           bgColor: "bg-gray-100",
//           textColor: "text-gray-800",
//           borderColor: "border-gray-200",
//           dotColor: "bg-gray-500",
//           text: "Không xác định"
//         };
//     }
//   };

//   const formatBloodType = (bloodType) => {
//     if (!bloodType) return "Không xác định";
    
//     const bloodTypeMap = {
//       A_POSITIVE: "A+",
//       A_NEGATIVE: "A-",
//       B_POSITIVE: "B+",
//       B_NEGATIVE: "B-",
//       AB_POSITIVE: "AB+",
//       AB_NEGATIVE: "AB-",
//       O_POSITIVE: "O+",
//       O_NEGATIVE: "O-",
//       APOSITIVE: "A+",
//       ANEGATIVE: "A-",
//       BPOSITIVE: "B+",
//       BNEGATIVE: "B-",
//       ABPOSITIVE: "AB+",
//       ABNEGATIVE: "AB-",
//       OPOSITIVE: "O+",
//       ONEGATIVE: "O-"
//     };
    
//     return bloodTypeMap[bloodType.toString().toUpperCase()] || bloodType;
//   };

//   const statusInfo = getStatusInfo(appointment.status);

//   return (
//     <div className="p-6 flex flex-col h-full">
//       {/* Card Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center gap-2">
//           {appointment.type === "DONATE" ? (
//             <MdOutlineVolunteerActivism className="text-2xl text-blue-600" />
//           ) : (
//             <MdBloodtype className="text-2xl text-red-600" />
//           )}
//           <div>
//             <h3 className="font-bold text-xl text-gray-800">
//               {appointment.type === "DONATE" ? "Lịch Hiến Máu" : "Lịch Nhận Máu"}
//             </h3>
//             <p className="text-sm text-red-700 font-medium flex items-center">
//               <GiDroplets className="mr-1.5"/> 
//               {appointment.type === "DONATE" ? "Hiến máu" : "Nhận máu"}
//             </p>
//           </div>
//         </div>
//         <div className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
//           <span className={`w-2 h-2 mr-2 rounded-full ${statusInfo.dotColor}`}></span>
//           {statusInfo.text}
//         </div>
//       </div>
      
//       {/* Card Body */}
//       <div className="flex-grow space-y-5">
//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//             <FaCalendarAlt className="text-red-400 mr-2"/>
//             {appointment.wantedDate && appointment.wantedHour ? 
//               `${appointment.wantedDate} lúc ${appointment.wantedHour}` :
//               "Chưa xác định"
//             }
//           </dd>
//         </dl>

//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//              <FaHospital className="text-red-400 mr-2" />
//              Nhóm máu: {formatBloodType(appointment.bloodType)}
//           </dd>
//           {appointment.quantity && (
//             <dd className="text-gray-700 flex items-center mt-1">
//                <MdBloodtype className="text-red-400 mr-2" />
//                Số lượng: {appointment.quantity} đơn vị
//             </dd>
//           )}
//         </dl>
        
//         <hr className="border-red-100"/>

//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ khẩn cấp</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//             <FaUserAlt className="text-red-400 mr-2"/>
//             {appointment.emergencyName || "Chưa cập nhật"}
//           </dd>
//            <dd className="text-gray-700 flex items-center mt-1">
//             <FaPhone className="text-red-400 mr-2" />
//             {appointment.emergencyPhone || "Chưa cập nhật"}
//           </dd>
//         </dl>

//         {appointment.medicalHistory && (
//           <dl>
//             <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền sử bệnh lý</dt>
//             <dd className="text-gray-900 flex items-start mt-1">
//               <FaTint className="text-red-400 mr-2 mt-0.5" />
//               {appointment.medicalHistory}
//             </dd>
//           </dl>
//         )}
//       </div>
      
//       {/* Card Footer */}
//       <div className="mt-6">
//         {appointment.status === "PENDING" && (
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => handleEdit(appointment.id)}
//               className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
//             >
//               <FaEdit className="mr-2" />
//               Chỉnh sửa
//             </button>
//             <button
//               onClick={() => handleCancel(appointment.id)}
//               className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
//             >
//               <FaTimes className="mr-2" />
//               Hủy lịch
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Component con cho Form chỉnh sửa
// const EditForm = ({ appointment, onSubmit, onCancel, isLoading, register, errors }) => {
//   return (
//     <div onSubmit={onSubmit} className="p-6 bg-red-50/50">
//       <h4 className="font-bold text-lg text-red-800 mb-4">Chỉnh sửa Lịch hẹn</h4>
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="wantedDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn</label>
//           <input
//             id="wantedDate"
//             {...register("wantedDate", { required: "Ngày hẹn là bắt buộc" })}
//             type="date"
//             defaultValue={appointment.wantedDate}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//           {errors.wantedDate && <p className="text-red-600 text-sm mt-1">{errors.wantedDate.message}</p>}
//         </div>
        
//         <div>
//            <label htmlFor="wantedHour" className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
//            <input
//             id="wantedHour"
//             {...register("wantedHour", { required: "Thời gian là bắt buộc" })}
//             type="time"
//             defaultValue={appointment.wantedHour}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//           {errors.wantedHour && <p className="text-red-600 text-sm mt-1">{errors.wantedHour.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
//           <select
//             id="bloodType"
//             {...register("bloodType", { required: "Vui lòng chọn nhóm máu" })}
//             defaultValue={appointment.bloodType}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           >
//             <option value="">Chọn nhóm máu</option>
//             <option value="A_POSITIVE">A+</option>
//             <option value="A_NEGATIVE">A-</option>
//             <option value="B_POSITIVE">B+</option>
//             <option value="B_NEGATIVE">B-</option>
//             <option value="AB_POSITIVE">AB+</option>
//             <option value="AB_NEGATIVE">AB-</option>
//             <option value="O_POSITIVE">O+</option>
//             <option value="O_NEGATIVE">O-</option>
//           </select>
//           {errors.bloodType && <p className="text-red-600 text-sm mt-1">{errors.bloodType.message}</p>}
//         </div>

//         <div>
//            <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-1">Tên liên hệ khẩn cấp</label>
//            <input
//             id="emergencyName"
//             {...register("emergencyName", { required: "Tên liên hệ là bắt buộc" })}
//             placeholder="Tên liên hệ khẩn cấp"
//             defaultValue={appointment.emergencyName}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//            {errors.emergencyName && <p className="text-red-600 text-sm mt-1">{errors.emergencyName.message}</p>}
//         </div>
        
//         <div>
//             <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">SĐT liên hệ khẩn cấp</label>
//             <input
//             id="emergencyPhone"
//             {...register("emergencyPhone", {
//                 required: "SĐT là bắt buộc",
//                 pattern: {
//                 value: /^[0-9+\-\s\(\)]{10,15}$/,
//                 message: "Số điện thoại không hợp lệ"
//                 }
//             })}
//             placeholder="SĐT liên hệ khẩn cấp"
//             defaultValue={appointment.emergencyPhone}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//             {errors.emergencyPhone && <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh lý</label>
//           <textarea
//             id="medicalHistory"
//             {...register("medicalHistory")}
//             rows={3}
//             defaultValue={appointment.medicalHistory}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             placeholder="Nhập tiền sử bệnh lý (nếu có)"
//           />
//         </div>

//         {appointment.type === "RECEIVE" && (
//           <div>
//             <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Số lượng máu cần nhận (đơn vị)</label>
//             <input
//               id="quantity"
//               type="number"
//               min="1"
//               max="10"
//               {...register("quantity", {
//                 required: "Vui lòng nhập số lượng",
//                 min: {
//                   value: 1,
//                   message: "Số lượng tối thiểu là 1",
//                 },
//                 max: {
//                   value: 10,
//                   message: "Số lượng tối đa là 10",
//                 },
//               })}
//               defaultValue={appointment.quantity}
//               className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               placeholder="Nhập số lượng"
//             />
//             {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
//           </div>
//         )}

//         <div className="flex justify-end space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//           >
//             <FaBan className="mr-2"/>
//             Hủy
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading}
//             onClick={onSubmit}
//             className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200"
//           >
//             <FaSave className="mr-2"/>
//             {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Component chính
// const AppointmentManager = () => {
//   const userData = useSelector((state) => state.user) || {};
//   const [appointments, setAppointments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

//   // Lấy danh sách lịch hẹn từ API
//   useEffect(() => {
//     const fetchAllAppointments = async () => {
//       try {
//         setIsLoading(true);
//         const [donateRes, receiveRes] = await Promise.all([
//           api.get(`/blood-register/user/${userData.id}`),
//           api.get(`/blood-receive/get-blood-receive-by-user-id`, {
//             params: { userId: userData.id },
//           }),
//         ]);

//         const donateAppointments = (donateRes.data || []).map((item) => ({
//           ...item,
//           type: "DONATE",
//         }));
//         const receiveAppointments = (receiveRes.data || []).map((item) => ({
//           ...item,
//           type: "RECEIVE",
//         }));

//         const combined = [...donateAppointments, ...receiveAppointments];
//         setAppointments(combined);
//         setError(null);
//       } catch (err) {
//         console.error("Lỗi khi lấy lịch hẹn:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (userData.id) {
//       fetchAllAppointments();
//     }
//   }, [userData.id]);
  
//   const handleEdit = (id) => {
//     const appointmentToEdit = appointments.find(app => app.id === id);
//     if(appointmentToEdit) {
//       setEditingId(id);
//       // Thiết lập giá trị form
//       setValue("wantedDate", appointmentToEdit.wantedDate);
//       setValue("wantedHour", appointmentToEdit.wantedHour);
//       setValue("bloodType", appointmentToEdit.bloodType || "");
//       setValue("emergencyName", appointmentToEdit.emergencyName || "");
//       setValue("emergencyPhone", appointmentToEdit.emergencyPhone || "");
//       setValue("medicalHistory", appointmentToEdit.medicalHistory || "");
//       setValue("quantity", appointmentToEdit.quantity || "");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     reset();
//   }

//   const handleCancelAppointment = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
//       try {
//         setIsLoading(true);
//         const appointment = appointments.find(app => app.id === id);
//         const endpoint = appointment.type === "DONATE"
//           ? `/blood-register/update-status/${id}`
//           : `/blood-receive/update-status/${id}`;

//         await api.patch(endpoint, null, {
//           params: { status: "CANCELED" },
//         });

//         setAppointments(appointments.map(app =>
//           app.id === id ? { ...app, status: "CANCELED" } : app
//         ));
//         setError(null);
//       } catch (err) {
//         console.error("Lỗi khi hủy lịch hẹn:", err);
//         setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const onSubmitEdit = async (data) => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const appointment = appointments.find(app => app.id === editingId);
//       const endpoint = appointment.type === "DONATE"
//         ? `/blood-register/update/${editingId}`
//         : `/blood-receive/update/${editingId}`;

//       const payload = {
//         wantedDate: data.wantedDate,
//         wantedHour: data.wantedHour,
//         bloodType: data.bloodType,
//         emergencyName: data.emergencyName,
//         emergencyPhone: data.emergencyPhone,
//         medicalHistory: data.medicalHistory,
//         ...(appointment.type === "RECEIVE" && { quantity: data.quantity })
//       };

//       await api.put(endpoint, payload);

//       setAppointments(appointments.map(app =>
//         app.id === editingId ? { ...app, ...payload } : app
//       ));
      
//       setEditingId(null);
//       reset();
//     } catch (err) {
//       console.error("Lỗi khi cập nhật lịch hẹn:", err);
//       setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading && appointments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-12">
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-red-800 tracking-tight">
//                 Quản lý Lịch hẹn
//             </h1>
//             <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//                 Theo dõi, sắp xếp và quản lý tất cả các lịch hẹn hiến và nhận máu một cách dễ dàng.
//             </p>
//         </header>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-md flex items-center"
//           >
//             <FaExclamationCircle className="text-xl mr-3"/>
//             <span>{error}</span>
//           </motion.div>
//         )}

//         {appointments.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12"
//           >
//             <img
//               src="https://i.pinimg.com/1200x/a7/2a/15/a72a151f7c3df828974251a7a7e80393.jpg"
//               alt="Không có lịch hẹn"
//               className="w-48 h-48 object-cover mx-auto mb-4 rounded-full"
//             />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Không Tìm Thấy Lịch Hẹn
//             </h2>
//             <p className="text-gray-500">Bạn chưa có lịch hẹn nào được tạo</p>
//           </motion.div>
//         ) : (
//           <AnimatePresence>
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
//               {appointments.map((appointment) => (
//                 <motion.div
//                   key={`${appointment.type}-${appointment.id}`}
//                   layout
//                   initial={{ opacity: 0, y: 20, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -20, scale: 0.98 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80 flex flex-col"
//                 >
//                   {editingId === appointment.id ? (
//                     <EditForm
//                       appointment={appointment}
//                       onSubmit={handleSubmit(onSubmitEdit)}
//                       onCancel={handleCancelEdit}
//                       isLoading={isLoading}
//                       register={register}
//                       errors={errors}
//                     />
//                   ) : (
//                     <AppointmentCard
//                       appointment={appointment}
//                       handleEdit={handleEdit}
//                       handleCancel={handleCancelAppointment}
//                     />
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentManager;
















// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaUserAlt, FaCalendarAlt, FaTimes, FaEdit, FaHospital, FaPhone, FaSave, FaBan, FaExclamationCircle, FaUserClock, FaTrash, FaCheck, FaCalendar, FaClock, FaTint } from "react-icons/fa";
// import { GiDroplets } from "react-icons/gi";
// import { MdOutlineVolunteerActivism, MdBloodtype } from "react-icons/md";
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// // Component con cho Card hiển thị thông tin
// const AppointmentCard = ({ appointment, handleEdit, handleCancel }) => {
//   const getStatusInfo = (status) => {
//     switch (status) {
//       case "PENDING":
//         return {
//           bgColor: "bg-yellow-100",
//           textColor: "text-yellow-800",
//           borderColor: "border-yellow-200",
//           dotColor: "bg-yellow-500",
//           text: "Chờ duyệt"
//         };
//       case "APPROVED":
//         return {
//           bgColor: "bg-green-100",
//           textColor: "text-green-800",
//           borderColor: "border-green-200",
//           dotColor: "bg-green-500",
//           text: "Đã duyệt"
//         };
//       case "COMPLETED":
//         return {
//           bgColor: "bg-blue-100",
//           textColor: "text-blue-800",
//           borderColor: "border-blue-200",
//           dotColor: "bg-blue-500",
//           text: "Hoàn thành"
//         };
//       case "CANCELED":
//         return {
//           bgColor: "bg-red-100",
//           textColor: "text-red-800",
//           borderColor: "border-red-200",
//           dotColor: "bg-red-500",
//           text: "Đã hủy"
//         };
//       case "INCOMPLETED":
//         return {
//           bgColor: "bg-orange-100",
//           textColor: "text-orange-800",
//           borderColor: "border-orange-200",
//           dotColor: "bg-orange-500",
//           text: "Chưa hoàn tất"
//         };
//       case "REJECTED":
//         return {
//           bgColor: "bg-red-100",
//           textColor: "text-red-800",
//           borderColor: "border-red-200",
//           dotColor: "bg-red-500",
//           text: "Bị từ chối"
//         };
//       default:
//         return {
//           bgColor: "bg-gray-100",
//           textColor: "text-gray-800",
//           borderColor: "border-gray-200",
//           dotColor: "bg-gray-500",
//           text: "Không xác định"
//         };
//     }
//   };

//   const formatBloodType = (bloodType) => {
//     if (!bloodType) return "Không xác định";
    
//     const bloodTypeMap = {
//       A_POSITIVE: "A+",
//       A_NEGATIVE: "A-",
//       B_POSITIVE: "B+",
//       B_NEGATIVE: "B-",
//       AB_POSITIVE: "AB+",
//       AB_NEGATIVE: "AB-",
//       O_POSITIVE: "O+",
//       O_NEGATIVE: "O-",
//       APOSITIVE: "A+",
//       ANEGATIVE: "A-",
//       BPOSITIVE: "B+",
//       BNEGATIVE: "B-",
//       ABPOSITIVE: "AB+",
//       ABNEGATIVE: "AB-",
//       OPOSITIVE: "O+",
//       ONEGATIVE: "O-"
//     };
    
//     return bloodTypeMap[bloodType.toString().toUpperCase()] || bloodType;
//   };

//   const statusInfo = getStatusInfo(appointment.status);

//   return (
//     <div className="p-6 flex flex-col h-full">
//       {/* Card Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center gap-2">
//           {appointment.type === "DONATE" ? (
//             <MdOutlineVolunteerActivism className="text-2xl text-blue-600" />
//           ) : (
//             <MdBloodtype className="text-2xl text-red-600" />
//           )}
//           <div>
//             <h3 className="font-bold text-xl text-gray-800">
//               {appointment.type === "DONATE" ? "Lịch Hiến Máu" : "Lịch Nhận Máu"}
//             </h3>
//             <p className="text-sm text-red-700 font-medium flex items-center">
//               <GiDroplets className="mr-1.5"/> 
//               {appointment.type === "DONATE" ? "Hiến máu" : "Nhận máu"}
//             </p>
//           </div>
//         </div>
//         <div className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
//           <span className={`w-2 h-2 mr-2 rounded-full ${statusInfo.dotColor}`}></span>
//           {statusInfo.text}
//         </div>
//       </div>
      
//       {/* Card Body */}
//       <div className="flex-grow space-y-5">
//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//             <FaCalendarAlt className="text-red-400 mr-2"/>
//             {appointment.wantedDate && appointment.wantedHour ? 
//               `${appointment.wantedDate} lúc ${appointment.wantedHour}` :
//               "Chưa xác định"
//             }
//           </dd>
//         </dl>

//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//              <FaHospital className="text-red-400 mr-2" />
//              Nhóm máu: {formatBloodType(appointment.bloodType)}
//           </dd>
//           {appointment.quantity && (
//             <dd className="text-gray-700 flex items-center mt-1">
//                <MdBloodtype className="text-red-400 mr-2" />
//                Số lượng: {appointment.quantity} đơn vị
//             </dd>
//           )}
//         </dl>
        
//         <hr className="border-red-100"/>

//         <dl>
//           <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ khẩn cấp</dt>
//           <dd className="text-gray-900 font-semibold flex items-center mt-1">
//             <FaUserAlt className="text-red-400 mr-2"/>
//             {appointment.emergencyName || "Chưa cập nhật"}
//           </dd>
//            <dd className="text-gray-700 flex items-center mt-1">
//             <FaPhone className="text-red-400 mr-2" />
//             {appointment.emergencyPhone || "Chưa cập nhật"}
//           </dd>
//         </dl>

//         {appointment.medicalHistory && (
//           <dl>
//             <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền sử bệnh lý</dt>
//             <dd className="text-gray-900 flex items-start mt-1">
//               <FaTint className="text-red-400 mr-2 mt-0.5" />
//               {appointment.medicalHistory}
//             </dd>
//           </dl>
//         )}
//       </div>
      
//       {/* Card Footer */}
//       <div className="mt-6">
//         {appointment.status === "PENDING" && (
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => handleEdit(appointment.id)}
//               className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
//             >
//               <FaEdit className="mr-2" />
//               Chỉnh sửa
//             </button>
//             <button
//               onClick={() => handleCancel(appointment.id)}
//               className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
//             >
//               <FaTimes className="mr-2" />
//               Hủy lịch
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Component con cho Form chỉnh sửa
// const EditForm = ({ appointment, onSubmit, onCancel, isLoading, register, errors }) => {
//   return (
//     <div className="p-6 bg-red-50/50">
//       <h4 className="font-bold text-lg text-red-800 mb-4">Chỉnh sửa Lịch hẹn</h4>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="wantedDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn</label>
//           <input
//             id="wantedDate"
//             {...register("wantedDate", { required: "Ngày hẹn là bắt buộc" })}
//             type="date"
//             defaultValue={appointment.wantedDate}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//           {errors.wantedDate && <p className="text-red-600 text-sm mt-1">{errors.wantedDate.message}</p>}
//         </div>
        
//         <div>
//            <label htmlFor="wantedHour" className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
//            <input
//             id="wantedHour"
//             {...register("wantedHour", { required: "Thời gian là bắt buộc" })}
//             type="time"
//             defaultValue={appointment.wantedHour}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//           {errors.wantedHour && <p className="text-red-600 text-sm mt-1">{errors.wantedHour.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
//           <select
//             id="bloodType"
//             {...register("bloodType", { required: "Vui lòng chọn nhóm máu" })}
//             defaultValue={appointment.bloodType}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           >
//             <option value="">Chọn nhóm máu</option>
//             <option value="A_POSITIVE">A+</option>
//             <option value="A_NEGATIVE">A-</option>
//             <option value="B_POSITIVE">B+</option>
//             <option value="B_NEGATIVE">B-</option>
//             <option value="AB_POSITIVE">AB+</option>
//             <option value="AB_NEGATIVE">AB-</option>
//             <option value="O_POSITIVE">O+</option>
//             <option value="O_NEGATIVE">O-</option>
//           </select>
//           {errors.bloodType && <p className="text-red-600 text-sm mt-1">{errors.bloodType.message}</p>}
//         </div>

//         <div>
//            <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-1">Tên liên hệ khẩn cấp</label>
//            <input
//             id="emergencyName"
//             {...register("emergencyName", { required: "Tên liên hệ là bắt buộc" })}
//             placeholder="Tên liên hệ khẩn cấp"
//             defaultValue={appointment.emergencyName}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           />
//            {errors.emergencyName && <p className="text-red-600 text-sm mt-1">{errors.emergencyName.message}</p>}
//         </div>
        
//         <div>
//             <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">SĐT liên hệ khẩn cấp</label>
//             <input
//             id="emergencyPhone"
//             {...register("emergencyPhone", {
//                 required: "SĐT là bắt buộc",
//                 pattern: {
//                 value: /^[0-9+\-\s\(\)]{10,15}$/,
//                 message: "Số điện thoại không hợp lệ"
//                 }
//             })}
//             placeholder="SĐT liên hệ khẩn cấp"
//             defaultValue={appointment.emergencyPhone}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//             {errors.emergencyPhone && <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh lý</label>
//           <textarea
//             id="medicalHistory"
//             {...register("medicalHistory")}
//             rows={3}
//             defaultValue={appointment.medicalHistory}
//             className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             placeholder="Nhập tiền sử bệnh lý (nếu có)"
//           />
//         </div>

//         {appointment.type === "RECEIVE" && (
//           <div>
//             <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Số lượng máu cần nhận (đơn vị)</label>
//             <input
//               id="quantity"
//               type="number"
//               min="1"
//               max="10"
//               {...register("quantity", {
//                 required: "Vui lòng nhập số lượng",
//                 min: {
//                   value: 1,
//                   message: "Số lượng tối thiểu là 1",
//                 },
//                 max: {
//                   value: 10,
//                   message: "Số lượng tối đa là 10",
//                 },
//               })}
//               defaultValue={appointment.quantity}
//               className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               placeholder="Nhập số lượng"
//             />
//             {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
//           </div>
//         )}

//         <div className="flex justify-end space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//           >
//             <FaBan className="mr-2"/>
//             Hủy
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200"
//           >
//             <FaSave className="mr-2"/>
//             {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Component chính
// const AppointmentManager = () => {
//   const userData = useSelector((state) => state.user) || {};
//   const [appointments, setAppointments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

//   // Lấy danh sách lịch hẹn từ API
//   useEffect(() => {
//     const fetchAllAppointments = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         // Gọi API một cách tuần tự và xử lý lỗi cho từng API
//         const results = await Promise.allSettled([
//           api.get(`/blood-register/user/${userData.id}`),
//           api.get(`/blood-receive/get-blood-receive-by-user-id`, {
//             params: { userId: userData.id },
//           }),
//         ]);

//         // Xử lý kết quả từ API hiến máu
//         let donateAppointments = [];
//         if (results[0].status === 'fulfilled') {
//           const donateData = results[0].value.data;
//           console.log('Donate API Response:', donateData);
          
//           if (Array.isArray(donateData)) {
//             donateAppointments = donateData.map((item) => ({
//               ...item,
//               type: "DONATE",
//             }));
//           } else if (donateData && typeof donateData === 'object') {
//             // Nếu response là object, có thể chứa array trong một property
//             const dataArray = donateData.data || donateData.appointments || donateData.result || [];
//             if (Array.isArray(dataArray)) {
//               donateAppointments = dataArray.map((item) => ({
//                 ...item,
//                 type: "DONATE",
//               }));
//             }
//           }
//         } else {
//           console.error('Lỗi khi lấy lịch hiến máu:', results[0].reason);
//         }

//         // Xử lý kết quả từ API nhận máu
//         let receiveAppointments = [];
//         if (results[1].status === 'fulfilled') {
//           const receiveData = results[1].value.data;
//           console.log('Receive API Response:', receiveData);
          
//           if (Array.isArray(receiveData)) {
//             receiveAppointments = receiveData.map((item) => ({
//               ...item,
//               type: "RECEIVE",
//             }));
//           } else if (receiveData && typeof receiveData === 'object') {
//             // Nếu response là object, có thể chứa array trong một property
//             const dataArray = receiveData.data || receiveData.appointments || receiveData.result || [];
//             if (Array.isArray(dataArray)) {
//               receiveAppointments = dataArray.map((item) => ({
//                 ...item,
//                 type: "RECEIVE",
//               }));
//             }
//           }
//         } else {
//           console.error('Lỗi khi lấy lịch nhận máu:', results[1].reason);
//         }

//         // Kết hợp cả hai loại lịch hẹn
//         const combined = [...donateAppointments, ...receiveAppointments];
//         console.log('Combined appointments:', combined);
        
//         setAppointments(combined);
        
//         // Chỉ hiển thị lỗi nếu cả hai API đều thất bại
//         if (results[0].status === 'rejected' && results[1].status === 'rejected') {
//           setError("Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại.");
//         }
        
//       } catch (err) {
//         console.error("Lỗi khi lấy lịch hẹn:", err);
//         setError("Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (userData.id) {
//       fetchAllAppointments();
//     }
//   }, [userData.id]);
  
//   const handleEdit = (id) => {
//     const appointmentToEdit = appointments.find(app => app.id === id);
//     if(appointmentToEdit) {
//       setEditingId(id);
//       // Thiết lập giá trị form
//       setValue("wantedDate", appointmentToEdit.wantedDate);
//       setValue("wantedHour", appointmentToEdit.wantedHour);
//       setValue("bloodType", appointmentToEdit.bloodType || "");
//       setValue("emergencyName", appointmentToEdit.emergencyName || "");
//       setValue("emergencyPhone", appointmentToEdit.emergencyPhone || "");
//       setValue("medicalHistory", appointmentToEdit.medicalHistory || "");
//       setValue("quantity", appointmentToEdit.quantity || "");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     reset();
//   }

//   const handleCancelAppointment = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
//       try {
//         setIsLoading(true);
//         const appointment = appointments.find(app => app.id === id);
//         const endpoint = appointment.type === "DONATE"
//           ? `/blood-register/update-status/${id}`
//           : `/blood-receive/update-status/${id}`;

//         await api.patch(endpoint, null, {
//           params: { status: "CANCELED" },
//         });

//         setAppointments(appointments.map(app =>
//           app.id === id ? { ...app, status: "CANCELED" } : app
//         ));
//         setError(null);
//       } catch (err) {
//         console.error("Lỗi khi hủy lịch hẹn:", err);
//         setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const onSubmitEdit = async (data) => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const appointment = appointments.find(app => app.id === editingId);
//       const endpoint = appointment.type === "DONATE"
//         ? `/blood-register/update/${editingId}`
//         : `/blood-receive/update/${editingId}`;

//       const payload = {
//         wantedDate: data.wantedDate,
//         wantedHour: data.wantedHour,
//         bloodType: data.bloodType,
//         emergencyName: data.emergencyName,
//         emergencyPhone: data.emergencyPhone,
//         medicalHistory: data.medicalHistory,
//         ...(appointment.type === "RECEIVE" && { quantity: data.quantity })
//       };

//       await api.put(endpoint, payload);

//       setAppointments(appointments.map(app =>
//         app.id === editingId ? { ...app, ...payload } : app
//       ));
      
//       setEditingId(null);
//       reset();
//     } catch (err) {
//       console.error("Lỗi khi cập nhật lịch hẹn:", err);
//       setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading && appointments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-4 sm:p-6 lg:p-10">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-12">
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-red-800 tracking-tight">
//                 Quản lý Lịch hẹn
//             </h1>
//             <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//                 Theo dõi, sắp xếp và quản lý tất cả các lịch hẹn hiến và nhận máu một cách dễ dàng.
//             </p>
//         </header>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-md flex items-center"
//           >
//             <FaExclamationCircle className="text-xl mr-3"/>
//             <span>{error}</span>
//           </motion.div>
//         )}

//         {/* Debug info - chỉ hiển thị trong development
//         {process.env.NODE_ENV === 'development' && (
//           <div className="mb-6 p-4 bg-gray-100 rounded-lg">
//             <p className="text-sm text-gray-600">
//               Debug: Tìm thấy {appointments.length} lịch hẹn
//               {appointments.length > 0 && (
//                 <>
//                   <br />
//                   Loại: {appointments.map(app => app.type).join(', ')}
//                 </>
//               )}
//             </p>
//           </div>
//         )} */}

//         {appointments.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12"
//           >
//             <img
//               src="https://i.pinimg.com/1200x/a7/2a/15/a72a151f7c3df828974251a7a7e80393.jpg"
//               alt="Không có lịch hẹn"
//               className="w-48 h-48 object-cover mx-auto mb-4 rounded-full"
//             />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Không Tìm Thấy Lịch Hẹn
//             </h2>
//             <p className="text-gray-500">Bạn chưa có lịch hẹn nào được tạo</p>
//           </motion.div>
//         ) : (
//           <AnimatePresence>
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
//               {appointments.map((appointment) => (
//                 <motion.div
//                   key={`${appointment.type}-${appointment.id}`}
//                   layout
//                   initial={{ opacity: 0, y: 20, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -20, scale: 0.98 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80 flex flex-col"
//                 >
//                   {editingId === appointment.id ? (
//                     <EditForm
//                       appointment={appointment}
//                       onSubmit={handleSubmit(onSubmitEdit)}
//                       onCancel={handleCancelEdit}
//                       isLoading={isLoading}
//                       register={register}
//                       errors={errors}
//                     />
//                   ) : (
//                     <AppointmentCard
//                       appointment={appointment}
//                       handleEdit={handleEdit}
//                       handleCancel={handleCancelAppointment}
//                     />
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentManager;












import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserAlt, FaCalendarAlt, FaTimes, FaEdit, FaHospital, FaPhone, FaSave, FaBan, FaExclamationCircle, FaUserClock, FaTrash, FaCheck, FaCalendar, FaClock, FaTint } from "react-icons/fa";
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
      emergencyName: appointment.emergencyName || userData?.fullName || "",
      emergencyPhone: appointment.emergencyPhone || userData?.phone || "",
      medicalHistory: appointment.medicalHistory || "",
      quantity: appointment.quantity || ""
    }
  });

  return (
    <div className="p-6 bg-red-50/50">
      <h4 className="font-bold text-lg text-red-800 mb-4">Chỉnh sửa Lịch hẹn</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="wantedDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn</label>
          <input
            id="wantedDate"
            {...register("wantedDate", { required: "Ngày hẹn là bắt buộc" })}
            type="date"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.wantedDate && <p className="text-red-600 text-sm mt-1">{errors.wantedDate.message}</p>}
        </div>
        
        <div>
           <label htmlFor="wantedHour" className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
           <input
            id="wantedHour"
            {...register("wantedHour", { required: "Thời gian là bắt buộc" })}
            type="time"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.wantedHour && <p className="text-red-600 text-sm mt-1">{errors.wantedHour.message}</p>}
        </div>

        <div>
          <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
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
             Tên liên hệ khẩn cấp
             <span className="text-xs text-gray-500 ml-1">(Mặc định: {userData?.fullName})</span>
           </label>
           <input
            id="emergencyName"
            {...register("emergencyName", { required: "Tên liên hệ là bắt buộc" })}
            placeholder="Tên liên hệ khẩn cấp"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
           {errors.emergencyName && <p className="text-red-600 text-sm mt-1">{errors.emergencyName.message}</p>}
        </div>
        
        <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              SĐT liên hệ khẩn cấp
              <span className="text-xs text-gray-500 ml-1">(Mặc định: {userData?.phone})</span>
            </label>
            <input
            id="emergencyPhone"
            {...register("emergencyPhone", {
                required: "SĐT là bắt buộc",
                pattern: {
                value: /^[0-9+\-\s\(\)]{10,15}$/,
                message: "Số điện thoại không hợp lệ"
                }
            })}
            placeholder="SĐT liên hệ khẩn cấp"
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {errors.emergencyPhone && <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone.message}</p>}
        </div>

        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh lý</label>
          <textarea
            id="medicalHistory"
            {...register("medicalHistory")}
            rows={3}
            className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nhập tiền sử bệnh lý (nếu có)"
          />
        </div>

        {appointment.type === "RECEIVE" && (
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Số lượng máu cần nhận (đơn vị)</label>
            <input
              id="quantity"
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
              className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nhập số lượng"
            />
            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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

  // Lấy danh sách lịch hẹn từ API
  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Gọi API một cách tuần tự và xử lý lỗi cho từng API
        const results = await Promise.allSettled([
          api.get(`/blood-register/user/${userData.id}`),
          api.get(`/blood-receive/get-blood-receive-by-user-id`, {
            params: { userId: userData.id },
          }),
        ]);

        // Xử lý kết quả từ API hiến máu
        let donateAppointments = [];
        if (results[0].status === 'fulfilled') {
          const donateData = results[0].value.data;
          console.log('Donate API Response:', donateData);
          
          if (Array.isArray(donateData)) {
            donateAppointments = donateData.map((item) => ({
              ...item,
              type: "DONATE",
            }));
          } else if (donateData && typeof donateData === 'object') {
            // Nếu response là object, có thể chứa array trong một property
            const dataArray = donateData.data || donateData.appointments || donateData.result || [];
            if (Array.isArray(dataArray)) {
              donateAppointments = dataArray.map((item) => ({
                ...item,
                type: "DONATE",
              }));
            }
          }
        } else {
          console.error('Lỗi khi lấy lịch hiến máu:', results[0].reason);
        }

        // Xử lý kết quả từ API nhận máu
        let receiveAppointments = [];
        if (results[1].status === 'fulfilled') {
          const receiveData = results[1].value.data;
          console.log('Receive API Response:', receiveData);
          
          if (Array.isArray(receiveData)) {
            receiveAppointments = receiveData.map((item) => ({
              ...item,
              type: "RECEIVE",
            }));
          } else if (receiveData && typeof receiveData === 'object') {
            // Nếu response là object, có thể chứa array trong một property
            const dataArray = receiveData.data || receiveData.appointments || receiveData.result || [];
            if (Array.isArray(dataArray)) {
              receiveAppointments = dataArray.map((item) => ({
                ...item,
                type: "RECEIVE",
              }));
            }
          }
        } else {
          console.error('Lỗi khi lấy lịch nhận máu:', results[1].reason);
        }

        // Kết hợp cả hai loại lịch hẹn
        const combined = [...donateAppointments, ...receiveAppointments];
        console.log('Combined appointments:', combined);
        
        setAppointments(combined);
        
        // Chỉ hiển thị lỗi nếu cả hai API đều thất bại
        if (results[0].status === 'rejected' && results[1].status === 'rejected') {
          setError("Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại.");
        }
        
      } catch (err) {
        console.error("Lỗi khi lấy lịch hẹn:", err);
        setError("Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userData.id) {
      fetchAllAppointments();
    }
  }, [userData.id]);
  
  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  }

  // const handleCancelAppointment = async (id) => {
  //   if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
  //     try {
  //       setIsLoading(true);
  //       const appointment = appointments.find(app => app.id === id);
  //       const endpoint = appointment.type === "DONATE"
  //         ? `/blood-register/update-status/${id}`
  //         : `/blood-receive/update-status/${id}`;

  //       await api.patch(endpoint, null, {
  //         params: { status: "CANCELED" },
  //       });

  //       setAppointments(appointments.map(app =>
  //         app.id === id ? { ...app, status: "CANCELED" } : app
  //       ));
  //       setError(null);
  //     } catch (err) {
  //       console.error("Lỗi khi hủy lịch hẹn:", err);
  //       setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };





const handleCancelAppointment = (id) => {
  const appointment = appointments.find(app => app.id === id);
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
        await api.patch(endpoint, null, {
          params: { status: "CANCELED" },
        });

        setAppointments((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "CANCELED" } : app
          )
        );
        setError(null);
      } catch (err) {
        console.error("Lỗi khi hủy lịch hẹn:", err);
        setError("Không thể hủy lịch hẹn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    },
    onCancel: () => {
      console.log("Người dùng đã hủy modal.");
    },
  });
};




  




  

  const onSubmitEdit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const appointment = appointments.find(app => app.id === editingId);
      const endpoint = appointment.type === "DONATE"
        ? `/blood-register/update/${editingId}`
        : `/blood-receive/update/${editingId}`;

      const payload = {
        wantedDate: data.wantedDate,
        wantedHour: data.wantedHour,
        bloodType: data.bloodType,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        medicalHistory: data.medicalHistory,
        ...(appointment.type === "RECEIVE" && { quantity: data.quantity })
      };

      await api.put(endpoint, payload);

      setAppointments(appointments.map(app =>
        app.id === editingId ? { ...app, ...payload } : app
      ));
      
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật lịch hẹn:", err);
      setError("Không thể cập nhật lịch hẹn. Vui lòng thử lại.");
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-md flex items-center"
          >
            <FaExclamationCircle className="text-xl mr-3"/>
            <span>{error}</span>
          </motion.div>
        )}

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