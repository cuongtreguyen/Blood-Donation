// import React, { useState, useEffect } from "react";
// import { createHealthCheck } from "../../services/healthCheckService";

// const initialState = {
//   fullName: "",
//   height: "",
//   weight: "",
//   temperature: "",
//   bloodPressure: "",
//   medicalHistory: "",
//   checkDate: new Date().toISOString().split("T")[0], // Mặc định là hôm nay
//   staffName: "",
//   status: true,
//   reason: "",
// };

// const validateForm = (form) => {
//   const errors = [];
//   const height = parseFloat(form.height);
//   if (isNaN(height) || height < 1 || height > 250)
//     errors.push("Chiều cao phải từ 1cm đến 250cm");
//   const weight = parseFloat(form.weight);
//   if (isNaN(weight) || weight < 30 || weight > 200)
//     errors.push("Cân nặng phải từ 30kg đến 200kg");
//   const temperature = parseFloat(form.temperature);
//   if (isNaN(temperature) || temperature < 35 || temperature > 42)
//     errors.push("Nhiệt độ phải từ 35°C đến 42°C");
//   const bloodPressure = parseFloat(form.bloodPressure);
//   if (isNaN(bloodPressure) || bloodPressure < 50 || bloodPressure > 250)
//     errors.push("Huyết áp phải từ 50 đến 250 mmHg");
//   if (!form.checkDate) errors.push("Ngày kiểm tra không được để trống");
//   if (!form.fullName.trim()) errors.push("Họ tên không được để trống");
//   if (!form.status && !form.reason.trim())
//     errors.push("Lý do không đủ điều kiện hiến máu là bắt buộc");
//   return errors;
// };

// const HealthCheckForm = ({ donorInfo, onSuccess }) => {
//   const [form, setForm] = useState({ ...initialState });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState([]);

//   useEffect(() => {
//     if (donorInfo) {
//       setForm((prev) => ({
//         ...prev,
//         fullName: donorInfo.fullName || donorInfo.name || "",
//       }));
//     }
//   }, [donorInfo]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError([]);
//     if (!donorInfo) {
//       setLoading(false);
//       setError(["Không tìm thấy đơn đăng ký hiến máu hợp lệ!"]);
//       return;
//     }
//     const errors = validateForm(form);
//     if (errors.length > 0) {
//       setLoading(false);
//       setError(errors);
//       return;
//     }
//     try {
//       const payload = {
//         height: form.height && !isNaN(parseFloat(form.height)) ? parseFloat(form.height) : null,
//         weight: form.weight && !isNaN(parseFloat(form.weight)) ? parseFloat(form.weight) : null,
//         temperature: form.temperature && !isNaN(parseFloat(form.temperature)) ? parseFloat(form.temperature) : null,
//         bloodPressure: form.bloodPressure && !isNaN(parseFloat(form.bloodPressure)) ? parseFloat(form.bloodPressure) : null,
//         medicalHistory: form.medicalHistory || null,
//         checkDate: form.checkDate,
//         status: form.status,
//         reason: form.reason || null,
//         bloodRegisterId: donorInfo.id, // lấy id đơn đăng ký
//         fullName: donorInfo.fullName || donorInfo.name || form.fullName,
//       };
//       await createHealthCheck(payload);
//       setLoading(false);
//       if (onSuccess) onSuccess();
//       alert("Tạo kiểm tra sức khỏe thành công!");
//       setForm({ ...initialState });
//     } catch (err) {
//       setLoading(false);
//       setError([
//         err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!",
//       ]);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 400,
//         margin: "0 auto",
//         padding: 16,
//         border: "1px solid #eee",
//         borderRadius: 8,
//       }}
//     >
//       <h3>Kiểm tra sức khỏe người hiến máu</h3>

//       <div style={{ marginBottom: 8 }}>
//         <label>Họ tên:</label>
//         <input
//           name="fullName"
//           value={donorInfo?.fullName || donorInfo?.name || form.fullName}
//           onChange={handleChange}
//           required
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Chiều cao (cm):</label>
//         <input
//           name="height"
//           value={form.height}
//           onChange={handleChange}
//           required
//           type="number"
//           step="0.01"
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Cân nặng (kg):</label>
//         <input
//           name="weight"
//           value={form.weight}
//           onChange={handleChange}
//           required
//           type="number"
//           step="0.01"
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Nhiệt độ (°C):</label>
//         <input
//           name="temperature"
//           value={form.temperature}
//           onChange={handleChange}
//           required
//           type="number"
//           step="0.01"
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Huyết áp (mmHg):</label>
//         <input
//           name="bloodPressure"
//           value={form.bloodPressure}
//           onChange={handleChange}
//           required
//           type="number"
//           step="0.01"
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Tiền sử bệnh:</label>
//         <input
//           name="medicalHistory"
//           value={form.medicalHistory}
//           onChange={handleChange}
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Ngày kiểm tra:</label>
//         <input
//           type="date"
//           name="checkDate"
//           value={form.checkDate}
//           onChange={handleChange}
//           required
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>
//           Đủ điều kiện hiến máu?
//           <input
//             name="status"
//             type="checkbox"
//             checked={form.status}
//             onChange={handleChange}
//             style={{ marginLeft: 8 }}
//           />
//         </label>
//       </div>
//       <div style={{ marginBottom: 8 }}>
//         <label>Lý do (nếu không đủ điều kiện):</label>
//         <input
//           name="reason"
//           value={form.reason}
//           onChange={handleChange}
//           disabled={form.status}
//           style={{ width: "100%" }}
//         />
//       </div>
//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={loading || !donorInfo}
//         style={{ width: "100%", padding: 8 }}
//       >
//         {loading ? "Đang lưu..." : "Lưu kiểm tra sức khỏe"}
//       </button>
//       {error.length > 0 && (
//         <ul style={{ color: "red", marginTop: 8 }}>
//           {error.map((err, index) => (
//             <li key={index}>{err}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default HealthCheckForm;
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Button,
  message,
  Alert,
  Typography,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs"; // AntD v5 dùng dayjs cho DatePicker
