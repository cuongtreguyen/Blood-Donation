import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Input, Spin, Row, Col, Statistic, Button, Tooltip, Space } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchOutlined, BarChartOutlined, WarningOutlined } from '@ant-design/icons';
import api from '../../config/api';

// Bản đồ chuyển đổi mã nhóm máu sang tên hiển thị
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

// Danh sách tất cả các nhóm máu để đảm bảo hiển thị đầy đủ
const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const BloodUnitsManagement = () => {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Hàm convert từ ml sang đơn vị (1 đơn vị = 250ml)
  const convertMlToUnits = (ml) => {
    if (!ml && ml !== 0) return 0;
    return (ml / 250);
  };

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
      
      console.log('Raw API data:', res.data);
      
      const rawData = res.data && Array.isArray(res.data) ? res.data : [];
      // Đảm bảo tất cả nhóm máu đều có, mặc định total là 0 nếu không có
      const inventoryMap = rawData.reduce((acc, unit) => {
        const bloodType = bloodTypeMap[unit.bloodType] || unit.bloodType;
        acc[bloodType] = { bloodType, total: unit.total || 0 };
        return acc;
      }, {});
      const completeInventory = allBloodTypes.map(bloodType => 
        inventoryMap[bloodType] || { bloodType, total: 0 }
      );
      setBloodUnits(completeInventory);

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
    const bloodTypeName = unit.bloodType;
    return (
      (unit.bloodType ? bloodTypeName.toLowerCase().includes(searchText) : false)
    );
  });

  // Gộp các nhóm máu trùng nhau và cộng tổng số lượng (đã được đảm bảo trong fetch)
  const mergedBloodUnits = filteredBloodUnits.reduce((acc, unit) => {
    if (!acc[unit.bloodType]) {
      acc[unit.bloodType] = { ...unit };
    } else {
      acc[unit.bloodType].total += unit.total || 0;
    }
    return acc;
  }, {});

  // Chuyển đổi sang mảng để sử dụng trong Table
  const mergedBloodUnitsArray = Object.values(mergedBloodUnits);

  // Tổng số đơn vị máu (ml) sau khi lọc
  const totalUnits = mergedBloodUnitsArray.reduce((acc, unit) => acc + (unit.total || 0), 0);
  // Ngưỡng cảnh báo số lượng máu thấp (sau khi convert)
  const lowStockThreshold = 10;
  // Thống kê số lượng máu theo từng nhóm máu (sau khi convert)
  const bloodTypeCounts = mergedBloodUnitsArray.reduce((acc, unit) => {
    acc[unit.bloodType] = convertMlToUnits(acc[unit.bloodType] || 0) + convertMlToUnits(unit.total || 0);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Nhóm Máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (type) => {
        let color = 'blue';
        if (type && (type.includes('A') || type.includes('B'))) color = 'geekblue';
        if (type && type.includes('O')) color = 'volcano';
        return <Tag color={color}>{type}</Tag>;
      },
      sorter: (a, b) => a.bloodType.localeCompare(b.bloodType),
    },
    {
      title: 'Số Lượng Hiện Có (đơn vị)',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => convertMlToUnits(a.total || 0) - convertMlToUnits(b.total || 0),
      render: (units) => convertMlToUnits(units || 0).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Thống kê Kho Máu" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng số đơn vị máu (đơn vị)" value={convertMlToUnits(totalUnits).toLocaleString()} prefix={<BarChartOutlined />} />
          </Col>
          {Object.entries(bloodTypeCounts).map(([type, count]) => (
            count < lowStockThreshold && (
              <Col span={8} key={type}>
                <Statistic
                  title={`Cảnh báo: ${type} sắp hết`}
                  value={count.toLocaleString()}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<WarningOutlined />}
                  suffix="đơn vị"
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
            placeholder="Tìm kiếm theo nhóm máu..."
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
            dataSource={mergedBloodUnitsArray}
            rowKey="bloodType"
            pagination={{ pageSize: 10 }}
            bordered
            summary={pageData => {
              let totalPageUnits = 0;
              pageData.forEach(({ total }) => {
                totalPageUnits += convertMlToUnits(total || 0);
              });

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={1}><b>Tổng cộng trên trang này</b></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <b style={{ color: '#d32f2f' }}>{totalPageUnits.toLocaleString()} đơn vị</b>
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


