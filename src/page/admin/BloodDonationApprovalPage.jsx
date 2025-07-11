import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip, Spin, Select } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api';

const BloodDonationApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requestsWithNames, setRequestsWithNames] = useState([]);

  // Hàm lấy danh sách các yêu cầu nhận máu từ server theo nhiều trạng thái
  const fetchBloodReceiveList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        setRequests([]);
        setLoading(false);
        return;
      }
      
      const statuses = ["APPROVED", "PENDING", "REJECTED", "COMPLETED", "INCOMPLETED", "CANCELED"];
      let allResults = [];
      for (const status of statuses) {
        const res = await api.get(`/blood-receive/list-by-status?status=${status}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.length > 0) {
          allResults = allResults.concat(res.data);
        }
      }

      if (allResults.length === 0) {
        setRequests([]);
        toast.warning("Không có dữ liệu yêu cầu nhận máu nào!", { toastId: "no-data-warning" });
      } else {
        setRequests(allResults);
      }
    } catch (err) {
      setRequests([]);
      toast.error("Không thể lấy dữ liệu từ máy chủ!", { toastId: "fetch-error" });
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBloodReceiveList();
  }, []);

  useEffect(() => {
    // Hàm lấy tên người đăng ký cho từng yêu cầu nếu chưa có
    const fetchAllNames = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const updated = await Promise.all(
        requests.map(async (req) => {
          if (req.fullName && req.fullName !== 'string' && req.fullName !== null && req.fullName !== '') return req;
          try {
            const res = await api.get(`/blood-receive/get/${req.id}`, { headers: { Authorization: `Bearer ${token}` } });
            return { ...req, fullName: res.data.fullName };
          } catch {
            return req;
          }
        })
      );
      setRequestsWithNames(updated);
    };
    if (requests.length > 0) fetchAllNames();
    else setRequestsWithNames([]);
  }, [requests]);

  // Hàm cập nhật trạng thái của một yêu cầu nhận máu
  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      await api.patch(`/blood-receive/update-status/${id}?status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setRequests((prev) => prev.map(req => req.id === id ? { ...req, status } : req));
      toast.success(`Đã cập nhật trạng thái thành công!`);
    } catch (err) {
      toast.error(`Không thể cập nhật trạng thái!`);
      console.log(err);
    }
  };

  // Hàm xử lý tìm kiếm theo từ khóa
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRequests = requestsWithNames
    .filter(request => ['APPROVED', 'PENDING', 'REJECTED'].includes(request.status))
    .filter(request => {
      const searchLower = searchText.toLowerCase();
      const matchSearch =
        (request.id ? request.id.toString().toLowerCase().includes(searchLower) : false) ||
        (request.fullName ? request.fullName.toLowerCase().includes(searchLower) : false) ||
        (request.status ? request.status.toLowerCase().includes(searchLower) : false);
      const matchStatus =
        statusFilter === 'ALL' ? true : request.status === statusFilter;
      return matchSearch && matchStatus;
    });
  

  // Hàm định dạng giờ hẹn hiển thị ra giao diện
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
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
    }
    return JSON.stringify(wantedHour);
  };

  // Cấu hình các cột cho bảng danh sách yêu cầu nhận máu
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', render: (text) => text || '-', width: 180 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color, text;
        switch (status) {
          case 'APPROVED': color = 'green'; text = 'Đã duyệt'; break;
          case 'PENDING': color = 'gold'; text = 'Chờ duyệt'; break;
          case 'REJECTED': color = 'red'; text = 'Đã từ chối'; break;
          default: color = 'default'; text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { 
      title: 'Ngày hẹn', 
      dataIndex: 'wantedDate', 
      key: 'wantedDate',
      render: value => value ? new Date(value).toLocaleDateString('vi-VN') : '',
      sorter: (a, b) => new Date(a.wantedDate) - new Date(b.wantedDate),
    },
    { 
      title: 'Giờ hẹn', 
      dataIndex: 'wantedHour', 
      key: 'wantedHour',
      render: value => formatWantedHour(value),
      sorter: (a, b) => (formatWantedHour(a.wantedHour) || '').localeCompare(formatWantedHour(b.wantedHour) || ''),
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      align: 'center',
      render: (type) => {
        if (!type) return '';
        const bloodMap = {
          'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
          'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
          'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
          'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
        };
        return <Tag color="geekblue" style={{ fontWeight: 500 }}>{bloodMap[type] || type}</Tag>;
      }
    },
    { title: 'Khẩn cấp', dataIndex: 'emergency', key: 'emergency', render: (emergency) => (emergency ? <Tag color="red">Có</Tag> : <Tag color="blue">Không</Tag>), align: 'center', width: 100 },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'PENDING') {
          return (
            <Space>
              <Tooltip title="Duyệt yêu cầu">
                <Popconfirm
                  title="Bạn có chắc chắn muốn duyệt yêu cầu này?"
                  onConfirm={() => handleUpdateStatus(record.id, 'APPROVED')}
                  okText="Duyệt"
                  cancelText="Hủy"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CheckCircleOutlined />}
                    style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Từ chối yêu cầu">
                <Popconfirm
                  title="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                  onConfirm={() => handleUpdateStatus(record.id, 'REJECTED')}
                  okText="Từ chối"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    shape="circle"
                    icon={<CloseCircleOutlined />}
                    style={{ color: '#f44336', borderColor: '#f44336' }}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  // Hàm lấy chi tiết yêu cầu nhận máu theo id (hiển thị thông tin chi tiết khi click vào dòng)
  const fetchBloodReceiveDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token xác thực!");
        return;
      }
      const res = await api.get(`/blood-receive/get/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data) {
        // Ví dụ: lấy tên người đăng ký
        toast.info(`Tên người đăng ký: ${res.data.fullName}`);
        // Bạn có thể xử lý dữ liệu chi tiết ở đây
      }
    } catch (err) {
      toast.error("Không thể lấy chi tiết yêu cầu nhận máu!");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Xác nhận Yêu cầu Nhận máu"
        extra={
          <Space>
            {/* Ô tìm kiếm và bộ lọc trạng thái */}
            <Input
              placeholder="Tìm kiếm theo ID, tên, trạng thái..."
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            {/* Hiển thị loading khi đang tải dữ liệu */}
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredRequests}
            pagination={{ pageSize: 10 }}
            bordered
            rowKey="id"
            onRow={record => ({
              onClick: () => fetchBloodReceiveDetail(record.id)
            })}
          />
        )}
      </Card>
    </div>
  );
};

export default BloodDonationApprovalPage; 