import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Space, Tabs, Form, Input, Select, Row, Col, DatePicker, Modal, Statistic, Divider, Descriptions } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, FilterOutlined, UserOutlined, CalendarOutlined, EditOutlined, PlusOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { getHealthCheckList, createHealthCheck, updateHealthCheck } from '../../../services/healthCheckService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const bloodTypeMap = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};
const displayBloodType = (type) => {
  const label = bloodTypeMap[type] || type || '-';
  if (label === '-') return label;
  // Màu sắc: đỏ cho dương, xanh cho âm, vàng cho O-, AB-
  let color = 'default';
  if (['A+', 'B+', 'O+', 'AB+'].includes(label)) color = 'red';
  else if (['A-', 'B-', 'O-', 'AB-'].includes(label)) color = 'blue';
  if (['O-', 'AB-'].includes(label)) color = 'gold';
  return <Tag color={color}>{label}</Tag>;
};

function MedicalRecordsPage() {
  const [searchText, setSearchText] = useState('');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    getHealthCheckList()
      .then(res => setMedicalRecords(res.data))
      .catch(err => console.error(err));
  }, []);

  const columns = [
    { title: 'Mã hồ sơ', dataIndex: 'id', key: 'id' },
    { title: 'Người hiến máu', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày khám', dataIndex: 'checkDate', key: 'checkDate' },
    { title: 'Nhóm máu', dataIndex: 'bloodType', key: 'bloodType', render: displayBloodType },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height', render: (v) => v || '-' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight', render: (v) => v || '-' },
    { title: 'Nhiệt độ (°C)', dataIndex: 'temperature', key: 'temperature', render: (v) => v || '-' },
    { title: 'Huyết áp', dataIndex: 'bloodPressure', key: 'bloodPressure', render: (v) => v || '-' },
    { title: 'Tiền sử bệnh', dataIndex: 'medicalHistory', key: 'medicalHistory', render: (v) => v || '-' },
    { title: 'Bác sĩ khám', dataIndex: 'staffName', key: 'staffName' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => status ? <Tag color="green">Đạt</Tag> : <Tag color="red">Không đạt</Tag> },
    { title: 'ID ĐK hiến máu', dataIndex: 'bloodRegisterId', key: 'bloodRegisterId', render: (v) => v || '-' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue({
                ...record,
                checkDate: record.checkDate ? dayjs(record.checkDate) : null,
              });
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button 
            icon={<PrinterOutlined />} 
            onClick={() => handlePrint(record)}
          >
            In
          </Button>
          <Button 
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            Tải về
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

  const handleAddEdit = async (values) => {
    if (editingRecord) {
      // Cập nhật hồ sơ hiện có qua API
      await updateHealthCheck(editingRecord.id, values);
      // Sau khi cập nhật, reload lại danh sách
      getHealthCheckList().then(res => setMedicalRecords(res.data));
    } else {
      // Thêm hồ sơ mới qua API
      await createHealthCheck(values);
      // Sau khi thêm, reload lại danh sách
      getHealthCheckList().then(res => setMedicalRecords(res.data));
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingRecord(null);
  };

  // Thêm hai hàm handlePrint và handleDownload (tạm thời chỉ alert)
  const handlePrint = (record) => {
    // Tạo cửa sổ mới chỉ chứa thông tin hồ sơ để in
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>In hồ sơ y tế</title></head><body>');
    printWindow.document.write(`<h2>Hồ sơ y tế #${record.id}</h2>`);
    printWindow.document.write(`<p><strong>Người hiến máu:</strong> ${record.fullName}</p>`);
    printWindow.document.write(`<p><strong>Ngày khám:</strong> ${record.checkDate}</p>`);
    printWindow.document.write(`<p><strong>Nhóm máu:</strong> ${record.bloodType}</p>`);
    printWindow.document.write(`<p><strong>Bác sĩ khám:</strong> ${record.staffName}</p>`);
    printWindow.document.write(`<p><strong>Trạng thái:</strong> ${record.status ? 'Đạt' : 'Không đạt'}</p>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownload = (record) => {
    // Tạo một div ẩn chứa nội dung cần xuất PDF
    const printContent = document.createElement('div');
    printContent.style.position = 'fixed';
    printContent.style.left = '-9999px';
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 24px; width: 600px;">
        <h2 style="text-align:center;">HỒ SƠ Y TẾ #${record.id}</h2>
        <p><strong>Người hiến máu:</strong> ${record.fullName || '-'}</p>
        <p><strong>Ngày khám:</strong> ${record.checkDate || '-'}</p>
        <p><strong>Nhóm máu:</strong> ${displayBloodType(record.bloodType)}</p>
        <p><strong>Chiều cao:</strong> ${record.height || '-'} cm</p>
        <p><strong>Cân nặng:</strong> ${record.weight || '-'} kg</p>
        <p><strong>Nhiệt độ:</strong> ${record.temperature || '-'} °C</p>
        <p><strong>Huyết áp:</strong> ${record.bloodPressure || '-'}</p>
        <p><strong>Tiền sử bệnh:</strong> ${record.medicalHistory || '-'}</p>
        <p><strong>Bác sĩ khám:</strong> ${record.staffName || '-'}</p>
        <p><strong>Trạng thái:</strong> ${record.status ? 'Đạt' : 'Không đạt'}</p>
        <p><strong>ID ĐK hiến máu:</strong> ${record.bloodRegisterId || '-'}</p>
      </div>
    `;
    document.body.appendChild(printContent);

    html2canvas(printContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = 600;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
      pdf.save(`ho-so-y-te-${record.id}.pdf`);
      document.body.removeChild(printContent);
    });
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                      setEditingRecord(null);
                      setIsModalVisible(true);
                      form.resetFields();
                    }}>
                      Tạo hồ sơ mới
                    </Button>
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
          ]}
        />
      </Card>

      <Modal
        title={editingRecord ? "Sửa hồ sơ y tế" : "Tạo hồ sơ y tế"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEdit}
          style={{ maxWidth: 800 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Người hiến máu" 
                name="fullName" 
                rules={[{ required: true, message: 'Vui lòng nhập tên người hiến máu' }]}
              >
                <Input placeholder="Nhập tên người hiến máu" />
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
                label="Cân nặng (kg)" 
                name="weight" 
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
              >
                <Input type="number" placeholder="VD: 65" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Nhiệt độ (°C)" 
                name="temperature" 
                rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]}
              >
                <Input type="number" step="0.1" placeholder="VD: 36.5" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                label="Huyết áp" 
                name="bloodPressure" 
                rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
              >
                <Input placeholder="VD: 120/80" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Tiền sử bệnh" 
                name="medicalHistory"
              >
                <Input placeholder="Nhập tiền sử bệnh (nếu có)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Ngày khám" 
                name="checkDate" 
                rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày khám" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Bác sĩ khám" 
                name="staffName" 
                rules={[{ required: true, message: 'Vui lòng nhập tên bác sĩ' }]}
              >
                <Input placeholder="Nhập tên bác sĩ khám" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="ID ĐK hiến máu" 
                name="bloodRegisterId" 
                rules={[{ required: true, message: 'Vui lòng nhập ID đăng ký hiến máu' }]}
              >
                <Input type="number" placeholder="VD: 1" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value={true}>Đạt</Option>
              <Option value={false}>Không đạt</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Lý do từ chối"
                name="reason"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('status') === false && !value) {
                        return Promise.reject('Vui lòng nhập lý do từ chối nếu không đạt!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="Nhập lý do từ chối nếu không đạt" />
              </Form.Item>
            </Col>
          </Row>
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
      </Modal>

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