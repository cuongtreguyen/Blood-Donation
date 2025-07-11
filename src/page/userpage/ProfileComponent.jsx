// import React, { useState, useEffect } from "react";
// import {
//   FaEdit,
//   FaCamera,
//   FaCheckCircle,
//   FaFire,
//   FaTint,
//   FaKey,
//   FaTimesCircle,
//   FaSpinner,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import api from "../../config/api";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../../redux/features/userSlice";
// import UpdateCredentials from "./UpdateCredentials";

// const ProfileComponent = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showUpdateCredentials, setShowUpdateCredentials] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageStatus, setImageStatus] = useState("loaded");
//   const [donationEligibility, setDonationEligibility] = useState(null);
//   const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.user) || {};
//   const [formData, setFormData] = useState(userData);

//   const bloodGroups = [
//     { label: "A+", value: "A_POSITIVE" },
//     { label: "A-", value: "A_NEGATIVE" },
//     { label: "B+", value: "B_POSITIVE" },
//     { label: "B-", value: "B_NEGATIVE" },
//     { label: "AB+", value: "AB_POSITIVE" },
//     { label: "AB-", value: "AB_NEGATIVE" },
//     { label: "O+", value: "O_POSITIVE" },
//     { label: "O-", value: "O_NEGATIVE" },
//   ];

//   const genderOptions = [
//     { label: "Nam", value: "MALE" },
//     { label: "Nữ", value: "FEMALE" },
//     { label: "Khác", value: "OTHER" },
//   ];

//   const getBloodTypeLabel = (value) => {
//     const group = bloodGroups.find((group) => group.value === value);
//     return group ? group.label : "Chưa xác định";
//   };

//   const getGenderLabel = (value) => {
//     const gender = genderOptions.find((option) => option.value === value);
//     return gender ? gender.label : "Chưa xác định";
//   };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString().split("T")[0];
//   };

//   // Hàm kiểm tra điều kiện hiến máu
//   const checkDonationEligibility = async () => {
//   if (!userData.id) return;

//   setIsCheckingEligibility(true);
//   try {
//     const token = userData.token;
//     if (!token) {
//       toast.error("Không tìm thấy token xác thực!");
//       return;
//     }

//     const response = await api.get(
//       `/user/check-donation-ability?id=${userData.id}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     setDonationEligibility(response.data.message);
//   } catch (err) {
//     console.error("Error checking donation eligibility:", err);

//     // ✅ Cập nhật thông báo và kết quả nếu lỗi 400 (chưa đủ điều kiện)
//     if (err.response && err.response.status === 400) {
//       const message = err.response.data?.message || "Bạn chưa đủ điều kiện hiến máu!";
//       setDonationEligibility(message);
//     } else {
//       // Các lỗi khác
//       setDonationEligibility("Không thể kiểm tra điều kiện hiến máu");
//       toast.error("Không thể kiểm tra điều kiện hiến máu!");
//     }
//   } finally {
//     // ✅ Luôn tắt trạng thái kiểm tra
//     setIsCheckingEligibility(false);
//   }
// };

