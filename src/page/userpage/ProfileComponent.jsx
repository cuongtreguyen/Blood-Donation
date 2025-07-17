// import React, { useState, useEffect } from "react";
// import {
//   FaEdit,
//   FaCamera,
//   FaCheckCircle,
//   FaTint,
//   FaKey,
//   FaTimesCircle,
//   FaSpinner,
//   FaUser,
//   FaBirthdayCake,
//   FaRulerVertical,
//   FaWeight,
//   FaPhoneAlt,
//   FaMapMarkerAlt,
//   FaVenusMars,
//   FaBookMedical,
//   FaHistory,
//   FaUserShield,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import api from "../../config/api";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../../redux/features/userSlice";
// import UpdateCredentials from "./UpdateCredentials";

// // --- Helper Components để code sạch hơn ---

// // Component hiển thị một trường thông tin
// const InfoField = ({ icon, label, value, isPlaceholder = false }) => (
//   <div>
//     <dt className="text-sm font-medium text-gray-500 flex items-center">
//       {icon}
//       <span className="ml-2">{label}</span>
//     </dt>
//     <dd className={`mt-1 text-lg font-semibold text-gray-800 ${isPlaceholder ? 'text-gray-400 italic' : ''}`}>
//       {value}
//     </dd>
//   </div>
// );

// // Component cho input trong form
// const FormInput = ({ id, label, value, onChange, required = false, type = "text", children, ...props }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="mt-1">
//       {children ? (
//         children
//       ) : (
//         <input
//           id={id}
//           type={type}
//           value={value || ""}
//           onChange={onChange}
//           required={required}
//           className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//           {...props}
//         />
//       )}
//     </div>
//   </div>
// );

// // --- Main Component ---

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

//   // --- Dữ liệu và hàm tiện ích ---
//   const bloodGroups = [
//     { label: "A+", value: "A_POSITIVE" }, { label: "A-", value: "A_NEGATIVE" },
//     { label: "B+", value: "B_POSITIVE" }, { label: "B-", value: "B_NEGATIVE" },
//     { label: "AB+", value: "AB_POSITIVE" }, { label: "AB-", value: "AB_NEGATIVE" },
//     { label: "O+", value: "O_POSITIVE" }, { label: "O-", value: "O_NEGATIVE" },
//   ];
//   const genderOptions = [
//     { label: "Nam", value: "MALE" }, { label: "Nữ", value: "FEMALE" }, { label: "Khác", value: "OTHER" },
//   ];

//   const getLabel = (options, value) => options.find(o => o.value === value)?.label || "Chưa có thông tin";
//   const formatDate = (dateString, format = "input") => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     if (format === 'display') return date.toLocaleDateString("vi-VN");
//     return date.toISOString().split("T")[0];
//   };

//   // --- Logic xử lý API ---
//   const checkDonationEligibility = async () => {
//     if (!userData.id) return;
//     setIsCheckingEligibility(true);
//     try {
//       const response = await api.get(`/user/check-donation-ability?id=${userData.id}`, { headers: { Authorization: `Bearer ${userData.token}` } });
//       setDonationEligibility({ status: 'success', message: response.data.message });
//     } catch (err) {
//       const message = err.response?.data?.message || "Không thể kiểm tra điều kiện.";
//       setDonationEligibility({ status: 'error', message });
//     } finally {
//       setIsCheckingEligibility(false);
//     }
//   };
  
