// // src/components/DonationModal.jsx
// import React, { useEffect, useState } from "react";
// import {
//   FaHeart,
//   FaUser,
//   FaCalendar,
//   FaMapMarkerAlt,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import api from "../../config/api";

// const DonationModal = ({ show, onClose, userData }) => {
//   const [formData, setFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         fullName: userData.fullName || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         birthdate: userData.birthdate || "",
//         gender: userData.gender?.toLowerCase?.() || "",
//         bloodType: userData.bloodType || "",
//         weight: userData.weight || "",
//         height: userData.height || "",
//         address: userData.address || "",
//         emergencyName: userData.emergencyName || "",
//         emergencyPhone: userData.emergencyPhone || "",

//         // Fields only in form
//         medical_history: "",
//         last_donation: "",
//         preferred_date: "",
//         preferred_time: "",
//         has_chronic_disease: false,
//         is_taking_medication: false,
//         has_recent_surgery: false,
//         agrees_to_terms: false,
//       });
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     const alwaysEditable = [
//       "medical_history",
//       "last_donation",
//       "preferred_date",
//       "preferred_time",
//       "emergencyName",
//       "emergencyPhone",
//       "has_chronic_disease",
//       "is_taking_medication",
//       "has_recent_surgery",
//       "agrees_to_terms",
//     ];

//     const userFields = [
//       "fullName",
//       "email",
//       "phone",
//       "birthdate",
//       "gender",
//       "bloodType",
//       "weight",
//       "height",
//       "address",
//     ];

//     const isEmptyUserField =
//       userFields.includes(name) &&
//       (userData?.[name] === undefined ||
//         userData?.[name] === null ||
//         userData?.[name] === "");

//     if (alwaysEditable.includes(name) || isEmptyUserField) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }
//   };

//   const formatApiData = (data) => {
//     const genderMap = {
//       male: "MALE",
//       female: "FEMALE",
//       other: "OTHER",
//     };

//     const formatTime = (time) => (time ? `${time}:00` : null);

//     return {
//       gender: genderMap[data.gender] || null,
//       birthdate: data.birthdate || null,
//       height: data.height ? parseFloat(data.height) / 100 : null,
//       weight: data.weight ? parseFloat(data.weight) : null,
//       last_donation: data.last_donation || null,
//       medicalHistory: data.medical_history || null,
//       bloodType: data.bloodType || null,
//       wantedDate: data.preferred_date || null,
//       wantedHour: formatTime(data.preferred_time),
//       emergencyName: data.emergencyName || null,
//       emergencyPhone: data.emergencyPhone || null,
//       location: "Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!formData.agrees_to_terms) {
//         toast.error("Vui lòng đồng ý với các điều khoản và điều kiện!");
//         return;
//       }

//       if (!formData.fullName || !formData.email || !formData.phone) {
//         toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
//         return;
//       }

//       const age =
//         new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
//       if (age < 18 || age > 60) {
//         toast.error("Tuổi hiến máu phải từ 18 đến 60 tuổi!");
//         return;
//       }

//       if (parseFloat(formData.weight) < 45) {
//         toast.error("Cân nặng tối thiểu để hiến máu là 45kg!");
//         return;
//       }

//       const apiData = formatApiData(formData);
//       await api.post("blood-register/create", apiData);

//       toast.success(
//         `Cảm ơn ${formData.fullName}, đăng ký hiến máu thành công!`
//       );
//       onClose(); // đóng modal
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="modal fade show d-block"
//       style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered modal-xl">
//         <div className="modal-content border-0 shadow-lg">
//           <div className="modal-header border-0 pb-0 bg-danger text-white">
//             <h4 className="modal-title fw-bold">
//               <FaHeart className="me-2" />
//               Đăng Ký Hiến Máu Tình Nguyện
//             </h4>
//             <button
//               type="button"
//               className="btn-close btn-close-white"
//               onClick={onClose}
//               disabled={isSubmitting}
//             ></button>
//           </div>

//           {userData && Object.keys(userData).length > 0 && (
//             <div className="alert alert-success mb-4">
//               <FaUser className="me-2" />
//               Xin chào <strong>{userData.fullName || "Người dùng"}</strong>!
//               Thông tin cá nhân của bạn đã được điền sẵn.
//             </div>
//           )}

//           <div className="alert alert-info mb-4">
//             <h6 className="fw-bold mb-2">
//               <FaInfoCircle className="me-2" />
//               Điều kiện hiến máu:
//             </h6>
//             <ul className="mb-0 small">
//               <li>Tuổi từ 18-60, cân nặng tối thiểu 45kg</li>
//               <li>Khỏe mạnh, không mắc bệnh truyền nhiễm</li>
//               <li>Không uống rượu bia 24h trước khi hiến máu</li>
//               <li>Nghỉ ngơi đủ giấc, ăn uống đầy đủ</li>
//             </ul>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {/* Thông tin cá nhân */}
//             <div className="border rounded p-3 mb-4">
//               <h6 className="fw-bold text-danger mb-3">
//                 <FaUser className="me-2" />
//                 Thông Tin Cá Nhân
//               </h6>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">Họ và tên *</label>
//                   <input
//                     type="text"
//                     className={`form-control ${
//                       userData?.fullName ? "bg-light" : ""
//                     }`}
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     placeholder="Nhập họ tên đầy đủ"
//                     readOnly={!!userData?.fullName}
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">Email *</label>
//                   <input
//                     type="email"
//                     className={`form-control ${
//                       userData?.email ? "bg-light" : ""
//                     }`}
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Nhập địa chỉ email"
//                     readOnly={!!userData?.email}
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">
//                     Số điện thoại *
//                   </label>
//                   <input
//                     type="tel"
//                     className={`form-control ${
//                       userData?.phone ? "bg-light" : ""
//                     }`}
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="Số điện thoại"
//                     readOnly={!!userData?.phone}
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">Ngày sinh *</label>
//                   <input
//                     type="date"
//                     className={`form-control ${
//                       userData?.birthdate ? "bg-light" : ""
//                     }`}
//                     name="birthdate"
//                     value={formData.birthdate}
//                     onChange={handleChange}
//                     readOnly={!!userData?.birthdate}
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">Giới tính</label>
//                   <select
//                     className={`form-select ${
//                       userData?.gender ? "bg-light" : ""
//                     }`}
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     disabled={!!userData?.gender || isSubmitting}
//                   >
//                     <option value="">Chọn giới tính</option>
//                     <option value="male">Nam</option>
//                     <option value="female">Nữ</option>
//                     <option value="other">Khác</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label fw-semibold">Địa chỉ</label>
//                   <input
//                     type="text"
//                     className={`form-control ${
//                       userData?.address ? "bg-light" : ""
//                     }`}
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Số nhà, tên đường"
//                     readOnly={!!userData?.address}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Thông tin sức khỏe */}
//             <div className="border rounded p-3 mb-4">
//               <h6 className="fw-bold text-danger mb-3">
//                 <FaHeart className="me-2" />
//                 Thông Tin Sức Khỏe
//               </h6>
//               <div className="row">
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">Nhóm máu</label>
//                   <select
//                     className={`form-select ${
//                       userData?.bloodType ? "bg-light" : ""
//                     }`}
//                     name="bloodType"
//                     value={formData.bloodType}
//                     onChange={handleChange}
//                     disabled={!!userData?.bloodType || isSubmitting}
//                   >
//                     <option value="">Chọn nhóm máu</option>
//                     <option value="A_POSITIVE">A+</option>
//                     <option value="A_NEGATIVE">A-</option>
//                     <option value="B_POSITIVE">B+</option>
//                     <option value="B_NEGATIVE">B-</option>
//                     <option value="AB_POSITIVE">AB+</option>
//                     <option value="AB_NEGATIVE">AB-</option>
//                     <option value="O_POSITIVE">O+</option>
//                     <option value="O_NEGATIVE">O-</option>
//                     <option value="unknown">Chưa biết</option>
//                   </select>
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">
//                     Cân nặng (kg) *
//                   </label>
//                   <input
//                     type="number"
//                     className={`form-control ${
//                       userData?.weight ? "bg-light" : ""
//                     }`}
//                     name="weight"
//                     value={formData.weight}
//                     onChange={handleChange}
//                     placeholder="Cân nặng"
//                     min="30"
//                     max="200"
//                     readOnly={!!userData?.weight}
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">
//                     Chiều cao (cm)
//                   </label>
//                   <input
//                     type="number"
//                     className={`form-control ${
//                       userData?.height ? "bg-light" : ""
//                     }`}
//                     name="height"
//                     value={formData.height}
//                     onChange={handleChange}
//                     placeholder="Chiều cao"
//                     min="100"
//                     max="250"
//                     readOnly={!!userData?.height}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   Lần hiến máu gần nhất
//                 </label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   name="last_donation"
//                   value={formData.last_donation}
//                   onChange={handleChange}
//                   disabled={isSubmitting}
//                 />
//                 <div className="form-text">Để trống nếu lần đầu hiến máu</div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   Tiền sử bệnh (nếu có)
//                 </label>
//                 <textarea
//                   className="form-control"
//                   name="medical_history"
//                   value={formData.medical_history}
//                   onChange={handleChange}
//                   rows="2"
//                   placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
//                   disabled={isSubmitting}
//                 ></textarea>
//               </div>
//               <div className="row">
//                 <div className="col-md-4">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       name="has_chronic_disease"
//                       checked={formData.has_chronic_disease}
//                       onChange={handleChange}
//                       disabled={isSubmitting}
//                     />
//                     <label className="form-check-label">Có bệnh mãn tính</label>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       name="is_taking_medication"
//                       checked={formData.is_taking_medication}
//                       onChange={handleChange}
//                       disabled={isSubmitting}
//                     />
//                     <label className="form-check-label">Đang dùng thuốc</label>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       name="has_recent_surgery"
//                       checked={formData.has_recent_surgery}
//                       onChange={handleChange}
//                       disabled={isSubmitting}
//                     />
//                     <label className="form-check-label">
//                       Phẫu thuật gần đây
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Thông tin lịch hẹn */}
//             <div className="border rounded p-3 mb-4">
//               <h6 className="fw-bold text-danger mb-3">
//                 <FaCalendar className="me-2" />
//                 Lịch Hẹn Hiến Máu
//               </h6>
//               <div className="row">
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">
//                     Ngày mong muốn
//                   </label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     name="preferred_date"
//                     value={formData.preferred_date}
//                     onChange={handleChange}
//                     min={new Date().toISOString().split("T")[0]}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label fw-semibold">
//                     Giờ mong muốn
//                   </label>
//                   <select
//                     className="form-select"
//                     name="preferred_time"
//                     value={formData.preferred_time}
//                     onChange={handleChange}
//                     disabled={isSubmitting}
//                   >
//                     <option value="">Chọn giờ</option>
//                     <option value="08:00">08:00 - 09:00</option>
//                     <option value="09:00">09:00 - 10:00</option>
//                     <option value="10:00">10:00 - 11:00</option>
//                     <option value="11:00">11:00 - 12:00</option>
//                     <option value="13:00">13:00 - 14:00</option>
//                     <option value="14:00">14:00 - 15:00</option>
//                     <option value="15:00">15:00 - 16:00</option>
//                     <option value="16:00">16:00 - 17:00</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Hiển thị địa chỉ chi tiết mặc định */}
//               <div className="alert alert-light border-start border-danger border-4 mb-3">
//                 <div className="d-flex align-items-start">
//                   <FaMapMarkerAlt className="text-danger me-2 mt-1" />
//                   <div>
//                     <strong className="text-danger">Địa điểm hiến máu:</strong>
//                     <div className="mt-1">
//                       Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Người liên hệ khẩn cấp */}
//             <div className="border rounded p-3 mb-4">
//               <h6 className="fw-bold text-danger mb-3">
//                 Người Liên Hệ Khẩn Cấp
//               </h6>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">Họ tên</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="emergencyName"
//                     value={formData.emergencyName}
//                     onChange={handleChange}
//                     placeholder="Tên người thân"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     Số điện thoại
//                   </label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     name="emergencyPhone"
//                     value={formData.emergencyPhone}
//                     onChange={handleChange}
//                     placeholder="Số điện thoại người thân"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Đồng ý điều khoản */}
//             <div className="form-check mb-4">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 name="agrees_to_terms"
//                 checked={formData.agrees_to_terms}
//                 onChange={handleChange}
//                 disabled={isSubmitting}
//                 required
//               />
//               <label className="form-check-label">
//                 Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý
//                 với{" "}
//                 <a href="#" className="text-decoration-none text-danger">
//                   điều khoản hiến máu
//                 </a>{" "}
//                 và{" "}
//                 <a href="#" className="text-decoration-none text-danger">
//                   chính sách bảo mật
//                 </a>{" "}
//                 *
//               </label>
//             </div>

