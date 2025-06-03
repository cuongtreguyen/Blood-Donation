import React, { useState } from 'react';
import { Card, Row, Col, List, Badge, Button, Space, Tabs, Table, Modal, Form, Input, message, Descriptions } from 'antd';
import { 
  UserOutlined, 
  FileOutlined, 
  AlertOutlined, 
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  HeartOutlined
} from '@ant-design/icons';

function DashboardPage() {
  const [isScreeningModalVisible, setIsScreeningModalVisible] = useState(false);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isMedicalRecordModalVisible, setIsMedicalRecordModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [form] = Form.useForm();
      // Gọi API cho hồ sơ y tế
  const [medicalRecords, setMedicalRecords] = useState([
    { 
      recipient_id: 'RCP001',
      user_id: 'USR001',
      name: 'Phạm Văn D',
      blood_type: 'A+',
      medical_condition: 'Không có bệnh nền',
      hospital_address: 'Bệnh viện A',
      attending_doctor: 'BS. Nguyễn Văn X',
      notes: 'Đủ điều kiện hiến máu',
      request: {
        request_id: 'REQ001',
        blood_type: 'A+',
        quantity_needed: 450,
        component_type: 'Whole Blood',
        urgency_level: 'Normal',
        request_date: '2024-03-15',
        status: 'pending'
      }
    },
    { 
      recipient_id: 'RCP002',
      user_id: 'USR002',
      name: 'Hoàng Thị E',
      blood_type: 'B+',
      medical_condition: 'Thiếu cân',
      hospital_address: 'Bệnh viện B',
      attending_doctor: 'BS. Trần Thị Y',
      notes: 'Cân nặng chưa đạt yêu cầu',
      request: {
        request_id: 'REQ002',
        blood_type: 'B+',
        quantity_needed: 350,
        component_type: 'Platelets',
        urgency_level: 'High',
        request_date: '2024-03-15',
        status: 'pending'
      }
    },
    { 
      recipient_id: 'RCP003',
      user_id: 'USR003',
      name: 'Vũ Văn F',
      blood_type: 'O+',
      medical_condition: 'Đang đánh giá',
      hospital_address: 'Bệnh viện C',
      attending_doctor: 'BS. Lê Văn Z',
      notes: 'Cần kiểm tra thêm',
      request: {
        request_id: 'REQ003',
        blood_type: 'O+',
        quantity_needed: 450,
        component_type: 'Whole Blood',
        urgency_level: 'Normal',
        request_date: '2024-03-15',
        status: 'pending'
      }
    }
  ]);
  //Emergency xử lý khẩn cấp 

  const [emergencyCases, setEmergencyCases] = useState([
    { 
      emergency_id: 'EMG001',
      patient_name: 'Nguyễn Thị G',
      patient_age: 35,
      blood_type: 'A+',
      volume_ml: 450,
      address: 'Phòng 301, Khoa Cấp Cứu',
      reason: 'Chóng mặt nhẹ sau hiến máu',
      status: 'monitoring',
      inventory_id: 'INV001'
    },
    { 
      emergency_id: 'EMG002',
      patient_name: 'Trần Văn H',
      patient_age: 42,
      blood_type: 'O+',
      volume_ml: 350,
      address: 'Phòng 205, Khoa Nội',
      reason: 'Huyết áp tạm thời giảm',
      status: 'resolved',
      inventory_id: 'INV002'
    },
  ]);

  const stats = [
    {
      title: 'Chờ khám sàng lọc',
      value: '8',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#e6f7ff'
    },
    {
      title: 'Đã khám hôm nay',
      value: '15',
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#f6ffed'
    },
    {
      title: 'Cần xử lý khẩn',
      value: '2',
      icon: <AlertOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      color: '#fff1f0'
    },
    {
      title: 'Hồ sơ chờ duyệt',
      value: '5',
      icon: <FileOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#fff7e6'
    }
  ];

  const pendingScreenings = [
    { 
      name: 'Nguyễn Văn A', 
      time: '09:00', 
      status: 'waiting', 
      notes: 'Lần đầu hiến máu',
      medicalHistory: 'Không có bệnh nền',
      vitals: { bp: '120/80', weight: '65kg', temp: '36.5°C', hb: '13g/dL' }
    },
    { 
      name: 'Trần Thị B', 
      time: '09:15', 
      status: 'processing', 
      notes: 'Tiền sử huyết áp cao',
      medicalHistory: 'Huyết áp cao (đã điều trị)',
      vitals: { bp: '130/85', weight: '58kg', temp: '36.8°C', hb: '12.5g/dL' }
    },
    { 
      name: 'Lê Văn C', 
      time: '09:30', 
      status: 'waiting', 
      notes: 'Hiến máu định kỳ',
      medicalHistory: 'Hiến máu 3 lần/năm',
      vitals: { bp: '118/75', weight: '70kg', temp: '36.6°C', hb: '14g/dL' }
    },
  ];

  const showViewModal = (record) => {
    setSelectedCase(record);
    setIsViewModalVisible(true);
  };

  const handleScreening = (record) => {
    setSelectedCase(record);
    setIsScreeningModalVisible(true);
  };

  const handleEmergencyCase = async (record) => {
    setSelectedCase(record);
    setIsEmergencyModalVisible(true);
  };

  const handleScreeningSubmit = async (values) => {
    try {
      // TODO: Integrate with API
      console.log('Screening values:', values);
      message.success('Đã cập nhật kết quả sàng lọc');
      setIsScreeningModalVisible(false);
      form.resetFields();
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật kết quả sàng lọc');
    }
  };

  const handleEmergencySubmit = async (values) => {
    try {
      // TODO: Gọi API để cập nhật xử lý khẩn cấp
      // API endpoint: PUT /api/emergencies/{emergency_id}
      // Body: { status: values.status, notes: values.notes }
      
      const updatedCases = emergencyCases.map(item => {
        if (item.emergency_id === selectedCase.emergency_id) {
          return {
            ...item,
            status: 'resolved',
            notes: values.notes
          };
        }
        return item;
      });
      setEmergencyCases(updatedCases);
      message.success('Đã cập nhật xử lý khẩn cấp');
      setIsEmergencyModalVisible(false);
      form.resetFields();
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật xử lý khẩn cấp');
    }
  };

  const handleApproveMedicalRecord = async (record) => {
    try {
      // TODO: Gọi API để cập nhật trạng thái
      // API endpoint: PUT /api/receive-requests/{request_id}
      // Body: { status: 'approved' }
      
      const updatedRecords = medicalRecords.map(item => {
        if (item.recipient_id === record.recipient_id) {
          return {
            ...item,
            request: {
              ...item.request,
              status: 'approved'
            }
          };
        }
        return item;
      });
      setMedicalRecords(updatedRecords);
      message.success('Đã duyệt hồ sơ y tế thành công');
    } catch {
      message.error('Có lỗi xảy ra khi duyệt hồ sơ');
    }
  };

  const handleRejectMedicalRecord = async (record) => {
    Modal.confirm({
      title: 'Từ chối hồ sơ',
      content: 'Bạn có chắc chắn muốn từ chối hồ sơ này không?',
      okText: 'Từ chối',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: Gọi API để cập nhật trạng thái
          // API endpoint: PUT /api/receive-requests/{request_id}
          // Body: { status: 'rejected' }
          
          const updatedRecords = medicalRecords.map(item => {
            if (item.recipient_id === record.recipient_id) {
              return {
                ...item,
                request: {
                  ...item.request,
                  status: 'rejected'
                }
              };
            }
            return item;
          });
          setMedicalRecords(updatedRecords);
          message.success('Đã từ chối hồ sơ y tế');
        } catch {
          message.error('Có lỗi xảy ra khi từ chối hồ sơ');
        }
      },
    });
  };

  const showMedicalRecordDetail = (record) => {
    setSelectedCase(record);
    setIsMedicalRecordModalVisible(true);
  };

  const screeningColumns = [
    {
      title: 'Người hiến máu',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {text}
          <Badge 
            status={record.status === 'waiting' ? 'default' : 'processing'} 
            text={record.status === 'waiting' ? 'Chờ khám' : 'Đang khám'}
          />
        </Space>
      ),
    },
    {
      title: 'Giờ hẹn',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Tiền sử',
      dataIndex: 'medicalHistory',
      key: 'medicalHistory',
    },
    {
      title: 'Chỉ số sinh hiệu',
      dataIndex: 'vitals',
      key: 'vitals',
      render: (vitals) => (
        <>
          <div>Huyết áp: {vitals.bp}</div>
          <div>Cân nặng: {vitals.weight}</div>
          <div>Nhiệt độ: {vitals.temp}</div>
          <div>Hemoglobin: {vitals.hb}</div>
        </>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleScreening(record)}>
            Khám sàng lọc
          </Button>
          <Button onClick={() => showViewModal(record)}>Xem hồ sơ</Button>
        </Space>
      ),
    },
  ];

  const MedicalRecordDetailModal = () => (
    <Modal
      title="Chi tiết hồ sơ y tế"
      open={isMedicalRecordModalVisible}
      onCancel={() => setIsMedicalRecordModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsMedicalRecordModalVisible(false)}>
          Đóng
        </Button>
      ]}
      width={800}
    >
      {selectedCase && (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã hồ sơ">{selectedCase.recipient_id}</Descriptions.Item>
          <Descriptions.Item label="Mã người dùng">{selectedCase.user_id}</Descriptions.Item>
          <Descriptions.Item label="Tên người hiến máu">{selectedCase.name}</Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">{selectedCase.blood_type}</Descriptions.Item>
          <Descriptions.Item label="Tình trạng sức khỏe">{selectedCase.medical_condition}</Descriptions.Item>
          <Descriptions.Item label="Bệnh viện">{selectedCase.hospital_address}</Descriptions.Item>
          <Descriptions.Item label="Bác sĩ phụ trách">{selectedCase.attending_doctor}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{selectedCase.notes}</Descriptions.Item>
          
          <Descriptions.Item label="Thông tin yêu cầu" span={2}>
            <Descriptions bordered size="small">
              <Descriptions.Item label="Mã yêu cầu">{selectedCase.request.request_id}</Descriptions.Item>
              <Descriptions.Item label="Loại máu cần">{selectedCase.request.blood_type}</Descriptions.Item>
              <Descriptions.Item label="Số lượng (ml)">{selectedCase.request.quantity_needed}</Descriptions.Item>
              <Descriptions.Item label="Loại thành phần">{selectedCase.request.component_type}</Descriptions.Item>
              <Descriptions.Item label="Mức độ khẩn cấp">{selectedCase.request.urgency_level}</Descriptions.Item>
              <Descriptions.Item label="Ngày yêu cầu">{selectedCase.request.request_date}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge 
                  status={
                    selectedCase.request.status === 'approved' ? 'success' : 
                    selectedCase.request.status === 'rejected' ? 'error' : 'processing'
                  } 
                  text={
                    selectedCase.request.status === 'approved' ? 'Đã duyệt' : 
                    selectedCase.request.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'
                  }
                />
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );

  const EmergencyModal = () => (
    <Modal
      title="Xử lý khẩn cấp"
      open={isEmergencyModalVisible}
      onCancel={() => setIsEmergencyModalVisible(false)}
      footer={null}
    >
      {selectedCase && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEmergencySubmit}
          initialValues={selectedCase}
        >
          <Descriptions bordered column={1} className="mb-4">
            <Descriptions.Item label="Mã khẩn cấp">{selectedCase.emergency_id}</Descriptions.Item>
            <Descriptions.Item label="Tên bệnh nhân">{selectedCase.patient_name}</Descriptions.Item>
            <Descriptions.Item label="Tuổi">{selectedCase.patient_age}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">{selectedCase.blood_type}</Descriptions.Item>
            <Descriptions.Item label="Lượng máu (ml)">{selectedCase.volume_ml}</Descriptions.Item>
            <Descriptions.Item label="Địa điểm">{selectedCase.address}</Descriptions.Item>
            <Descriptions.Item label="Lý do">{selectedCase.reason}</Descriptions.Item>
          </Descriptions>

          <Form.Item
            name="notes"
            label="Ghi chú xử lý"
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú xử lý' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" danger htmlType="submit">
                Xác nhận xử lý
              </Button>
              <Button onClick={() => setIsEmergencyModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );

  const renderEmergencyList = () => (
    <List
      itemLayout="horizontal"
      dataSource={emergencyCases}
      renderItem={(item) => (
        <List.Item
          actions={[
            item.status === 'monitoring' && (
              <Button 
                type="primary" 
                danger 
                onClick={() => handleEmergencyCase(item)}
              >
                Xử lý
              </Button>
            )
          ]}
        >
          <List.Item.Meta
            avatar={<AlertOutlined style={{ color: '#f5222d' }} />}
            title={
              <Space>
                <span>#{item.emergency_id}</span>
                {item.patient_name}
                <Badge 
                  status={item.status === 'monitoring' ? 'processing' : 'success'} 
                  text={item.status === 'monitoring' ? 'Đang theo dõi' : 'Đã xử lý'}
                />
              </Space>
            }
            description={
              <>
                <div>Tuổi: {item.patient_age}</div>
                <div>Nhóm máu: {item.blood_type}</div>
                <div>Lượng máu cần: {item.volume_ml}ml</div>
                <div>Địa điểm: {item.address}</div>
                <div>Lý do: {item.reason}</div>
              </>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bảng điều khiển Bác sĩ</h2>
      
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={{ background: stat.color }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div>{stat.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-8">
        <Tabs
          defaultActiveKey="screening"
          items={[
            {
              key: 'screening',
              label: 'Khám sàng lọc',
              children: (
                <Table 
                  dataSource={pendingScreenings}
                  columns={screeningColumns}
                  pagination={false}
                />
              ),
            },
            {
              key: 'emergency',
              label: 'Xử lý khẩn cấp',
              children: renderEmergencyList(),
            },
            {
              key: 'medical-records',
              label: 'Hồ sơ y tế',
              children: (
                <List
                  itemLayout="horizontal"
                  dataSource={medicalRecords}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        item.status === 'pending' && (
                          <>
                            <Button 
                              type="primary" 
                              onClick={() => handleApproveMedicalRecord(item)}
                            >
                              Duyệt
                            </Button>
                            <Button 
                              danger
                              onClick={() => handleRejectMedicalRecord(item)}
                            >
                              Từ chối
                            </Button>
                          </>
                        ),
                        <Button onClick={() => showMedicalRecordDetail(item)}>
                          Xem chi tiết
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileOutlined />}
                        title={
                          <Space>
                            {item.name}
                            <Badge 
                              status={
                                item.status === 'approved' ? 'success' : 
                                item.status === 'rejected' ? 'error' : 'processing'
                              } 
                              text={
                                item.status === 'approved' ? 'Đã duyệt' : 
                                item.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'
                              }
                            />
                          </Space>
                        }
                        description={
                          <>
                            <div>Ngày: {item.date}</div>
                            <div>Loại: {item.type || 'N/A'}</div>
                            <div>Tình trạng sức khỏe: {item.healthStatus}</div>
                            <div>Ghi chú: {item.notes}</div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Chi tiết hồ sơ"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedCase && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên người hiến máu">{selectedCase.name}</Descriptions.Item>
            <Descriptions.Item label="Giờ hẹn">{selectedCase.time}</Descriptions.Item>
            <Descriptions.Item label="Tiền sử">{selectedCase.medicalHistory}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedCase.notes}</Descriptions.Item>
            <Descriptions.Item label="Chỉ số sinh hiệu" span={2}>
              <div>Huyết áp: {selectedCase.vitals?.bp}</div>
              <div>Cân nặng: {selectedCase.vitals?.weight}</div>
              <div>Nhiệt độ: {selectedCase.vitals?.temp}</div>
              <div>Hemoglobin: {selectedCase.vitals?.hb}</div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Khám sàng lọc"
        open={isScreeningModalVisible}
        onCancel={() => setIsScreeningModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleScreeningSubmit}
          initialValues={selectedCase}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bloodPressure"
                label="Huyết áp"
                rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
              >
                <Input placeholder="VD: 120/80" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="temperature"
                label="Nhiệt độ (°C)"
                rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]}
              >
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hemoglobin"
                label="Hemoglobin (g/dL)"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ số Hemoglobin' }]}
              >
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu kết quả
              </Button>
              <Button onClick={() => setIsScreeningModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <EmergencyModal />

      <MedicalRecordDetailModal />
    </div>
  );
}

export default DashboardPage; 