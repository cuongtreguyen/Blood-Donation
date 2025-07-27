import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Spin,
  Empty,
  message,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  CalendarOutlined,
  HeartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getUserCertificates } from "../../services/certificateService";
import { downloadCertificateFile } from "../../components/CertificateGenerator";
import moment from "moment";

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

const CertificatesComponent = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserCertificates(user.id);
      setCertificates(data || []);
    } catch (error) {
      console.error("Lỗi khi tải giấy chứng nhận:", error);
      message.error("Không thể tải danh sách giấy chứng nhận.");
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewModalOpen(true);
  };

  const handleDownloadCertificate = async (certificate) => {
    setDownloadLoading(true);
    try {
      // Tạo PDF từ dữ liệu certificate
      const donationData = {
        id: certificate.donationId,
        fullName: user.fullName,
        completedDate: certificate.donationDate,
        bloodType: certificate.bloodType,
        unit: certificate.amount,
        location: certificate.location || "Bệnh viện Trung ương",
        doctorName: certificate.doctorName,
      };

      downloadCertificateFile(donationData, certificate.doctorName);
      message.success("Đã tải giấy chứng nhận thành công!");
    } catch (error) {
      console.error("Lỗi khi tải certificate:", error);
      message.error("Không thể tải giấy chứng nhận. Vui lòng thử lại!");
    } finally {
      setDownloadLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã chứng nhận",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Text code>#{id}</Text>
      ),
    },
    {
      title: "Ngày hiến máu",
      dataIndex: "donationDate",
      key: "donationDate",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {moment(date).format("DD/MM/YYYY")}
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (bloodType) => (
        <Tag color="red" style={{ fontSize: 12 }}>
          {bloodTypeMap[bloodType] || bloodType}
        </Tag>
      ),
    },
    {
      title: "Lượng máu",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Space>
          <HeartOutlined style={{ color: "#cf1322" }} />
          <Text strong>{amount} ml</Text>
        </Space>
      ),
    },
    {
      title: "Bác sĩ phụ trách",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => handleViewCertificate(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadCertificate(record)}
            loading={downloadLoading}
            size="small"
          >
            Tải
          </Button>
        </Space>
      ),
    },
  ];

  const getStatistics = () => {
    if (!certificates.length) return { total: 0, totalAmount: 0, latest: null };
    
    const totalAmount = certificates.reduce((sum, cert) => sum + (cert.amount || 0), 0);
    const latest = certificates.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))[0];
    
    return {
      total: certificates.length,
      totalAmount,
      latest: latest?.donationDate
    };
  };

  const stats = getStatistics();

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <div className="mb-8">
        <Title level={2} className="mb-4">
          <FileTextOutlined className="mr-3 text-red-600" />
          Giấy chứng nhận hiến máu
        </Title>
        <Text type="secondary">
          Xem và tải xuống các giấy chứng nhận hiến máu của bạn
        </Text>
      </div>

      {/* Thống kê */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số giấy chứng nhận"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng lượng máu hiến"
              value={stats.totalAmount}
              suffix="ml"
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Lần hiến gần nhất"
              value={stats.latest ? moment(stats.latest).format("DD/MM/YYYY") : "Chưa có"}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng giấy chứng nhận */}
      <Card>
        <Spin spinning={loading}>
          {certificates.length === 0 ? (
            <Empty
              image={<FileTextOutlined style={{ fontSize: 60, color: "#d9d9d9" }} />}
              description={
                <div>
                  <Text type="secondary">Bạn chưa có giấy chứng nhận hiến máu nào.</Text>
                  <br />
                  <Text type="secondary">Giấy chứng nhận sẽ được tạo sau khi hoàn thành hiến máu.</Text>
                </div>
              }
            />
          ) : (
            <Table
              columns={columns}
              dataSource={certificates}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} giấy chứng nhận`,
              }}
            />
          )}
        </Spin>
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <Text>Chi tiết giấy chứng nhận</Text>
          </Space>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => handleDownloadCertificate(selectedCertificate)}>
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedCertificate && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã chứng nhận" span={2}>
              <Text code>#{selectedCertificate.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hiến máu">
              {moment(selectedCertificate.donationDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">
              <Tag color="red">{bloodTypeMap[selectedCertificate.bloodType] || selectedCertificate.bloodType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lượng máu hiến">
              <Text strong>{selectedCertificate.amount} ml</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ phụ trách">
              {selectedCertificate.doctorName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm hiến máu" span={2}>
              {selectedCertificate.location || "Bệnh viện Trung ương"}
            </Descriptions.Item>
            {selectedCertificate.notes && (
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedCertificate.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CertificatesComponent; 