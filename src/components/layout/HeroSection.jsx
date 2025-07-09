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
import DonationModal from "./DonationModal";

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
      const response = await api.post("blood-register/create", apiData);
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
      <DonationModal
        show={showDonationForm}
        onClose={handleCloseDonationForm} // 👈 truyền từ HeroSection
        userData={userData}
      />
    </>
  );
}

export default HeroSection;
