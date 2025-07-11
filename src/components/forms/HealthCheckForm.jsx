import React, { useState, useEffect } from "react";
import axios from "axios";
import { createHealthCheck } from "../../services/healthCheckService";
import api from "../../config/api";

const initialState = {
  fullName: "",
  height: "",
  weight: "",
  temperature: "",
  bloodPressure: "",
  medicalHistory: "",
  checkDate: new Date().toISOString().split("T")[0], // Mặc định là hôm nay
  staffName: "",
  status: true,
  reason: "",
};

const validateForm = (form) => {
  const errors = [];
  const height = parseFloat(form.height);
  if (isNaN(height) || height < 1 || height > 250)
    errors.push("Chiều cao phải từ 1cm đến 250cm");
  const weight = parseFloat(form.weight);
  if (isNaN(weight) || weight < 30 || weight > 200)
    errors.push("Cân nặng phải từ 30kg đến 200kg");
  const temperature = parseFloat(form.temperature);
  if (isNaN(temperature) || temperature < 35 || temperature > 42)
    errors.push("Nhiệt độ phải từ 35°C đến 42°C");
  const bloodPressure = parseFloat(form.bloodPressure);
  if (isNaN(bloodPressure) || bloodPressure < 50 || bloodPressure > 250)
    errors.push("Huyết áp phải từ 50 đến 250 mmHg");
  if (!form.checkDate) errors.push("Ngày kiểm tra không được để trống");
  if (!form.staffName.trim()) errors.push("Tên nhân viên kiểm tra không được để trống");
  if (!form.fullName.trim()) errors.push("Họ tên không được để trống");
  if (!form.status && !form.reason.trim())
    errors.push("Lý do không đủ điều kiện hiến máu là bắt buộc");
  return errors;
};

const HealthCheckForm = ({ bloodRegisterId, onSuccess }) => {
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [donorInfo, setDonorInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/blood-register/get-list-donation`);
        const found = res.data.find(
          (item) => String(item.id) === String(bloodRegisterId)
        );
        if (found) {
          setDonorInfo(found);
          setForm((prev) => ({
            ...prev,
            fullName: found.fullName || "",
            height: found.height || "",
            weight: found.weight || "",
            temperature: found.temperature || "",
            bloodPressure: found.bloodPressure || "",
            checkDate: found.checkDate || new Date().toISOString().split("T")[0],
            reason: found.reason || "",
          }));
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
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    const errors = validateForm(form);
    if (errors.length > 0) {
      setLoading(false);
      setError(errors);
      return;
    }
    try {
      const payload = {
        height: form.height && !isNaN(parseFloat(form.height)) ? parseFloat(form.height) : null,
        weight: form.weight && !isNaN(parseFloat(form.weight)) ? parseFloat(form.weight) : null,
        temperature: form.temperature && !isNaN(parseFloat(form.temperature)) ? parseFloat(form.temperature) : null,
        bloodPressure: form.bloodPressure && !isNaN(parseFloat(form.bloodPressure)) ? parseFloat(form.bloodPressure) : null,
        medicalHistory: form.medicalHistory || null,
        checkDate: form.checkDate,
        staffName: form.staffName,
        status: form.status,
        reason: form.reason || null,
        bloodRegisterId,
      };
      await createHealthCheck(payload);
      setLoading(false);
      if (onSuccess) onSuccess();
      alert("Tạo kiểm tra sức khỏe thành công!");
      setForm({ ...initialState }); // Reset form sau khi gửi thành công
    } catch (err) {
      setLoading(false);
      setError([err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!"]);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
      <h3>Kiểm tra sức khỏe người hiến máu</h3>
      {donorInfo && (
        <div style={{ marginBottom: 16, background: "#f8f8f8", padding: 8, borderRadius: 6 }}>
          <div><b>Họ tên:</b> {donorInfo.fullName || "Chưa có"}</div>
          <div><b>Nhóm máu:</b> {donorInfo.bloodType || "Chưa có"}</div>
          <div><b>Số điện thoại:</b> {donorInfo.phone || "Chưa có"}</div>
          <div><b>Email:</b> {donorInfo.email || "Chưa có"}</div>
          <div><b>Số lần hiến:</b> {donorInfo.unitDonation || "0"}</div>
          <div><b>Lần hiến gần nhất:</b> {donorInfo.lastDonation || "Chưa có"}</div>
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <label>Họ tên:</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Chiều cao (cm):</label>
        <input
          name="height"
          value={form.height}
          onChange={handleChange}
          required
          type="number"
          step="0.01"
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
          type="number"
          step="0.01"
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
          type="number"
          step="0.01"
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Huyết áp (mmHg):</label>
        <input
          name="bloodPressure"
          value={form.bloodPressure}
          onChange={handleChange}
          required
          type="number"
          step="0.01"
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Tiền sử bệnh:</label>
        <input
          name="medicalHistory"
          value={form.medicalHistory}
          onChange={handleChange}
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
      <div style={{ marginBottom: 8 }}>
        <label>Tên nhân viên kiểm tra:</label>
        <input
          name="staffName"
          value={form.staffName}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Đủ điều kiện hiến máu?
          <input
            name="status"
            type="checkbox"
            checked={form.status}
            onChange={handleChange}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Lý do (nếu không đủ điều kiện):</label>
        <input
          name="reason"
          value={form.reason}
          onChange={handleChange}
          disabled={form.status}
          style={{ width: "100%" }}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: 8 }}
      >
        {loading ? "Đang lưu..." : "Lưu kiểm tra sức khỏe"}
      </button>
      {error.length > 0 && (
        <ul style={{ color: "red", marginTop: 8 }}>
          {error.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HealthCheckForm;