import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
//liên hệ chúng tôi
function ContactButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={showModal}
        className="fixed bottom-8 right-8 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-2 animate-bounce"
      >
        <PhoneOutlined />
        <span>Liên Hệ Chúng Tôi</span>
      </button>

      {/* Contact Modal */}
      <Modal
        title={<h3 className="text-xl font-bold text-red-600">Thông Tin Liên Hệ</h3>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <div className="space-y-6 py-4">
          {/* Address */}
          <div className="flex items-start space-x-4">
            <EnvironmentOutlined className="text-xl text-red-600 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Địa chỉ</h4>
              <p>123 Đường Trung Tâm Máu<br />Thành phố Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-4">
            <PhoneOutlined className="text-xl text-red-600 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Điện thoại</h4>
              <p>Tổng đài: (123) 456-7890<br />Khẩn cấp: 24/7</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <MailOutlined className="text-xl text-red-600 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Email</h4>
              <p>infor@dongmauviet.com</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start space-x-4">
            <ClockCircleOutlined className="text-xl text-red-600 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Giờ làm việc</h4>
              <ul className="list-none p-0 m-0">
                <li>Thứ 2 - Thứ 6: 8h - 20h</li>
                <li>Thứ 7: 9h - 18h</li>
                <li>Chủ nhật: 10h - 16h</li>
                <li className="text-red-600 font-semibold">Trường hợp khẩn cấp: 24/7</li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button 
              type="primary" 
              danger
              size="large"
              icon={<PhoneOutlined />}
              onClick={() => window.location.href = 'tel:(123) 456-7890'}
            >
              Gọi Ngay
            </Button>
            <Button
              type="default"
              size="large"
              icon={<MailOutlined />}
              onClick={() => window.location.href = 'mailto:infor@dongmauviet.com'}
            >
              Gửi Email
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ContactButton; 