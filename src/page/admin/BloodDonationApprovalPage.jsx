import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin } from 'antd';
import { SearchOutlined, SafetyOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api';

// Dữ liệu mẫu trả về từ API blood-receive/list-all (tham khảo)
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
    },
    emergency: true
  }
];

const BloodDonationApprovalPage = () => {
  const [donations, setDonations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch blood receive list
  const fetchBloodReceiveList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        setDonations([]);
        setLoading(false);
        return;
      }
      const res = await api.get("/blood-receive/list-all", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.data || res.data.length === 0) {
        setDonations([]);
        toast.warning("Không có dữ liệu nhận máu nào!", { toastId: "no-data-warning" });
      } else {
        setDonations(res.data);
      }
    } catch (err) {
      setDonations([]);
      toast.error("Không thể lấy dữ liệu từ máy chủ!", { toastId: "fetch-error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBloodReceiveList();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(`/blood-receive/${id}/status?status=APPROVED`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
      toast.success('Đã duyệt yêu cầu nhận máu thành công!', { toastId: 'approve-success' });
    } catch (err) {
      toast.error('Không thể duyệt yêu cầu nhận máu!', { toastId: 'approve-error' });
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(`/blood-receive/${id}/status?status=REJECTED`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
      toast.success('Đã từ chối yêu cầu nhận máu thành công!', { toastId: 'reject-success' });
    } catch (err) {
      toast.error('Không thể từ chối yêu cầu nhận máu!', { toastId: 'reject-error' });
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchText.toLowerCase();
    return (
      (donation.patientName || '').toLowerCase().includes(searchLower) ||
      (donation.bloodType || '').toLowerCase().includes(searchLower) ||
      (donation.id || '').toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      width: 100,
    },
    {
      title: 'Số lượng (đơn vị)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 120,
    },
    {
      title: 'Ngày đến hạn',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang chờ', value: 'PENDING' },
        { text: 'Đã duyệt', value: 'APPROVED' },
        { text: 'Đã từ chối', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = '';
        if (status === 'PENDING') color = 'orange';
        else if (status === 'APPROVED') color = 'green';
        else if (status === 'REJECTED') color = 'red';
        return <Tag color={color}>{status === 'PENDING' ? 'Đang chờ' : status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <>
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt yêu cầu này?"
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{ type: 'primary', style: { background: '#52c41a', borderColor: '#52c41a' } }}
              >
                <Tooltip title="Duyệt">
                  <Button
                    icon={<SafetyOutlined style={{ color: 'white' }} />}
                    type="primary"
                    size="small"
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    shape="circle"
                  />
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                onConfirm={() => handleReject(record.id)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Từ chối">
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    size="small"
                    shape="circle"
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
          {record.status !== 'PENDING' && (
            <Tag color={record.status === 'APPROVED' ? 'green' : 'red'}>
              {record.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
            </Tag>
          )}
        </Space>
      ),
      width: 130,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Duyệt / Xác Nhận Yêu Cầu Nhận Máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo mã, tên bệnh nhân, nhóm máu..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
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

export default BloodDonationApprovalPage; 