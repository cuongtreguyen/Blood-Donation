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
    // Kiểm tra chiều cao
    if (values.height < 1 || values.height > 250) {
      message.error("Chiều cao phải từ 1-250cm");
      return;
    }
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
          message.info(
            "Đơn đăng ký đã bị từ chối do không đủ điều kiện sức khỏe."
          );
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
                  min: 140,
                  max: 250,
                  message: "Chiều cao phải từ 140-250cm",
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
                  min: 42,
                  max: 150,
                  message: "Cân nặng phải từ 42-150kg",
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
