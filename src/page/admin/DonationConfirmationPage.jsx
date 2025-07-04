import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin, Select } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CalendarOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api';

const bloodTypeMap = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const DonationConfirmationPage = () => {
  const [donations, setDonations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch blood register list
  const fetchBloodRegisterList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        setDonations([]);
        setLoading(false);
        return;
      }
      // Gọi API 3 lần cho từng status
      const statuses = ["APPROVED", "PENDING", "REJECTED"];
      let allResults = [];
      for (const status of statuses) {
        const res = await api.get(`/blood-register/list-by-status?status=${status}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.length > 0) {
          allResults = allResults.concat(res.data);
        }
      }
      if (allResults.length === 0) {
        setDonations([]);
        toast.warning("Không có dữ liệu hiến máu nào!", {
          toastId: "no-data-warning",
          position: "top-right",
        });
      } else {
        setDonations(allResults.flat());
        console.log('Donations chi tiết:', allResults.flat());
        allResults.flat().forEach((item, idx) => console.log('Donation', idx, item));
      }
    } catch(err) {
      setDonations([]);
      toast.error("Không thể lấy dữ liệu từ máy chủ!", {
        toastId: "fetch-error",
        position: "top-right",        
      });
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBloodRegisterList();
  }, []);

  useEffect(() => {
    console.log('Donations:', donations);
  }, [donations]);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(
        `/blood-register/update-status/${id}?status=APPROVED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
      toast.success('Đã duyệt yêu cầu hiến máu thành công!', { toastId: 'approve-success' });
    } catch (err) {
      toast.error('Không thể duyệt yêu cầu hiến máu!', { toastId: 'approve-error' });
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(
        `/blood-register/update-status/${id}?status=REJECTED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
      toast.success('Đã từ chối yêu cầu hiến máu thành công!', { toastId: 'reject-success' });
    } catch (err) {
      toast.error('Không thể từ chối yêu cầu hiến máu!', { toastId: 'reject-error' });
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchText.toLowerCase();
    const matchSearch =
      (donation.id ? donation.id.toString().includes(searchLower) : false) ||
      (donation.status ? donation.status.toLowerCase().includes(searchLower) : false) ||
      (donation.blood && donation.blood.bloodType ? (bloodTypeMap[donation.blood.bloodType] || '').toLowerCase().includes(searchLower) : false);
    const matchStatus =
      statusFilter === 'ALL' ? true : donation.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Format wantedHour
  const formatWantedHour = (wantedHour) => {
    if (typeof wantedHour === 'string') {
      return wantedHour.split('.')[0];
    }
    if (!wantedHour || typeof wantedHour !== 'object') return '';
    const { hour, minute, second } = wantedHour;
    if (
      typeof hour === 'number' &&
      typeof minute === 'number' &&
      typeof second === 'number'
    ) {
      // Pad to 2 digits
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
    }
    return JSON.stringify(wantedHour);
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['descend', 'ascend'],
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'APPROVED':
            color = 'green';
            text = 'Đã duyệt';
            break;
          case 'PENDING':
            color = 'gold';
            text = 'Chờ duyệt';
            break;
          case 'REJECTED':
            color = 'red';
            text = 'Đã từ chối';
            break;
          default:
            color = 'default';
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { 
      title: 'Ngày hẹn', 
      dataIndex: 'wantedDate', 
      key: 'wantedDate',
      sorter: (a, b) => new Date(a.wantedDate) - new Date(b.wantedDate),
      sortDirections: ['descend', 'ascend'],
      render: value => value ? new Date(value).toLocaleDateString('vi-VN') : ''
    },
    { 
      title: 'Giờ hẹn', 
      dataIndex: 'wantedHour', 
      key: 'wantedHour',
      render: value => formatWantedHour(value)
    },
    {
      title: 'Nhóm máu',
      key: 'bloodType',
      render: (_, record) => {
        const bloodType = record.bloodType || '';
        return bloodTypeMap[bloodType] || bloodType || '-';
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'PENDING') {
          return (
            <Space>
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt yêu cầu này?"
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{ type: 'primary', style: { background: '#4CAF50', borderColor: '#4CAF50' } }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckCircleOutlined style={{ fontSize: 24 }} />}
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', boxShadow: '0 2px 8px #b2f2bb' }}
                />
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                onConfirm={() => handleReject(record.id)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button
                  shape="circle"
                  icon={<CloseCircleOutlined style={{ fontSize: 24, color: '#f44336' }} />}
                  style={{ borderColor: '#f44336', backgroundColor: 'white', boxShadow: '0 2px 8px #ffc9c9' }}
                />
              </Popconfirm>
            </Space>
          );
        }
        return null; // Không hiển thị gì nếu trạng thái không phải PENDING
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Duyệt / Xác Nhận Hiến Máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo ID, trạng thái, nhóm máu..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 220 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Select.Option value="ALL">Tất cả</Select.Option>
              <Select.Option value="APPROVED">Đã duyệt</Select.Option>
              <Select.Option value="PENDING">Chờ duyệt</Select.Option>
              <Select.Option value="REJECTED">Đã từ chối</Select.Option>
            </Select>
          </Space>
        }
      >
        <Spin spinning={loading} tip="Đang tải..." size="large">
          <Table
            columns={columns}
            dataSource={filteredDonations}
            pagination={{ pageSize: 10 }}
            bordered
            rowKey="id"
          />
        </Spin>
      </Card>
    </div>
  );
};

export default DonationConfirmationPage; 