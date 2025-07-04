import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import api from '../../config/api';
import { List, Card, Tag, Typography, Button, Space, Badge, Input, Select, Row, Col, Empty, Modal, Form } from 'antd';
import { BellOutlined, SearchOutlined, FilterOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;
const { Option } = Select;

function AdminNotificationsPage() {
  const userData = useSelector((state) => state.user) || {};
  const userId = userData.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách thông báo và số lượng chưa đọc khi userId thay đổi
  const fetchNotifications = () => {
    if (!userId) return;
    api.get(`/notifications/user/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Error fetching notifications:', err));
    api.get(`/notifications/user/${userId}/unread-count`)
      .then(res => setUnreadCount(res.data.unreadCount))
      .catch(err => console.error('Error fetching unread count:', err));
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [userId]);

  // Hàm tạo thông báo mới
  const createNotification = async (values) => {
    try {
      // Ensure recipientId is a number
      values.recipientId = Number(values.recipientId);
      await api.post('/notifications/create', values);
      setIsModalVisible(false);
      form.resetFields();
      toast.success('Tạo thông báo thành công!');
      fetchNotifications();
    } catch (err) {
      toast.error('Tạo thông báo thất bại!');
      console.error('Error creating notification:', err);
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      user: 'blue',
      bloodBank: 'green',
      report: 'purple',
      system: 'orange',
      BLOOD_REQUEST: 'red',
    };
    return colors[type] || 'default';
  };

  // Filter notifications based on search text and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                          notification.message?.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && notification.read) ||
                       (readFilter === 'unread' && !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  // Hàm đánh dấu tất cả là đã đọc
  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await api.put(`/notifications/user/${userId}/mark-all-read`);
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
      fetchNotifications();
    } catch (err) {
      toast.error('Không thể đánh dấu tất cả là đã đọc!');
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <BellOutlined /> Thông báo <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Tạo thông báo mới
          </Button>
          <Button icon={<CheckCircleOutlined />} onClick={markAllAsRead} disabled={unreadCount === 0}>
            Đánh dấu tất cả đã đọc
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
              <Option value="BLOOD_REQUEST">Yêu cầu máu</Option>
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
              <List.Item>
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
                        {item.type === 'BLOOD_REQUEST' && 'Yêu cầu máu'}
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

      <Modal
        title="Tạo thông báo mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={createNotification}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại thông báo"
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select>
              <Option value="BLOOD_REQUEST">Yêu cầu hiến máu</Option>
              <Option value="BLOOD_DONATION_REMINDER">Nhắc nhở hiến máu</Option>
              <Option value="EMERGENCY_REQUEST">Yêu cầu cấp cứu</Option>
              <Option value="DONATION_COMPLETED">Hoàn thành hiến máu</Option>
              <Option value="SYSTEM_ANNOUNCEMENT">Thông báo hệ thống</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="recipientId"
            label="ID người nhận"
            rules={[{ required: true, message: 'Vui lòng nhập ID người nhận!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminNotificationsPage; 