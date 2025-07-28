/**
 * Trang Danh Sách Hiến Máu (Quản lý đăng ký hiến máu)
 * 
 * Chức năng:
 * - Hiển thị danh sách đăng ký hiến máu của người dùng
 * - Lọc danh sách theo trạng thái (Chờ duyệt, Đã duyệt, Hoàn thành, Từ chối)
 * - Duyệt/từ chối đăng ký hiến máu
 * - Hoàn thành quy trình hiến máu (nhập thông tin hiến máu)
 * - Tạo phiếu khám sức khỏe cho người hiến máu
 * 
 * Giúp bác sĩ/nhân viên y tế:
 * - Quản lý quy trình hiến máu từ đăng ký đến hoàn thành
 * - Theo dõi trạng thái của các đăng ký hiến máu
 * - Nhập thông tin chi tiết về lượng máu hiến và ngày hoàn thành
 * - Tạo và quản lý phiếu khám sức khỏe cho người hiến máu
 */

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Segmented,
  message,
  Spin,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Avatar,
} from "antd";
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import {
  getBloodRegisterByStatus,
  updateBloodRegisterStatus,
  completeBloodRegister,
} from "../../../services/bloodRegisterService";
import { getHealthCheckList } from "../../../services/healthCheckService";
import api from "../../../config/api";
import dayjs from "dayjs";
import HealthCheckForm from "../../../components/forms/HealthCheckForm";

const { Title, Text } = Typography;

const statusColors = {
  APPROVED: "blue",
  COMPLETED: "green",
  REJECTED: "red",
  PENDING: "orange",
  INCOMPLETED: "gray",
};

const statusIcons = {
  APPROVED: <CheckCircleOutlined />,
  COMPLETED: <CheckCircleOutlined />,
  REJECTED: <CloseCircleOutlined />,
  PENDING: <ClockCircleOutlined />,
  INCOMPLETED: <WarningOutlined />,
};

const statusOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Từ chối", value: "REJECTED" },
];

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

const DonorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeRecord, setCompleteRecord] = useState(null);
  const [completeForm] = Form.useForm();
  const [healthCheckModalOpen, setHealthCheckModalOpen] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [healthCheckStatus, setHealthCheckStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // === BƯỚC 1: LẤY DỮ LIỆU CẦN THIẾT ===
        // Lấy danh sách đăng ký hiến máu dựa trên bộ lọc trạng thái
        let registerPromise;
        if (status === "ALL") {
          const allStatuses = statusOptions
            .map((opt) => opt.value)
            .filter((v) => v !== "ALL");
          registerPromise = getBloodRegisterByStatus(allStatuses);
        } else {
          registerPromise = getBloodRegisterByStatus(status);
        }
        
        // Lấy TẤT CẢ danh sách phiếu khám sức khỏe chỉ với MỘT lần gọi API
        const healthCheckPromise = getHealthCheckList();

        // Thực thi đồng thời 2 lời gọi API để tăng tốc độ
        const [registerRes, healthChecksRes] = await Promise.all([
          registerPromise,
          healthCheckPromise
        ]);

        const allHealthChecks = healthChecksRes.data || [];
        
        // Tạo một Set chứa các 'bloodRegisterId' đã có phiếu khám để tra cứu nhanh (O(1))
        const checkedRegisterIds = new Set(
          allHealthChecks.map(check => check.bloodRegisterId)
        );

        // === BƯỚC 2: XỬ LÝ VÀ KẾT HỢP DỮ LIỆU ===
        const bloodRegisters = registerRes || [];
        const dataWithUser = await Promise.all(
          bloodRegisters.map(async (item) => {
            let userInfo = {};
            if (item.user_id) {
              try {
                const userRes = await api.get(`/user/${item.user_id}`);
                userInfo = userRes.data || {};
              } catch {
                userInfo = {}; // Bỏ qua nếu lỗi, không làm gián đoạn
              }
            }
            return {
              id: item.id,
              name: userInfo.fullName || item.fullName || item.name || "Chưa có",
              bloodType: item.bloodType || item.blood?.bloodType || userInfo.bloodType || "Chưa xác định",
              quantity: item.blood?.unit || item.quantity || item.amount || 1,
              wantedHour: item.wantedHour || item.blood?.wantedHour || item.hour || "",
              wantedDate: item.wantedDate || item.blood?.donationDate || item.registerDate || item.created_at || "",
              status: item.status,
              address: userInfo.address || item.address || "",
              user_id: item.user_id, // Giữ lại user_id để dùng sau
            };
          })
        );

        // Tạo map trạng thái khám sức khỏe bằng cách tra cứu trong Set, không cần gọi API
        const healthCheckStatusMap = {};
        dataWithUser.forEach(item => {
          healthCheckStatusMap[item.id] = checkedRegisterIds.has(item.id);
        });

        // === BƯỚC 3: CẬP NHẬT STATE ===
        setHealthCheckStatus(healthCheckStatusMap);
        setData(dataWithUser.slice().sort((a, b) => b.id - a.id));

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải danh sách đăng ký. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  const handleIncomplete = async (record) => {
    try {
      await updateBloodRegisterStatus(record.id, "INCOMPLETED");
      message.success("Đã đánh dấu chưa hoàn thành!");
      setData((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, status: "INCOMPLETED" } : item
        )
      );
      // Cân nhắc có nên chuyển về 'ALL' hay không, hoặc chỉ cập nhật tại chỗ
      // setStatus("ALL");
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleOpenCompleteModal = (record) => {
    const hasHealthCheck = healthCheckStatus[record.id];

    if (hasHealthCheck) {
      setCompleteRecord(record);
      setCompleteModalOpen(true);
      completeForm.setFieldsValue({
        implementationDate: dayjs(),
        unit: record.quantity,
      });
    } else {
      message.error("Đơn đăng ký chưa có kiểm tra sức khỏe, không thể hoàn thành!");
    }
  };

  const handleCompleteSubmit = async (values) => {
    setCompleteLoading(true);
    try {
      await completeBloodRegister({
        bloodId: completeRecord.id, 
        implementationDate: values.implementationDate.format("YYYY-MM-DD"),
        unit: values.unit,
      });
      message.success("Đã đánh dấu hoàn thành!");
      setData((prev) =>
        prev.map((item) =>
          item.id === completeRecord.id
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
      setCompleteModalOpen(false);
      setCompleteRecord(null);
      completeForm.resetFields();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi hoàn thành đăng ký!";
      message.error(errorMessage);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleOpenHealthCheckModal = async (record) => {
    let merged = { ...record };
    // Không cần gọi lại api user vì đã có đủ thông tin trong 'record'
    setSelectedRegister(merged);
    setHealthCheckModalOpen(true);
  };

  const handleHealthCheckSuccess = () => {
    setHealthCheckModalOpen(false);
    if (selectedRegister) {
      // Cập nhật trạng thái ngay trên UI mà không cần gọi lại API
      setHealthCheckStatus((prev) => ({
        ...prev,
        [selectedRegister.id]: true,
      }));
    }
    message.success("Phiếu kiểm tra sức khỏe đã được lưu thành công!");
  };

  let filteredData =
    status === "ALL" ? data : data.filter((item) => item.status === status);

  if (searchText) {
    filteredData = filteredData.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80, sorter: (a, b) => a.id - b.id, sortDirections: ['descend', 'ascend'] },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />}>{name?.[0]?.toUpperCase()}</Avatar>
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text) => <Tag color="red">{bloodTypeMap[text] || text}</Tag>,
    },
    {
      title: "Thời gian đăng ký",
      dataIndex: "wantedDate",
      key: "time",
      render: (date, record) => (
        <div>
          <Text>
            {record.wantedHour ? record.wantedHour.substring(0, 5) : "N/A"}
          </Text>
          <br />
          <Text type="secondary">
            {date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} icon={statusIcons[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => {
        if (record.status === "APPROVED") {
          return (
            <Space>
              <Button
                type="primary"
                onClick={() => handleOpenCompleteModal(record)}
                disabled={!healthCheckStatus[record.id]} // Vô hiệu hóa nếu chưa khám
              >
                Hoàn thành
              </Button>
              <Button danger onClick={() => handleIncomplete(record)}>
                Chưa hoàn thành
              </Button>
              {/* Chỉ hiện nút 'Khám SK' nếu chưa có phiếu khám */}
              {!healthCheckStatus[record.id] && (
                <Button onClick={() => handleOpenHealthCheckModal(record)}>
                  Khám SK
                </Button>
              )}
            </Space>
          );
        }
        return <Text type="secondary">N/A</Text>;
      },
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
                Danh sách Hiến Máu
              </Title>
              <Text type="secondary">
                Quản lý, duyệt và theo dõi các đơn đăng ký hiến máu từ người dùng.
              </Text>
            </div>
          </Space>
        </Row>
      </Card>
      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Segmented
              options={statusOptions}
              value={status}
              onChange={setStatus}
              size="large"
            />
          </Col>
          <Col>
            <Input
              placeholder="Tìm theo tên, địa chỉ..."
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Col>
        </Row>
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>
      <Modal
        open={completeModalOpen}
        title="Xác nhận hoàn thành đăng ký"
        onCancel={() => setCompleteModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleCompleteSubmit}
        >
          <Form.Item
            label="Ngày thực hiện"
            name="implementationDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Lượng máu thực tế (ml)"
            name="unit"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" min={1} addonAfter="ml" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={completeLoading}
              block
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={healthCheckModalOpen}
        title="Phiếu kiểm tra sức khỏe người hiến máu"
        onCancel={() => setHealthCheckModalOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedRegister && (
          <HealthCheckForm
            donorInfo={selectedRegister}
            onSuccess={handleHealthCheckSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default DonorsPage;