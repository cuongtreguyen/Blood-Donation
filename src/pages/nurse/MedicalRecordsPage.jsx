import React from 'react';
import { Card, Table, Button, Tag, Space, Form, Input, Row, Col, Select, InputNumber } from 'antd';
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

function MedicalRecordsPage() {
  const records = [
    {
      id: '1',
      donorName: 'Nguyễn Văn A',
      date: '2024-03-15',
      bloodType: 'A+',
      vitals: {
        bloodPressure: '120/80',
        pulse: 72,
        temperature: 36.5,
        weight: 65,
        height: 170,
        hemoglobin: 14
      },
      status: 'pending'
    },
    {
      id: '2',
      donorName: 'Trần Thị B',
      date: '2024-03-15',
      bloodType: 'O-',
      vitals: {
        bloodPressure: '110/70',
        pulse: 68,
        temperature: 36.8,
        weight: 55,
        height: 160,
        hemoglobin: 12
      },
      status: 'approved'
    },
    {
      id: '3',
      donorName: 'Lê Văn C',
      date: '2024-03-14',
      bloodType: 'B+',
      vitals: {
        bloodPressure: '130/85',
        pulse: 75,
        temperature: 36.6,
        weight: 70,
        height: 175,
        hemoglobin: 15
      },
      status: 'rejected'
    }
  ];

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Chỉ số sinh hiệu',
      dataIndex: 'vitals',
      key: 'vitals',
      render: (vitals) => (
        <Space direction="vertical" size="small">
          <span>Huyết áp: {vitals.bloodPressure} mmHg</span>
          <span>Mạch: {vitals.pulse} nhịp/phút</span>
          <span>Nhiệt độ: {vitals.temperature}°C</span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'processing', text: 'Chờ duyệt' },
          approved: { color: 'success', text: 'Đã duyệt' },
          rejected: { color: 'error', text: 'Từ chối' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" icon={<FileTextOutlined />}>
            Xem chi tiết
          </Button>
          <Button>Cập nhật</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý hồ sơ y tế</h2>

      <Card className="mb-6">
        <Form layout="vertical">
          <h3 className="text-lg font-semibold mb-4">Nhập chỉ số sinh hiệu</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Người hiến máu" name="donorName" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Chọn người hiến máu"
                  optionFilterProp="children"
                >
                  <Option value="1">Nguyễn Văn A</Option>
                  <Option value="2">Trần Thị B</Option>
                  <Option value="3">Lê Văn C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Nhóm máu" name="bloodType">
                <Select>
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
            </Col>
            <Col span={8}>
              <Form.Item label="Huyết áp (mmHg)" name="bloodPressure" rules={[{ required: true }]}>
                <Input placeholder="VD: 120/80" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Mạch (nhịp/phút)" name="pulse" rules={[{ required: true }]}>
                <InputNumber min={0} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Nhiệt độ (°C)" name="temperature" rules={[{ required: true }]}>
                <InputNumber min={35} max={42} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cân nặng (kg)" name="weight" rules={[{ required: true }]}>
                <InputNumber min={0} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Chiều cao (cm)" name="height" rules={[{ required: true }]}>
                <InputNumber min={0} max={250} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hemoglobin (g/dL)" name="hemoglobin" rules={[{ required: true }]}>
                <InputNumber min={0} max={20} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi chú" name="notes">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary">Lưu hồ sơ</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Danh sách hồ sơ y tế">
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{
            total: records.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
        />
      </Card>
    </div>
  );
}

export default MedicalRecordsPage; 