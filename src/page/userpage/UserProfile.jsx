import React from 'react';
import { Card, Avatar, Typography, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserProfile = () => {
  // Trong thực tế, bạn sẽ lấy thông tin user từ context hoặc redux store
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    bloodType: 'A+',
    lastDonation: '2024-01-01',
    donationCount: 5
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Avatar size={128} icon={<UserOutlined />} />
          <Title level={2} className="mt-4">{user.name}</Title>
        </div>

        <Descriptions bordered>
          <Descriptions.Item label="Email" span={3}>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={3}>{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Nhóm máu" span={3}>{user.bloodType}</Descriptions.Item>
          <Descriptions.Item label="Lần hiến máu gần nhất" span={3}>{user.lastDonation}</Descriptions.Item>
          <Descriptions.Item label="Số lần hiến máu" span={3}>{user.donationCount}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserProfile; 