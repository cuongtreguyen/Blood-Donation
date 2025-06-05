import React from 'react';
import { Form, Input, Select, Button, Card, Space, Radio, InputNumber, message } from 'antd';

const { Option } = Select;

function ScreeningPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Đã lưu kết quả sàng lọc');
    form.resetFields();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sàng Lọc Người Hiến Máu</h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-3xl"
        >
          <h3 className="text-lg font-semibold mb-4">Thông Tin Cơ Bản</h3>
          
          <Form.Item
            name="donorId"
            label="Mã Người Hiến Máu"
            rules={[{ required: true, message: 'Vui lòng nhập mã người hiến máu' }]}
          >
            <Input />
          </Form.Item>

          <Space className="w-full" size="large">
            <Form.Item
              name="weight"
              label="Cân nặng (kg)"
              rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="height"
              label="Chiều cao (cm)"
              rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="bloodPressure"
              label="Huyết áp"
              rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
            >
              <Input placeholder="VD: 120/80" />
            </Form.Item>
          </Space>

          <h3 className="text-lg font-semibold mb-4 mt-6">Kiểm Tra Sức Khỏe</h3>

          <Form.Item
            name="healthStatus"
            label="Tình trạng sức khỏe hiện tại"
            rules={[{ required: true, message: 'Vui lòng chọn tình trạng sức khỏe' }]}
          >
            <Radio.Group>
              <Radio value="good">Tốt</Radio>
              <Radio value="moderate">Trung bình</Radio>
              <Radio value="poor">Kém</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="recentIllness"
            label="Bệnh lý gần đây"
          >
            <Select mode="multiple" placeholder="Chọn nếu có">
              <Option value="fever">Sốt</Option>
              <Option value="cold">Cảm cúm</Option>
              <Option value="infection">Nhiễm trùng</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="medications"
            label="Thuốc đang sử dụng"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <h3 className="text-lg font-semibold mb-4 mt-6">Kết Luận</h3>

          <Form.Item
            name="screeningResult"
            label="Kết quả sàng lọc"
            rules={[{ required: true, message: 'Vui lòng chọn kết quả sàng lọc' }]}
          >
            <Radio.Group>
              <Radio value="passed">Đủ điều kiện hiến máu</Radio>
              <Radio value="failed">Không đủ điều kiện hiến máu</Radio>
              <Radio value="postponed">Hoãn hiến máu</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-red-500">
              Lưu Kết Quả
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ScreeningPage; 