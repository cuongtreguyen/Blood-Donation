/**
 * Trang Quản Lý Người Hiến Máu
 * 
 * Chức năng:
 * - Hiển thị danh sách tất cả người hiến máu trong hệ thống
 * - Xem thông tin chi tiết của người hiến máu (tên, email, số điện thoại, nhóm máu)
 * - Xem lịch sử hiến máu của từng người hiến
 * - Tìm kiếm người hiến máu theo tên, số điện thoại, email
 * - Lọc người hiến máu theo nhóm máu
 * - Hiển thị số lần hiến máu thực tế của mỗi người hiến
 * 
 * Giúp bác sĩ/nhân viên y tế:
 * - Quản lý thông tin của tất cả người hiến máu
 * - Theo dõi lịch sử hiến máu của từng người hiến
 * - Tìm kiếm nhanh người hiến máu khi cần
 * - Đánh giá mức độ tham gia hiến máu của người hiến
 */

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
  message,
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartOutlined,
  InfoCircleOutlined,
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

  // Hàm tính số lần hiến thực tế từ lịch sử
  const getRealDonationCount = async (donorId) => {
    try {
      const history = await getDonationHistoryByUserId(donorId);
      const validHistory = (history || []).filter((item) => {
        const hasValidDate =
          item.completedDate &&
          item.completedDate !== "N/A" &&
          item.completedDate !== null &&
          item.completedDate !== undefined;

        const hasValidUnit =
          item.unit &&
          item.unit > 0 &&
          item.unit !== "N/A" &&
          item.unit !== null &&
          item.unit !== undefined;

        return hasValidDate && hasValidUnit;
      });
      return validHistory.length;
    } catch (error) {
      console.error("Lỗi khi tính số lần hiến thực tế:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const data = await getAllDonors();

        // Tính toán số lần hiến thực tế cho mỗi donor
        const donorsWithRealCount = await Promise.all(
          data.map(async (donor, index) => {
            const realCount = await getRealDonationCount(donor.id);
            return {
              ...donor,
              key: `${donor.id}_${index}`, // Tạo key unique
              realDonationCount: realCount,
            };
          })
        );

        // Loại bỏ dữ liệu trùng lặp dựa trên ID
        const uniqueDonors = donorsWithRealCount.filter(
          (donor, index, self) =>
            index === self.findIndex((d) => d.id === donor.id)
        );

        setDonors(uniqueDonors);
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
      console.log("Raw history data for", donor.fullName, ":", history); // Debug log

      // Lọc và xử lý dữ liệu để đảm bảo tính nhất quán
      const validHistory = (history || []).filter((item) => {
        console.log("Checking item:", item); // Debug log cho từng item

        // Kiểm tra ngày hoàn thành
        const hasValidDate =
          item.completedDate &&
          item.completedDate !== "N/A" &&
          item.completedDate !== null &&
          item.completedDate !== undefined;

        // Kiểm tra số lượng
        const hasValidUnit =
          item.unit &&
          item.unit > 0 &&
          item.unit !== "N/A" &&
          item.unit !== null &&
          item.unit !== undefined;

        const isValid = hasValidDate && hasValidUnit;
        console.log("Item validation:", {
          hasValidDate,
          hasValidUnit,
          isValid,
        }); // Debug log

        return isValid;
      });

      console.log(
        "Filtered history data for",
        donor.fullName,
        ":",
        validHistory
      ); // Debug log
      setDonationHistory(validHistory);

      // Kiểm tra sự khác biệt giữa số lần hiến hiển thị và thực tế
      const displayedCount = donor.realDonationCount || 0;
      const actualCount = validHistory.length;

      console.log("Count comparison:", { displayedCount, actualCount }); // Debug log

      if (displayedCount !== actualCount) {
        message.warning(
          `Số lần hiến hiển thị (${displayedCount}) khác với số lần hiến thực tế (${actualCount}). ` +
            `Có thể có các bản ghi chưa hoàn thành hoặc dữ liệu không hợp lệ.`
        );
      }
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
      dataIndex: "realDonationCount",
      key: "realDonationCount",
      align: "center",
      sorter: (a, b) => (a.realDonationCount || 0) - (b.realDonationCount || 0),
      render: (_, record) => (
        <Tag color="blue">{record.realDonationCount || 0} lần</Tag>
      ),
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
          rowKey="key"
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
            <>
              {donationHistory.length > 0 && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "8px 12px",
                    backgroundColor: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    borderRadius: "6px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <InfoCircleOutlined style={{ marginRight: 4 }} />
                    Chỉ hiển thị các lần hiến máu đã hoàn thành với dữ liệu đầy
                    đủ.
                  </Text>
                </div>
              )}
              {donationHistory.length === 0 && !historyLoading && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "8px 12px",
                    backgroundColor: "#fff2e8",
                    border: "1px solid #ffbb96",
                    borderRadius: "6px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <InfoCircleOutlined style={{ marginRight: 4 }} />
                    Không tìm thấy lịch sử hiến máu hợp lệ. Có thể có các bản
                    ghi chưa hoàn thành hoặc dữ liệu không đầy đủ.
                  </Text>
                </div>
              )}
              <Table
                columns={historyColumns}
                dataSource={donationHistory.map((item, index) => ({
                  ...item,
                  key: `${item.id}_${index}`,
                }))}
                rowKey="key"
                pagination={false}
                size="middle"
              />
            </>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default DonorsPage;
