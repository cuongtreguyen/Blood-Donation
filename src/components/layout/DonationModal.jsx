import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";

const DonationModal = ({ show, onClose, userData }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
        last_donation: userData.last_donation || "",
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Ngày sinh là bắt buộc";
    } else {
      const age = new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
      const monthDiff = new Date().getMonth() - new Date(formData.birthdate).getMonth();
      const dayDiff = new Date().getDate() - new Date(formData.birthdate).getDate();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      if (actualAge < 18) {
        newErrors.birthdate = "Bạn phải đủ 18 tuổi để hiến máu";
      } else if (actualAge > 60) {
        newErrors.birthdate = "Tuổi hiến máu tối đa là 60 tuổi";
      }
    }

    if (!formData.weight) {
      newErrors.weight = "Cân nặng là bắt buộc";
    } else if (parseFloat(formData.weight) < 45) {
      newErrors.weight = "Cân nặng tối thiểu để hiến máu là 45kg";
    } else if (parseFloat(formData.weight) > 200) {
      newErrors.weight = "Vui lòng nhập cân nặng hợp lệ";
    }

    if (formData.height && (parseFloat(formData.height) < 140 || parseFloat(formData.height) > 220)) {
      newErrors.height = "Chiều cao không hợp lệ (140-220cm)";
    }

    // Last donation validation
    if (formData.last_donation) {
      const lastDonationDate = new Date(formData.last_donation);
      const today = new Date();
      const diffTime = today - lastDonationDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 84) {
        newErrors.last_donation = "Phải cách lần hiến máu trước ít nhất 12 tuần (84 ngày)";
      }
    }

    // Preferred date validation
    if (!formData.preferred_date) {
      newErrors.preferred_date = "Ngày mong muốn hiến máu là bắt buộc";
    } else {
      const preferredDate = new Date(formData.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (preferredDate < today) {
        newErrors.preferred_date = "Ngày mong muốn không thể là ngày trong quá khứ";
      }
      
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      if (preferredDate > maxDate) {
        newErrors.preferred_date = "Ngày mong muốn không được quá 3 tháng từ hôm nay";
      }
    }

    // Preferred time validation
    if (!formData.preferred_time) {
      newErrors.preferred_time = "Giờ mong muốn hiến máu là bắt buộc";
    }

    // Emergency contact validation
    if (formData.emergencyName && formData.emergencyName.trim().length < 2) {
      newErrors.emergencyName = "Tên người liên hệ khẩn cấp phải có ít nhất 2 ký tự";
    }

    if (formData.emergencyPhone && !/^[0-9]{10,11}$/.test(formData.emergencyPhone.replace(/\s/g, ""))) {
      newErrors.emergencyPhone = "Số điện thoại khẩn cấp không hợp lệ";
    }

    // Terms agreement validation
    if (!formData.agrees_to_terms) {
      newErrors.agrees_to_terms = "Bạn phải đồng ý với các điều khoản và điều kiện";
    }

    // Health condition warnings
    if (formData.has_chronic_disease || formData.is_taking_medication || formData.has_recent_surgery) {
      if (!formData.medical_history?.trim()) {
        newErrors.medical_history = "Vui lòng mô tả chi tiết tình trạng sức khỏe của bạn";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatApiData = (data) => {
    const genderMap = {
      male: "MALE",
      female: "FEMALE",
    };

    const formatTime = (time) => (time ? `${time}:00` : null);

    return {
      gender: genderMap[data.gender] || null,
      birthdate: data.birthdate || null,
      height: data.height ? parseFloat(data.height) / 100 : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      last_donation: data.last_donation || null,
      medicalHistory: data.medical_history || "không có",
      bloodType: data.bloodType || null,
      wantedDate: data.preferred_date || null,
      wantedHour: formatTime(data.preferred_time),
      emergencyName: data.emergencyName || null,
      emergencyPhone: data.emergencyPhone || null,
      location: "Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
    };
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      const { data } = error.response;
      
      if (data.message) {
        toast.error(`❌ ${data.message}`);
        return;
      }
      
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          data.errors.forEach(message => {
            toast.error(`❌ ${message}`);
          });
        } else if (typeof data.errors === 'object') {
          Object.values(data.errors).flat().forEach(message => {
            toast.error(`❌ ${message}`);
          });
        } else {
          toast.error(`❌ ${data.errors}`);
        }
        return;
      }
      
      toast.error("❌ Đã xảy ra lỗi, vui lòng thử lại.");
    } else if (error.request) {
      toast.error("❌ Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.");
    } else {
      toast.error(`❌ ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(error => error).join(", ");
      toast.error(`❌ Vui lòng kiểm tra và sửa các lỗi sau: ${errorMessages}`);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const apiData = formatApiData(formData);
      await api.post("blood-register/create", apiData);

      toast.success(
        `🎉 Cảm ơn ${formData.fullName}, đăng ký hiến máu thành công!`
      );
      toast.success(
        "📋 ĐƠN CỦA BẠN SẼ ĐƯỢC PHẢN HỒI VÀ PHÊ DUYỆT TRONG VÒNG 24H, TRÂN TRỌNG CẢM ƠN!!"
      );
      onClose();
    } catch (error) {
      handleApiError(error);
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
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label">Họ và tên *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    className={`form-control form-control-lg ${errors.fullName ? 'is-invalid' : ''}`}
                    value={formData.fullName} 
                    onChange={handleChange} 
                    disabled={!!userData?.fullName} 
                    required 
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email} 
                    onChange={handleChange} 
                    disabled={!!userData?.email} 
                    required 
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                    value={formData.phone} 
                    onChange={handleChange} 
                    disabled={!!userData?.phone} 
                    required 
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Birthdate */}
                <div className="col-md-6">
                  <label className="form-label">Ngày sinh *</label>
                  <input 
                    type="date" 
                    name="birthdate" 
                    className={`form-control form-control-lg ${errors.birthdate ? 'is-invalid' : ''}`}
                    value={formData.birthdate} 
                    onChange={handleChange} 
                    disabled={!!userData?.birthdate} 
                    required 
                  />
                  {errors.birthdate && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.birthdate}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <label className="form-label">Giới tính</label>
                  <select name="gender" className="form-select form-select-lg" value={formData.gender} onChange={handleChange} disabled={!!userData?.gender}>
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                {/* Address */}
                <div className="col-md-6">
                  <label className="form-label">Địa chỉ</label>
                  <input type="text" name="address" className="form-control form-control-lg" value={formData.address} onChange={handleChange} disabled={!!userData?.address} />
                </div>

                {/* Blood Type */}
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

                {/* Weight */}
                <div className="col-md-3">
                  <label className="form-label">Cân nặng (kg) *</label>
                  <input 
                    type="number" 
                    name="weight" 
                    className={`form-control form-control-lg ${errors.weight ? 'is-invalid' : ''}`}
                    value={formData.weight} 
                    onChange={handleChange} 
                    disabled={!!userData?.weight} 
                    min="30"
                    max="200"
                    required 
                  />
                  {errors.weight && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.weight}
                    </div>
                  )}
                </div>

                {/* Height */}
                <div className="col-md-3">
                  <label className="form-label">Chiều cao (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    className={`form-control form-control-lg ${errors.height ? 'is-invalid' : ''}`}
                    value={formData.height} 
                    onChange={handleChange} 
                    disabled={!!userData?.height}
                    min="140"
                    max="220"
                  />
                  {errors.height && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.height}
                    </div>
                  )}
                </div>

                {/* Last Donation */}
                <div className="col-md-6">
                  <label className="form-label">Lần hiến máu gần nhất</label>
                  <input 
                    type="date" 
                    name="last_donation" 
                    className={`form-control form-control-lg ${errors.last_donation ? 'is-invalid' : ''}`}
                    value={formData.last_donation} 
                    onChange={handleChange} 
                  />
                  {errors.last_donation && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.last_donation}
                    </div>
                  )}
                </div>

                {/* Medical History */}
                <div className="col-12">
                  <label className="form-label">Tiền sử bệnh (nếu có)</label>
                  <textarea 
                    name="medical_history" 
                    rows="2" 
                    className={`form-control ${errors.medical_history ? 'is-invalid' : ''}`}
                    value={formData.medical_history} 
                    onChange={handleChange} 
                    placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
                  ></textarea>
                  {errors.medical_history && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.medical_history}
                    </div>
                  )}
                </div>

                {/* Health Checkboxes */}
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

                {/* Preferred Date */}
                <div className="col-md-6">
                  <label className="form-label">Ngày mong muốn *</label>
                  <input 
                    type="date" 
                    name="preferred_date" 
                    className={`form-control form-control-lg ${errors.preferred_date ? 'is-invalid' : ''}`}
                    value={formData.preferred_date} 
                    onChange={handleChange} 
                    min={new Date().toISOString().split("T")[0]} 
                    required
                  />
                  {errors.preferred_date && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.preferred_date}
                    </div>
                  )}
                </div>

                {/* Preferred Time */}
                <div className="col-md-6">
                  <label className="form-label">Giờ mong muốn *</label>
                  <select 
                    name="preferred_time" 
                    className={`form-select form-select-lg ${errors.preferred_time ? 'is-invalid' : ''}`} 
                    value={formData.preferred_time} 
                    onChange={handleChange}
                    required
                  >
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
                  {errors.preferred_time && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.preferred_time}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="col-12">
                  <div className="alert alert-light border-start border-danger border-4">
                    <FaMapMarkerAlt className="me-2 text-danger" /> Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM
                  </div>
                </div>

                {/* Emergency Contact Name */}
                <div className="col-md-6">
                  <label className="form-label">Tên người liên hệ khẩn cấp</label>
                  <input 
                    type="text" 
                    name="emergencyName" 
                    className={`form-control form-control-lg ${errors.emergencyName ? 'is-invalid' : ''}`}
                    value={formData.emergencyName} 
                    onChange={handleChange} 
                  />
                  {errors.emergencyName && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.emergencyName}
                    </div>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div className="col-md-6">
                  <label className="form-label">Số điện thoại khẩn cấp</label>
                  <input 
                    type="tel" 
                    name="emergencyPhone" 
                    className={`form-control form-control-lg ${errors.emergencyPhone ? 'is-invalid' : ''}`}
                    value={formData.emergencyPhone} 
                    onChange={handleChange} 
                  />
                  {errors.emergencyPhone && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      {errors.emergencyPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="form-check my-4">
                <input 
                  className={`form-check-input ${errors.agrees_to_terms ? 'is-invalid' : ''}`}
                  type="checkbox" 
                  name="agrees_to_terms" 
                  checked={formData.agrees_to_terms} 
                  onChange={handleChange} 
                  required 
                />
                <label className="form-check-label">
                  Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với <a href="#" className="text-decoration-none text-danger">điều khoản hiến máu</a> và <a href="#" className="text-decoration-none text-danger">chính sách bảo mật</a>
                </label>
                {errors.agrees_to_terms && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    {errors.agrees_to_terms}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                  Hủy
                </button>
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