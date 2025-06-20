import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CalendarOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api';

// Dữ liệu mẫu trả về từ API (dùng để test hoặc tham khảo)
const value = [
  {
    id: 9007199254740991,
    status: "PENDING",
    wantedDate: "2025-06-19",
    wantedHour: {
      hour: 1073741824,
      minute: 1073741824,
      second: 1073741824,
      nano: 1073741824
    }
  }
];

const DonationConfirmationPage = () => {
  const [donations, setDonations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

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
          position: "top-right"
        });
      } else {
        setDonations(allResults);
      }
    } catch(err) {
      setDonations([]);
      toast.error("Không thể lấy dữ liệu từ máy chủ!", {
        toastId: "fetch-error",
        position: "top-right"
      });
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
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch =
      (donation.donorName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (donation.bloodType || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (donation.component || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (donation.id ? donation.id.toString().toLowerCase().includes(searchText.toLowerCase()) : false);
    return matchesSearch;
  });

  // Format wantedHour
  const formatWantedHour = (wantedHour) => {
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
    { title: 'id', dataIndex: 'id', key: 'id' },
    { title: 'status', dataIndex: 'status', key: 'status' },
    { 
      title: 'wanted_date', 
      dataIndex: 'wanted_date', 
      key: 'wanted_date',
      render: value => value ? new Date(value).toLocaleDateString('vi-VN') : ''
    },
    { 
      title: 'wanted_hour', 
      dataIndex: 'wanted_hour', 
      key: 'wanted_hour',
      render: value => formatWantedHour(value)
    },
    { title: 'user_id', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Người liên hệ khẩn cấp', dataIndex: 'emergency_contact', key: 'emergency_contact' },
    { title: 'SĐT khẩn cấp', dataIndex: 'emergency_phone', key: 'emergency_phone' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
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
              disabled={record.status === 'APPROVED'}
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
              disabled={record.status === 'REJECTED'}
              style={{ borderColor: '#f44336', backgroundColor: 'white', boxShadow: '0 2px 8px #ffc9c9' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Duyệt / Xác Nhận Hiến Máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo ID, Tên người hiến..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredDonations}
            pagination={{ pageSize: 10 }}
            bordered
            rowKey="id"
          />
        )}
      </Card>
    </div>
  );
};

export default DonationConfirmationPage; 