//             <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary me-md-2"
//                 onClick={onClose}
//                 disabled={isSubmitting}
//               >
//                 Hủy
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-danger btn-lg px-4"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                       aria-hidden="true"
//                     ></span>
//                     Đang xử lý...
//                   </>
//                 ) : (
//                   <>
//                     <FaHeart className="me-2" />
//                     Đăng Ký Hiến Máu
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonationModal;














// src/components/DonationModal.jsx
import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";

const DonationModal = ({ show, onClose, userData }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthdate: userData.birthdate || "",
        gender: userData.gender?.toLowerCase?.() || "",
        bloodType: userData.bloodType || "",
        weight: userData.weight || "",
        height: userData.height || "",
        address: userData.address || "",
        emergencyName: userData.emergencyName || "",
        emergencyPhone: userData.emergencyPhone || "",

        medical_history: "",
        last_donation: "",
        preferred_date: "",
        preferred_time: "",
        has_chronic_disease: false,
        is_taking_medication: false,
        has_recent_surgery: false,
        agrees_to_terms: false,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatApiData = (data) => {
    const genderMap = {
      male: "MALE",
      female: "FEMALE",
      other: "OTHER",
    };

    const formatTime = (time) => (time ? `${time}` : null);

    return {
      gender: genderMap[data.gender] || null,
      birthdate: data.birthdate || null,
      height: data.height ? parseFloat(data.height) / 100 : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      last_donation: data.last_donation || null,
      medicalHistory: data.medical_history || null,
      bloodType: data.bloodType || null,
      wantedDate: data.preferred_date || null,
      wantedHour: formatTime(data.preferred_time),
      emergencyName: data.emergencyName || null,
      emergencyPhone: data.emergencyPhone || null,
      location: "Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.agrees_to_terms) {
        toast.error("Vui lòng đồng ý với các điều khoản và điều kiện!");
        return;
      }

      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      const age =
        new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
      if (age < 18 || age > 60) {
        toast.error("Tuổi hiến máu phải từ 18 đến 60 tuổi!");
        return;
      }

      if (parseFloat(formData.weight) < 45) {
        toast.error("Cân nặng tối thiểu để hiến máu là 45kg!");
        return;
      }

      const apiData = formatApiData(formData);
      await api.post("blood-register/create", apiData);

      toast.success(
        `Cảm ơn ${formData.fullName}, đăng ký hiến máu thành công!`
      );
      toast.success(
        "ĐƠN CỦA BẠN SẼ ĐƯỢC PHẢN HỒI VÀ PHÊ DUYỆT TRONG VÒNG 24H,TRÂN TRỌNG CẢM ƠN!!"
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content rounded-4 overflow-hidden">
          <div className="modal-header bg-danger text-white">
            <h4 className="modal-title fw-bold">
              <FaHeart className="me-2" /> Đăng Ký Hiến Máu Tình Nguyện
            </h4>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body p-4 bg-light-subtle">
            <div className="alert alert-info d-flex align-items-center">
              <FaInfoCircle className="me-2" />
              <div>
                <strong>Điều kiện hiến máu:</strong> Tuổi từ 18-60, cân nặng tối thiểu 45kg, khỏe mạnh, không mắc bệnh truyền nhiễm.
              </div>
            </div>

            {userData?.fullName && (
              <div className="alert alert-success">
                <FaUser className="me-2" /> Xin chào <strong>{userData.fullName}</strong>, thông tin cá nhân đã được điền sẵn.
              </div>
            )}

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Họ và tên *</label>
                  <input type="text" name="fullName" className="form-control form-control-lg" value={formData.fullName} onChange={handleChange} disabled={!!userData?.fullName} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" className="form-control form-control-lg" value={formData.email} onChange={handleChange} disabled={!!userData?.email} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại *</label>
                  <input type="tel" name="phone" className="form-control form-control-lg" value={formData.phone} onChange={handleChange} disabled={!!userData?.phone} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày sinh *</label>
                  <input type="date" name="birthdate" className="form-control form-control-lg" value={formData.birthdate} onChange={handleChange} disabled={!!userData?.birthdate} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giới tính</label>
                  <select name="gender" className="form-select form-select-lg" value={formData.gender} onChange={handleChange} disabled={!!userData?.gender}>
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Địa chỉ</label>
                  <input type="text" name="address" className="form-control form-control-lg" value={formData.address} onChange={handleChange} disabled={!!userData?.address} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nhóm máu</label>
                  <select name="bloodType" className="form-select form-select-lg" value={formData.bloodType} onChange={handleChange} disabled={!!userData?.bloodType}>
                    <option value="">Chọn nhóm máu</option>
                    <option value="A_POSITIVE">A+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="AB_NEGATIVE">AB-</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="O_NEGATIVE">O-</option>
                    <option value="unknown">Chưa biết</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Cân nặng (kg) *</label>
                  <input type="number" name="weight" className="form-control form-control-lg" value={formData.weight} onChange={handleChange} disabled={!!userData?.weight} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Chiều cao (cm)</label>
                  <input type="number" name="height" className="form-control form-control-lg" value={formData.height} onChange={handleChange} disabled={!!userData?.height} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Lần hiến máu gần nhất</label>
                  <input type="date" name="last_donation" className="form-control form-control-lg" value={formData.last_donation} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Tiền sử bệnh (nếu có)</label>
                  <textarea name="medical_history" rows="2" className="form-control" value={formData.medical_history} onChange={handleChange} placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"></textarea>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="has_chronic_disease" checked={formData.has_chronic_disease} onChange={handleChange} />
                    <label className="form-check-label">Có bệnh mãn tính</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="is_taking_medication" checked={formData.is_taking_medication} onChange={handleChange} />
                    <label className="form-check-label">Đang dùng thuốc</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="has_recent_surgery" checked={formData.has_recent_surgery} onChange={handleChange} />
                    <label className="form-check-label">Phẫu thuật gần đây</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Ngày mong muốn</label>
                  <input type="date" name="preferred_date" className="form-control form-control-lg" value={formData.preferred_date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giờ mong muốn</label>
                  <select name="preferred_time" className="form-select form-select-lg" value={formData.preferred_time} onChange={handleChange}>
                    <option value="">Chọn giờ</option>
                    <option value="08:00">08:00 - 09:00</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="11:00">11:00 - 12:00</option>
                    <option value="13:00">13:00 - 14:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                  </select>
                </div>
                <div className="col-12">
                  <div className="alert alert-light border-start border-danger border-4">
                    <FaMapMarkerAlt className="me-2 text-danger" /> Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tên người liên hệ khẩn cấp</label>
                  <input type="text" name="emergencyName" className="form-control form-control-lg" value={formData.emergencyName} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại khẩn cấp</label>
                  <input type="tel" name="emergencyPhone" className="form-control form-control-lg" value={formData.emergencyPhone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-check my-4">
                <input className="form-check-input" type="checkbox" name="agrees_to_terms" checked={formData.agrees_to_terms} onChange={handleChange} required />
                <label className="form-check-label">
                  Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với <a href="#" className="text-decoration-none text-danger">điều khoản hiến máu</a> và <a href="#" className="text-decoration-none text-danger">chính sách bảo mật</a>
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>Hủy</button>
                <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : (
                    <FaHeart className="me-2" />
                  )}
                  {isSubmitting ? "Đang xử lý..." : "Đăng Ký Hiến Máu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
