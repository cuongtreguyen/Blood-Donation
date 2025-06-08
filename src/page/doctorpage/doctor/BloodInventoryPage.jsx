import React, { useState } from 'react';
import { Table, Card, Button, Tag, Space, Statistic, Row, Col, Modal, Form, Input, Select, InputNumber, DatePicker, message, Alert } from 'antd';
import { WarningOutlined, CheckCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, AlertOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const { Option } = Select;
const { confirm } = Modal;

function BloodInventoryPage() {
  const [bloodInventory, setBloodInventory] = useState([
    {
      id: 'BU1',
      bloodType: 'A+',
      quantity: 50,
      expiryDate: '2024-06-15',
      location: 'Kho A',
      notes: 'Máu mới nhận',
      lastUpdated: '2024-03-15 09:00:00'
    },
    {
      id: 'BU2',
      bloodType: 'O-',
      quantity: 15,
      expiryDate: '2024-06-20',
      location: 'Kho B',
      notes: 'Cần bổ sung',
      lastUpdated: '2024-03-15 10:30:00'
    }
  ]);

  // State cho thống kê số lượng theo loại máu
  const [bloodTypeStats, setBloodTypeStats] = useState({
    'A+': 50,
    'A-': 30,
    'B+': 45,
    'B-': 25,
    'AB+': 20,
    'AB-': 15,
    'O+': 60,
    'O-': 15
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Kiểm tra hạn sử dụng
  const checkExpiry = (expiryDate) => {
    const today = moment();
    const expiry = moment(expiryDate);
    const daysUntilExpiry = expiry.diff(today, 'days');

    if (daysUntilExpiry <= 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'nearExpiry';
    return 'good';
  };

  // Tính tổng số lượng máu
  const totalBloodUnits = bloodInventory.reduce((total, item) => total + item.quantity, 0);

  // Đếm số nhóm máu sắp hết (dưới 20 đơn vị)
  const lowStockTypes = Object.entries(bloodTypeStats)
    .filter(([_, quantity]) => quantity <= 20)
    .length;

  // Đếm số đơn vị máu sắp hết hạn
  const nearExpiryUnits = bloodInventory.filter(item => checkExpiry(item.expiryDate) === 'nearExpiry').length;

  // Tính toán dữ liệu cho biểu đồ tròn
  const pieChartData = Object.entries(bloodTypeStats).map(([type, quantity]) => ({
    name: type,
    value: quantity
  }));

  // Màu sắc cho các loại máu
  const BLOOD_TYPE_COLORS = {
    'A+': '#ff4d4f',
    'A-': '#ff7875',
    'B+': '#ff9c6e',
    'B-': '#ffc069',
    'AB+': '#ffd666',
    'AB-': '#fff566',
    'O+': '#95de64',
    'O-': '#5cdbd3'
  };

  // Render thống kê tổng quan (STAT01)
  const renderOverallStats = () => {
    return (
      <Card title="Thống kê tổng quan" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Tổng số đơn vị máu"
                value={totalBloodUnits}
                suffix="đơn vị"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Nhóm máu sắp hết"
                value={lowStockTypes}
                suffix="nhóm"
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<AlertOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Đơn vị sắp hết hạn"
                value={nearExpiryUnits}
                suffix="đơn vị"
                valueStyle={{ color: '#faad14' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Cập nhật gần nhất"
                value={bloodInventory.length > 0 ? moment(bloodInventory[0].lastUpdated).format('DD/MM/YYYY') : 'Chưa có'}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    );
  };

  // Render cảnh báo nhóm máu sắp hết (STAT02)
  const renderLowStockAlert = () => {
    const lowStockBloodTypes = Object.entries(bloodTypeStats)
      .filter(([_, quantity]) => quantity <= 20)
      .map(([bloodType, quantity]) => ({
        bloodType,
        quantity
      }));

    if (lowStockBloodTypes.length > 0) {
      return (
        <Alert
          message="Cảnh báo nhóm máu sắp hết"
          description={
            <ul>
              {lowStockBloodTypes.map(({ bloodType, quantity }) => (
                <li key={bloodType}>
                  Nhóm máu {bloodType}: còn {quantity} đơn vị
                </li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          className="mb-4"
        />
      );
    }
    return null;
  };

  // Render cảnh báo máu sắp hết hạn (STAT03)
  const renderExpiryAlert = () => {
    const nearExpiryItems = bloodInventory
      .filter(item => checkExpiry(item.expiryDate) === 'nearExpiry')
      .map(item => ({
        ...item,
        daysUntilExpiry: moment(item.expiryDate).diff(moment(), 'days')
      }));

    if (nearExpiryItems.length > 0) {
      return (
        <Alert
          message="Cảnh báo đơn vị máu sắp hết hạn"
          description={
            <ul>
              {nearExpiryItems.map(item => (
                <li key={item.id}>
                  Nhóm máu {item.bloodType} (ID: {item.id}): còn {item.daysUntilExpiry} ngày
                </li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          className="mb-4"
        />
      );
    }
    return null;
  };

  // Render biểu đồ tròn phân bố máu
  const renderBloodDistributionChart = () => {
    return (
      <Card title="Phân bố các loại máu" className="mb-4">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BLOOD_TYPE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  // Columns cho bảng
  const columns = [
    {
      title: 'Loại máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: bloodType => <Tag color="red">{bloodType}</Tag>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: quantity => `${quantity} đơn vị`,
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: date => {
        const status = checkExpiry(date);
        return (
          <Tag color={
            status === 'expired' ? 'red' :
            status === 'nearExpiry' ? 'orange' :
            'green'
          }>
            {moment(date).format('DD/MM/YYYY')}
          </Tag>
        );
      },
    },
    {
      title: 'Vị trí lưu trữ',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue({
                ...record,
                expiryDate: moment(record.expiryDate)
              });
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  // Hàm xử lý thêm/sửa đơn vị máu
  const handleOk = () => {
    form.validateFields().then((values) => {
      const { bloodType, quantity, expiryDate, location, notes } = values;

      if (editingRecord) {
        // Cập nhật đơn vị máu hiện có
        const updatedInventory = bloodInventory.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                bloodType,
                quantity: parseInt(quantity),
                expiryDate: expiryDate.format('YYYY-MM-DD'),
                location,
                notes,
                lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss')
              }
            : item
        );
        setBloodInventory(updatedInventory);

        // Cập nhật bloodTypeStats
        const newStats = { ...bloodTypeStats };
        // Trừ đi số lượng cũ
        newStats[editingRecord.bloodType] -= editingRecord.quantity;
        // Cộng thêm số lượng mới
        newStats[bloodType] = (newStats[bloodType] || 0) + parseInt(quantity);
        setBloodTypeStats(newStats);
      } else {
        // Thêm đơn vị máu mới
        const newRecord = {
          id: `BU${bloodInventory.length + 1}`,
          bloodType,
          quantity: parseInt(quantity),
          expiryDate: expiryDate.format('YYYY-MM-DD'),
          location,
          notes,
          lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        setBloodInventory([...bloodInventory, newRecord]);

        // Cập nhật bloodTypeStats
        setBloodTypeStats({
          ...bloodTypeStats,
          [bloodType]: (bloodTypeStats[bloodType] || 0) + parseInt(quantity)
        });
      }

      message.success(`${editingRecord ? 'Cập nhật' : 'Thêm'} đơn vị máu thành công!`);
      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    });
  };

  // Hàm xử lý xóa đơn vị máu
  const handleDelete = (record) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa đơn vị máu ${record.bloodType} này không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setBloodInventory(prev => prev.filter(item => item.id !== record.id));
        message.success('Đã xóa đơn vị máu');
      },
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* STAT01: Thống kê tổng quan */}
        {renderOverallStats()}

        {/* STAT02: Cảnh báo nhóm máu sắp hết */}
        {renderLowStockAlert()}

        {/* STAT03: Cảnh báo máu sắp hết hạn */}
        {renderExpiryAlert()}

        {/* Thống kê chi tiết theo nhóm máu */}
        <Card title="Thống kê theo nhóm máu">
          <Row gutter={[16, 16]}>
            {Object.entries(bloodTypeStats).map(([bloodType, quantity]) => (
              <Col xs={12} sm={8} md={6} key={bloodType}>
                <Card>
                  <Statistic
                    title={<Tag color="red">{bloodType}</Tag>}
                    value={quantity}
                    suffix="đơn vị"
                    valueStyle={{ color: quantity <= 20 ? '#ff4d4f' : '#3f8600' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Biểu đồ tròn phân bố máu */}
        {renderBloodDistributionChart()}

        {/* Bảng quản lý kho máu */}
        <Card
          title="Quản lý kho máu"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                setIsModalVisible(true);
              }}
            >
              Thêm đơn vị máu
            </Button>
          }
        >
          <Table
            dataSource={bloodInventory}
            columns={columns}
            rowKey="id"
            rowClassName={(record) => {
              const status = checkExpiry(record.expiryDate);
              return status === 'expired' ? 'expired-row' : 
                     status === 'nearExpiry' ? 'near-expiry-row' : '';
            }}
          />
        </Card>
      </Space>

      {/* Modal thêm/sửa đơn vị máu */}
      <Modal
        title={editingRecord ? "Sửa đơn vị máu" : "Thêm đơn vị máu mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="bloodType"
            label="Nhóm máu"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm máu' }]}
          >
            <Select disabled={!!editingRecord}>
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

          <Form.Item
            name="quantity"
            label="Số lượng (đơn vị)"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="Hạn sử dụng"
            rules={[{ required: true, message: 'Vui lòng chọn hạn sử dụng' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Vị trí lưu trữ"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí lưu trữ' }]}
          >
            <Select>
              <Option value="Kho A">Kho A</Option>
              <Option value="Kho B">Kho B</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BloodInventoryPage; 