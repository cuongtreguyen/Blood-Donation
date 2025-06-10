import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserHomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">Chào mừng bạn đến với Dòng Máu Việt</Title>
      
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            className="text-center h-full"
            cover={
              <div className="p-4">
                <UserOutlined style={{ fontSize: '48px', color: '#d32f2f' }} />
              </div>
            }
          >
            <Card.Meta
              title="Thông tin cá nhân"
              description="Xem và cập nhật thông tin cá nhân của bạn"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserHomePage; 