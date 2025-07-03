import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Checkbox,
  Card,
  Row,
  Col,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../hook/useAuthCheck";

const { Option } = Select;
const { TextArea } = Input;

function BloodRequestForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userData } = useAuthCheck("/login", true);
  const [submitting, setSubmitting] = useState(false);

  /* ───────────────────────── 1. Đổ dữ liệu sẵn có ───────────────────────── */
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        full_name:
          userData.fullName || userData.full_name || userData.name || "",
        email: userData.email || "",
        phone: userData.phone || userData.phoneNumber || "",
        gender: userData.gender ? userData.gender.toUpperCase() : undefined,
        blood_type: userData.bloodType || userData.blood_type,
        birthdate: userData.date_of_birth
          ? dayjs(userData.date_of_birth)
          : userData.birthdate
          ? dayjs(userData.birthdate)
          : undefined,
        address: userData.address || "",
        city: userData.city || "",
        height: userData.height || "",
        weight: userData.weight || "",
        emergencyName: userData.emergencyName || "",
        emergencyPhone: userData.emergencyPhone || "",
        requestType: "emergency",
      });
    }
  }, [userData, form]);

  /* ───────────────────────── 2. Huỷ form ───────────────────────── */
  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu này?")) {
      navigate("/");
    }
  };

  /* ───────────────────────── 3. Submit form ───────────────────────── */
  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
        return;
      }

      const payload = {
        name: values.full_name,
        birthdate: values.birthdate?.format("YYYY-MM-DD"),
        height: values.height,
        weight: values.weight,
        lastDonation: values.last_donation_date?.format("YYYY-MM-DD"),
        medicalHistory: values.medical_history,
        bloodType: values.blood_type,
        wantedDate: values.wantedDate?.format("YYYY-MM-DD"),
        wantedHour: values.wantedHour ? `${values.wantedHour}:00` : null,
        emergencyName: values.emergencyName,
        emergencyPhone: values.emergencyPhone,
        emergency: values.requestType === "emergency",
      };

      await api.post("/blood-receive/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Yêu cầu nhận máu đã được gửi thành công!");
      setTimeout(() => navigate("/"), 1500);
      form.resetFields();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Không thể gửi yêu cầu. Vui lòng thử lại sau!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────── Bắt lỗi khi submit không hợp lệ ──────── */
  const onFinishFailed = ({ errorFields }) => {
    if (errorFields.length) {
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc!");
    }
  };

  /* ───────────────────────── 4. Loading / Chưa đăng nhập ───────────────────────── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  /* ───────────────────────── 5. Helper hiển thị giới tính ───────────────────────── */
  const displayGender = (g) => {
    switch ((g || "").toLowerCase()) {
      case "male":
      case "nam":
      case "m":
        return "Nam";
      case "female":
      case "nữ":
      case "nu":
      case "f":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  /* ───────────────────────── 6. Giao diện ───────────────────────── */
  return (
    <div className="py-6 px-4">
      <Card title="Đăng Ký Nhận Máu" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ requestType: "emergency", agreement: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* ───────────── Thông tin cá nhân ───────────── */}
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
                  <Select>
                    <Option value="emergency">Khẩn cấp</Option>
                    <Option value="scheduled">Bình thường</Option>
                  </Select>
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
                    readOnly={!!form.getFieldValue("full_name")}
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
                    placeholder="Email"
                    readOnly={!!form.getFieldValue("email")}
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
                    readOnly={!!form.getFieldValue("phone")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="birthdate"
                  label="Ngày sinh"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày sinh",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabled={!!form.getFieldValue("birthdate")}
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
                  {form.getFieldValue("gender") ? (
                    <Input
                      value={displayGender(form.getFieldValue("gender"))}
                      readOnly
                    />
                  ) : (
                    <Select placeholder="Chọn giới tính">
                      <Option value="MALE">Nam</Option>
                      <Option value="FEMALE">Nữ</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  )}
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
                    readOnly={!!form.getFieldValue("address")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* ───────────── Thông tin y tế ───────────── */}
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
                  <Select
                    disabled={!!(userData?.bloodType || userData?.blood_type)}
                    placeholder="Chọn nhóm máu"
                  >
                    <Option value="A_POSITIVE">A+</Option>
                    <Option value="A_NEGATIVE">A-</Option>
                    <Option value="B_POSITIVE">B+</Option>
                    <Option value="B_NEGATIVE">B-</Option>
                    <Option value="AB_POSITIVE">AB+</Option>
                    <Option value="AB_NEGATIVE">AB-</Option>
                    <Option value="O_POSITIVE">O+</Option>
                    <Option value="O_NEGATIVE">O-</Option>
                    <Option value="unknown">Chưa biết</Option>
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
                  <Input type="number" min={0} max={200} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="height" label="Chiều cao (cm)">
                  <Input type="number" min={0} max={250} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="last_donation_date"
              label="Ngày hiến máu gần nhất"
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="medical_history" label="Tiền sử bệnh">
              <TextArea
                placeholder="Mô tả các bệnh lý hiện tại hoặc trước đây (nếu có)"
                rows={3}
              />
            </Form.Item>
          </div>

          {/* ───────────── Thời gian nhận máu ───────────── */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Thời gian và địa điểm nhận máu
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="wantedDate"
                  label="Ngày mong muốn"
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="wantedHour"
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
            </Row>

            <Form.Item
              name="preferred_location"
              label="Địa điểm"
              initialValue="Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM"
              rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
            >
              <Input
                disabled
                style={{
                  width: "100%",
                  color: "rgba(0,0,0,0.88)",
                  background: "#fff",
                }}
              />
            </Form.Item>
          </div>

          {/* ───────────── Liên hệ khẩn cấp ───────────── */}
          <div className="bg-gray-50 p-4 mb-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Liên hệ khẩn cấp
            </h3>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyName"
                  label="Người liên hệ khẩn cấp"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người liên hệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="Họ tên người liên hệ"
                    readOnly={!!form.getFieldValue("emergencyName")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyPhone"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại phải có 10 chữ số",
                    },
                  ]}
                >
                  <Input
                    placeholder="Số điện thoại liên hệ"
                    readOnly={!!form.getFieldValue("emergencyPhone")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* ───────────── Điều khoản ───────────── */}
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
              Tôi đã đọc và đồng ý với{" "}
              <a href="#" target="_blank" rel="noreferrer">
                điều khoản và điều kiện
              </a>
            </Checkbox>
          </Form.Item>

          {/* ───────────── Nút hành động ───────────── */}
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
