/**
 * Trang Tổng Quan (Dashboard) cho bác sĩ/nhân viên y tế
 *
 * Chức năng:
 * - Hiển thị thông tin tổng quan về hệ thống hiến máu
 * - Thống kê số lượng người hiến máu, người nhận máu, đơn vị máu có sẵn
 * - Hiển thị danh sách người hiến máu mới nhất
 * - Hiển thị biểu đồ tồn kho máu theo nhóm máu
 *
 * Giúp bác sĩ/nhân viên y tế:
 * - Nắm bắt nhanh tình hình hoạt động của hệ thống
 * - Theo dõi số lượng người hiến máu và người nhận máu
 * - Kiểm tra tình trạng kho máu và các nhóm máu đang thiếu
 */

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
  UsergroupAddOutlined,
  HeartOutlined,
  BankOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { getAllDonors } from "../../../services/donorsService";
import { getBloodReceiveHistory } from "../../../services/bloodReceiveService";
import { getAllBloodInventory } from "../../../services/bloodInventoryService";

const { Title, Text } = Typography;

// THAY ĐỔI: Thêm hằng số để code dễ đọc và dễ bảo trì
const ML_PER_UNIT = 250;

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
  // THAY ĐỔI: Thêm state để lưu trữ lượng máu tối đa, dùng cho thanh Progress
  const [maxBloodMl, setMaxBloodMl] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [donorsResult, recipientsResult, inventoryResult] =
          await Promise.allSettled([
            getAllDonors(),
            getBloodReceiveHistory(),
            getAllBloodInventory(),
          ]);

        if (donorsResult.status === "fulfilled") {
          const donors = donorsResult.value || [];
          setTotalDonors(donors.length);

          const sortedDonors = donors
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setLatestUsers(sortedDonors);
        } else {
          console.error("Error fetching donors:", donorsResult.reason);
        }

        if (recipientsResult.status === "fulfilled") {
          const recipients = recipientsResult.value || [];
          setTotalRecipients(recipients.length);
        } else {
          console.error("Error fetching recipients:", recipientsResult.reason);
        }
if (inventoryResult.status === "fulfilled") {
          const inventory = inventoryResult.value || [];
          setBloodInventory(inventory);

          // THAY ĐỔI: Tính tổng số đơn vị máu bằng cách chia mỗi item cho 250
          const totalUnits = inventory.reduce(
            (sum, item) => sum + (item.total || 0) / ML_PER_UNIT,
            0
          );
          setTotalBloodUnits(totalUnits);

          // THAY ĐỔI: Tìm lượng máu (ml) lớn nhất để tính toán thanh Progress cho chính xác
          const maxMl = Math.max(
            ...inventory.map((item) => item.total || 0),
            0
          );
          setMaxBloodMl(maxMl);
        } else {
          console.error("Error fetching inventory:", inventoryResult.reason);
        }
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
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (type) => bloodTypeMap[type] || type,
    },
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
          <Col xs={24} sm={12} lg={8}>
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
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Statistic
                title="Tổng đơn nhận máu"
                value={totalRecipients}
prefix={<HeartOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Statistic
                title="Kho máu (đơn vị)"
                value={totalBloodUnits}
                // THAY ĐỔI: Thêm precision để hiển thị số thập phân (ví dụ: 10.5 đơn vị)
                precision={2}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#ffc107" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Người hiến máu mới nhất"
              bordered={false}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
            >
              <Table
                columns={userColumns}
                dataSource={latestUsers}
                rowKey="donorId"
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
              {bloodInventory.map((item) => {
                // THAY ĐỔI: Tính toán số đơn vị cho từng nhóm máu
                const units = (item.total || 0) / ML_PER_UNIT;

                return (
                  <div key={item.bloodType} style={{ marginBottom: "10px" }}>
                    <Text strong>{`Nhóm máu ${
                      bloodTypeMap[item.bloodType] || item.bloodType
                    }`}</Text>
                    <Text style={{ float: "right" }}>
                      {/* THAY ĐỔI: Hiển thị số đơn vị đã tính, làm tròn 2 chữ số thập phân */}
                      {`${units.toFixed(2)} đơn vị`}
                    </Text>
                    <Progress
                      // THAY ĐỔI: Tính phần trăm dựa trên lượng máu lớn nhất trong kho
                      percent={
                        maxBloodMl > 0 ? (item.total / maxBloodMl) * 100 : 0
                      }
                      showInfo={false}
                      // THAY ĐỔI: Đặt trạng thái dựa trên số "đơn vị", ví dụ dưới 10 đơn vị là "exception"
                      status={units < 10 ? "exception" : "success"}
                    />
                  </div>
                );
              })}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;
