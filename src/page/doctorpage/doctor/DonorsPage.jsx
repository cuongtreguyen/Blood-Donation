import React, { useState } from "react";
import { Table, Input, Select, Row, Col, Card } from "antd";
const { Option } = Select;

// Dữ liệu mock mẫu
const mockDonors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    bloodType: "A+",
    donationCount: 5,
    lastDonation: "2024-05-01",
    email: "a.nguyen@email.com",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    bloodType: "O-",
    donationCount: 2,
    lastDonation: "2024-04-15",
    email: "b.tran@email.com",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0987654321",
    bloodType: "B+",
    donationCount: 7,
    lastDonation: "2024-03-20",
    email: "c.le@email.com",
  },
];

const DonorsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("all");

  const filteredDonors = mockDonors.filter((donor) => {
    const matchName = donor.name.toLowerCase().includes(searchText.toLowerCase());
    const matchBlood = filterBloodType === "all" ? true : donor.bloodType === filterBloodType;
    return matchName && matchBlood;
  });

  const columns = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
    { title: "Số lần hiến", dataIndex: "donationCount", key: "donationCount" },
    { title: "Ngày hiến gần nhất", dataIndex: "lastDonation", key: "lastDonation" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return (
    <div>
      <h1>Danh sách người hiến máu</h1>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            value={filterBloodType}
            onChange={setFilterBloodType}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả nhóm máu</Option>
            <Option value="A+">A+</Option>
            <Option value="A-">A-</Option>
            <Option value="B+">B+</Option>
            <Option value="B-">B-</Option>
            <Option value="O+">O+</Option>
            <Option value="O-">O-</Option>
            <Option value="AB+">AB+</Option>
            <Option value="AB-">AB-</Option>
          </Select>
        </Col>
      </Row>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredDonors}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default DonorsPage;
