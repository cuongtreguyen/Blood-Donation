import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Input, Spin, Row, Col, Statistic, Button, Modal, Form, Select, Popconfirm, Tooltip, Space, InputNumber } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchOutlined, BarChartOutlined, WarningOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../config/api';

const { Option } = Select;

const bloodTypeMap = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  UNKNOWN: 'Chưa xác định'
};

const BloodUnitsManagement = () => {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [form] = Form.useForm();

  const fetchBloodInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const res = await api.get('/blood-inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBloodUnits(res.data && Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      setBloodUnits([]);
      toast.error("Không thể tải dữ liệu kho máu từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodInventory();
  }, []);

  const showModal = (mode, record = null) => {
    setModalMode(mode);
    if (mode === 'edit' && record) {
      setSelectedUnitId(record.id);
      form.setFieldsValue({
        bloodType: record.bloodType,
        unitsAvailable: record.totalUnitsAvailable,
      });
    } else {
      form.resetFields();
      setSelectedUnitId(null);
    }
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      if (modalMode === 'add') {
        await api.post('/blood-inventory', values, { headers });
        toast.success('Thêm đơn vị máu thành công!');
      } else {
        if (!selectedUnitId || selectedUnitId <= 0) {
          toast.error('ID của đơn vị máu không hợp lệ. Không thể cập nhật.');
          return;
        }
        const originalUnit = bloodUnits.find(unit => unit.id === selectedUnitId);
        if (originalUnit) {
          const payload = {
            bloodType: originalUnit.bloodType,
            unitsAvailable: values.unitsAvailable,
          };
          await api.put(`/blood-inventory/${selectedUnitId}`, payload, { headers });
          toast.success('Cập nhật đơn vị máu thành công!');
        } else {
          toast.error('Không thể tìm thấy đơn vị máu để cập nhật.');
        }
      }
      
      setIsModalVisible(false);
      fetchBloodInventory(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/blood-inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Xóa đơn vị máu thành công!');
      fetchBloodInventory(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa đơn vị máu.');
    }
  };


  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredBloodUnits = bloodUnits.filter(unit => {
    const bloodTypeName = bloodTypeMap[unit.bloodType] || unit.bloodType;
    return (
      (unit.id ? unit.id.toString().toLowerCase().includes(searchText) : false) ||
      (bloodTypeName ? bloodTypeName.toLowerCase().includes(searchText) : false)
    );
  });

  const totalUnits = filteredBloodUnits.reduce((acc, unit) => acc + (unit.totalUnitsAvailable || 0), 0);
  const lowStockThreshold = 10;
  const bloodTypeCounts = filteredBloodUnits.reduce((acc, unit) => {
    acc[unit.bloodType] = (acc[unit.bloodType] || 0) + (unit.totalUnitsAvailable || 0);
    return acc;
  }, {});

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nhóm Máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (type) => {
        const bloodInfo = bloodTypeMap[type];
        let color = 'blue';
        if (type && (type.includes('A') || type.includes('B'))) color = 'geekblue';
        if (type && type.includes('O')) color = 'volcano';
        return <Tag color={color}>{bloodInfo || type}</Tag>;
      },
      sorter: (a, b) => (bloodTypeMap[a.bloodType] || a.bloodType).localeCompare(bloodTypeMap[b.bloodType] || b.bloodType),
    },
    {
      title: 'Số Lượng Hiện Có (ml)',
      dataIndex: 'totalUnitsAvailable',
      key: 'totalUnitsAvailable',
      sorter: (a, b) => (a.totalUnitsAvailable || 0) - (b.totalUnitsAvailable || 0),
      render: (units) => (units || 0).toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => showModal('edit', record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Thống kê Kho Máu" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng số đơn vị máu (ml)" value={totalUnits.toLocaleString()} prefix={<BarChartOutlined />} />
          </Col>
          {Object.entries(bloodTypeCounts).map(([type, count]) => (
            count < lowStockThreshold && (
              <Col span={8} key={type}>
                <Statistic
                  title={`Cảnh báo: ${bloodTypeMap[type] || type} sắp hết`}
                  value={count.toLocaleString()}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<WarningOutlined />}
                  suffix="ml"
                />
              </Col>
            )
          ))}
        </Row>
      </Card>
      
      <Card
        title="Quản lý Kho Máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo ID, nhóm máu..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('add')} style={{ backgroundColor: '#d32f2f', borderColor: '#d32f2f' }}>
              Thêm mới
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBloodUnits}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            summary={pageData => {
              let totalPageUnits = 0;
              pageData.forEach(({ totalUnitsAvailable }) => {
                totalPageUnits += (totalUnitsAvailable || 0);
              });

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}><b>Tổng cộng trên trang này</b></Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <b style={{ color: '#d32f2f' }}>{totalPageUnits.toLocaleString()} ml</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        )}
      </Card>
      <Modal
        title={modalMode === 'add' ? 'Thêm đơn vị máu' : 'Chỉnh sửa đơn vị máu'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' } }}
      >
        <Form form={form} layout="vertical" name="bloodUnitForm">
          <Form.Item
            name="bloodType"
            label="Nhóm Máu"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
          >
            <Select placeholder="Chọn nhóm máu" disabled={modalMode === 'edit'}>
              {Object.entries(bloodTypeMap).filter(([key]) => key !== 'UNKNOWN').map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="unitsAvailable"
            label="Số Lượng (ml)"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng ml" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodUnitsManagement; 