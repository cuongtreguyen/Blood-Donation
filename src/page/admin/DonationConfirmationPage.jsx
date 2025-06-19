import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CalendarOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
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
    } catch (err) {
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
      (donation.id || '').toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  // Tạo columns động dựa trên dữ liệu thực tế
  const dynamicColumns = donations[0]
    ? Object.keys(donations[0]).map(key => ({
        title: key,
        dataIndex: key,
        key,
        render: value => {
          // Nếu là object, stringify
          if (typeof value === 'object' && value !== null) {
            return <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(value, null, 2)}</pre>;
          }
          // Nếu là ngày dạng yyyy-mm-dd
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            return new Date(value).toLocaleDateString('vi-VN');
          }
          // Nếu là số lớn, hiển thị bình thường
          return value;
        }
      }))
    : [];

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
            columns={dynamicColumns}
            dataSource={donations.filter(donation => {
              // Lọc theo searchText trên tất cả các trường dạng string
              return Object.values(donation).some(val =>
                typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase())
              );
            })}
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