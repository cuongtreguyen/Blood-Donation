import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CalendarOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import api from '../../config/api';

const mockData = [
  {
    key: 'D001',
    id: 'D001',
    donorName: 'Nguyễn Thị A',
    bloodType: 'A+',
    component: 'Whole Blood',
    collectionDate: '2024-04-25',
    quantity: '350ml',
    status: 'Pending',
  },
  {
    key: 'D002',
    id: 'D002',
    donorName: 'Trần Văn B',
    bloodType: 'B-',
    component: 'Plasma',
    collectionDate: '2024-04-20',
    quantity: '200ml',
    status: 'Approved',
  },
  {
    key: 'D003',
    id: 'D003',
    donorName: 'Lê Thị C',
    bloodType: 'O+',
    component: 'Red Blood Cells',
    collectionDate: '2024-04-22',
    quantity: '450ml',
    status: 'Pending',
  },
  {
    key: 'D004',
    id: 'D004',
    donorName: 'Phạm Văn D',
    bloodType: 'AB+',
    component: 'Platelets',
    collectionDate: '2024-04-18',
    quantity: '100ml',
    status: 'Rejected',
  },
];

const DonationConfirmationPage = () => {
  const [donations, setDonations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Không tìm thấy token xác thực!");
          setDonations(mockData);
          setUsingMock(true);
          toast.warning("Không thể lấy dữ liệu thật, đang hiển thị dữ liệu mẫu!", {
            toastId: "mock-data-warning",
            position: "top-right"
          });
          setLoading(false);
          return;
        }
        // Gọi API lấy danh sách các lần hiến máu với 3 trạng thái: APPROVED, PENDING, REJECTED
        // Truyền nhiều status vào query string để backend lọc theo tất cả các trạng thái này
        const res = await api.get(
          "/api/blood-register/list-by-status?status=APPROVED&status=PENDING&status=REJECTED",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.data || res.data.length === 0) {
          setDonations(mockData);
          setUsingMock(true);
          toast.warning("Không thể lấy dữ liệu thật, đang hiển thị dữ liệu mẫu!", {
            toastId: "mock-data-warning",
            position: "top-right"
          });
        } else {
          setDonations(res.data);
          setUsingMock(false);
          toast.dismiss("mock-data-warning");
        }
      } catch (err) {
        setDonations(mockData);
        setUsingMock(true);
        toast.warning("Không thể lấy dữ liệu thật, đang hiển thị dữ liệu mẫu!", {
          toastId: "mock-data-warning",
          position: "top-right"
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(
        `/api/blood-register/update-status/${id}?status=APPROVED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map(d => d.id === id ? { ...d, status: 'Approved' } : d));
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
        `/api/blood-register/update-status/${id}?status=REJECTED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map(d => d.id === id ? { ...d, status: 'Rejected' } : d));
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

  const columns = [
    {
      title: 'ID Lần hiến',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id || '').localeCompare(b.id || ''),
      width: 100,
    },
    {
      title: 'Tên người hiến',
      dataIndex: 'donorName',
      key: 'donorName',
      sorter: (a, b) => (a.donorName || '').localeCompare(b.donorName || ''),
      width: 130,
      ellipsis: true,
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      filters: [
        { text: 'A+', value: 'A+' }, { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' }, { text: 'B-', value: 'B-' },
        { text: 'AB+', value: 'AB+' }, { text: 'AB-', value: 'AB-' },
        { text: 'O+', value: 'O+' }, { text: 'O-', value: 'O-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
      width: 80,
    },
    {
      title: 'Thành phần',
      dataIndex: 'component',
      key: 'component',
      filters: [
        { text: 'Whole Blood', value: 'Whole Blood' },
        { text: 'Plasma', value: 'Plasma' },
        { text: 'Red Blood Cells', value: 'Red Blood Cells' },
        { text: 'Platelets', value: 'Platelets' },
      ],
      onFilter: (value, record) => record.component === value,
      width: 100,
    },
    {
      title: 'Ngày hiến',
      dataIndex: 'collectionDate',
      key: 'collectionDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
      sorter: (a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime(),
      width: 100,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang chờ', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Đã từ chối', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = '';
        if (status === 'Pending') color = 'orange';
        else if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status === 'Pending' ? 'Đang chờ' : status === 'Approved' ? 'Đã duyệt' : 'Đã từ chối'}</Tag>;
      },
      width: 90,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'Pending' && (
            <>
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt lần hiến máu này?"
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{ type: 'primary', style: { background: '#52c41a', borderColor: '#52c41a' } }}
              >
                <Tooltip title="Duyệt">
                  <Button
                    icon={<CheckCircleOutlined style={{ color: 'white' }} />}
                    type="primary"
                    size="small"
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    shape="circle"
                  />
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối lần hiến máu này?"
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
          {record.status !== 'Pending' && (
            <Tag color={record.status === 'Approved' ? 'green' : 'red'}>
              {record.status === 'Approved' ? 'Đã duyệt' : 'Đã từ chối'}
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
        title="Duyệt / Xác Nhận Hiến Máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo ID, Tên người hiến..."
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

export default DonationConfirmationPage; 