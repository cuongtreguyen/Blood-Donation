import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, message, Divider, Modal } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthCheck } from '../../../hook/useAuthCheck';
import authService from '../../../services/authService';

const ProfilePage = () => {
  const { userData, isLoading: authLoading } = useAuthCheck();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (authLoading) {
    return <div>Đang tải...</div>;
  }

  if (!userData) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await authService.updateUser({ ...userData, ...values });
      if (result.success) {
        message.success('Đã cập nhật thông tin thành công');
        setEditing(false);
      } else {
        message.error(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
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

      if (result.success) {
        message.success('Đổi mật khẩu thành công!');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(result.error || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch {
      message.error('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(userData);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.resetFields();
  }

  // Giả lập upload ảnh, bạn có thể thay thế bằng logic upload thật
  const handleAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được tải lên file ảnh!');
      return false;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      // Giả lập lưu avatar và cập nhật user
      const result = await authService.updateUser({ ...userData, avatar: e.target.result });
      if (result.success) {
        message.success('Cập nhật ảnh đại diện thành công!');
      } else {
        message.error('Cập nhật ảnh đại diện thất bại!');
      }
    };
    reader.readAsDataURL(file);
    return false;
  };


  return (
    <div>
      <h1>Thông tin cá nhân</h1>
      
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={userData.avatarUrl || userData.avatar} // Support avatarUrl from backend
                style={{ marginBottom: 16 }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </div>

            <Divider />

            <div>
              <p><strong>Vai trò:</strong> {userData.role}</p>
              <p><strong>Ngày vào làm:</strong> {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
              <p><strong>ID Cơ sở:</strong> {userData.institutionId || 'N/A'}</p>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="Thông tin chi tiết"
            extra={
              !editing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              ) : null
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={userData}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input disabled={!editing} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                  >
                    <Input disabled={!editing} />
                  </Form.Item>
                </Col>
                 <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                  >
                    <Input disabled={!editing} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea rows={3} disabled={!editing} />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <div style={{ textAlign: 'right', gap: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </Card>

          <Card title="Bảo mật" style={{ marginTop: 16 }}>
            <Button type="primary" danger onClick={() => setIsPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Đổi mật khẩu"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsPasswordModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={passwordLoading} onClick={() => passwordForm.submit()}>
            Đổi mật khẩu
          </Button>,
        ]}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage; 