//   useEffect(() => {
//     setFormData(userData);
//     checkDonationEligibility();
//   }, [userData.id]); // Chỉ chạy lại khi user.id thay đổi

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     if (!formData.fullName) {
//       toast.error("Họ và tên là bắt buộc!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         phone: formData.phone || null,
//         address: formData.address || null,
//         gender: formData.gender || null,
//         birthdate: formData.birthdate ? formatDate(formData.birthdate, 'api') : null,
//         height: formData.height ? parseFloat(formData.height) : null,
//         weight: formData.weight ? parseFloat(formData.weight) : null,
//         lastDonation: formData.lastDonation ? formatDate(formData.lastDonation, 'api') : null,
//         medicalHistory: formData.medicalHistory || null,
//         emergencyName: formData.emergencyName || null,
//         emergencyPhone: formData.emergencyPhone || null,
//         bloodType: formData.bloodType || null,
//         email: userData.email || null,
//       };
      
//       const response = await api.put("/user/update-user", payload, { headers: { Authorization: `Bearer ${userData.token}` } });
//       const updatedUser = { ...userData, ...response.data, id: userData.id, email: response.data.email || userData.email, role: response.data.role || userData.role };
      
//       dispatch(login(updatedUser));
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setFormData(updatedUser);
//       toast.success("Cập nhật thông tin thành công!");
//       setIsEditing(false);
//       checkDonationEligibility();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
//       toast.error("Vui lòng chọn ảnh dưới 5MB!");
//       return;
//     }
    
//     setIsLoading(true);
//     setImageStatus("loading");
//     try {
//       const form = new FormData();
//       form.append("profileImage", file);
      
//       const response = await api.put("/users/profile-image", form, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userData.token}` } });
//       const updatedUser = { ...userData, profileImage: response.data.profileImage };

//       dispatch(login(updatedUser));
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setFormData(updatedUser);
//       setImageStatus("loaded");
//       toast.success("Cập nhật ảnh đại diện thành công!");
//     } catch (err) {
//       setImageStatus("error");
//       toast.error("Cập nhật ảnh đại diện thất bại!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setFormData(userData); // Reset form về dữ liệu gốc
//   };

//   // --- JSX Rendering ---
//   const renderEligibilityStatus = () => {
//     if (isCheckingEligibility) {
//       return { icon: <FaSpinner className="text-blue-500 animate-spin" />, text: "Đang kiểm tra...", bgColor: "bg-blue-50", textColor: "text-blue-700" };
//     }
//     if (!donationEligibility) {
//       return { icon: <FaTimesCircle className="text-gray-500" />, text: "Không thể tải trạng thái", bgColor: "bg-gray-100", textColor: "text-gray-700" };
//     }
//     if (donationEligibility.status === 'success') {
//       return { icon: <FaCheckCircle className="text-green-500" />, text: donationEligibility.message, bgColor: "bg-green-50", textColor: "text-green-800" };
//     }
//     return { icon: <FaTimesCircle className="text-red-500" />, text: donationEligibility.message, bgColor: "bg-red-50", textColor: "text-red-800" };
//   };
//   const eligibility = renderEligibilityStatus();
  
//   return (
//     <>
//       <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80">
//         {/* --- Header --- */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
//           <div className="flex items-center space-x-5">
//             <div className="relative">
//               <img
//                 src={userData.profileImage || `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`}
//                 alt="Hồ sơ"
//                 className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-red-100 border-2 border-white shadow-md"
//                 onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`; }}
//               />
//               <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
//                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading}/>
//                 <FaCamera className="text-gray-600 text-lg" />
//               </label>
//             </div>
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {userData.fullName || "Người dùng"}
//               </h2>
//               <div className="mt-2 inline-flex items-center bg-red-100 text-red-800 text-lg font-bold px-4 py-1.5 rounded-full">
//                 <FaTint className="mr-2" />
//                 <span>{getLabel(bloodGroups, userData.bloodType)}</span>
//               </div>
//             </div>
//           </div>
//           {!isEditing && (
//             <div className="flex space-x-2 mt-4 sm:mt-0">
//                <button onClick={() => setIsEditing(true)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Chỉnh sửa hồ sơ">
//                 <FaEdit className="text-gray-700 text-xl" />
//               </button>
//               <button onClick={() => setShowUpdateCredentials(true)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Cập nhật thông tin đăng nhập">
//                 <FaKey className="text-gray-700 text-xl" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* --- Body --- */}
//         {isEditing ? (
//             // --- Edit Mode ---
//             <form onSubmit={handleProfileUpdate} className="mt-6 space-y-8">
//                 {/* Personal Info */}
//                 <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaUser className="mr-2 text-red-500"/>Thông tin cá nhân</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                         <FormInput id="fullName" label="Họ và tên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required/>
//                         <FormInput id="phone" label="Điện thoại" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
//                         <FormInput id="birthdate" label="Ngày sinh" type="date" value={formatDate(formData.birthdate)} onChange={e => setFormData({...formData, birthdate: e.target.value})}/>
//                         <FormInput id="gender" label="Giới tính">
//                              <select id="gender" value={formData.gender || ""} onChange={e => setFormData({...formData, gender: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
//                                 <option value="">Chọn giới tính</option>
//                                 {genderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//                             </select>
//                         </FormInput>
//                          <div className="md:col-span-2">
//                             <FormInput id="address" label="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
//                          </div>
//                     </div>
//                 </div>

//                  {/* Medical Info */}
//                 <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaBookMedical className="mr-2 text-red-500"/>Thông tin y tế</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                         <FormInput id="height" label="Chiều cao (cm)" type="number" min="0" value={formData.height} onWheel={(e) => e.target.blur()} onChange={e => setFormData({...formData, height: e.target.value})}/>
//                         <FormInput id="weight" label="Cân nặng (kg)" type="number" min="0" value={formData.weight} onWheel={(e) => e.target.blur()} onChange={e => setFormData({...formData, weight: e.target.value})}/>
//                         <FormInput id="bloodType" label="Nhóm máu">
//                              <select id="bloodType" value={formData.bloodType || ""} onChange={e => setFormData({...formData, bloodType: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
//                                 <option value="">Chọn nhóm máu</option>
//                                 {bloodGroups.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
//                             </select>
//                         </FormInput>
//                         <FormInput id="lastDonation" label="Lần hiến cuối" type="date" value={formatDate(formData.lastDonation)} onChange={e => setFormData({...formData, lastDonation: e.target.value})}/>
//                          <div className="md:col-span-2">
//                              <FormInput id="medicalHistory" label="Tiền sử bệnh án">
//                                 <textarea id="medicalHistory" rows="3" value={formData.medicalHistory || ""} onChange={e => setFormData({...formData, medicalHistory: e.target.value})} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-none"></textarea>
//                             </FormInput>
//                          </div>
//                     </div>
//                 </div>

//                 {/* Emergency Contact */}
//                 <div>
//                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaUserShield className="mr-2 text-red-500"/>Liên hệ khẩn cấp</h3>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                         <FormInput id="emergencyName" label="Họ tên người liên hệ" value={formData.emergencyName} onChange={e => setFormData({...formData, emergencyName: e.target.value})}/>
//                         <FormInput id="emergencyPhone" label="SĐT người liên hệ" type="tel" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})}/>
//                      </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end space-x-3 pt-4">
//                     <button type="button" onClick={handleCancelEdit} disabled={isLoading} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
//                         Hủy
//                     </button>
//                     <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center">
//                         {isLoading && <FaSpinner className="animate-spin mr-2" />}
//                         Lưu Thay Đổi
//                     </button>
//                 </div>
//             </form>
//         ) : (
//             // --- View Mode ---
//             <div className="mt-8">
//               <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
//                   <InfoField icon={<FaUser />} label="Họ và tên" value={userData.fullName} isPlaceholder={!userData.fullName} />
//                   <InfoField icon={<FaPhoneAlt />} label="Điện thoại" value={userData.phone} isPlaceholder={!userData.phone} />
//                   <InfoField icon={<FaBirthdayCake />} label="Ngày sinh" value={formatDate(userData.birthdate, 'display')} isPlaceholder={!userData.birthdate} />
//                   <InfoField icon={<FaVenusMars />} label="Giới tính" value={getLabel(genderOptions, userData.gender)} />
//                   <InfoField icon={<FaMapMarkerAlt />} label="Địa chỉ" value={userData.address} isPlaceholder={!userData.address} />
//                   <InfoField icon={<FaRulerVertical />} label="Chiều cao" value={userData.height ? `${userData.height} cm` : "Chưa có thông tin"} isPlaceholder={!userData.height} />
//                   <InfoField icon={<FaWeight />} label="Cân nặng" value={userData.weight ? `${userData.weight} kg` : "Chưa có thông tin"} isPlaceholder={!userData.weight} />
//                   <InfoField icon={<FaHistory />} label="Lần hiến máu cuối" value={formatDate(userData.lastDonation, 'display')} isPlaceholder={!userData.lastDonation}/>
//                   <InfoField icon={<FaBookMedical />} label="Tiền sử bệnh án" value={userData.medicalHistory} isPlaceholder={!userData.medicalHistory}/>
//                   <InfoField icon={<FaUserShield />} label="Người liên hệ khẩn cấp" value={userData.emergencyName} isPlaceholder={!userData.emergencyName}/>
//                   <InfoField icon={<FaPhoneAlt />} label="SĐT khẩn cấp" value={userData.emergencyPhone} isPlaceholder={!userData.emergencyPhone}/>
//               </dl>
//             </div>
//         )}

//         {/* --- Eligibility Status --- */}
//         <div className={`mt-8 p-4 rounded-lg flex items-center justify-between ${eligibility.bgColor}`}>
//           <div className="flex items-center">
//             <span className="text-xl">{eligibility.icon}</span>
//             <p className={`ml-3 font-semibold ${eligibility.textColor}`}>{eligibility.text}</p>
//           </div>
//           <button onClick={checkDonationEligibility} disabled={isCheckingEligibility} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
//             Kiểm tra lại
//           </button>
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

// Helper function để lấy user data từ nhiều nguồn
const getUserData = (reduxUser) => {
  if (reduxUser && Object.keys(reduxUser).length > 0) {
    return reduxUser;
  }
  
  // Fallback từ localStorage
  try {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      return JSON.parse(localUser);
    }
  } catch (error) {
    console.error("Error parsing localStorage user:", error);
  }
  
  return {};
};