//   useEffect(() => {
//     setFormData(userData);
//     // Kiểm tra điều kiện hiến máu khi component mount
//     checkDonationEligibility();
//   }, [userData]);

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     console.log("Giá trị gửi lên:", {
//       height: formData.height,
//       weight: formData.weight,
//       parsedHeight: parseFloat(formData.height),
//       parsedWeight: parseFloat(formData.weight),
//     });
//     if (!formData.fullName) {
//       toast.error("Tên là bắt buộc!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const token = userData.token;
//       if (!token) {
//         toast.error("Không tìm thấy token xác thực!");
//         return;
//       }
//       const formatDateForAPI = (dateString) => {
//         if (!dateString || dateString.trim() === "") return null;

//         try {
//           const date = new Date(dateString);
//           if (isNaN(date.getTime())) {
//             console.error("Invalid date:", dateString);
//             return null;
//           }
//           return date.toISOString().split("T")[0];
//         } catch (error) {
//           console.error("Date formatting error:", error);
//           return null;
//         }
//       };

//       const response = await api.put(
//         "/user/update-user",
//         {
//           fullName: formData.fullName,
//           phone: formData.phone || null,
//           address: formData.address || null,
//           gender: formData.gender || null,
//           birthdate: formData.birthdate || null,
//           height: formData.height ? parseFloat(formData.height) : null,
//           weight: formData.weight ? parseFloat(formData.weight) : null,
//           lastDonation: formatDateForAPI(formData.lastDonation),
//           medicalHistory: formData.medicalHistory || null,
//           emergencyName: formData.emergencyName || null,
//           emergencyPhone: formData.emergencyPhone || null,
//           bloodType: formData.bloodType || null,
//           email: userData.email || null,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const updatedUser = {
//         ...userData,
//         ...response.data,
//         id: userData.id,
//         email: response.data.email || userData.email,
//         role: response.data.role || userData.role,
//       };
//       dispatch(login(updatedUser));
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setFormData(updatedUser);
//       toast.success("Cập nhật thông tin thành công!");
//       setIsEditing(false);

//       // Kiểm tra lại điều kiện hiến máu sau khi cập nhật
//       checkDonationEligibility();
//     } catch (err) {
//       console.error(
//         "Error updating profile:",
//         err.response?.data || err.message
//       );
//       if (err.response?.status === 404) {
//         toast.error("Không tìm thấy người dùng. Vui lòng kiểm tra lại!");
//       } else {
//         toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Vui lòng chọn file hình ảnh!");
//       return;
//     }

//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       toast.error("Kích thước ảnh không được vượt quá 5MB!");
//       return;
//     }

//     const token = userData.token;
//     if (!token) {
//       toast.error("Không tìm thấy token xác thực!");
//       return;
//     }

//     setIsLoading(true);
//     setImageStatus("loading");
//     try {
//       const formData = new FormData();
//       formData.append("profileImage", file);

//       const response = await api.put("/users/profile-image", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const updatedUser = {
//         ...userData,
//         role: response.data.role || userData.role,
//         profileImage: response.data.profileImage,
//       };

//       dispatch(login(updatedUser));
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setFormData(updatedUser);
//       setImageStatus("loaded");
//       toast.success("Cập nhật ảnh đại diện thành công!");
//     } catch (err) {
//       console.error("Error uploading profile image:", err);
//       setImageStatus("error");
//       toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getEligibilityDisplay = () => {
//   if (isCheckingEligibility) {
//     return {
//       icon: <FaSpinner className="text-blue-500 text-xl mr-3 animate-spin" />,
//       text: "Đang kiểm tra điều kiện hiến máu...",
//       bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
//       textColor: "text-blue-700",
//     };
//   }

//   if (!donationEligibility) {
//     return {
//       icon: <FaTimesCircle className="text-gray-500 text-xl mr-3" />,
//       text: "Chưa kiểm tra điều kiện hiến máu",
//       bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
//       textColor: "text-gray-700",
//     };
//   }

//   // ✅ Xử lý logic phân biệt đủ và chưa đủ điều kiện
//   const normalizedMsg = donationEligibility.toLowerCase().trim();
//   const isEligible =
//     normalizedMsg.includes("đủ điều kiện") &&
//     !normalizedMsg.includes("chưa") &&
//     !normalizedMsg.includes("không");

//   if (isEligible) {
//     return {
//       icon: <FaCheckCircle className="text-green-500 text-xl mr-3" />,
//       text: donationEligibility,
//       bgColor: "bg-gradient-to-r from-green-50 to-green-100",
//       textColor: "text-green-700",
//     };
//   } else {
//     return {
//       icon: <FaTimesCircle className="text-red-500 text-xl mr-3" />,
//       text: donationEligibility,
//       bgColor: "bg-gradient-to-r from-red-50 to-red-100",
//       textColor: "text-red-700",
//     };
//   }
// };


//   const eligibilityDisplay = getEligibilityDisplay();

//   return (
//     <>
//       <div className="bg-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
//         <span className="absolute top-2 right-4 animate-pulse">
//           <FaFire className="text-red-400 text-3xl drop-shadow-lg" />
//         </span>
//         <div className="flex justify-between items-center mb-8 mt-4">
//           <div className="flex items-center space-x-6">
//             <div className="relative">
//               {imageStatus === "loading" && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full">
//                   <span className="text-gray-600">Đang tải...</span>
//                 </div>
//               )}
//               {imageStatus === "error" && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-red-100 rounded-full">
//                   <span className="text-red-600">Ảnh lỗi</span>
//                 </div>
//               )}
//               <img
//                 src={
//                   userData.profileImage ||
//                   "https://media.vov.vn/sites/default/files/styles/large/public/2020-12/Trump3_0.jpg"
//                 }
//                 alt="Hồ sơ"
//                 className="w-24 h-24 rounded-full object-cover ring-4 ring-red-200 shadow-lg border-4 border-white"
//                 onError={() => setImageStatus("error")}
//               />
//               <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-red-200 shadow cursor-pointer hover:bg-red-50 transition-colors">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//                 <FaCamera className="text-red-500 text-2xl" />
//               </label>
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">
//                 {userData.fullName || "Người dùng"}
//               </h2>
//               <div className="flex items-center bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-full">
//                 <FaTint className="text-red-600 mr-2 animate-pulse" />
//                 <span className="text-xl font-semibold text-red-600">
//                   {getBloodTypeLabel(userData.bloodType)}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors shadow"
//               disabled={isLoading}
//               title="Chỉnh sửa hồ sơ"
//             >
//               <FaEdit className="text-red-600 text-xl" />
//             </button>
//             <button
//               onClick={() => setShowUpdateCredentials(true)}
//               className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors shadow"
//               disabled={isLoading}
//               title="Cập nhật thông tin đăng nhập"
//             >
//               <FaKey className="text-blue-600 text-xl" />
//             </button>
//           </div>
//         </div>

//         {!isEditing ? (
//           <div className="space-y-4 mb-8">
//             <p className="text-gray-600">
//               <strong>Tên:</strong> {userData.fullName || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Email:</strong> {userData.email || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Điện thoại:</strong>{" "}
//               {userData.phone || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Địa chỉ:</strong>{" "}
//               {userData.address || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Giới tính:</strong> {getGenderLabel(userData.gender)}
//             </p>
//             <p className="text-gray-600">
//               <strong>Ngày sinh:</strong>{" "}
//               {userData.birthdate
//                 ? new Date(userData.birthdate).toLocaleDateString("vi-VN")
//                 : "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Chiều cao:</strong>{" "}
//               {userData.height ? `${userData.height} cm` : "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Cân nặng:</strong>{" "}
//               {userData.weight ? `${userData.weight} kg` : "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Nhóm máu:</strong> {getBloodTypeLabel(userData.bloodType)}
//             </p>
//             <p className="text-gray-600">
//               <strong>Lần hiến máu cuối:</strong>{" "}
//               {userData.lastDonation
//                 ? new Date(userData.lastDonation).toLocaleDateString("vi-VN")
//                 : "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Tiền sử bệnh án:</strong>{" "}
//               {userData.medicalHistory || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Người liên hệ khẩn cấp:</strong>{" "}
//               {userData.emergencyName || "Chưa có thông tin"}
//             </p>
//             <p className="text-gray-600">
//               <strong>SĐT khẩn cấp:</strong>{" "}
//               {userData.emergencyPhone || "Chưa có thông tin"}
//             </p>
//           </div>
//         ) : (
//           <form onSubmit={handleProfileUpdate} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Tên <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullName: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Điện thoại
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phone || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Giới tính
//                 </label>
//                 <select
//                   value={formData.gender || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, gender: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 >
//                   <option value="">Chưa xác định</option>
//                   {genderOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Ngày sinh
//                 </label>
//                 <input
//                   type="date"
//                   value={formatDateForInput(formData.birthdate)}
//                   onChange={(e) =>
//                     setFormData({ ...formData, birthdate: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Chiều cao (cm)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.height || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, height: e.target.value })
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   min="0"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Cân nặng (kg)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.weight || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, weight: e.target.value })
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   min="0"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Nhóm máu
//                 </label>
//                 <select
//                   value={formData.bloodType || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, bloodType: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 >
//                   <option value="">Chưa xác định</option>
//                   {bloodGroups.map((group) => (
//                     <option key={group.value} value={group.value}>
//                       {group.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Lần hiến máu cuối
//                 </label>
//                 <input
//                   type="date"
//                   value={formatDateForInput(formData.lastDonation)}
//                   onChange={(e) =>
//                     setFormData({ ...formData, lastDonation: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Địa chỉ
//                 </label>
//                 <textarea
//                   value={formData.address || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-24 resize-none"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Tiền sử bệnh án
//                 </label>
//                 <textarea
//                   value={formData.medicalHistory || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, medicalHistory: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-24 resize-none"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   Người liên hệ khẩn cấp
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.emergencyName || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, emergencyName: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2 font-semibold">
//                   SĐT khẩn cấp
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.emergencyPhone || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, emergencyPhone: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-semibold"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setFormData(userData);
//                 }}
//                 className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 disabled:border-red-400 disabled:text-red-400 transition-colors font-semibold"
//                 disabled={isLoading}
//               >
//                 Hủy
//               </button>
//             </div>
//           </form>
//         )}

