import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, message, Divider, Select } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuthCheck } from '../../hook/useAuthCheck';
import api from '../../config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

const AdminProfilePage = () => {
  const { userData, isLoading: authLoading } = useAuthCheck();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return <div>Đang tải...</div>;
  }

  if (!userData) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  // Xử lý khi submit form cập nhật thông tin người dùng
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = { ...userData, ...values };
      const token = localStorage.getItem('token');
      const res = await api.put('/user/update-user', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API update-user response:', res);
      if (res.data && !res.data.error) {
        toast.success('Đã cập nhật thông tin thành công!');
        setEditing(false);
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu chế độ chỉnh sửa, điền dữ liệu hiện tại vào form
  const handleEdit = () => {
    form.setFieldsValue({
      ...userData,
      gender: userData.gender || 'MALE',
    });
    setEditing(true);
  };

  // Hủy chỉnh sửa, reset lại form về trạng thái ban đầu
  const handleCancelEdit = () => {
    setEditing(false);
    form.resetFields();
  };

  // Xử lý upload ảnh đại diện (giả lập), kiểm tra file và cập nhật avatar cho user
  const handleAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được tải lên file ảnh!');
      return false;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      // Giả lập lưu avatar và cập nhật user
      const token = localStorage.getItem('token');
      const payload = { ...userData, avatar: e.target.result };
      const res = await api.put('/user/update-user', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        toast.success('Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error('Cập nhật ảnh đại diện thất bại!');
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div className="p-6">
      <h1>Hồ sơ Admin</h1>
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={userData.avatarUrl || userData.avatar}
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
                  style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
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
              initialValues={{
                ...userData,
                gender: userData.gender || 'MALE',
              }}
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
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                  >
                    <Select disabled={!editing} options={genderOptions} />
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
                      style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfilePage; 