import React from 'react';
import { Card, Form, Input, Button, Typography, Space, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminSettingsPage = () => {
  const [generalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  const handleGeneralSubmit = (values) => {
    console.log('General Settings Submit:', values);
    // Add logic to save general settings
  };

  const handlePasswordSubmit = (values) => {
    console.log('Password Settings Submit:', values);
    // Add logic to save password settings
  };

  const handleEmailSubmit = (values) => {
    console.log('Email Settings Submit:', values);
    // Add logic to save email settings
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
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề trang web' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adminEmail"
            label="Email Admin"
            rules={[{ required: true, message: 'Vui lòng nhập email admin' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#d32f2f', borderColor: '#d32f2f' }}>
              Lưu cài đặt chung
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
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
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
            <Button type="primary" htmlType="submit" style={{ background: '#d32f2f', borderColor: '#d32f2f' }}>
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
            rules={[{ required: true, message: 'Vui lòng nhập email liên hệ' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          {/* Thêm các cài đặt email khác nếu cần */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#d32f2f', borderColor: '#d32f2f' }}>
              Lưu cài đặt Email
            </Button>
          </Form.Item>
        </Form>
      </Card>

    </div>
  );
};

export default AdminSettingsPage; 