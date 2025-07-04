import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Input, Spin, Row, Col, Statistic, Button, Tooltip, Space } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchOutlined, BarChartOutlined, WarningOutlined } from '@ant-design/icons';
import api from '../../config/api';

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

  const fetchBloodInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const res = await api.get('/blood-inventory/get-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(res.data);
      
      setBloodUnits(res.data && Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      setBloodUnits([]);
      toast.error("Không thể tải dữ liệu kho máu từ máy chủ.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodInventory();
  }, []);

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

  const totalUnits = filteredBloodUnits.reduce((acc, unit) => acc + (unit.unitsAvailable || 0), 0);
  const lowStockThreshold = 10;
  const bloodTypeCounts = filteredBloodUnits.reduce((acc, unit) => {
    acc[unit.bloodType] = (acc[unit.bloodType] || 0) + (unit.unitsAvailable || 0);
    return acc;
  }, {});

  const columns = [
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
      dataIndex: 'unitsAvailable',
      key: 'unitsAvailable',
      sorter: (a, b) => (a.unitsAvailable || 0) - (b.unitsAvailable || 0),
      render: (units) => (units || 0).toLocaleString(),
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
        title="Danh sách Kho Máu"
        extra={
          <Input
            placeholder="Tìm kiếm theo ID, nhóm máu..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
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
              pageData.forEach(({ unitsAvailable }) => {
                totalPageUnits += (unitsAvailable || 0);
              });

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={1}><b>Tổng cộng trên trang này</b></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <b style={{ color: '#d32f2f' }}>{totalPageUnits.toLocaleString()} ml</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default BloodUnitsManagement; 