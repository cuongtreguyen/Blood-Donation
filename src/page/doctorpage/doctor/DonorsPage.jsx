import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Modal,
  Spin,
  message,
} from "antd";
import {
  getAllDonors,
  getDonationHistoryByUserId,
} from "../../../services/donorsService";
import moment from "moment";

const { Option } = Select;

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("all");

  // State cho modal lịch sử hiến máu
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedDonorName, setSelectedDonorName] = useState("");

  /* -------------------- Fetch danh sách người hiến -------------------- */
  const loadDonors = async () => {
    setLoading(true);
    try {
      const data = await getAllDonors();
      setDonors(data);
    } catch (e) {
      message.error("Không thể tải danh sách người hiến.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  /* -------------------- Xử lý lọc / tìm kiếm -------------------- */
  const filteredDonors = donors.filter((d) => {
    const matchName = d.fullName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchBlood =
      filterBloodType === "all" ? true : d.bloodType === filterBloodType;
    return matchName && matchBlood;
  });

  /* -------------------- Xem lịch sử hiến -------------------- */
  const openHistoryModal = async (record) => {
    setSelectedDonorName(record.fullName);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const data = await getDonationHistoryByUserId(record.id);
      setHistoryData(data);
    } catch (e) {
      message.error("Không thể tải lịch sử hiến máu.");
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* -------------------- Cột của bảng chính -------------------- */
  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (t) => <Tag color="red">{t}</Tag>,
    },
    {
      title: "Số lần hiến",
      dataIndex: "donationCount",
      key: "donationCount",
      sorter: (a, b) => a.donationCount - b.donationCount,
    },
    {
      title: "Ngày hiến gần nhất",
      dataIndex: "lastDonation",
      render: (d) => {
        const date = moment(d);
        return date.isValid() ? date.format("DD/MM/YYYY") : "Chưa có";
      },
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => openHistoryModal(record)}>
          Xem lịch sử
        </Button>
      ),
    },
  ];

  /* -------------------- Cột của bảng lịch sử -------------------- */
  const historyColumns = [
    { title: "Mã đơn", dataIndex: "id", key: "id" },
    {
      title: "Ngày hiến",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (d) => moment(d).format("DD/MM/YYYY"),
    },
    {
      title: "Lượng máu (ml)",
      dataIndex: "unit",
      key: "unit",
      render: (u) => `${u} ml`,
    },
  ];

  return (
    <div>
      <h1>Danh sách người hiến máu</h1>

      {/* Bộ lọc */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
        </Col>
        <Col>
          <Select
            value={filterBloodType}
            onChange={setFilterBloodType}
            style={{ width: 180 }}
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

      {/* Bảng danh sách */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredDonors}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          loading={loading}
        />
      </Card>

      {/* Modal lịch sử hiến máu */}
      <Modal
        title={`Lịch sử hiến máu – ${selectedDonorName}`}
        open={historyModalOpen}
        onCancel={() => {
          setHistoryModalOpen(false);
          setHistoryData([]);
        }}
        footer={null}
        width={600}
      >
        {historyLoading ? (
          <Spin tip="Đang tải lịch sử..." />
        ) : (
          <Table
            columns={historyColumns}
            dataSource={historyData}
            rowKey="id"
            pagination={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default DonorsPage;
