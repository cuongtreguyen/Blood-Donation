import React from 'react';
import { Form, Input, DatePicker, Select, Button, Card, Space, Radio, message } from 'antd';

const { Option } = Select;

function RegisterDonorPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Đã đăng ký người hiến máu thành công');
    form.resetFields();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Đăng Ký Người Hiến Máu</h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-3xl"
        >
          <h3 className="text-lg font-semibold mb-4">Thông Tin Cá Nhân</h3>
          
          <Space className="w-full" size="large">
            <Form.Item
              name="firstName"
              label="Họ và tên đệm"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên đệm' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input />
            </Form.Item>
          </Space>

          <Space className="w-full" size="large">
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>

          <Form.Item
            name="idNumber"
            label="Số CMND/CCCD"
            rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ' },
              { required: true, message: 'Vui lòng nhập email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <h3 className="text-lg font-semibold mb-4 mt-6">Thông Tin Hiến Máu</h3>

          <Form.Item
            name="bloodType"
            label="Nhóm máu (nếu biết)"
          >
            <Select placeholder="Chọn nhóm máu">
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="donationHistory"
            label="Lịch sử hiến máu"
          >
            <Radio.Group>
              <Radio value="first">Lần đầu</Radio>
              <Radio value="repeat">Đã từng hiến</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="lastDonationDate"
            label="Ngày hiến máu gần nhất (nếu có)"
          >
            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-red-500">
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default RegisterDonorPage; 