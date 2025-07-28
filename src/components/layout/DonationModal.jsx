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
