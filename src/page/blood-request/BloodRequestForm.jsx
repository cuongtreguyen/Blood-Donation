import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Checkbox,
  Radio,
  Card,
  Row,
  Col,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../hook/useAuthCheck";

const { Option } = Select;
const { TextArea } = Input;

function BloodRequestForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userData } = useAuthCheck("/login", true);
  const [submitting, setSubmitting] = useState(false);

  // Điền thông tin từ dữ liệu người dùng
  useEffect(() => {
    if (userData) {
      const formData = {
        full_name:
          userData.fullName || userData.full_name || userData.name || "",
        email: userData.email || "",
        phone: userData.phone || userData.phoneNumber || "",
        gender: userData.gender || "",
        blood_type: userData.bloodType || userData.blood_type || "",
      };
      form.setFieldsValue(formData);
    }
  }, [userData, form]);

  // Sử dụng navigate - Điều hướng khi nhấn nút hủy
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy yêu cầu này?"
    );
    if (confirmCancel) {
      navigate("/"); // Điều hướng về trang chủ
    }
  };

  // Sử dụng submitting và setSubmitting trong quá trình gửi form
  const onFinish = async (values) => {
    try {
      setSubmitting(true); // Bắt đầu trạng thái loading

      // Map form values to API-compatible field names
      const formData = {
        request_type: values.requestType,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        date_of_birth: values.date_of_birth
          ? moment(values.date_of_birth).format("YYYY-MM-DD")
          : "",
        gender: values.gender,
        address: values.address,
        city: values.city,
        blood_type: values.blood_type,
        weight: values.weight,
        height: values.height,
        last_donation_date: values.last_donation_date
          ? moment(values.last_donation_date).format("YYYY-MM-DD")
          : "",
        medical_history: values.medical_history || "",
        has_chronic_disease: values.chronic_disease || false,
        is_taking_medication: values.taking_medication || false,
        has_recent_surgery: values.recent_surgery || false,
        preferred_date: values.preferred_date
          ? moment(values.preferred_date).format("YYYY-MM-DD")
          : "",
        preferred_time: values.preferred_time,
        preferred_location: values.preferred_location,
        emergency_contact: values.emergency_contact,
        emergency_phone: values.emergency_phone,
        agrees_to_terms: values.agreement,
      };

      // gắn /api/blood-register
      const response = await api.post("/blood-requests", formData);

      // Hiển thị thông báo thành công
      toast.success("Yêu cầu nhận máu đã được gửi thành công!");

      // Reset form
      form.resetFields();

      // Chuyển hướng đến trang xác nhận
      navigate("/request-success");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);

      // Hiển thị thông báo lỗi
      toast.error(
        error.response?.data?.message ||
          "Không thể gửi yêu cầu. Vui lòng thử lại sau!"
      );
    } finally {
      setSubmitting(false); // Kết thúc trạng thái loading
    }
  };

  // Hiển thị loading nếu đang kiểm tra đăng nhập
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Nếu chưa đăng nhập, component trả về null (hook sẽ chuyển hướng)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="py-6 px-4">
      <Card title="Đăng Ký Nhận Máu" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            requestType: "emergency",
            agreement: false,
          }}
        >
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Thông tin cá nhân
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="requestType"
                  label="Loại yêu cầu"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại yêu cầu" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="emergency">Khẩn cấp</Radio>
                    <Radio value="scheduled">Theo lịch</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="full_name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email liên hệ"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại phải có 10 chữ số",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Số điện thoại"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="date_of_birth"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                  ]}
                >
                  <DatePicker
                    placeholder="Ngày/Tháng/Năm"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Địa chỉ liên hệ"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                  rules={[
                    { required: true, message: "Vui lòng nhập thành phố" },
                  ]}
                >
                  <Input placeholder="Thành phố" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Thông tin y tế */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Thông tin y tế
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="blood_type"
                  label="Nhóm máu"
                  rules={[
                    { required: true, message: "Vui lòng chọn nhóm máu" },
                  ]}
                >
                  <Select placeholder="Chọn nhóm máu">
                    <Option value="A_POSITIVE">A+</Option>
                    <Option value="A_NEGATIVE">A-</Option>
                    <Option value="B_POSITIVE">B+</Option>
                    <Option value="B_NEGATIVE">B-</Option>
                    <Option value="AB_POSITIVE">AB+</Option>
                    <Option value="AB_NEGATIVE">AB-</Option>
                    <Option value="O_POSITIVE">O+</Option>
                    <Option value="O_NEGATIVE">O-</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="weight"
                  label="Cân nặng (kg)"
                  rules={[
                    { required: true, message: "Vui lòng nhập cân nặng" },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Cân nặng"
                    min={0}
                    max={200}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="height" label="Chiều cao (cm)">
                  <Input
                    type="number"
                    placeholder="Chiều cao"
                    min={0}
                    max={250}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="medical_history" label="Tiền sử bệnh">
              <TextArea
                placeholder="Mô tả các bệnh lý hiện tại hoặc trước đây (nếu có)"
                rows={3}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="chronic_disease" valuePropName="checked">
                  <Checkbox>Mắc bệnh mãn tính</Checkbox>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="taking_medication" valuePropName="checked">
                  <Checkbox>Đang dùng thuốc</Checkbox>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="recent_surgery" valuePropName="checked">
                  <Checkbox>Phẫu thuật gần đây</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Thông tin lịch nhận máu */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Thời gian và địa điểm nhận máu
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="preferred_date"
                  label="Ngày mong muốn"
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="preferred_time"
                  label="Thời gian"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời gian" },
                  ]}
                >
                  <Select placeholder="Chọn thời gian">
                    <Option value="08:00">08:00 - 09:00</Option>
                    <Option value="09:00">09:00 - 10:00</Option>
                    <Option value="10:00">10:00 - 11:00</Option>
                    <Option value="14:00">14:00 - 15:00</Option>
                    <Option value="15:00">15:00 - 16:00</Option>
                    <Option value="16:00">16:00 - 17:00</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="preferred_location"
                  label="Địa điểm"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa điểm" },
                  ]}
                >
                  <Select placeholder="Chọn địa điểm">
                    <Option value="hospital_1">Bệnh viện Chợ Rẫy</Option>
                    <Option value="hospital_2">
                      Bệnh viện Đa khoa Sài Gòn
                    </Option>
                    <Option value="hospital_3">Bệnh viện Thống Nhất</Option>
                    <Option value="hospital_4">
                      Viện Huyết học Truyền máu TW
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Thông tin liên hệ khẩn cấp */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Liên hệ khẩn cấp
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergency_contact"
                  label="Người liên hệ khẩn cấp"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người liên hệ",
                    },
                  ]}
                >
                  <Input placeholder="Họ tên người liên hệ" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="emergency_phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại phải có 10 chữ số",
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại liên hệ" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Điều khoản và đồng ý */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Vui lòng đồng ý với các điều khoản")
                      ),
              },
            ]}
          >
            <Checkbox>
              Tôi đã đọc và đồng ý với <a href="#">điều khoản và điều kiện</a>
            </Checkbox>
          </Form.Item>

          {/* Nút submit và hủy - sử dụng submitting state */}
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ backgroundColor: "#d32f2f", borderColor: "#d32f2f" }}
              size="large"
            >
              <HeartOutlined /> Gửi Yêu Cầu Nhận Máu
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default BloodRequestForm;
