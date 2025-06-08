import React, { useState } from 'react';
import { Table, Card, Button, Tag, Space, Tabs, Form, Input, Select, Row, Col, DatePicker, Modal, Statistic, Divider, Descriptions } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, FilterOutlined, UserOutlined, CalendarOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

function MedicalRecordsPage() {
  const [searchText, setSearchText] = useState('');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 'HS001',
      donorName: 'Nguyễn Văn A',
      date: '2024-03-15',
      bloodType: 'A+',
      donationType: 'A+',
      healthStatus: 'approved',
      examResult: 'Sức khỏe tốt, đủ điều kiện hiến máu',
      doctor: 'Bs. Hoàng Văn X'
    },
    {
      id: 'HS002',
      donorName: 'Trần Thị B',
      date: '2024-03-15',
      bloodType: 'O-',
      donationType: 'O-',
      healthStatus: 'rejected',
      examResult: 'Thiếu cân, hemoglobin thấp',
      doctor: 'Bs. Hoàng Văn X'
    }
  ]);

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'id',
      key: 'id',
      width: 100,
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
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Loại hiến máu',
      dataIndex: 'donationType',
      key: 'donationType',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status) => {
        const statusConfig = {
          approved: { color: 'success', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', text: 'Từ chối', icon: <CloseCircleOutlined /> },
          pending: { color: 'warning', text: 'Chờ duyệt', icon: <FileTextOutlined /> }
        };
        const { color, text, icon } = statusConfig[status];
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: 'Bác sĩ khám',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button 
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setIsViewModalVisible(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const stats = [
    { title: 'Tổng số hồ sơ', value: medicalRecords.length },
    { title: 'Đã duyệt', value: medicalRecords.filter(r => r.healthStatus === 'approved').length },
    { title: 'Chờ duyệt', value: medicalRecords.filter(r => r.healthStatus === 'pending').length },
    { title: 'Từ chối', value: medicalRecords.filter(r => r.healthStatus === 'rejected').length },
  ];

  const handleAddEdit = (values) => {
    if (editingRecord) {
      // Cập nhật hồ sơ hiện có
      const updatedRecords = medicalRecords.map(record => 
        record.id === editingRecord.id ? { ...record, ...values } : record
      );
      setMedicalRecords(updatedRecords);
    } else {
      // Thêm hồ sơ mới
      const newRecord = {
        id: `HS${medicalRecords.length + 1}`,
        ...values,
        healthStatus: 'pending',
        doctor: 'Dr. Example' // Thay thế bằng thông tin bác sĩ thực tế
      };
      setMedicalRecords([...medicalRecords, newRecord]);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Thống kê hồ sơ y tế</h2>
          <Row gutter={16}>
            {stats.map((stat, index) => (
              <Col span={6} key={index}>
                <Card>
                  <Statistic title={stat.title} value={stat.value} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Card>

      <Card>
        <Tabs
          defaultActiveKey="records"
          items={[
            {
              key: 'records',
              label: 'Danh sách hồ sơ',
              children: (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <Space>
                      <Input
                        placeholder="Tìm kiếm theo tên hoặc mã hồ sơ"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                      />
                      <Button icon={<FilterOutlined />}>Lọc</Button>
                      <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
                    </Space>
                  </div>

                  <Table
                    columns={columns}
                    dataSource={medicalRecords}
                    rowKey="id"
                    pagination={{
                      total: medicalRecords.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng số ${total} hồ sơ`,
                    }}
                  />
                </div>
              ),
            },
            {
              key: 'new-record',
              label: 'Tạo hồ sơ mới',
              children: (
                <Form form={form} layout="vertical" style={{ maxWidth: 800 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="Người hiến máu" 
                        name="donorName" 
                        rules={[{ required: true, message: 'Vui lòng chọn người hiến máu' }]}
                      >
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
                    <Col span={12}>
                      <Form.Item 
                        label="Nhóm máu" 
                        name="bloodType" 
                        rules={[{ required: true, message: 'Vui lòng chọn nhóm máu' }]}
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
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="Loại hiến máu" 
                        name="donationType" 
                        rules={[{ required: true, message: 'Vui lòng chọn loại hiến máu' }]}
                      >
                        <Select placeholder="Chọn loại hiến máu">
                          <Option value="A+">A+</Option>
                          <Option value="A-">A-</Option>
                          <Option value="B+">B+</Option>
                          <Option value="B-">B-</Option>
                          <Option value="AB+">AB+</Option>
                          <Option value="AB-">AB-</Option>
                          <Option value="O+">O+</Option>
                          <Option value="O-">O-</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item 
                        label="Ngày khám" 
                        name="examDate" 
                        rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
                      >
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày khám" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item 
                        label="Cân nặng (kg)" 
                        name="weight" 
                        rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
                      >
                        <Input type="number" placeholder="VD: 65" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item 
                        label="Chiều cao (cm)" 
                        name="height" 
                        rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
                      >
                        <Input type="number" placeholder="VD: 170" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item 
                        label="Huyết áp" 
                        name="bloodPressure" 
                        rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
                      >
                        <Input placeholder="VD: 120/80" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="Mạch" 
                        name="pulse" 
                        rules={[{ required: true, message: 'Vui lòng nhập mạch' }]}
                      >
                        <Input type="number" placeholder="VD: 75" addonAfter="nhịp/phút" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item 
                        label="Hemoglobin" 
                        name="hemoglobin" 
                        rules={[{ required: true, message: 'Vui lòng nhập chỉ số Hemoglobin' }]}
                      >
                        <Input type="number" step="0.1" placeholder="VD: 14.5" addonAfter="g/dL" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item 
                    label="Ghi chú" 
                    name="notes"
                  >
                    <TextArea rows={4} placeholder="Nhập ghi chú và các quan sát khác" />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Lưu hồ sơ
                      </Button>
                      <Button onClick={() => form.resetFields()}>
                        Làm mới
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Chi tiết hồ sơ y tế"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Row gutter={16}>
              <Col span={12}>
                <div className="space-y-2">
                  <p><strong>Mã hồ sơ:</strong> {selectedRecord.id}</p>
                  <p><strong>Người hiến máu:</strong> {selectedRecord.donorName}</p>
                  <p><strong>Ngày khám:</strong> {selectedRecord.date}</p>
                  <p><strong>Nhóm máu:</strong> {selectedRecord.bloodType}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className="space-y-2">
                  <p><strong>Loại hiến máu:</strong> {selectedRecord.donationType}</p>
                  <p><strong>Bác sĩ khám:</strong> {selectedRecord.doctor}</p>
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    <Tag color={
                      selectedRecord.healthStatus === 'approved' ? 'success' :
                      selectedRecord.healthStatus === 'rejected' ? 'error' :
                      'warning'
                    }>
                      {selectedRecord.healthStatus === 'approved' ? 'Đã duyệt' :
                       selectedRecord.healthStatus === 'rejected' ? 'Từ chối' :
                       'Chờ duyệt'}
                    </Tag>
                  </p>
                </div>
              </Col>
            </Row>

            <Divider>Kết quả khám</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Cân nặng" value={selectedRecord.examResult.weight} suffix="kg" />
              </Col>
              <Col span={8}>
                <Statistic title="Chiều cao" value={selectedRecord.examResult.height} suffix="cm" />
              </Col>
              <Col span={8}>
                <Statistic title="Huyết áp" value={selectedRecord.examResult.bloodPressure} suffix="mmHg" />
              </Col>
            </Row>

            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <Statistic title="Mạch" value={selectedRecord.examResult.pulse} suffix="nhịp/phút" />
              </Col>
              <Col span={12}>
                <Statistic title="Hemoglobin" value={selectedRecord.examResult.hemoglobin} suffix="g/dL" />
              </Col>
            </Row>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Ghi chú:</h4>
              <p>{selectedRecord.examResult.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MedicalRecordsPage; 