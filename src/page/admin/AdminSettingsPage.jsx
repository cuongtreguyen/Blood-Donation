import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../../config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

const AdminSettingsPage = () => {
  const [passwordForm] = Form.useForm();
  const [systemConfigForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (values) => {
    try {
      setLoading(true);
      // Lấy email từ localStorage (hoặc context nếu có)
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email;
      if (!email) throw new Error('Không tìm thấy email người dùng!');
      // Gọi API đổi mật khẩu
      await api.put('/user/update/email-password', {
        email,
        password: values.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields(); // Reset form sau khi đổi mật khẩu thành công
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      const errorMessage = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemConfigSubmit = async (values) => {
    try {
      setLoading(true);
      // Gọi API lưu cài đặt hệ thống (ví dụ: api.put('/settings/system', values);)
      console.log('Lưu cấu hình hệ thống:', values); // Dùng console log tạm thời
      toast.success('Lưu cấu hình hệ thống thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu cấu hình hệ thống:', error);
      const errorMessage = error.response?.data?.message || 'Lưu cấu hình hệ thống thất bại. Vui lòng thử lại!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={2}>Cài đặt</Title>

      {/* Cài đặt hệ thống */}
      <Card title="Cấu hình hệ thống" className="mb-6">
        <Form
          form={systemConfigForm}
          layout="vertical"
          onFinish={handleSystemConfigSubmit}
          initialValues={{
            reminderFrequencyDays: 90, // Ví dụ: Nhắc nhở sau 90 ngày
            recoveryTimeMonths: 3,    // Ví dụ: Thời gian phục hồi 3 tháng
          }}
        >
          <Form.Item
            name="reminderFrequencyDays"
            label="Tần suất nhắc nhở hiến máu (ngày)"
            rules={[
              { required: true, message: 'Vui lòng nhập tần suất nhắc nhở!' },
              {
                validator: (_, value) => {
                  const num = Number(value);
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Không được để trống!'));
                  }
                  if (isNaN(num)) {
                    return Promise.reject(new Error('Phải là số!'));
                  }
                  if (!Number.isInteger(num)) {
                    return Promise.reject(new Error('Phải là số nguyên!'));
                  }
                  if (num <= 0) {
                    return Promise.reject(new Error('Phải lớn hơn 0!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="recoveryTimeMonths"
            label="Thời gian phục hồi sau hiến máu (tháng)"
            rules={[
              { required: true, message: 'Vui lòng nhập thời gian phục hồi!' },
              {
                validator: (_, value) => {
                  const num = Number(value);
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Không được để trống!'));
                  }
                  if (isNaN(num)) {
                    return Promise.reject(new Error('Phải là số!'));
                  }
                  if (!Number.isInteger(num)) {
                    return Promise.reject(new Error('Phải là số nguyên!'));
                  }
                  if (num <= 0) {
                    return Promise.reject(new Error('Phải lớn hơn 0!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              loading={loading}
            >
              Lưu cấu hình hệ thống
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Cài đặt mật khẩu */}
      <Card title="Cài đặt mật khẩu" className="mb-6">
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { max: 50, message: 'Mật khẩu không được vượt quá 50 ký tự!' }
            ]}
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
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSettingsPage; 