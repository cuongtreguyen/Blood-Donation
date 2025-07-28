/**
 * Trang Hồ Sơ Cá Nhân (Quản lý thông tin cá nhân của bác sĩ/nhân viên y tế)
 * 
 * Chức năng:
 * - Hiển thị thông tin cá nhân của bác sĩ/nhân viên y tế
 * - Cập nhật thông tin cá nhân (họ tên, số điện thoại, địa chỉ, v.v.)
 * - Thay đổi mật khẩu
 * - Tải lên ảnh đại diện
 * - Xem thông tin chi tiết về tài khoản
 * 
 * Giúp bác sĩ/nhân viên y tế:
 * - Quản lý thông tin cá nhân
 * - Cập nhật thông tin liên lạc
 * - Bảo mật tài khoản bằng cách thay đổi mật khẩu
 * - Cá nhân hóa tài khoản với ảnh đại diện
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Avatar,
  Upload,
  message,
  Divider,
  Modal,
  Spin,
  Typography,
  Space,
  Descriptions,
  Tabs, // Sử dụng Tabs để có giao diện hiện đại
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuthCheck } from "../../../hook/useAuthCheck";
import authService from "../../../services/authService";

const { Title, Text } = Typography;

const ProfilePage = () => {
  // --- TOÀN BỘ LOGIC GỐC ĐƯỢC GIỮ NGUYÊN ---
  const { userData, isLoading: authLoading, reFetch } = useAuthCheck();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Cập nhật form khi có dữ liệu người dùng
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        gender:
          userData.gender === "MALE"
            ? "Nam"
            : userData.gender === "FEMALE"
            ? "Nữ"
            : "Khác",
      });
    }
  }, [userData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        gender: (values.gender === "Nam"
          ? "MALE"
          : values.gender === "Nữ"
          ? "FEMALE"
          : "OTHER"
        ),
        birthdate: values.birthdate || "1990-01-01",
        height: Number(values.height) || 170,
        weight: Number(values.weight) || 60,
        lastDonation: values.lastDonation || "2024-06-01",
        medicalHistory: values.medicalHistory || "Không có",
        emergencyName: values.emergencyName || "Người thân",
        emergencyPhone: values.emergencyPhone || "0912345678",
        bloodType: values.bloodType || "A_POSITIVE",
      };
      await authService.updateUser(payload);
      message.success("Đã cập nhật thông tin thành công");
      setEditing(false);
      reFetch();
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      const result = await authService.updatePassword({
        email: userData.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      // if (result.success) {
      message.success("Đổi mật khẩu thành công!");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      // } else {
      //   message.error(result.error || 'Có lỗi xảy ra khi đổi mật khẩu');
      // }
    } catch {
      message.error("Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.resetFields();
    // Reset lại giá trị ban đầu cho form
    if (userData) {
      form.setFieldsValue({
        ...userData,
        gender:
          userData.gender === "MALE"
            ? "Nam"
            : userData.gender === "FEMALE"
            ? "Nữ"
            : "Khác",
      });
    }
  };

  const handleAvatarUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file ảnh!");
      return false;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Chỉ gửi avatar, không merge userData
        await authService.updateUser({ avatar: e.target.result });
        message.success("Cập nhật ảnh đại diện thành công!");
        reFetch(); // Tải lại dữ liệu để cập nhật avatar
      } catch {
        message.error("Cập nhật ảnh đại diện thất bại!");
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  // --- KẾT THÚC PHẦN LOGIC GỐC ---

  if (authLoading || !userData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Các nút hành động cho Card
  const cardActions = !editing ? (
    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
      Chỉnh sửa thông tin
    </Button>
  ) : (
    <Space>
      <Button onClick={handleCancelEdit}>Hủy</Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        loading={loading}
        onClick={() => form.submit()}
      >
        Lưu thay đổi
      </Button>
    </Space>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
        title={
          <Title level={4} style={{ margin: 0 }}>
            Hồ sơ cá nhân
          </Title>
        }
        extra={cardActions}
      >
        <Row gutter={[32, 16]}>
          {/* Cột thông tin tóm tắt bên trái */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                textAlign: "center",
                background: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Avatar
                size={128}
                icon={<UserOutlined />}
                src={userData.avatarUrl || userData.avatar}
                style={{
                  marginBottom: 16,
                  border: "4px solid #fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Upload showUploadList={false} beforeUpload={handleAvatarUpload}>
                <Button icon={<UploadOutlined />} style={{ marginBottom: 20 }}>
                  Đổi ảnh đại diện
                </Button>
              </Upload>
              <Title level={5} style={{ margin: 0 }}>
                {userData.fullName}
              </Title>
              <Text type="secondary">{userData.email}</Text>

              <Divider dashed />

              <Descriptions
                column={1}
                labelStyle={{ fontWeight: "500" }}
                contentStyle={{ justifyContent: "flex-end", display: "flex" }}
              >
                <Descriptions.Item label="Vai trò">
                  {userData.role}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày vào làm">
                  {userData.joinDate
                    ? new Date(userData.joinDate).toLocaleDateString("vi-VN")
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="ID Cơ sở">
                  {userData.institutionId || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Cột thông tin chi tiết và bảo mật bên phải */}
          <Col xs={24} md={16}>
            {/* Giao diện được sắp xếp lại với Tabs */}
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane
                tab={
                  <span>
                    <InfoCircleOutlined /> Thông tin chi tiết
                  </span>
                }
                key="1"
              >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} disabled={!editing} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label="Email">
                        <Input prefix={<MailOutlined />} disabled={true} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="phone" label="Số điện thoại">
                        <Input prefix={<PhoneOutlined />} disabled={!editing} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="gender" label="Giới tính">
                        <Input disabled={!editing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="address" label="Địa chỉ">
                    <Input.TextArea
                      prefix={<HomeOutlined />}
                      rows={3}
                      disabled={!editing}
                    />
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <SafetyCertificateOutlined /> Bảo mật & Đăng nhập
                  </span>
                }
                key="2"
              >
                <div style={{ padding: "16px" }}>
                  <Text>Cập nhật mật khẩu của bạn để tăng cường bảo mật.</Text>
                  <br />
                  <Button
                    type="primary"
                    danger
                    style={{ marginTop: "16px" }}
                    onClick={() => setIsPasswordModalVisible(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>

      {/* Modal đổi mật khẩu (giữ nguyên) */}
      <Modal
        title={<Title level={5}>Đổi mật khẩu</Title>}
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        destroyOnClose
        footer={[
          <Button key="back" onClick={() => setIsPasswordModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={passwordLoading}
            onClick={() => passwordForm.submit()}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
