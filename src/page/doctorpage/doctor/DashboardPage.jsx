import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Typography,
  Space,
  Avatar,
  message,
  Table,
  Progress,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { getAllDonors } from "../../../services/donorsService";
import { getBloodReceiveHistory } from "../../../services/bloodReceiveService";
import { getAllBloodInventory } from "../../../services/bloodInventoryService";


const { Title, Text } = Typography;

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


const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalRecipients, setTotalRecipients] = useState(0);
  const [totalBloodUnits, setTotalBloodUnits] = useState(0);
  const [latestUsers, setLatestUsers] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          donorsResult,
          recipientsResult,
          inventoryResult,
        ] = await Promise.allSettled([
          getAllDonors(),
          getBloodReceiveHistory(),
          getAllBloodInventory(),
          // Bỏ lời gọi api.get("/user/get-user-by-role")
        ]);

        if (donorsResult.status === 'fulfilled') {
          const donors = donorsResult.value || [];
          setTotalDonors(donors.length);
          
          // Lấy 5 người hiến máu mới nhất từ danh sách donor
          const sortedDonors = donors
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp theo ngày tạo
            .slice(0, 5);
          setLatestUsers(sortedDonors);

        } else {
          console.error("Error fetching donors:", donorsResult.reason);
        }
        
        if (recipientsResult.status === 'fulfilled') {
          const recipients = recipientsResult.value || [];
          setTotalRecipients(recipients.length);
        } else {
          console.error("Error fetching recipients:", recipientsResult.reason);
        }

        if (inventoryResult.status === 'fulfilled') {
          const inventory = inventoryResult.value || [];
          setBloodInventory(inventory);
          const totalUnits = inventory.reduce(
            (sum, item) => sum + (item.unitsAvailable || 0),
            0
          );
          setTotalBloodUnits(totalUnits);
        } else {
          console.error("Error fetching inventory:", inventoryResult.reason);
        }

        // Bỏ logic xử lý usersResult
        
      } catch (error) {
        message.error("Đã có lỗi xảy ra khi tải dữ liệu tổng quan!");
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userColumns = [
    {
      title: "Tên",
      dataIndex: "fullName", // Dùng fullName từ dữ liệu donor
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email", // Dùng email từ dữ liệu donor
      key: "email",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (type) => bloodTypeMap[type] || type,
    },
    // Cột "Vai trò" đã được lược bỏ theo yêu cầu
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Card style={{ marginBottom: 24, borderRadius: "8px" }}>
        <Row align="middle">
          <Space align="center" size="large">
            <Avatar
              size={64}
              icon={<MedicineBoxOutlined />}
              style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
            />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Tổng quan
              </Title>
              <Text type="secondary">
                Thống kê tổng quan về hoạt động hiến và nhận máu.
              </Text>
            </div>
          </Space>
        </Row>
      </Card>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Statistic
                title="Tổng người hiến máu"
                value={totalDonors}
                prefix={<UsergroupAddOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Statistic
                title="Tổng người nhận máu"
                value={totalRecipients}
                prefix={<HeartOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Statistic
                title="Kho máu (đơn vị)"
                value={totalBloodUnits}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#ffc107" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Người dùng mới nhất"
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Table
                columns={userColumns}
                dataSource={latestUsers}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Tình trạng nhóm máu"
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              {bloodInventory.map((item) => (
                <div key={item.bloodType} style={{ marginBottom: "10px" }}>
                  <Text strong>{`Nhóm máu ${bloodTypeMap[item.bloodType] || item.bloodType}`}</Text>
                  <Text style={{ float: 'right' }}>{`${item.unitsAvailable} đơn vị`}</Text>
                  <Progress
                    percent={(item.unitsAvailable / 100) * 100} // Assuming max 100 units for visualisation
                    showInfo={false}
                    status={item.unitsAvailable < 10 ? "exception" : "success"}
                  />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;
