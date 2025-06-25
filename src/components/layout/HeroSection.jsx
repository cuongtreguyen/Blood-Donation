import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaHeart,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthCheck } from "../../hook/useAuthCheck";
import api from "../../config/api";

// Hero Section Component
function HeroSection({ onLearnMoreClick }) {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuthCheck("/login", false);
  const [donationFormData, setDonationFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    birthdate: userData?.birthdate || "",
    gender: userData?.gender || "",

    bloodType: userData?.bloodType || "",
    weight: userData?.weight || "",
    height: userData?.height || "",
    address: userData?.address || "",

    medical_history: "",
    last_donation: "",
    preferred_date: "",
    preferred_time: "",
    emergencyName: userData?.emergencyName || "",
    emergencyPhone: userData?.emergencyPhone || "",
    has_chronic_disease: false,
    is_taking_medication: false,
    has_recent_surgery: false,
    agrees_to_terms: false,
  });

  // Update form data when user data changes
  useEffect(() => {
    setDonationFormData({
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      birthdate: userData?.birthdate || "",
      gender: userData?.gender?.toLowerCase?.() || "",

      bloodType: userData?.bloodType || "",
      weight: userData?.weight || "",
      height: userData?.height || "",
      address: userData?.address || "",

      medical_history: "",
      last_donation: "",
      preferred_date: "",
      preferred_time: "",
      emergencyName: userData?.emergencyName || "",
      emergencyPhone: userData?.emergencyPhone || "",
      has_chronic_disease: false,
      is_taking_medication: false,
      has_recent_surgery: false,
      agrees_to_terms: false,
    });
  }, [userData]);

  // Xử lý đăng ký hiến máu - kiểm tra đăng nhập trước
  const handleDonateClick = () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, lưu đường dẫn hiện tại và chuyển hướng
      localStorage.setItem("redirectAfterLogin", "/");
      toast.error("Vui lòng đăng nhập để đăng ký hiến máu!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } else {
      // Nếu đã đăng nhập, hiển thị form
      setShowDonationForm(true);
    }
  };

  const handleDonationInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Always allow changes for these fields
    const alwaysEditableFields = [
      "emergencyName",
      "emergencyPhone",
      "agrees_to_terms",
      "medical_history",
      "last_donation",
      "preferred_date",
      "preferred_time",
      "has_chronic_disease",
      "is_taking_medication",
      "has_recent_surgery",
    ];

    // Allow changes for user-related fields if they are empty in userData
    const userRelatedFields = [
      "fullName",
      "email",
      "phone",
      "birthdate",
      "gender",

      "bloodType",
      "weight",
      "height",
      "address",
    ];

    // Check if the field is user-related and its value is empty in userData
    const isUserRelatedAndEmpty =
      userRelatedFields.includes(name) &&
      (userData[name] === undefined ||
        userData[name] === null ||
        userData[name] === "");

    // Allow change if the field is always editable or user-related and empty
    if (alwaysEditableFields.includes(name) || isUserRelatedAndEmpty) {
      setDonationFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Function to transform form data to API format
  const transformToApiFormat = (formData) => {
    // Map gender values
    const genderMap = {
      male: "MALE",
      female: "FEMALE",
      other: "OTHER",
    };

    // Convert preferred_time to HH:MM:SS format
    const formatTime = (timeSlot) => {
      if (!timeSlot) return null;
      // timeSlot is like "08:00", we need to add seconds
      return `${timeSlot}:00`;
    };

    return {
      gender: genderMap[formData.gender] || null,
      birthdate: formData.birthdate || null,
      height: formData.height ? parseFloat(formData.height) / 100 : null, // Convert cm to meters
      weight: formData.weight ? parseFloat(formData.weight) : null,
      last_donation: formData.last_donation || null,
      medicalHistory: formData.medical_history || null,
      bloodType: formData.bloodType || null,
      wantedDate: formData.preferred_date || null,
      wantedHour: formatTime(formData.preferred_time),
      emergencyName: formData.emergencyName || null,
      emergencyPhone: formData.emergencyPhone || null,

      location: "Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
    };
  };

  // API call function
  const submitDonationRequest = async (apiData) => {
    try {
      const response = await api.post("blood-register", apiData);
      console.log(response.data);
      setShowDonationForm(false);

      toast.success("Đăng ký máu thành công, chờ phê duyệt");
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký");

      throw error;
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!donationFormData.agrees_to_terms) {
        toast.error("Vui lòng đồng ý với các điều khoản và điều kiện!");
        return;
      }

      if (
        !donationFormData.fullName ||
        !donationFormData.email ||
        !donationFormData.phone
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      // Calculate age
      if (donationFormData.birthdate) {
        const today = new Date();
        const birthDate = new Date(donationFormData.birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18 || age > 60) {
          toast.error("Tuổi hiến máu phải từ 18 đến 60 tuổi!");
          return;
        }
      }

      if (donationFormData.weight && parseInt(donationFormData.weight) < 45) {
        toast.error("Cân nặng tối thiểu để hiến máu là 45kg!");
        return;
      }

      // Transform data to API format
      const apiData = transformToApiFormat(donationFormData);
      console.log("API Data:", apiData);

      // Submit to API
      const result = await submitDonationRequest(apiData);

      toast.success(
        `Cảm ơn ${donationFormData.fullName}! Đăng ký hiến máu thành công. Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn.`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );

      setShowDonationForm(false);
      // Reset only non-user fields
      setDonationFormData((prev) => ({
        ...prev,
        medical_history: "",
        last_donation: "",
        preferred_date: "",
        preferred_time: "",
        has_chronic_disease: false,
        is_taking_medication: false,
        has_recent_surgery: false,
        agrees_to_terms: false,
      }));
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!",
        {
          position: "top-right",

          autoClose: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDonationForm = () => {
    setShowDonationForm(false);
  };

  return (
    <>
      <section
        id="home"
        className="hero-section bg-gradient-danger text-white py-5"
        style={{
          marginTop: "0px",
          background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Hiến Máu Cứu Người
                <br />
                <span className="text-warning">Chia sẻ Yêu Thương</span>
              </h1>
              <p className="lead mb-4">
                Mỗi lần hiến máu của bạn có thể cứu sống đến 3 người. Hãy tham
                gia cùng chúng tôi trong sứ mệnh cao quý này.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button
                  onClick={handleDonateClick}
                  className="btn btn-outline-light btn-lg fw-bold px-4"
                >
                  Đăng Ký Hiến Máu
                </button>
                <button
                  onClick={onLearnMoreClick}
                  className="btn btn-outline-light btn-lg fw-bold px-4"
                >
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto-format&fit=crop&w=800&q=80"
                alt="Blood Donation"
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation Registration Modal */}
      {showDonationForm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 bg-danger text-white">
                <h4 className="modal-title fw-bold">
                  <FaHeart className="me-2" />
                  Đăng Ký Hiến Máu Tình Nguyện
                </h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseDonationForm}
                  disabled={isSubmitting}
                ></button>
              </div>
              <div className="modal-body p-4">
                {userData && Object.keys(userData).length > 0 && (
                  <div className="alert alert-success mb-4">
                    <FaUser className="me-2" />
                    Xin chào{" "}
                    <strong>{userData.fullName || "Người dùng"}</strong>! Thông
                    tin cá nhân của bạn đã được điền sẵn.
                  </div>
                )}

                <div className="alert alert-info mb-4">
                  <h6 className="fw-bold mb-2">
                    <FaInfoCircle className="me-2" />
                    Điều kiện hiến máu:
                  </h6>
                  <ul className="mb-0 small">
                    <li>Tuổi từ 18-60, cân nặng tối thiểu 45kg</li>
                    <li>Khỏe mạnh, không mắc bệnh truyền nhiễm</li>
                    <li>Không uống rượu bia 24h trước khi hiến máu</li>
                    <li>Nghỉ ngơi đủ giấc, ăn uống đầy đủ</li>
                  </ul>
                </div>

                <form onSubmit={handleDonationSubmit}>
                  {/* Thông tin cá nhân */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <FaUser className="me-2" />
                      Thông Tin Cá Nhân
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            userData?.fullName ? "bg-light" : ""
                          }`}
                          name="fullName"
                          value={donationFormData.fullName}
                          onChange={handleDonationInputChange}
                          placeholder="Nhập họ tên đầy đủ"
                          readOnly={!!userData?.fullName}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Email *
                        </label>
                        <input
                          type="email"
                          className={`form-control ${
                            userData?.email ? "bg-light" : ""
                          }`}
                          name="email"
                          value={donationFormData.email}
                          onChange={handleDonationInputChange}
                          placeholder="Nhập địa chỉ email"
                          readOnly={!!userData?.email}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${
                            userData?.phone ? "bg-light" : ""
                          }`}
                          name="phone"
                          value={donationFormData.phone}
                          onChange={handleDonationInputChange}
                          placeholder="Số điện thoại"
                          readOnly={!!userData?.phone}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Ngày sinh *
                        </label>
                        <input
                          type="date"
                          className={`form-control ${
                            userData?.birthdate ? "bg-light" : ""
                          }`}
                          name="birthdate"
                          value={donationFormData.birthdate}
                          onChange={handleDonationInputChange}
                          readOnly={!!userData?.birthdate}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Giới tính
                        </label>
                        <select
                          className={`form-select ${
                            userData?.gender ? "bg-light" : ""
                          }`}
                          name="gender"
                          value={donationFormData.gender}
                          onChange={handleDonationInputChange}
                          disabled={!!userData?.gender || isSubmitting}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            userData?.address ? "bg-light" : ""
                          }`}
                          name="address"
                          value={donationFormData.address}
                          onChange={handleDonationInputChange}
                          placeholder="Số nhà, tên đường"
                          readOnly={!!userData?.address}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin sức khỏe */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <FaHeart className="me-2" />
                      Thông Tin Sức Khỏe
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Nhóm máu
                        </label>
                        <select
                          className={`form-select ${
                            userData?.bloodType ? "bg-light" : ""
                          }`}
                          name="bloodType"
                          value={donationFormData.bloodType}
                          onChange={handleDonationInputChange}
                          disabled={!!userData?.bloodType || isSubmitting}
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
                          <option value="unknown">Chưa biết</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Cân nặng (kg) *
                        </label>
                        <input
                          type="number"
                          className={`form-control ${
                            userData?.weight ? "bg-light" : ""
                          }`}
                          name="weight"
                          value={donationFormData.weight}
                          onChange={handleDonationInputChange}
                          placeholder="Cân nặng"
                          min="30"
                          max="200"
                          readOnly={!!userData?.weight}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Chiều cao (cm)
                        </label>
                        <input
                          type="number"
                          className={`form-control ${
                            userData?.height ? "bg-light" : ""
                          }`}
                          name="height"
                          value={donationFormData.height}
                          onChange={handleDonationInputChange}
                          placeholder="Chiều cao"
                          min="100"
                          max="250"
                          readOnly={!!userData?.height}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Lần hiến máu gần nhất
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="last_donation"
                        value={donationFormData.last_donation}
                        onChange={handleDonationInputChange}
                        disabled={isSubmitting}
                      />
                      <div className="form-text">
                        Để trống nếu lần đầu hiến máu
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Tiền sử bệnh (nếu có)
                      </label>
                      <textarea
                        className="form-control"
                        name="medical_history"
                        value={donationFormData.medical_history}
                        onChange={handleDonationInputChange}
                        rows="2"
                        placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="has_chronic_disease"
                            checked={donationFormData.has_chronic_disease}
                            onChange={handleDonationInputChange}
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label">
                            Có bệnh mãn tính
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="is_taking_medication"
                            checked={donationFormData.is_taking_medication}
                            onChange={handleDonationInputChange}
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label">
                            Đang dùng thuốc
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="has_recent_surgery"
                            checked={donationFormData.has_recent_surgery}
                            onChange={handleDonationInputChange}
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label">
                            Phẫu thuật gần đây
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin lịch hẹn */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <FaCalendar className="me-2" />
                      Lịch Hẹn Hiến Máu
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Ngày mong muốn
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="preferred_date"
                          value={donationFormData.preferred_date}
                          onChange={handleDonationInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Giờ mong muốn
                        </label>
                        <select
                          className="form-select"
                          name="preferred_time"
                          value={donationFormData.preferred_time}
                          onChange={handleDonationInputChange}
                          disabled={isSubmitting}
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
                      </div>
                    </div>

                    {/* Hiển thị địa chỉ chi tiết mặc định */}
                    <div className="alert alert-light border-start border-danger border-4 mb-3">
                      <div className="d-flex align-items-start">
                        <FaMapMarkerAlt className="text-danger me-2 mt-1" />
                        <div>
                          <strong className="text-danger">
                            Địa điểm hiến máu:
                          </strong>
                          <div className="mt-1">
                            Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5,
                            TP.HCM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Người liên hệ khẩn cấp */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      Người Liên Hệ Khẩn Cấp
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Họ tên</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyName"
                          value={donationFormData.emergencyName}
                          onChange={handleDonationInputChange}
                          placeholder="Tên người thân"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="emergencyPhone"
                          value={donationFormData.emergencyPhone}
                          onChange={handleDonationInputChange}
                          placeholder="Số điện thoại người thân"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Đồng ý điều khoản */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="agrees_to_terms"
                      checked={donationFormData.agrees_to_terms}
                      onChange={handleDonationInputChange}
                      disabled={isSubmitting}
                      required
                    />
                    <label className="form-check-label">
                      Tôi xác nhận rằng tất cả thông tin trên là chính xác và
                      đồng ý với{" "}
                      <a href="#" className="text-decoration-none text-danger">
                        điều khoản hiến máu
                      </a>{" "}
                      và{" "}
                      <a href="#" className="text-decoration-none text-danger">
                        chính sách bảo mật
                      </a>{" "}
                      *
                    </label>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-md-2"
                      onClick={handleCloseDonationForm}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger btn-lg px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FaHeart className="me-2" />
                          Đăng Ký Hiến Máu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroSection;
