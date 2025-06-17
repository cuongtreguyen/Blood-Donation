import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

const AdminSettingsPage = () => {
  const [generalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [systemConfigForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleGeneralSubmit = async (values) => {
    try {
      setLoading(true);
      // Gọi API lưu cài đặt chung
      await api.put('/settings/general', values);
      toast.success('Lưu cài đặt chung thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt chung:', error);
      // Thử hiển thị thông báo lỗi chi tiết từ server nếu có
      const errorMessage = error.response?.data?.message || 'Lưu cài đặt chung thất bại. Vui lòng thử lại!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      setLoading(true);
      // Gọi API đổi mật khẩu
      await api.put('/settings/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields(); // Reset form sau khi đổi mật khẩu thành công
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
       // Thử hiển thị thông báo lỗi chi tiết từ server nếu có
      const errorMessage = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
      if (error.response?.status === 401) {
         toast.error('Mật khẩu hiện tại không đúng!');
      } else {
         toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (values) => {
    try {
      setLoading(true);
      // Gọi API lưu cài đặt email
      await api.put('/settings/email', values);
      toast.success('Lưu cài đặt email thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt email:', error);
       // Thử hiển thị thông báo lỗi chi tiết từ server nếu có
      const errorMessage = error.response?.data?.message || 'Lưu cài đặt email thất bại. Vui lòng thử lại!';
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

      {/* Cài đặt chung */}
      <Card title="Cài đặt chung" className="mb-6">
        <Form
          form={generalForm}
          layout="vertical"
          onFinish={handleGeneralSubmit}
          initialValues={{
            siteTitle: 'Blood Donation System',
            adminEmail: 'admin@example.com',
          }}
        >
          <Form.Item
            name="siteTitle"
            label="Tiêu đề trang web"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề trang web' },
              { min: 3, message: 'Tiêu đề trang web phải có ít nhất 3 ký tự!' },
              { max: 100, message: 'Tiêu đề trang web không được vượt quá 100 ký tự!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adminEmail"
            label="Email Admin"
            rules={[
              { required: true, message: 'Vui lòng nhập email admin' },
              { type: 'email', message: 'Email không hợp lệ' },
              { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              loading={loading}
            >
              Lưu cài đặt chung
            </Button>
          </Form.Item>
        </Form>
      </Card>

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
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
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

      {/* Cài đặt Email */}
      <Card title="Cài đặt Email">
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleEmailSubmit}
          initialValues={{
            contactEmail: 'contact@yourdomain.com',
          }}
        >
           <Form.Item
            name="contactEmail"
            label="Email liên hệ"
            rules={[
              { required: true, message: 'Vui lòng nhập email liên hệ!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              loading={loading}
            >
              Lưu cài đặt Email
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSettingsPage; 