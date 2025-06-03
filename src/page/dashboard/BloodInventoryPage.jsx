import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Tag, Button, Statistic, Table, Modal, Form, InputNumber, Select, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons';
import { fetchData } from '../../api/fakeData';
import { useUser } from '../../contexts/UserContext';

const { Option } = Select;

const BloodInventoryPage = () => {
  const { role } = useUser();
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    Promise.all([
      fetchData('bloodInventory'),
      fetchData('donations')
    ]).then(([inventoryData, donationsData]) => {
      setInventory(inventoryData);
      setDonations(donationsData);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return '#f5222d';
      case 'low':
        return '#faad14';
      case 'normal':
        return '#52c41a';
      case 'high':
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  };

  const getProgressStatus = (status) => {
    switch (status) {
      case 'critical':
        return 'exception';
      case 'low':
        return 'normal';
      case 'normal':
        return 'success';
      case 'high':
        return 'active';
      default:
        return 'normal';
    }
  };

  const donationColumns = [
    {
      title: 'Mã hiến máu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Lượng máu',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Y tá',
      dataIndex: 'nurse',
      key: 'nurse',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
        </Tag>
      ),
    },
  ];

  const showModal = () => {
    if (role !== 'doctor') {
      message.error('Chỉ bác sĩ mới có quyền cập nhật kho máu');
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const { bloodType, amount } = values;
    
    setInventory(prev => {
      const updatedInventory = { ...prev };
      const currentAmount = updatedInventory[bloodType]?.amount || 0;
      const newAmount = currentAmount + amount;
      
      updatedInventory[bloodType] = {
        ...updatedInventory[bloodType],
        amount: newAmount,
        status: newAmount <= 20 ? 'critical' : newAmount <= 50 ? 'low' : newAmount <= 100 ? 'normal' : 'high',
        lastUpdated: new Date().toISOString()
      };
      
      return updatedInventory;
    });

    message.success(`Đã thêm ${amount} đơn vị máu ${bloodType} vào kho`);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Kho máu</h1>
        <div>
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }} onClick={showModal}>
            Nhập kho
          </Button>
          <Button icon={<HistoryOutlined />}>
            Lịch sử
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Card title="Tình trạng kho máu" loading={loading}>
            <Row gutter={[16, 16]}>
              {Object.entries(inventory).map(([type, data]) => (
                <Col span={6} key={type}>
                  <Card>
                    <Statistic
                      title={`Nhóm máu ${type}`}
                      value={data.amount}
                      suffix="đơn vị"
                      valueStyle={{ color: getStatusColor(data.status) }}
                    />
                    <Progress
                      percent={data.amount}
                      status={getProgressStatus(data.status)}
                      showInfo={false}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Tag color={getStatusColor(data.status)}>
                        {data.status === 'critical' ? 'Khẩn cấp' :
                         data.status === 'low' ? 'Thấp' :
                         data.status === 'normal' ? 'Bình thường' : 'Dồi dào'}
                      </Tag>
                      <small style={{ marginLeft: 8, color: '#8c8c8c' }}>
                        Cập nhật: {new Date(data.lastUpdated).toLocaleDateString()}
                      </small>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card title="Thống kê">
            <Statistic
              title="Tổng lượng máu"
              value={Object.values(inventory).reduce((sum, data) => sum + data.amount, 0)}
              suffix="đơn vị"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Statistic
              title="Mức tiêu thụ trung bình"
              value={45}
              suffix="đơn vị/ngày"
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Lịch sử hiến máu gần đây" style={{ marginTop: 16 }} loading={loading}>
        <Table
          columns={donationColumns}
          dataSource={donations}
          rowKey="id"
          pagination={{
            total: donations.length,
            pageSize: 5,
            showTotal: (total) => `Tổng ${total} lượt hiến máu`,
          }}
        />
      </Card>

      <Modal
        title="Nhập kho máu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="bloodType"
            label="Nhóm máu"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm máu' }]}
          >
            <Select>
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
            name="amount"
            label="Số lượng (đơn vị)"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Xác nhận
            </Button>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodInventoryPage; 