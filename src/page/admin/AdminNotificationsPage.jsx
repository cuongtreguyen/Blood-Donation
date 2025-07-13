import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import api from '../../config/api';
import { List, Card, Tag, Typography, Button, Space, Badge, Input, Select, Row, Col, Empty, Modal, Form } from 'antd';
import { BellOutlined, SearchOutlined, FilterOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography; // Lấy các component Title, Text từ thư viện Typography của Ant Design để sử dụng cho tiêu đề và văn bản
const { Option } = Select; // Lấy component Option từ Select của Ant Design để sử dụng cho các lựa chọn trong dropdown

function AdminNotificationsPage() {
  const userData = useSelector((state) => state.user) || {}; // Lấy thông tin người dùng từ Redux store
  const userId = userData.id; // Lấy id của người dùng hiện tại

  const [notifications, setNotifications] = useState([]); // State lưu danh sách thông báo
  const [unreadCount, setUnreadCount] = useState(0); // State lưu số lượng thông báo chưa đọc
  const [searchText, setSearchText] = useState(''); // State lưu từ khóa tìm kiếm thông báo
  const [typeFilter, setTypeFilter] = useState('all'); // State lưu loại thông báo được chọn để lọc
  const [readFilter, setReadFilter] = useState('all'); // State lưu trạng thái đọc/chưa đọc để lọc
  const [isModalVisible, setIsModalVisible] = useState(false); // State kiểm soát hiển thị modal tạo thông báo mới
  const [form] = Form.useForm(); // Khởi tạo instance form của Ant Design để quản lý form tạo thông báo mới

  // Lấy các thông báo và số lượng chưa đọc khi userId thay đổi
  // Hàm này gọi API để lấy danh sách thông báo và số lượng thông báo chưa đọc của người dùng
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
  // Gửi dữ liệu từ form lên server để tạo một thông báo mới, sau đó làm mới danh sách
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

  // Hàm lấy màu tag theo loại thông báo
  // Trả về màu sắc cho tag dựa trên loại thông báo truyền vào
  const getTypeTagColor = (type) => {
    switch (type) {
      case 'BLOOD_REQUEST': return 'red';
      case 'BLOOD_DONATION_REMINDER': return 'blue';
      case 'EMERGENCY_REQUEST': return 'orange';
      case 'DONATION_COMPLETED': return 'green';
      case 'SYSTEM_ANNOUNCEMENT': return 'purple';
      case 'user': return 'geekblue';
      case 'bloodBank': return 'lime';
      case 'report': return 'gold';
      case 'system': return 'gray';
      default: return 'default';
    }
  };

  // Lọc thông báo dựa trên từ khóa tìm kiếm và các bộ lọc
  const allowedTypes = [
    'BLOOD_REQUEST',
    'BLOOD_DONATION_REMINDER',
    'EMERGENCY_REQUEST',
    'DONATION_COMPLETED',
    'SYSTEM_ANNOUNCEMENT'
  ];
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                          notification.message?.toLowerCase().includes(searchText.toLowerCase());
    const matchesType =
      (typeFilter === 'all' && allowedTypes.includes(notification.type)) ||
      notification.type === typeFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && notification.read) ||
                       (readFilter === 'unread' && !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  // Hàm đánh dấu tất cả thông báo là đã đọc
  // Gọi API để đánh dấu tất cả thông báo của người dùng là đã đọc
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

  // Hàm đánh dấu một thông báo là đã đọc
  // Gọi API để đánh dấu một thông báo cụ thể là đã đọc
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/mark-read`);
      fetchNotifications();
      toast.success('Đã đánh dấu thông báo là đã đọc!');
    } catch (err) {
      toast.error('Không thể đánh dấu thông báo là đã đọc!');
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <BellOutlined /> Thông báo <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}
            style={{ background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 }}
          >
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
              <Option value="BLOOD_REQUEST">Yêu cầu hiến máu</Option>
              <Option value="BLOOD_DONATION_REMINDER">Nhắc nhở hiến máu</Option>
              <Option value="EMERGENCY_REQUEST">Yêu cầu cấp cứu</Option>
              <Option value="DONATION_COMPLETED">Hoàn thành hiến máu</Option>
              <Option value="SYSTEM_ANNOUNCEMENT">Thông báo hệ thống</Option>
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
                style={{ background: !item.read ? '#fff7f6' : 'white', borderLeft: !item.read ? '4px solid #ff4d4f' : '4px solid #f0f0f0', transition: 'background 0.2s' }}
                actions={
                  !item.read
                    ? [
                        <Button
                          icon={<CheckCircleOutlined />}
                          size="small"
                          style={{ color: '#595959', borderColor: '#d9d9d9', background: '#fff' }}
                          onClick={e => {
                            e.stopPropagation();
                            markAsRead(item.id);
                          }}
                        >Đã đọc</Button>
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read}>
                      <BellOutlined style={{ fontSize: '24px', color: !item.read ? '#ff4d4f' : '#bfbfbf' }} />
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong={!item.read} style={{ color: !item.read ? '#d32f2f' : undefined }}>
                        {item.title}
                      </Text>
                      <Tag color={!item.read ? 'red' : 'default'}>{!item.read ? 'Chưa đọc' : 'Đã đọc'}</Tag>
                      {item.type && (
                        <Tag color={getTypeTagColor(item.type)}>
                          {item.type === 'BLOOD_REQUEST' && 'Yêu cầu hiến máu'}
                          {item.type === 'BLOOD_DONATION_REMINDER' && 'Nhắc nhở hiến máu'}
                          {item.type === 'EMERGENCY_REQUEST' && 'Yêu cầu cấp cứu'}
                          {item.type === 'DONATION_COMPLETED' && 'Hoàn thành hiến máu'}
                          {item.type === 'SYSTEM_ANNOUNCEMENT' && 'Thông báo hệ thống'}
                          {item.type === 'user' && 'Người dùng'}
                          {item.type === 'bloodBank' && 'Ngân hàng máu'}
                          {item.type === 'report' && 'Báo cáo'}
                          {item.type === 'system' && 'Hệ thống'}
                          {![
                            'BLOOD_REQUEST',
                            'BLOOD_DONATION_REMINDER',
                            'EMERGENCY_REQUEST',
                            'DONATION_COMPLETED',
                            'SYSTEM_ANNOUNCEMENT',
                            'user',
                            'bloodBank',
                            'report',
                            'system',
                          ].includes(item.type) && item.type}
                        </Tag>
                      )}
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
        okButtonProps={{ style: { background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 } }}
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