// --- Helper Components ---
const InfoField = ({ icon, label, value, isPlaceholder = false }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </dt>
    <dd className={`mt-1 text-lg font-semibold text-gray-800 ${isPlaceholder ? 'text-gray-400 italic' : ''}`}>
      {value || "Chưa có thông tin"}
    </dd>
  </div>
);

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

const ProfileComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateCredentials, setShowUpdateCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState("loaded");
  const [donationEligibility, setDonationEligibility] = useState(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user);
  const userData = getUserData(reduxUser);
  const [formData, setFormData] = useState(userData);

  // --- Dữ liệu và hàm tiện ích ---
  const bloodGroups = [
    { label: "A+", value: "A_POSITIVE" }, { label: "A-", value: "A_NEGATIVE" },
    { label: "B+", value: "B_POSITIVE" }, { label: "B-", value: "B_NEGATIVE" },
    { label: "AB+", value: "AB_POSITIVE" }, { label: "AB-", value: "AB_NEGATIVE" },
    { label: "O+", value: "O_POSITIVE" }, { label: "O-", value: "O_NEGATIVE" },
  ];
  
  const genderOptions = [
    { label: "Nam", value: "MALE" }, 
    { label: "Nữ", value: "FEMALE" }, 
    { label: "Khác", value: "OTHER" },
  ];

  const getLabel = (options, value) => options.find(o => o.value === value)?.label || "Chưa có thông tin";
  
  const formatDate = (dateString, format = "input") => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (format === 'display') return date.toLocaleDateString("vi-VN");
    return date.toISOString().split("T")[0];
  };

  // --- Hàm cập nhật user data đồng bộ ---
  const updateUserData = (newUserData) => {
    const updatedUser = {
      ...userData,
      ...newUserData,
      // Đảm bảo không mất các thông tin quan trọng
      id: userData.id,
      token: userData.token,
      role: newUserData.role || userData.role,
    };
    
    dispatch(login(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setFormData(updatedUser);
    
    // Debug log
    console.log("Updated user data:", updatedUser);
    
    return updatedUser;
  };

  // --- Logic xử lý API ---
  const checkDonationEligibility = async () => {
    if (!userData.id || !userData.token) return;
    
    setIsCheckingEligibility(true);
    try {
      const response = await api.get(`/user/check-donation-ability?id=${userData.id}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setDonationEligibility({ 
        status: 'success', 
        message: response.data.message 
      });
    } catch (err) {
      const message = err.response?.data?.message || "Không thể kiểm tra điều kiện.";
      setDonationEligibility({ 
        status: 'error', 
        message 
      });
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  // --- useEffect với dependency chính xác ---
  useEffect(() => {
    // Chỉ cập nhật formData khi userData thay đổi thực sự
    if (userData && Object.keys(userData).length > 0) {
      setFormData(userData);
    }
  }, [userData.id, userData.fullName, userData.phone, userData.email]); // Theo dõi các field quan trọng

  useEffect(() => {
    // Kiểm tra eligibility khi có user ID và token
    if (userData.id && userData.token) {
      checkDonationEligibility();
    }
  }, [userData.id, userData.token]);

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
        bloodType: formData.bloodType || null, // Đúng tên trường
      };
      
      console.log("Updating profile with payload:", payload);
      
      const response = await api.put("/user/update-user", payload, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      
      console.log("API Response:", response.data);
      
      // Cập nhật user data đồng bộ
      updateUserData(response.data);
      
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      
      // Kiểm tra lại eligibility sau khi cập nhật
      setTimeout(() => {
        checkDonationEligibility();
      }, 500);
      
    } catch (err) {
      console.error("Update profile error:", err);
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
      
      const response = await api.put("/users/profile-image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userData.token}`
        }
      });
      
      // Cập nhật ảnh profile
      updateUserData({ profileImage: response.data.profileImage });
      
      setImageStatus("loaded");
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Upload image error:", err);
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
      return {
        icon: <FaSpinner className="text-blue-500 animate-spin" />,
        text: "Đang kiểm tra...",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
      };
    }
    
    if (!donationEligibility) {
      return {
        icon: <FaTimesCircle className="text-gray-500" />,
        text: "Không thể tải trạng thái",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700"
      };
    }
    
    if (donationEligibility.status === 'success') {
      return {
        icon: <FaCheckCircle className="text-green-500" />,
        text: donationEligibility.message,
        bgColor: "bg-green-50",
        textColor: "text-green-800"
      };
    }
    
    return {
      icon: <FaTimesCircle className="text-red-500" />,
      text: donationEligibility.message,
      bgColor: "bg-red-50",
      textColor: "text-red-800"
    };
  };

  const eligibility = renderEligibilityStatus();

  // Kiểm tra xem có dữ liệu user không
  if (!userData || !userData.id) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="text-red-500 animate-spin text-2xl mr-3" />
          <span className="text-gray-600">Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={userData.profileImage || `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`}
                alt="Hồ sơ"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-red-100 border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=D1C4E9&color=4527A0&bold=true`;
                }}
              />
              <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
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
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Chỉnh sửa hồ sơ"
              >
                <FaEdit className="text-gray-700 text-xl" />
              </button>
              <button
                onClick={() => setShowUpdateCredentials(true)}
                className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Cập nhật thông tin đăng nhập"
              >
                <FaKey className="text-gray-700 text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        {isEditing ? (
          // Edit Mode
          <form onSubmit={handleProfileUpdate} className="mt-6 space-y-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-red-500" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormInput
                  id="fullName"
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  required
                />
                <FormInput
                  id="phone"
                  label="Điện thoại"
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                <FormInput
                  id="birthdate"
                  label="Ngày sinh"
                  type="date"
                  value={formatDate(formData.birthdate)}
                  onChange={e => setFormData({...formData, birthdate: e.target.value})}
                />
                <FormInput id="gender" label="Giới tính">
                  <select
                    id="gender"
                    value={formData.gender || ""}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value="">Chọn giới tính</option>
                    {genderOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FormInput>
                <div className="md:col-span-2">
                  <FormInput
                    id="address"
                    label="Địa chỉ"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaBookMedical className="mr-2 text-red-500" />
                Thông tin y tế
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormInput
                  id="height"
                  label="Chiều cao (cm)"
                  type="number"
                  min="0"
                  value={formData.height}
                  onWheel={(e) => e.target.blur()}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                />
                <FormInput
                  id="weight"
                  label="Cân nặng (kg)"
                  type="number"
                  min="0"
                  value={formData.weight}
                  onWheel={(e) => e.target.blur()}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
                <FormInput id="bloodType" label="Nhóm máu">
                  <select
                    id="bloodType"
                    value={formData.bloodType || ""}
                    onChange={e => setFormData({...formData, bloodType: e.target.value})}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodGroups.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </FormInput>
                <FormInput
                  id="lastDonation"
                  label="Lần hiến cuối"
                  type="date"
                  value={formatDate(formData.lastDonation)}
                  onChange={e => setFormData({...formData, lastDonation: e.target.value})}
                />
                <div className="md:col-span-2">
                  <FormInput id="medicalHistory" label="Tiền sử bệnh án">
                    <textarea
                      id="medicalHistory"
                      rows="3"
                      value={formData.medicalHistory || ""}
                      onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-none"
                    />
                  </FormInput>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUserShield className="mr-2 text-red-500" />
                Liên hệ khẩn cấp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormInput
                  id="emergencyName"
                  label="Họ tên người liên hệ"
                  value={formData.emergencyName}
                  onChange={e => setFormData({...formData, emergencyName: e.target.value})}
                />
                <FormInput
                  id="emergencyPhone"
                  label="SĐT người liên hệ"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({...formData, emergencyPhone: e.target.value})}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center"
              >
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="mt-8">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <InfoField
                icon={<FaUser />}
                label="Họ và tên"
                value={userData.fullName}
                isPlaceholder={!userData.fullName}
              />
              <InfoField
                icon={<FaPhoneAlt />}
                label="Điện thoại"
                value={userData.phone}
                isPlaceholder={!userData.phone}
              />
              <InfoField
                icon={<FaBirthdayCake />}
                label="Ngày sinh"
                value={formatDate(userData.birthdate, 'display')}
                isPlaceholder={!userData.birthdate}
              />
              <InfoField
                icon={<FaVenusMars />}
                label="Giới tính"
                value={getLabel(genderOptions, userData.gender)}
              />
              <InfoField
                icon={<FaMapMarkerAlt />}
                label="Địa chỉ"
                value={userData.address}
                isPlaceholder={!userData.address}
              />
              <InfoField
                icon={<FaRulerVertical />}
                label="Chiều cao"
                value={userData.height ? `${userData.height} cm` : "Chưa có thông tin"}
                isPlaceholder={!userData.height}
              />
              <InfoField
                icon={<FaWeight />}
                label="Cân nặng"
                value={userData.weight ? `${userData.weight} kg` : "Chưa có thông tin"}
                isPlaceholder={!userData.weight}
              />
              <InfoField
                icon={<FaHistory />}
                label="Lần hiến máu cuối"
                value={formatDate(userData.lastDonation, 'display')}
                isPlaceholder={!userData.lastDonation}
              />
              <InfoField
                icon={<FaBookMedical />}
                label="Tiền sử bệnh án"
                value={userData.medicalHistory}
                isPlaceholder={!userData.medicalHistory}
              />
              <InfoField
                icon={<FaUserShield />}
                label="Người liên hệ khẩn cấp"
                value={userData.emergencyName}
                isPlaceholder={!userData.emergencyName}
              />
              <InfoField
                icon={<FaPhoneAlt />}
                label="SĐT khẩn cấp"
                value={userData.emergencyPhone}
                isPlaceholder={!userData.emergencyPhone}
              />
            </dl>
          </div>
        )}

        {/* Eligibility Status */}
        <div className={`mt-8 p-4 rounded-lg flex items-center justify-between ${eligibility.bgColor}`}>
          <div className="flex items-center">
            <span className="text-xl">{eligibility.icon}</span>
            <p className={`ml-3 font-semibold ${eligibility.textColor}`}>
              {eligibility.text}
            </p>
          </div>
          <button
            onClick={checkDonationEligibility}
            disabled={isCheckingEligibility}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
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
