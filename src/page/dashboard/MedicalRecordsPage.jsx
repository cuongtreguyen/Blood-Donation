import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, DatePicker, Tabs, Descriptions, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

function MedicalRecordsPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data for medical records
  const [medicalRecords, setMedicalRecords] = useState([
    {
      key: '1',
      donorId: 'D001',
      name: 'Nguyễn Văn A',
      bloodType: 'A+',
      lastExamination: '15/09/2023',
      lastDonation: '15/09/2023',
      healthStatus: 'good',
      notes: 'Sức khỏe tốt, đủ điều kiện hiến máu.',
      weight: 68,
      height: 170,
      bloodPressure: '120/80',
      hemoglobin: 14.5,
      allergies: 'Không',
      chronicDiseases: 'Không',
      medications: 'Không',
      donationHistory: [
        { date: '15/09/2023', amount: '450ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Nguyễn Văn X' },
        { date: '10/03/2023', amount: '450ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Trần Thị Y' },
        { date: '05/09/2022', amount: '350ml', location: 'Bệnh viện Chợ Rẫy', doctor: 'Bác sĩ Lê Văn Z' },
      ],
    },
    {
      key: '2',
      donorId: 'D002',
      name: 'Trần Thị B',
      bloodType: 'O-',
      lastExamination: '20/08/2023',
      lastDonation: '20/08/2023',
      healthStatus: 'attention',
      notes: 'Hàm lượng sắt thấp, cần bổ sung dinh dưỡng trước khi hiến máu lần tiếp theo.',
      weight: 55,
      height: 160,
      bloodPressure: '110/70',
      hemoglobin: 11.8,
      allergies: 'Penicillin',
      chronicDiseases: 'Không',
      medications: 'Viên sắt',
      donationHistory: [
        { date: '20/08/2023', amount: '350ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Nguyễn Văn X' },
        { date: '15/02/2023', amount: '350ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Trần Thị Y' },
      ],
    },
    {
      key: '3',
      donorId: 'D003',
      name: 'Lê Văn C',
      bloodType: 'B+',
      lastExamination: '05/10/2023',
      lastDonation: '05/10/2023',
      healthStatus: 'good',
      notes: 'Người hiến máu thường xuyên, sức khỏe tốt.',
      weight: 75,
      height: 178,
      bloodPressure: '125/85',
      hemoglobin: 15.2,
      allergies: 'Không',
      chronicDiseases: 'Không',
      medications: 'Không',
      donationHistory: [
        { date: '05/10/2023', amount: '450ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Nguyễn Văn X' },
        { date: '01/04/2023', amount: '450ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Trần Thị Y' },
        { date: '28/10/2022', amount: '450ml', location: 'Bệnh viện Chợ Rẫy', doctor: 'Bác sĩ Lê Văn Z' },
        { date: '15/04/2022', amount: '450ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Nguyễn Văn X' },
      ],
    },
    {
      key: '4',
      donorId: 'D004',
      name: 'Phạm Thị D',
      bloodType: 'AB+',
      lastExamination: '30/07/2023',
      lastDonation: '30/07/2023',
      healthStatus: 'critical',
      notes: 'Phát hiện viêm gan B, tạm thời không đủ điều kiện hiến máu.',
      weight: 52,
      height: 158,
      bloodPressure: '115/75',
      hemoglobin: 12.5,
      allergies: 'Không',
      chronicDiseases: 'Viêm gan B',
      medications: 'Thuốc điều trị viêm gan',
      donationHistory: [
        { date: '15/01/2023', amount: '350ml', location: 'Trung tâm Hiến máu TP.HCM', doctor: 'Bác sĩ Nguyễn Văn X' },
      ],
    },
  ]);

  const showModal = (record = null) => {
    setSelectedRecord(record);
    setIsModalVisible(true);

    if (record) {
      form.setFieldsValue({
        donorId: record.donorId,
        name: record.name,
        bloodType: record.bloodType,
        weight: record.weight,
        height: record.height,
        bloodPressure: record.bloodPressure,
        hemoglobin: record.hemoglobin,
        allergies: record.allergies,
        chronicDiseases: record.chronicDiseases,
        medications: record.medications,
        healthStatus: record.healthStatus,
        notes: record.notes,
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      if (selectedRecord) {
        // Update existing record
        const updatedRecords = medicalRecords.map((record) => {
          if (record.key === selectedRecord.key) {
            return {
              ...record,
              lastExamination: formattedDate,
              weight: values.weight,
              height: values.height,
              bloodPressure: values.bloodPressure,
              hemoglobin: values.hemoglobin,
              allergies: values.allergies,
              chronicDiseases: values.chronicDiseases,
              medications: values.medications,
              healthStatus: values.healthStatus,
              notes: values.notes,
            };
          }
          return record;
        });
        setMedicalRecords(updatedRecords);
      } else {
        // Add new record
        const newRecord = {
          key: `${medicalRecords.length + 1}`,
          donorId: values.donorId,
          name: values.name,
          bloodType: values.bloodType,
          lastExamination: formattedDate,
          lastDonation: 'Chưa hiến máu',
          healthStatus: values.healthStatus || 'good',
          notes: values.notes,
          weight: values.weight,
          height: values.height,
          bloodPressure: values.bloodPressure,
          hemoglobin: values.hemoglobin,
          allergies: values.allergies || 'Không',
          chronicDiseases: values.chronicDiseases || 'Không',
          medications: values.medications || 'Không',
          donationHistory: [],
        };
        setMedicalRecords([...medicalRecords, newRecord]);
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'donorId',
      key: 'donorId',
      sorter: (a, b) => a.donorId.localeCompare(b.donorId),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
          record.donorId.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
      filters: [
        { text: 'A+', value: 'A+' },
        { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' },
        { text: 'B-', value: 'B-' },
        { text: 'AB+', value: 'AB+' },
        { text: 'AB-', value: 'AB-' },
        { text: 'O+', value: 'O+' },
        { text: 'O-', value: 'O-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
    },
    {
      title: 'Khám gần nhất',
      dataIndex: 'lastExamination',
      key: 'lastExamination',
      sorter: (a, b) => {
        const dateA = a.lastExamination.split('/').reverse().join('');
        const dateB = b.lastExamination.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
    },
    {
      title: 'Hiến máu gần nhất',
      dataIndex: 'lastDonation',
      key: 'lastDonation',
    },
    {
      title: 'Tình trạng sức khỏe',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status) => {
        let color = 'green';
        let text = 'Tốt';
        
        if (status === 'attention') {
          color = 'orange';
          text = 'Cần chú ý';
        } else if (status === 'critical') {
          color = 'red';
          text = 'Không đủ điều kiện';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Tốt', value: 'good' },
        { text: 'Cần chú ý', value: 'attention' },
        { text: 'Không đủ điều kiện', value: 'critical' },
      ],
      onFilter: (value, record) => record.healthStatus === value,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => showViewModal(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Hồ sơ y tế"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên hoặc ID..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Thêm hồ sơ mới
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={medicalRecords}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal for adding/editing medical records */}
      <Modal
        title={selectedRecord ? 'Cập nhật hồ sơ y tế' : 'Thêm hồ sơ y tế mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText={selectedRecord ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="donorId"
                label="ID người hiến máu"
                rules={[{ required: true, message: 'Vui lòng nhập ID!' }]}
                disabled={!!selectedRecord}
              >
                <Input placeholder="Nhập ID người hiến máu" disabled={!!selectedRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                disabled={!!selectedRecord}
              >
                <Input placeholder="Nhập họ và tên" disabled={!!selectedRecord} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bloodType"
                label="Nhóm máu"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
                disabled={!!selectedRecord}
              >
                <Select placeholder="Chọn nhóm máu" disabled={!!selectedRecord}>
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
            <Col span={8}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
              >
                <Input type="number" placeholder="Nhập cân nặng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label="Chiều cao (cm)"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao!' }]}
              >
                <Input type="number" placeholder="Nhập chiều cao" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bloodPressure"
                label="Huyết áp"
                rules={[{ required: true, message: 'Vui lòng nhập huyết áp!' }]}
              >
                <Input placeholder="Ví dụ: 120/80" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hemoglobin"
                label="Hemoglobin (g/dL)"
                rules={[{ required: true, message: 'Vui lòng nhập hemoglobin!' }]}
              >
                <Input type="number" step="0.1" placeholder="Nhập hemoglobin" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="healthStatus"
                label="Tình trạng sức khỏe"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
              >
                <Select placeholder="Chọn tình trạng">
                  <Option value="good">Tốt</Option>
                  <Option value="attention">Cần chú ý</Option>
                  <Option value="critical">Không đủ điều kiện</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="allergies" label="Dị ứng">
            <Input placeholder="Nhập thông tin dị ứng (nếu có)" />
          </Form.Item>

          <Form.Item name="chronicDiseases" label="Bệnh mãn tính">
            <Input placeholder="Nhập thông tin bệnh mãn tính (nếu có)" />
          </Form.Item>

          <Form.Item name="medications" label="Thuốc đang sử dụng">
            <Input placeholder="Nhập thông tin thuốc đang sử dụng (nếu có)" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for viewing detailed medical records */}
      <Modal
        title="Chi tiết hồ sơ y tế"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              handleViewCancel();
              showModal(selectedRecord);
            }}
            style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin cá nhân" key="1">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">{selectedRecord.donorId}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên">{selectedRecord.name}</Descriptions.Item>
                <Descriptions.Item label="Nhóm máu">
                  <Tag color="red">{selectedRecord.bloodType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Khám gần nhất">{selectedRecord.lastExamination}</Descriptions.Item>
                <Descriptions.Item label="Hiến máu gần nhất">{selectedRecord.lastDonation}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng sức khỏe">
                  {selectedRecord.healthStatus === 'good' && <Tag color="green">Tốt</Tag>}
                  {selectedRecord.healthStatus === 'attention' && <Tag color="orange">Cần chú ý</Tag>}
                  {selectedRecord.healthStatus === 'critical' && <Tag color="red">Không đủ điều kiện</Tag>}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Chỉ số sức khỏe" key="2">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Cân nặng">{selectedRecord.weight} kg</Descriptions.Item>
                <Descriptions.Item label="Chiều cao">{selectedRecord.height} cm</Descriptions.Item>
                <Descriptions.Item label="Huyết áp">{selectedRecord.bloodPressure}</Descriptions.Item>
                <Descriptions.Item label="Hemoglobin">{selectedRecord.hemoglobin} g/dL</Descriptions.Item>
                <Descriptions.Item label="Dị ứng">{selectedRecord.allergies}</Descriptions.Item>
                <Descriptions.Item label="Bệnh mãn tính">{selectedRecord.chronicDiseases}</Descriptions.Item>
                <Descriptions.Item label="Thuốc đang sử dụng">{selectedRecord.medications}</Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedRecord.notes}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Lịch sử hiến máu" key="3">
              <Table
                dataSource={selectedRecord.donationHistory}
                columns={[
                  {
                    title: 'Ngày hiến máu',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: 'Lượng máu',
                    dataIndex: 'amount',
                    key: 'amount',
                  },
                  {
                    title: 'Địa điểm',
                    dataIndex: 'location',
                    key: 'location',
                  },
                  {
                    title: 'Bác sĩ',
                    dataIndex: 'doctor',
                    key: 'doctor',
                  },
                ]}
                pagination={false}
              />
              {selectedRecord.donationHistory.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <WarningOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <p>Chưa có lịch sử hiến máu</p>
                </div>
              )}
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
}

export default MedicalRecordsPage; 