//         <div
//           className={`mt-8 p-6 ${eligibilityDisplay.bgColor} rounded-xl shadow-sm`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               {eligibilityDisplay.icon}
//               <span
//                 className={`${eligibilityDisplay.textColor} font-semibold text-lg`}
//               >
//                 {eligibilityDisplay.text}
//               </span>
//             </div>
//             {!isCheckingEligibility && (
//               <button
//                 onClick={checkDonationEligibility}
//                 className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 disabled={isLoading}
//               >
//                 Kiểm tra lại
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {showUpdateCredentials && (
//         <UpdateCredentials onClose={() => setShowUpdateCredentials(false)} />
//       )}
//     </>
//   );
// };

// export default ProfileComponent;

















import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaCamera,
  FaCheckCircle,
  FaTint,
  FaKey,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaBirthdayCake,
  FaRulerVertical,
  FaWeight,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBookMedical,
  FaHistory,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import UpdateCredentials from "./UpdateCredentials";

// --- Helper Components để code sạch hơn ---

// Component hiển thị một trường thông tin
const InfoField = ({ icon, label, value, isPlaceholder = false }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </dt>
    <dd className={`mt-1 text-lg font-semibold text-gray-800 ${isPlaceholder ? 'text-gray-400 italic' : ''}`}>
      {value}
    </dd>
  </div>
);

// Component cho input trong form
const FormInput = ({ id, label, value, onChange, required = false, type = "text", children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-1">
      {children ? (
        children
      ) : (
        <input
          id={id}
          type={type}
          value={value || ""}
          onChange={onChange}
          required={required}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          {...props}
        />
      )}
    </div>
  </div>
);

// --- Main Component ---

const ProfileComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateCredentials, setShowUpdateCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState("loaded");
  const [donationEligibility, setDonationEligibility] = useState(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};
  const [formData, setFormData] = useState(userData);

  // --- Dữ liệu và hàm tiện ích ---
  const bloodGroups = [
    { label: "A+", value: "A_POSITIVE" }, { label: "A-", value: "A_NEGATIVE" },
    { label: "B+", value: "B_POSITIVE" }, { label: "B-", value: "B_NEGATIVE" },
    { label: "AB+", value: "AB_POSITIVE" }, { label: "AB-", value: "AB_NEGATIVE" },
    { label: "O+", value: "O_POSITIVE" }, { label: "O-", value: "O_NEGATIVE" },
  ];
  const genderOptions = [
    { label: "Nam", value: "MALE" }, { label: "Nữ", value: "FEMALE" }, { label: "Khác", value: "OTHER" },
  ];

  const getLabel = (options, value) => options.find(o => o.value === value)?.label || "Chưa có thông tin";
  const formatDate = (dateString, format = "input") => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (format === 'display') return date.toLocaleDateString("vi-VN");
    return date.toISOString().split("T")[0];
  };

  // --- Logic xử lý API ---
  const checkDonationEligibility = async () => {
    if (!userData.id) return;
    setIsCheckingEligibility(true);
    try {
      const response = await api.get(`/user/check-donation-ability?id=${userData.id}`, { headers: { Authorization: `Bearer ${userData.token}` } });
      setDonationEligibility({ status: 'success', message: response.data.message });
    } catch (err) {
      const message = err.response?.data?.message || "Không thể kiểm tra điều kiện.";
      setDonationEligibility({ status: 'error', message });
    } finally {
      setIsCheckingEligibility(false);
    }
  };
  
  useEffect(() => {
    setFormData(userData);
    checkDonationEligibility();
  }, [userData.id]); // Chỉ chạy lại khi user.id thay đổi

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.fullName) {
      toast.error("Họ và tên là bắt buộc!");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone || null,
        address: formData.address || null,
        gender: formData.gender || null,
        birthdate: formData.birthdate ? formatDate(formData.birthdate, 'api') : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        lastDonation: formData.lastDonation ? formatDate(formData.lastDonation, 'api') : null,
        medicalHistory: formData.medicalHistory || null,
        emergencyName: formData.emergencyName || null,
        emergencyPhone: formData.emergencyPhone || null,
        bloodType: formData.bloodType || null,
        email: userData.email || null,
      };
      
      const response = await api.put("/user/update-user", payload, { headers: { Authorization: `Bearer ${userData.token}` } });
      const updatedUser = { ...userData, ...response.data, id: userData.id, email: response.data.email || userData.email, role: response.data.role || userData.role };
      
      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      checkDonationEligibility();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Vui lòng chọn ảnh dưới 5MB!");
      return;
    }
    
    setIsLoading(true);
    setImageStatus("loading");
    try {
      const form = new FormData();
      form.append("profileImage", file);
      
      const response = await api.put("/users/profile-image", form, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userData.token}` } });
      const updatedUser = { ...userData, profileImage: response.data.profileImage };

      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
      setImageStatus("loaded");
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      setImageStatus("error");
      toast.error("Cập nhật ảnh đại diện thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(userData); // Reset form về dữ liệu gốc
  };

  // --- JSX Rendering ---
  const renderEligibilityStatus = () => {
    if (isCheckingEligibility) {
      return { icon: <FaSpinner className="text-blue-500 animate-spin" />, text: "Đang kiểm tra...", bgColor: "bg-blue-50", textColor: "text-blue-700" };
    }
    if (!donationEligibility) {
      return { icon: <FaTimesCircle className="text-gray-500" />, text: "Không thể tải trạng thái", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    }
    if (donationEligibility.status === 'success') {
      return { icon: <FaCheckCircle className="text-green-500" />, text: donationEligibility.message, bgColor: "bg-green-50", textColor: "text-green-800" };
    }
    return { icon: <FaTimesCircle className="text-red-500" />, text: donationEligibility.message, bgColor: "bg-red-50", textColor: "text-red-800" };
  };
  const eligibility = renderEligibilityStatus();
  
  return (
    <>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={userData.profileImage || `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`}
                alt="Hồ sơ"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-red-100 border-2 border-white shadow-md"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`; }}
              />
              <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading}/>
                <FaCamera className="text-gray-600 text-lg" />
              </label>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {userData.fullName || "Người dùng"}
              </h2>
              <div className="mt-2 inline-flex items-center bg-red-100 text-red-800 text-lg font-bold px-4 py-1.5 rounded-full">
                <FaTint className="mr-2" />
                <span>{getLabel(bloodGroups, userData.bloodType)}</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <div className="flex space-x-2 mt-4 sm:mt-0">
               <button onClick={() => setIsEditing(true)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Chỉnh sửa hồ sơ">
                <FaEdit className="text-gray-700 text-xl" />
              </button>
              <button onClick={() => setShowUpdateCredentials(true)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Cập nhật thông tin đăng nhập">
                <FaKey className="text-gray-700 text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* --- Body --- */}
        {isEditing ? (
            // --- Edit Mode ---
            <form onSubmit={handleProfileUpdate} className="mt-6 space-y-8">
                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaUser className="mr-2 text-red-500"/>Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormInput id="fullName" label="Họ và tên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required/>
                        <FormInput id="phone" label="Điện thoại" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                        <FormInput id="birthdate" label="Ngày sinh" type="date" value={formatDate(formData.birthdate)} onChange={e => setFormData({...formData, birthdate: e.target.value})}/>
                        <FormInput id="gender" label="Giới tính">
                             <select id="gender" value={formData.gender || ""} onChange={e => setFormData({...formData, gender: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                                <option value="">Chọn giới tính</option>
                                {genderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormInput>
                         <div className="md:col-span-2">
                            <FormInput id="address" label="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
                         </div>
                    </div>
                </div>

                 {/* Medical Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaBookMedical className="mr-2 text-red-500"/>Thông tin y tế</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormInput id="height" label="Chiều cao (cm)" type="number" min="0" value={formData.height} onWheel={(e) => e.target.blur()} onChange={e => setFormData({...formData, height: e.target.value})}/>
                        <FormInput id="weight" label="Cân nặng (kg)" type="number" min="0" value={formData.weight} onWheel={(e) => e.target.blur()} onChange={e => setFormData({...formData, weight: e.target.value})}/>
                        <FormInput id="bloodType" label="Nhóm máu">
                             <select id="bloodType" value={formData.bloodType || ""} onChange={e => setFormData({...formData, bloodType: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                                <option value="">Chọn nhóm máu</option>
                                {bloodGroups.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </FormInput>
                        <FormInput id="lastDonation" label="Lần hiến cuối" type="date" value={formatDate(formData.lastDonation)} onChange={e => setFormData({...formData, lastDonation: e.target.value})}/>
                         <div className="md:col-span-2">
                             <FormInput id="medicalHistory" label="Tiền sử bệnh án">
                                <textarea id="medicalHistory" rows="3" value={formData.medicalHistory || ""} onChange={e => setFormData({...formData, medicalHistory: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-none"></textarea>
                            </FormInput>
                         </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaUserShield className="mr-2 text-red-500"/>Liên hệ khẩn cấp</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormInput id="emergencyName" label="Họ tên người liên hệ" value={formData.emergencyName} onChange={e => setFormData({...formData, emergencyName: e.target.value})}/>
                        <FormInput id="emergencyPhone" label="SĐT người liên hệ" type="tel" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})}/>
                     </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={handleCancelEdit} disabled={isLoading} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                        Hủy
                    </button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center">
                        {isLoading && <FaSpinner className="animate-spin mr-2" />}
                        Lưu Thay Đổi
                    </button>
                </div>
            </form>
        ) : (
            // --- View Mode ---
            <div className="mt-8">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <InfoField icon={<FaUser />} label="Họ và tên" value={userData.fullName} isPlaceholder={!userData.fullName} />
                  <InfoField icon={<FaPhoneAlt />} label="Điện thoại" value={userData.phone} isPlaceholder={!userData.phone} />
                  <InfoField icon={<FaBirthdayCake />} label="Ngày sinh" value={formatDate(userData.birthdate, 'display')} isPlaceholder={!userData.birthdate} />
                  <InfoField icon={<FaVenusMars />} label="Giới tính" value={getLabel(genderOptions, userData.gender)} />
                  <InfoField icon={<FaMapMarkerAlt />} label="Địa chỉ" value={userData.address} isPlaceholder={!userData.address} />
                  <InfoField icon={<FaRulerVertical />} label="Chiều cao" value={userData.height ? `${userData.height} cm` : "Chưa có thông tin"} isPlaceholder={!userData.height} />
                  <InfoField icon={<FaWeight />} label="Cân nặng" value={userData.weight ? `${userData.weight} kg` : "Chưa có thông tin"} isPlaceholder={!userData.weight} />
                  <InfoField icon={<FaHistory />} label="Lần hiến máu cuối" value={formatDate(userData.lastDonation, 'display')} isPlaceholder={!userData.lastDonation}/>
                  <InfoField icon={<FaBookMedical />} label="Tiền sử bệnh án" value={userData.medicalHistory} isPlaceholder={!userData.medicalHistory}/>
                  <InfoField icon={<FaUserShield />} label="Người liên hệ khẩn cấp" value={userData.emergencyName} isPlaceholder={!userData.emergencyName}/>
                  <InfoField icon={<FaPhoneAlt />} label="SĐT khẩn cấp" value={userData.emergencyPhone} isPlaceholder={!userData.emergencyPhone}/>
              </dl>
            </div>
        )}

        {/* --- Eligibility Status --- */}
        <div className={`mt-8 p-4 rounded-lg flex items-center justify-between ${eligibility.bgColor}`}>
          <div className="flex items-center">
            <span className="text-xl">{eligibility.icon}</span>
            <p className={`ml-3 font-semibold ${eligibility.textColor}`}>{eligibility.text}</p>
          </div>
          <button onClick={checkDonationEligibility} disabled={isCheckingEligibility} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Kiểm tra lại
          </button>
        </div>
      </div>

      {showUpdateCredentials && (
        <UpdateCredentials onClose={() => setShowUpdateCredentials(false)} />
      )}
    </>
  );
};

export default ProfileComponent;
