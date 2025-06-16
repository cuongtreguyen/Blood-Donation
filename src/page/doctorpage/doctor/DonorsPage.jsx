import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Input,
  Modal,
  Descriptions,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;

function DonorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyDonor, setHistoryDonor] = useState(null);

  const donors = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      bloodType: "A+",
      lastDonation: "2024-03-01",
      donationCount: 5,
      healthStatus: "good",
      nextEligibleDate: "2024-06-01",
    },
    {
      id: "2",
      name: "Trần Thị B",
      bloodType: "O-",
      lastDonation: "2024-02-15",
      donationCount: 3,
      healthStatus: "attention",
      nextEligibleDate: "2024-05-15",
    },
    {
      id: "3",
      name: "Lê Văn C",
      bloodType: "B+",
      lastDonation: "2024-03-10",
      donationCount: 8,
      healthStatus: "good",
      nextEligibleDate: "2024-06-10",
    },
  ];
  const [searchText, setSearchText] = useState("");
  const [filteredDonors, setFilteredDonors] = useState(donors);

  const handleViewProfile = (donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  const handleViewHistory = (donor) => {
    setHistoryDonor(donor);
    setIsHistoryModalOpen(true);
  };
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = donors.filter(
      (donor) =>
        donor.name.toLowerCase().includes(value.toLowerCase()) ||
        donor.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDonors(filtered);
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: "Lần hiến gần nhất",
      dataIndex: "lastDonation",
      key: "lastDonation",
    },
    {
      title: "Số lần hiến",
      dataIndex: "donationCount",
      key: "donationCount",
    },
    {
      title: "Tình trạng sức khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (status) => (
        <Tag color={status === "good" ? "green" : "orange"}>
          {status === "good" ? "Tốt" : "Cần chú ý"}
        </Tag>
      ),
    },
    {
      title: "Ngày đủ điều kiện tiếp",
      dataIndex: "nextEligibleDate",
      key: "nextEligibleDate",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleViewProfile(record)} type="primary">
            Xem hồ sơ
          </Button>
          <Button onClick={() => handleViewHistory(record)}>
            Lịch sử hiến máu
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý người hiến máu</h2>

      <Card>
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm theo tên hoặc mã số"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ maxWidth: 400 }}
            onSearch={handleSearch}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredDonors}
          rowKey="id"
          pagination={{
            total: filteredDonors.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người hiến máu`,
          }}
        />
      </Card>
      <Modal
        title="Lịch sử hiến máu"
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsHistoryModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {historyDonor && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {historyDonor.name}
            </Descriptions.Item>
            <Descriptions.Item label="Lần hiến gần nhất">
              {historyDonor.lastDonation}
            </Descriptions.Item>
            <Descriptions.Item label="Số lần hiến">
              {historyDonor.donationCount}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Chi tiết hồ sơ người hiến máu"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        {selectedDonor && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {selectedDonor.name}
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">
              {selectedDonor.bloodType}
            </Descriptions.Item>
            <Descriptions.Item label="Tình trạng sức khỏe">
              {selectedDonor.healthStatus === "good" ? "Tốt" : "Cần chú ý"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đủ điều kiện tiếp">
              {selectedDonor.nextEligibleDate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default DonorsPage;
