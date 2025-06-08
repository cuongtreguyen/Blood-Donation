import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Modal, Form, Select, Popconfirm, DatePicker, Tooltip, Input, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import { BarChartOutlined } from '@ant-design/icons';
import { Row, Col, Statistic } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Option } = Select;

const BloodUnitsManagement = () => {
  const [bloodUnits, setBloodUnits] = useState([
    {
      key: 'BU001', id: 'BU001', bloodBankId: 'BB001', bloodType: 'A+', component: 'Whole Blood', 
      collectionDate: '2023-01-01', expirationDate: '2023-02-12', status: 'available' 
    },
    {
      key: 'BU002', id: 'BU002', bloodBankId: 'BB001', bloodType: 'B-', component: 'Plasma', 
      collectionDate: '2023-01-05', expirationDate: '2023-03-05', status: 'available' 
    },
    {
      key: 'BU003', id: 'BU003', bloodBankId: 'BB002', bloodType: 'O+', component: 'Red Blood Cells', 
      collectionDate: '2023-01-10', expirationDate: '2023-02-20', status: 'available' 
    },
  ]);

  const [bloodBanks] = useState([
    { id: 'BB001', name: 'Bệnh viện Chợ Rẫy' },
    { id: 'BB002', name: 'Bệnh viện Nhân dân 115' },
    { id: 'BB003', name: 'Bệnh viện Đại học Y Dược' },
  ]);

  // Tính toán số lượng máu theo nhóm và thành phần
  const bloodSummary = bloodUnits.reduce((acc, unit) => {
    // Theo nhóm máu
    acc.byBloodType[unit.bloodType] = (acc.byBloodType[unit.bloodType] || 0) + 1;
    // Theo thành phần
    acc.byComponent[unit.component] = (acc.byComponent[unit.component] || 0) + 1;
    return acc;
  }, { byBloodType: {}, byComponent: {} });

  // Tính toán cảnh báo hạn sử dụng
  const today = dayjs();
  const expiringSoonThreshold = 30; // Cảnh báo nếu còn 30 ngày nữa hết hạn

  const expiredUnits = bloodUnits.filter(unit => 
    unit.expirationDate && dayjs(unit.expirationDate).isBefore(today, 'day')
  ).length;

  const expiringSoonUnits = bloodUnits.filter(unit => {
    if (!unit.expirationDate) return false;
    const expirationDate = dayjs(unit.expirationDate);
    return expirationDate.isAfter(today, 'day') && expirationDate.diff(today, 'day') <= expiringSoonThreshold;
  }).length;

  // Cảnh báo lượng máu thấp
  const lowBloodThreshold = 5; // Ví dụ: ngưỡng cảnh báo máu thấp là 5 đơn vị
  const isLowBlood = bloodUnits.length <= lowBloodThreshold;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const showModal = (mode, unit = null) => {
    setModalMode(mode);
    setSelectedUnit(unit);
    setIsModalVisible(true);

    if (mode === 'edit' && unit) {
      form.setFieldsValue({
        ...unit,
        collectionDate: unit.collectionDate ? dayjs(unit.collectionDate) : null,
        expirationDate: unit.expirationDate ? dayjs(unit.expirationDate) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newUnit = {
        ...values,
        collectionDate: values.collectionDate ? values.collectionDate.format('YYYY-MM-DD') : null,
        expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
      };

      if (modalMode === 'add') {
        const newId = `BU${String(bloodUnits.length + 1).padStart(3, '0')}`;
        setBloodUnits([...bloodUnits, { key: newId, id: newId, ...newUnit }]);
        toast.success('Thêm đơn vị máu thành công!');
      } else {
        setBloodUnits(bloodUnits.map(unit => 
          unit.key === selectedUnit.key ? { ...unit, ...newUnit } : unit
        ));
        toast.success('Cập nhật đơn vị máu thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    setBloodUnits(bloodUnits.filter(unit => unit.key !== key));
    toast.success('Xóa đơn vị máu thành công!');
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc dữ liệu chỉ dựa trên searchText trước khi truyền vào Table
  const filteredBloodUnits = bloodUnits.filter(unit => {
    const bloodBankName = bloodBanks.find(bank => bank.id === unit.bloodBankId)?.name || '';
    const matchesSearch = unit.id.toLowerCase().includes(searchText.toLowerCase()) ||
                          bloodBankName.toLowerCase().includes(searchText.toLowerCase()) ||
                          unit.bloodType.toLowerCase().includes(searchText.toLowerCase()) ||
                          unit.component.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: 'ID Đơn vị',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 100,
    },
    {
      title: 'Ngân hàng Máu',
      dataIndex: 'bloodBankId',
      key: 'bloodBankId',
      sorter: (a, b) => a.bloodBankId.localeCompare(b.bloodBankId),
      filters: bloodBanks.map(bank => ({ text: bank.name, value: bank.id })),
      onFilter: (value, record) => record.bloodBankId === value,
      render: (bloodBankId) => bloodBanks.find(bank => bank.id === bloodBankId)?.name || bloodBankId,
      width: 180,
    },
    {
      title: 'Nhóm Máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      sorter: (a, b) => a.bloodType.localeCompare(b.bloodType),
      filters: [
        { text: 'A+', value: 'A+' }, { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' }, { text: 'B-', value: 'B-' },
        { text: 'AB+', value: 'AB+' }, { text: 'AB-', value: 'AB-' },
        { text: 'O+', value: 'O+' }, { text: 'O-', value: 'O-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
      width: 100,
    },
    {
      title: 'Thành Phần',
      dataIndex: 'component',
      key: 'component',
      sorter: (a, b) => a.component.localeCompare(b.component),
      filters: [
        { text: 'Whole Blood', value: 'Whole Blood' },
        { text: 'Plasma', value: 'Plasma' },
        { text: 'Red Blood Cells', value: 'Red Blood Cells' },
        { text: 'Platelets', value: 'Platelets' },
      ],
      onFilter: (value, record) => record.component === value,
      width: 150,
    },
    {
      title: 'Ngày Thu Thập',
      dataIndex: 'collectionDate',
      key: 'collectionDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
      sorter: (a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime(),
      width: 120,
    },
    {
      title: 'Ngày Hết Hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
      sorter: (a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime(),
      width: 120,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'available') {
          color = 'green';
        } else if (status === 'used') {
          color = 'blue';
        } else if (status === 'expired') {
          color = 'red';
        }
        return <Tag color={color}>{status === 'available' ? 'Khả dụng' : status === 'used' ? 'Đã sử dụng' : 'Hết hạn'}</Tag>;
      },
      filters: [
        { text: 'Khả dụng', value: 'available' },
        { text: 'Đã sử dụng', value: 'used' },
        { text: 'Hết hạn', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined style={{ color: 'white' }} />}
              onClick={() => showModal('edit', record)}
              type="primary"
              size="small"
              style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn vị máu này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 110,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {isLowBlood && (
        <Alert
          message="Cảnh Báo Lượng Máu Thấp!"
          description={`Tổng số đơn vị máu hiện tại là ${bloodUnits.length}, đang dưới ngưỡng an toàn là ${lowBloodThreshold} đơn vị. Vui lòng bổ sung ngay!`}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#fff0f6' }}>
            <Statistic
              title="Đơn vị máu hết hạn"
              value={expiredUnits}
              prefix={<WarningOutlined style={{ color: '#cf1322' }} />}
              valueStyle={{ color: '#cf1322' }}
              suffix="đơn vị"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#fffbe6' }}>
            <Statistic
              title={`Sắp hết hạn (trong ${expiringSoonThreshold} ngày)`}
              value={expiringSoonUnits}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
              suffix="đơn vị"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#e6fffb' }}>
            <Statistic
              title="Tổng số đơn vị máu"
              value={bloodUnits.length}
              prefix={<BarChartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              suffix="đơn vị"
            />
          </Card>
        </Col>
      </Row>
      <Card
        title="Quản Lý Đơn Vị Máu"
        bordered={false}
        extra={
          <Space>
            {/* Input Tìm kiếm */}
            <Input
              placeholder="Tìm kiếm theo ID, Ngân hàng, Nhóm máu, Thành phần..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 400 }}
            />
            {/* Nút Thêm Đơn Vị Máu */}
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              onClick={() => showModal('add')}
            >
              Thêm Đơn Vị Máu
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredBloodUnits}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 1200 }}
        />
      </Card>

      <Card title="Thống Kê Kho Máu" bordered={false} style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Theo Nhóm Máu" size="small">
              <Row gutter={[16, 16]}>
                {Object.entries(bloodSummary.byBloodType).map(([type, count]) => (
                  <Col key={type} xs={12} sm={8} md={6}>
                    <Statistic title={type} value={count} suffix="đơn vị" />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Theo Thành Phần" size="small">
              <Row gutter={[16, 16]}>
                {Object.entries(bloodSummary.byComponent).map(([component, count]) => (
                  <Col key={component} xs={12} sm={8} md={6}>
                    <Statistic title={component} value={count} suffix="đơn vị" />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm Đơn Vị Máu Mới' : 'Chỉnh Sửa Đơn Vị Máu'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="bloodBankId" label="Ngân Hàng Máu" rules={[{ required: true, message: 'Vui lòng chọn ngân hàng máu!' }]}>
            <Select placeholder="Chọn ngân hàng máu" disabled={modalMode === 'edit'}>
              {bloodBanks.map(bank => (
                <Option key={bank.id} value={bank.id}>{bank.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bloodType" label="Nhóm Máu" rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}>
            <Select placeholder="Chọn nhóm máu">
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
          <Form.Item name="component" label="Thành Phần" rules={[{ required: true, message: 'Vui lòng chọn thành phần!' }]}>
            <Select placeholder="Chọn thành phần">
              <Option value="Whole Blood">Whole Blood</Option>
              <Option value="Plasma">Plasma</Option>
              <Option value="Red Blood Cells">Red Blood Cells</Option>
              <Option value="Platelets">Platelets</Option>
            </Select>
          </Form.Item>
          <Form.Item name="collectionDate" label="Ngày Thu Thập" rules={[{ required: true, message: 'Vui lòng chọn ngày thu thập!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="expirationDate" label="Ngày Hết Hạn" rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value="available">Khả dụng</Option>
              <Option value="used">Đã sử dụng</Option>
              <Option value="expired">Hết hạn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodUnitsManagement; 