import { createHealthCheck } from "../../services/healthCheckService";
import { updateBloodRegisterStatus } from "../../services/bloodRegisterService";

const { Title } = Typography;

const HealthCheckForm = ({ donorInfo, onSuccess }) => {
  const [form] = Form.useForm(); // Hook quản lý Form của AntD
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(""); // State riêng cho lỗi từ API

  // Cập nhật tên người hiến máu và reset form khi donorInfo thay đổi
  useEffect(() => {
    if (donorInfo) {
      form.resetFields(); // Reset các trường khi có người mới
      form.setFieldsValue({
        fullName: donorInfo.fullName || donorInfo.name || "",
        checkDate: dayjs(), // Đặt lại ngày là hôm nay
        status: true,
      });
    }
  }, [donorInfo, form]);

  // Hàm xử lý khi form được submit và đã qua validation
  const handleFinish = async (values) => {
    setLoading(true);
    setApiError("");

    if (!donorInfo || !donorInfo.id) {
      setApiError("Không tìm thấy thông tin đơn đăng ký hiến máu hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...values,
        checkDate: values.checkDate.format("YYYY-MM-DD"), 
        bloodRegisterId: donorInfo.id,
      };

      await createHealthCheck(payload);
      // Nếu không đủ điều kiện hiến máu, tự động cập nhật trạng thái đơn sang REJECTED
      if (values.status === false) {
        try {
          await updateBloodRegisterStatus(donorInfo.id, "REJECTED");
          message.info("Đơn đăng ký đã bị từ chối do không đủ điều kiện sức khỏe.");
        } catch {
          message.error("Không thể cập nhật trạng thái đơn sang từ chối!");
        }
      }
      message.success("Tạo phiếu kiểm tra sức khỏe thành công!");

      if (onSuccess) {
        onSuccess();
      }
      // Không cần reset form ở đây vì useEffect đã xử lý khi có donorInfo mới
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<Title level={4}>Phiếu Kiểm Tra Sức Khỏe</Title>}
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          checkDate: dayjs(),
          status: true,
        }}
      >
        <Form.Item name="fullName" label="Họ và tên">
          <Input readOnly placeholder="Họ tên người hiến máu" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="height"
              label="Chiều cao (cm)"
              rules={[
                { required: true, message: "Vui lòng nhập chiều cao!" },
                {
                  type: "number",
                  min: 1,
                  max: 250,
                  message: "Chiều cao phải từ 1-250cm",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 170" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="weight"
              label="Cân nặng (kg)"
              rules={[
                { required: true, message: "Vui lòng nhập cân nặng!" },
                {
                  type: "number",
                  min: 30,
                  max: 200,
                  message: "Cân nặng phải từ 30-200kg",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 65" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="temperature"
              label="Nhiệt độ (°C)"
              rules={[
                { required: true, message: "Vui lòng nhập nhiệt độ!" },
                {
                  type: "number",
                  min: 35,
                  max: 42,
                  message: "Nhiệt độ phải từ 35-42°C",
                },
              ]}
            >
              <InputNumber
                step="0.1"
                style={{ width: "100%" }}
                placeholder="Ví dụ: 37.0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="bloodPressure"
              label="Huyết áp (mmHg)"
              rules={[
                { required: true, message: "Vui lòng nhập huyết áp!" },
                {
                  type: "number",
                  min: 50,
                  max: 250,
                  message: "Huyết áp phải từ 50-250mmHg",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 120" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="medicalHistory" label="Tiền sử bệnh lý (nếu có)">
          <Input.TextArea
            rows={2}
            placeholder="Ghi rõ các bệnh lý nền hoặc dị ứng thuốc..."
          />
        </Form.Item>

        <Form.Item
          name="checkDate"
          label="Ngày kiểm tra"
          rules={[{ required: true, message: "Vui lòng chọn ngày kiểm tra!" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="status" valuePropName="checked">
          <Checkbox>Đủ điều kiện hiến máu</Checkbox>
        </Form.Item>

        {/* Trường lý do chỉ hiển thị và yêu cầu nhập khi KHÔNG đủ điều kiện */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.status !== currentValues.status
          }
        >
          {({ getFieldValue }) =>
            !getFieldValue("status") ? (
              <Form.Item
                name="reason"
                label="Lý do (không đủ điều kiện)"
                rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Ghi rõ lý do không đủ điều kiện hiến máu"
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {apiError && (
          <Alert
            message={apiError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!donorInfo}
            style={{ width: "100%" }}
          >
            Lưu Kết Quả
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default HealthCheckForm;
