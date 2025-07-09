import React, { useState, useEffect } from "react";
import axios from "axios";

const initialState = {
  height: "",
  weight: "",
  temperature: "",
  bloodPressure: "",
  checkDate: "",
};

const HealthCheckForm = ({ bloodRegisterId, onSuccess }) => {
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [donorInfo, setDonorInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin đơn đăng ký hiến máu
    const fetchData = async () => {
      try {
        const res = await axios.get(`/blood-register/get-list-donation`);
        console.log("Danh sách đơn trả về:", res.data);
        console.log("bloodRegisterId:", bloodRegisterId);
        // Tìm đơn theo id
        const found = res.data.find(
          (item) => String(item.id) === String(bloodRegisterId)
        );
        if (found) {
          setDonorInfo(found);
          setForm({
            height: found.height || "",
            weight: found.weight || "",
            temperature: found.temperature || "",
            bloodPressure: found.bloodPressure || "",
            checkDate: found.checkDate || "",
          });
        } else {
          console.warn("Không tìm thấy đơn với id:", bloodRegisterId);
        }
      } catch (err) {
        setDonorInfo(null);
        console.error("Lỗi khi lấy danh sách đơn:", err);
      }
    };
    if (bloodRegisterId) fetchData();
  }, [bloodRegisterId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(`/api/blood-register/update/${bloodRegisterId}`, form);
      setLoading(false);
      if (onSuccess) onSuccess();
      alert("Cập nhật kiểm tra sức khỏe thành công!");
    } catch {
      setLoading(false);
      setError("Có lỗi xảy ra!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 16,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h3>Kiểm tra sức khỏe người hiến máu</h3>
      {donorInfo && (
        <div
          style={{
            marginBottom: 16,
            background: "#f8f8f8",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <div>
            <b>Họ tên:</b> {donorInfo.fullName || ""}
          </div>
          <div>
            <b>Nhóm máu:</b> {donorInfo.bloodType || ""}
          </div>
          <div>
            <b>Số điện thoại:</b> {donorInfo.phone || ""}
          </div>
          <div>
            <b>Email:</b> {donorInfo.email || ""}
          </div>
          <div>
            <b>Số lần hiến:</b> {donorInfo.unitDonation || ""}
          </div>
          <div>
            <b>Lần hiến gần nhất:</b> {donorInfo.lastDonation || "Chưa có"}
          </div>
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <label>Chiều cao (cm):</label>
        <input
          name="height"
          value={form.height}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Cân nặng (kg):</label>
        <input
          name="weight"
          value={form.weight}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Nhiệt độ (°C):</label>
        <input
          name="temperature"
          value={form.temperature}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Huyết áp:</label>
        <input
          name="bloodPressure"
          value={form.bloodPressure}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Ngày kiểm tra:</label>
        <input
          type="date"
          name="checkDate"
          value={form.checkDate}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: 8 }}
      >
        {loading ? "Đang lưu..." : "Lưu kiểm tra sức khỏe"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default HealthCheckForm;
