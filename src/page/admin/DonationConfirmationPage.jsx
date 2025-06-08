import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CalendarOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const DonationConfirmationPage = () => {
  const [donations, setDonations] = useState([
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
  ]);

  const [searchText, setSearchText] = useState('');

  const handleApprove = (key) => {
    setDonations(donations.map(donation =>
      donation.key === key ? { ...donation, status: 'Approved' } : donation
    ));
    toast.success('Duyệt hiến máu thành công!');
  };

  const handleReject = (key) => {
    setDonations(donations.map(donation =>
      donation.key === key ? { ...donation, status: 'Rejected' } : donation
    ));
    toast.error('Từ chối hiến máu thành công!');
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchText.toLowerCase()) ||
                          donation.bloodType.toLowerCase().includes(searchText.toLowerCase()) ||
                          donation.component.toLowerCase().includes(searchText.toLowerCase()) ||
                          donation.id.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: 'ID Lần hiến',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 100,
    },
    {
      title: 'Tên người hiến',
      dataIndex: 'donorName',
      key: 'donorName',
      sorter: (a, b) => a.donorName.localeCompare(b.donorName),
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
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
      sorter: (a, b) => dayjs(a.collectionDate).unix() - dayjs(b.collectionDate).unix(),
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
        if (status === 'Pending') {
          color = 'orange';
        } else if (status === 'Approved') {
          color = 'green';
        } else if (status === 'Rejected') {
          color = 'red';
        }
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
                onConfirm={() => handleApprove(record.key)}
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
                onConfirm={() => handleReject(record.key)}
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
        <Table
          columns={columns}
          dataSource={filteredDonations}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default DonationConfirmationPage; 