import React, { useState } from 'react';
import { List, Card, Tag, Typography, Button, Space, Badge, Input, Select, Row, Col, Empty } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;
const { Option } = Select;

function AdminNotificationsPage() {
  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Người dùng mới đăng ký',
      message: 'Nguyễn Văn A đã đăng ký tài khoản mới',
      type: 'user',
      read: false,
      timestamp: '2024-03-20 10:30:00',
    },
    {
      id: 2,
      title: 'Ngân hàng máu mới',
      message: 'Bệnh viện Chợ Rẫy đã được thêm vào hệ thống',
      type: 'bloodBank',
      read: false,
      timestamp: '2024-03-20 09:15:00',
    },
    {
      id: 3,
      title: 'Báo cáo mới',
      message: 'Báo cáo thống kê tháng 3 đã được tạo',
      type: 'report',
      read: true,
      timestamp: '2024-03-19 15:45:00',
    },
    {
      id: 4,
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật lên phiên bản mới',
      type: 'system',
      read: true,
      timestamp: '2024-03-19 14:20:00',
    },
  ]);

  // State for filters
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  const getNotificationColor = (type) => {
    const colors = {
      user: 'blue',
      bloodBank: 'green',
      report: 'purple',
      system: 'orange',
    };
    return colors[type] || 'default';
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success('Đã đánh dấu thông báo là đã đọc!');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success('Đã xóa thông báo!');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
  };

  const deleteAllRead = () => {
    const initialCount = notifications.length;
    const remainingNotifications = notifications.filter(notification => !notification.read);
    const deletedCount = initialCount - remainingNotifications.length;

    setNotifications(remainingNotifications);

    if (deletedCount > 0) {
      toast.success(`Đã xóa ${deletedCount} thông báo đã đọc!`);
    } else {
      toast.info('Không có thông báo nào đã đọc để xóa.');
    }
  };

  // Filter notifications based on search text and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && notification.read) ||
                       (readFilter === 'unread' && !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  return (
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <BellOutlined /> Thông báo
        </Title>
        <Space>
          <Button onClick={markAllAsRead}>
            <CheckOutlined /> Đánh dấu tất cả đã đọc
          </Button>
          <Button danger onClick={deleteAllRead}>
            <DeleteOutlined /> Xóa thông báo đã đọc
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm thông báo..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo loại"
              value={typeFilter}
              onChange={setTypeFilter}
              prefix={<FilterOutlined />}
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="user">Người dùng</Option>
              <Option value="bloodBank">Ngân hàng máu</Option>
              <Option value="report">Báo cáo</Option>
              <Option value="system">Hệ thống</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              value={readFilter}
              onChange={setReadFilter}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="unread">Chưa đọc</Option>
              <Option value="read">Đã đọc</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        {filteredNotifications.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            renderItem={(item) => (
              <List.Item
                actions={[
                  !item.read && (
                    <Button type="link" onClick={() => markAsRead(item.id)}>
                      <CheckOutlined /> Đánh dấu đã đọc
                    </Button>
                  ),
                  <Button type="link" danger onClick={() => deleteNotification(item.id)}>
                    <DeleteOutlined /> Xóa
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read}>
                      <BellOutlined style={{ fontSize: '24px', color: getNotificationColor(item.type) }} />
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      <Tag color={getNotificationColor(item.type)}>
                        {item.type === 'user' && 'Người dùng'}
                        {item.type === 'bloodBank' && 'Ngân hàng máu'}
                        {item.type === 'report' && 'Báo cáo'}
                        {item.type === 'system' && 'Hệ thống'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <>
                      <Text>{item.message}</Text>
                      <br />
                      <Text type="secondary">{item.timestamp}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description={
              <Text type="secondary">
                {searchText || typeFilter !== 'all' || readFilter !== 'all'
                  ? 'Không tìm thấy thông báo phù hợp'
                  : 'Không có thông báo nào'}
              </Text>
            }
          />
        )}
      </Card>
    </div>
  );
}

export default AdminNotificationsPage; 