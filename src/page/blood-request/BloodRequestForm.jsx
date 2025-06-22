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
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

const { Option } = Select;
const { TextArea } = Input;

function BloodRequestForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userData } = useAuthCheck("/login", true);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  // Điền thông tin từ dữ liệu người dùng
  useEffect(() => {
    if (userData) {
      const formData = {
        full_name: userData.fullName || userData.full_name || userData.name || "",
        email: userData.email || "",
        phone: userData.phone || userData.phoneNumber || "",
        gender: userData.gender ? userData.gender.toUpperCase() : "",
        blood_type: userData.bloodType || userData.blood_type || "",
        birthdate: userData.date_of_birth
          ? dayjs(userData.date_of_birth)
          : userData.birthdate
          ? dayjs(userData.birthdate)
          : null,
        address: userData.address || "",
        city: userData.city || "",
        height: userData.height || "",
        weight: userData.weight || "",
        emergencyName: userData.emergencyName || "",
        emergencyPhone: userData.emergencyPhone || "",
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
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
        setSubmitting(false);
        return;
      }
      
      const payload = {
        name: values.full_name,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : null,
        height: values.height,
        weight: values.weight,
        lastDonation: values.last_donation_date ? values.last_donation_date.format("YYYY-MM-DD") : null,
        medicalHistory: values.medical_history,
        bloodType: values.blood_type,
        wantedDate: values.wantedDate ? values.wantedDate.format("YYYY-MM-DD") : null,
        wantedHour: values.wantedHour ? `${values.wantedHour}:00` : null,
        emergencyName: values.emergencyName,
        emergencyPhone: values.emergencyPhone,
        isEmergency: values.requestType === 'emergency',
      };
      
      await api.post("/blood-receive", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Yêu cầu nhận máu đã được gửi thành công!");

      // Chuyển hướng về trang chủ sau 1.5 giây
      setTimeout(() => {
        navigate("/");
      }, 1500);

      // Reset form
      form.resetFields();
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

  const bloodTypeMap = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
    unknown: "Chưa biết"
  };

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
                    readOnly
                    value={userData.fullName || userData.full_name || userData.name || ''}
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
                    readOnly
                    value={userData.email || ''}
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
                    readOnly
                    value={userData.phone || userData.phoneNumber || ''}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="birthdate"
                  label="Ngày sinh"
                  rules={!userData?.date_of_birth && !userData?.birthdate ? [{ required: true, message: "Vui lòng chọn ngày sinh" }] : []}
                >
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                  {(() => {
                    let genderValue = (userData?.gender || "").toLowerCase();
                    let genderDisplay = "";
                    if (["nam", "male", "nam giới", "m"].includes(genderValue)) genderDisplay = "Nam";
                    else if (["nữ", "nu", "female", "nữ giới", "f"].includes(genderValue)) genderDisplay = "Nữ";
                    else if (["khác", "other", "o"].includes(genderValue)) genderDisplay = "Khác";
                    if (genderDisplay) {
                      return (
                        <div className="ant-form-item-control-input-content" style={{ padding: '7px 11px', background: '#f5f5f5', borderRadius: 4 }}>
                          {genderDisplay}
                        </div>
                      );
                    }
                    return null;
                  })()}
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
                    readOnly
                    value={userData.address || ''}
                  />
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
                  rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
                >
                  <select
                    className={`form-select ${userData?.bloodType || userData?.blood_type ? "bg-light" : ""}`}
                    name="blood_type"
                    value={(userData?.bloodType || userData?.blood_type || form.getFieldValue("blood_type") || "")}
                    onChange={e => form.setFieldsValue({ blood_type: e.target.value })}
                    disabled={!!(userData?.bloodType || userData?.blood_type)}
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
                    readOnly
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
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="last_donation_date" label="Ngày hiến máu gần nhất">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

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
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <Form.Item
                  name="preferred_location"
                  label="Địa điểm"
                  initialValue="Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa điểm" },
                  ]}
                >
                  <Input
                    value="Bệnh viện Chợ Rẫy - 201B Nguyễn Chí Thanh, Quận 5, TP.HCM"
                    disabled
                    style={{ width: '100%', color: 'rgba(0,0,0,0.88)', background: '#fff' }}
                  />
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
                  name="emergencyName"
                  label="Người liên hệ khẩn cấp"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên người liên hệ" },
                  ]}
                >
                  <Input placeholder="Họ tên người liên hệ" readOnly />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyPhone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số" },
                  ]}
                >
                  <Input placeholder="Số điện thoại liên hệ" readOnly />
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
