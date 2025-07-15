import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Avatar,
  Typography,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Space,
  Spin,
  Empty,
  Select,
  message, // Thêm message để thông báo lỗi
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  getAllDonors,
  getDonationHistoryByUserId,
} from "../../../services/donorsService";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm tạo màu ngẫu nhiên nhưng nhất quán cho Avatar dựa trên ID
const getColorById = (id) => {
  if (!id) return "#ccc";
  const colors = [
    "#ff7a45",
    "#ffc53d",
    "#73d13d",
    "#40a9ff",
    "#597ef7",
    "#9254de",
  ];
  return colors[id % colors.length];
};

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const data = await getAllDonors();
        setDonors(data.map((d) => ({ ...d, key: d.id })));
      } catch (error) {
        console.error("Failed to fetch donors:", error);
        message.error("Không thể tải danh sách người hiến máu.");
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const handleViewHistory = async (donor) => {
    setSelectedDonor(donor);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const history = await getDonationHistoryByUserId(donor.id);
      setDonationHistory(history || []);
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
      message.error(`Không thể tải lịch sử của ${donor.fullName}.`);
      setDonationHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const nameMatch = donor.fullName
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const phoneMatch = donor.phone?.includes(searchText);
      const emailMatch = donor.email
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const bloodTypeMatch =
        bloodTypeFilter === "all" || donor.bloodType === bloodTypeFilter;
      return (nameMatch || phoneMatch || emailMatch) && bloodTypeMatch;
    });
  }, [donors, searchText, bloodTypeFilter]);

  const bloodTypeMap = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };

  const columns = [
    {
      title: "Thông tin người hiến",
      dataIndex: "fullName",
      key: "info",
      render: (_, record) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: getColorById(record.id),
              verticalAlign: "middle",
            }}
            size="large"
          >
            {record.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{record.fullName}</Text>
            <br />
            <Text type="secondary">
              <MailOutlined style={{ marginRight: 6 }} />
              {record.email}
            </Text>
            <br />
            <Text type="secondary">
              <PhoneOutlined style={{ marginRight: 6 }} />
              {record.phone}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center",
      render: (bloodType) => (
        <Tag color="red" style={{ fontSize: 14, padding: "4px 8px" }}>
          {bloodTypeMap[bloodType] || bloodType}
        </Tag>
      ),
    },
    {
      title: "Số lần hiến",
      dataIndex: "unitDonation",
      key: "unitDonation",
      align: "center",
      sorter: (a, b) => a.unitDonation - b.unitDonation,
      render: (count) => <Tag color="blue">{count || 0} lần</Tag>,
    },
    {
      title: "Ngày hiến gần nhất",
      dataIndex: "lastDonation",
      key: "lastDonation",
      sorter: (a, b) =>
        moment(a.lastDonation).unix() - moment(b.lastDonation).unix(),
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "Chưa có"),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<HistoryOutlined />}
          onClick={() => handleViewHistory(record)}
        >
          Xem lịch sử
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      title: "Ngày hiến",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    { title: "Số lượng (ml)", dataIndex: "unit", key: "unit", align: "right" },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: () => "Bệnh viện Trung ương",
    }, // Placeholder data
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Card
        style={{
          marginBottom: 24,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center" size="middle">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#fff1f0", color: "#cf1322" }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Quản lý người hiến máu
                </Title>
                <Text type="secondary">
                  Danh sách chi tiết những người đã tham gia hiến máu.
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Input
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              placeholder="Tìm kiếm theo tên, SĐT, email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Select
              defaultValue="all"
              style={{ width: 180 }}
              onChange={(value) => setBloodTypeFilter(value)}
            >
              <Option value="all">Tất cả nhóm máu</Option>
              {Object.entries(bloodTypeMap).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredDonors}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: true }}
        />
      </Card>

      <Modal
        open={historyModalOpen}
        title={
          <Space>
            <HistoryOutlined />
            <Text>Lịch sử hiến máu của</Text>
            <Text strong>{selectedDonor?.fullName}</Text>
          </Space>
        }
        onCancel={() => setHistoryModalOpen(false)}
        footer={
          <Button onClick={() => setHistoryModalOpen(false)}>Đóng</Button>
        }
        width={700}
      >
        <Spin spinning={historyLoading} tip="Đang tải lịch sử...">
          {donationHistory.length === 0 && !historyLoading ? (
            <Empty
              image={
                <HeartOutlined style={{ fontSize: 60, color: "#f7d9d9" }} />
              }
              description={
                <Text type="secondary">
                  Người này chưa có lịch sử hiến máu nào.
                </Text>
              }
            />
          ) : (
            <Table
              columns={historyColumns}
              dataSource={donationHistory}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default DonorsPage;
