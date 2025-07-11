import React, { useEffect, useState } from "react";
import { getHealthCheckById } from "../../services/healthCheckService";

const HealthCheckDetail = ({ healthCheckId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!healthCheckId) return;
    setLoading(true);
    setError("");
    getHealthCheckById(healthCheckId)
      .then(setData)
      .catch(() => setError("Không thể lấy thông tin kiểm tra sức khỏe!"))
      .finally(() => setLoading(false));
  }, [healthCheckId]);

  if (!healthCheckId) return null;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data) return <div>Không có dữ liệu.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
      <h3>Chi tiết kiểm tra sức khỏe</h3>
      <div><b>Họ tên:</b> {data.fullName}</div>
      <div><b>Chiều cao:</b> {data.height} m</div>
      <div><b>Cân nặng:</b> {data.weight} kg</div>
      <div><b>Nhiệt độ:</b> {data.temperature} °C</div>
      <div><b>Huyết áp:</b> {data.bloodPressure}</div>
      <div><b>Tiền sử bệnh:</b> {data.medicalHistory}</div>
      <div><b>Ngày kiểm tra:</b> {data.checkDate}</div>
      <div><b>Nhân viên kiểm tra:</b> {data.staffName}</div>
      <div><b>Trạng thái:</b> {data.status ? "Đủ điều kiện" : "Không đủ điều kiện"}</div>
      <div><b>ID đăng ký hiến máu:</b> {data.bloodRegisterId}</div>
      {onClose && <button onClick={onClose} style={{ marginTop: 16 }}>Đóng</button>}
    </div>
  );
};

export default HealthCheckDetail; 