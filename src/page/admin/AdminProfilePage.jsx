import React from 'react';
import { Card, Form, Input, Button, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values) => {
    console.log('Admin Profile Submit:', values);
    setLoading(true);
    // Add logic to save admin profile data
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Title level={2}>Hồ sơ Admin</Title>

      <Card title="Thông tin cơ bản">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: 'Admin',
            email: 'admin@example.com',
          }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]} 
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          {/* Thêm các trường thông tin khác nếu cần */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#d32f2f', borderColor: '#d32f2f' }} loading={loading}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminProfilePage; 