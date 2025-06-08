import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, InputNumber, Select, Row, Col, Statistic, Tag, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, WarningOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([
    { id: 1, type: 'A+', quantity: 50, status: 'normal' },
    { id: 2, type: 'A-', quantity: 20, status: 'low' },
    { id: 3, type: 'B+', quantity: 45, status: 'normal' },
    { id: 4, type: 'B-', quantity: 15, status: 'low' },
    { id: 5, type: 'O+', quantity: 60, status: 'normal' },
    { id: 6, type: 'O-', quantity: 25, status: 'low' },
    { id: 7, type: 'AB+', quantity: 30, status: 'normal' },
    { id: 8, type: 'AB-', quantity: 10, status: 'critical' }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Lấy cài đặt ngưỡng cảnh báo từ localStorage
  const systemSettings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
  const lowThreshold = systemSettings?.notificationSettings?.lowBloodStockThreshold || 20;

  useEffect(() => {
    // Cập nhật trạng thái dựa trên ngưỡng
    const updatedInventory = inventory.map(item => ({
      ...item,
      status: getStatus(item.quantity)
    }));
    setInventory(updatedInventory);
  }, [lowThreshold]);

  const getStatus = (quantity) => {
    if (quantity <= lowThreshold / 2) return 'critical';
    if (quantity <= lowThreshold) return 'low';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'red';
      case 'low': return 'orange';
      default: return 'green';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical': return 'Cực kỳ thấp';
      case 'low': return 'Sắp hết';
      default: return 'Đủ dùng';
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    const status = getStatus(values.quantity);
    
    if (editingRecord) {
      setInventory(prev =>
        prev.map(item =>
          item.id === editingRecord.id
            ? { ...item, ...values, status }
            : item
        )
      );
    } else {
      setInventory(prev => [
        ...prev,
        {
          id: Date.now(),
          ...values,
          status
        }
      ]);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa nhóm máu ${record.type} khỏi kho không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setInventory(prev => prev.filter(item => item.id !== record.id));
        message.success(`Đã xóa nhóm máu ${record.type}`);
      },
    });
  };

  // Tính toán thống kê
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalTypes = inventory.filter(item => item.status === 'critical').length;
  const lowTypes = inventory.filter(item => item.status === 'low').length;

  const columns = [
    {
      title: 'Nhóm máu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Số lượng (đơn vị)',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'critical' && <WarningOutlined style={{ marginRight: 4 }} />}
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Cập nhật
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý kho máu</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn vị máu"
              value={totalUnits}
              suffix="đơn vị"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm máu cực kỳ thấp"
              value={criticalTypes}
              valueStyle={{ color: '#cf1322' }}
              suffix="nhóm"
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm máu sắp hết"
              value={lowTypes}
              valueStyle={{ color: '#faad14' }}
              suffix="nhóm"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ngưỡng cảnh báo"
              value={lowThreshold}
              suffix="đơn vị"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Kho máu"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={inventory}
          rowKey="id"
        />
      </Card>

      <Modal
        title={editingRecord ? "Cập nhật số lượng máu" : "Thêm nhóm máu mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="type"
            label="Nhóm máu"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm máu' }]}
          >
            <Select disabled={!!editingRecord}>
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
            name="quantity"
            label="Số lượng (đơn vị)"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodInventoryPage; 