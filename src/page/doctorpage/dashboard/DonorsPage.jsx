import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import {
  getAllDonors,
  getDonationHistoryByUserId,
} from "../../../services/donorsService";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const data = await getAllDonors();
      
        setDonors(data);
   
        
      } catch {
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const handleViewHistory = async (userId) => {
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const history = await getDonationHistoryByUserId(userId);
      setDonationHistory(history);
    } catch {
      setDonationHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };
 
  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
    { title: "Số lần hiến", dataIndex: "unitDonation", key: "unitDonation" },
    {
      title: "Ngày hiến gần nhất",
      dataIndex: "lastDonation",
      key: "lastDonation",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleViewHistory(record.id)}>
          Xem lịch sử
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Danh sách người hiến máu
      </h2>
      <Table
        columns={columns}
        dataSource={donors}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        open={historyModalOpen}
        title="Lịch sử hiến máu"
        onCancel={() => setHistoryModalOpen(false)}
        footer={null}
        width={600}
      >
        {historyLoading ? (
          <div>Đang tải...</div>
        ) : donationHistory.length === 0 ? (
          <div>Chưa có lịch sử hiến máu.</div>
        ) : (
          <Table
            columns={[
              {
                title: "Ngày hoàn thành",
                dataIndex: "completedDate",
                key: "completedDate",
              },
              { title: 'Số đơn vị', dataIndex: 'unit', key: 'unit' },
             
            ]}
            dataSource={donationHistory}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Modal>
    </div>
  );
};

export default DonorsPage;
