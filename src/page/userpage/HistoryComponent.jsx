import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaHistory,
  FaTint,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInbox,
} from "react-icons/fa";
import api from "../../config/api";
import html2pdf from "html2pdf.js";

// ⚙️ Hàm định dạng ngày tháng theo chuẩn Việt Nam
const formatDate = (dateString) => {
  if (!dateString) return "Không rõ ngày";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// 🎨 Hàm tạo HTML template cho chứng nhận
const createCertificateHTML = (certificateData, donationData) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chứng Nhận Hiến Máu Tình Nguyện</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-red: #a41e21;
            --accent-gold: #c9a86a;
            --text-dark: #333333;
            --text-light: #555555;
            --background-light: #fdfbf7;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Lato', sans-serif;
            background: #f1f1f1;
            padding: 40px 20px;
            color: var(--text-dark);
        }
        
        .certificate-container {
            max-width: 840px;
            min-height: 594px;
            margin: 0 auto;
            background: var(--background-light);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .certificate-container::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 2px solid var(--accent-gold);
            pointer-events: none;
        }
        
        .certificate-container::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px solid var(--primary-red);
            pointer-events: none;
        }

        .certificate-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .header-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            background-image: url("https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        .main-title {
            font-family: 'Merriweather', serif;
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-red);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .subtitle {
            font-size: 16px;
            color: var(--text-light);
            letter-spacing: 1px;
        }

        .certificate-body {
            text-align: center;
            padding: 20px 0;
            flex-grow: 1;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a41e21' opacity='0.05'%3E%3Cpath d='M12 2C7.58 2 4 5.58 4 10c0 4.42 8 12 8 12s8-7.58 8-12c0-4.42-3.58-8-8-8zm-1.5 10.5H9v-3h1.5v3zm3 0h-1.5v-3H15v3z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 50%;
        }

        .acknowledgement-text {
            font-size: 18px;
            line-height: 1.7;
            color: var(--text-light);
            margin: 20px 0;
        }
        
        .donor-name {
            font-family: 'Merriweather', serif;
            font-size: 36px;
            color: var(--primary-red);
            font-weight: 700;
            margin: 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--accent-gold);
            display: inline-block;
        }
        
        .donation-details {
            width: 80%;
            margin: 30px auto;
            border-collapse: collapse;
        }

        .donation-details td {
            padding: 12px;
            font-size: 16px;
            border-bottom: 1px solid #eee;
        }

        .donation-details .detail-label {
            font-weight: 700;
            color: var(--primary-red);
            text-align: left;
        }
        
        .donation-details .detail-value {
            text-align: right;
            font-weight: 400;
            color: var(--text-dark);
        }

        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 40px;
        }
        
        .signature-block {
            text-align: center;
            width: 40%;
        }
        
        .signature-title {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 50px;
        }
        
        .signature-line {
            border-top: 1px dotted var(--text-dark);
            padding-top: 8px;
            font-size: 16px;
            font-weight: 700;
        }
        
        .certificate-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .certificate-container {
                box-shadow: none;
                margin: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <header class="certificate-header">
            <div class="header-logo"></div>
            <h1 class="main-title">Chứng Nhận Hiến Máu Tình Nguyện</h1>
            <p class="subtitle">Certificate of Voluntary Blood Donation</p>
        </header>
        
        <main class="certificate-body">
            <p class="acknowledgement-text">Trân trọng chứng nhận và ghi nhận nghĩa cử cao đẹp của:</p>
            
            <div class="donor-name">${certificateData.donorName}</div>
            
            <p class="acknowledgement-text">
                Đã tình nguyện hiến máu cứu người, một hành động nhân văn sâu sắc.
            </p>
            
            <table class="donation-details">
                <tbody>
                    <tr>
                        <td class="detail-label">Ngày hiến máu:</td>
                        <td class="detail-value">${formatDate(donationData.completedDate)}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Lượng máu đã hiến:</td>
                        <td class="detail-value">${donationData.unit} ml</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Ngày cấp chứng nhận:</td>
                        <td class="detail-value">${formatDate(certificateData.issueDate)}</td>
                    </tr>
                </tbody>
            </table>
        </main>
        
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-title">Người Hiến Máu</div>
                <div class="signature-line">${certificateData.donorName}</div>
            </div>
            <div class="signature-block">
                <div class="signature-title">Đại Diện Đơn Vị Tiếp Nhận</div>
                <div class="signature-line">${certificateData.staffName}</div>
            </div>
        </div>

        <footer class="certificate-footer">
            <p>Trung tâm Huyết học - Truyền máu Quốc gia</p>
            <p>Mỗi giọt máu cho đi, một cuộc đời ở lại. Xin chân thành cảm ơn!</p>
        </footer>
    </div>
</body>
</html>`;
};

// 🔻 Component thể hiện một mục hiến máu trong timeline
const HistoryItem = ({ donation, isLast, isDonation = true }) => {
  const handleDownload = async () => {
    if (isDonation) {
      try {
        const response = await api.get(`/certificates/get-certificate-by-id/${donation.certificateId}`);
        const certificateData = response.data;
        
        const htmlContent = createCertificateHTML(certificateData, donation);
        
        // Create a temporary container for the HTML content
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        document.body.appendChild(element);

        // Configure html2pdf options
        const opt = {
          margin: 0,
          filename: `ChungNhanHienMau-${donation.certificateId}-${certificateData.donorName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate and download PDF
        await html2pdf().from(element).set(opt).save();
        
        // Clean up
        document.body.removeChild(element);
      } catch (error) {
        alert("Không thể tải chứng nhận hiến máu. Đơn có thể không tồn tại.");
        console.error("Lỗi khi tải chứng nhận:", error);
      }
    }
  };

  // Lấy ngày đúng dựa trên loại (hiến máu hoặc nhận máu)
  const getDate = () => {
    if (isDonation) {
      return donation.completedDate;
    } else {
      return donation.receiveDate; // Sử dụng receiveDate cho nhận máu
    }
  };

  return (
    <div className="relative pl-12 pb-8">
      <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-8 ring-white">
        <FaTint className="h-3 w-3 text-white" />
      </div>

      {!isLast && <div className="absolute left-3 top-8 h-full w-0.5 bg-red-200"></div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-red-50 border border-red-100 rounded-xl shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FaCalendarAlt />
            <span>{formatDate(getDate())}</span>
          </div>
          <p className="font-bold text-xl text-gray-800">
            {donation.fullName || "Tình nguyện viên ẩn danh"}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 text-right">
          <p className="font-bold text-2xl text-red-600">
            {donation.unit}
            <span className="text-lg font-medium ml-1">ml</span>
          </p>
          {isDonation && (
            <button
              onClick={handleDownload}
              className="mt-3 px-4 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tải chứng nhận
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ⏳ Component loader giả lập trạng thái loading
const SkeletonLoader = () => (
  <div className="space-y-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    ))}
  </div>
);

// 🧠 Component chính hiển thị lịch sử hiến máu và nhận máu
const HistoryComponent = ({ userId: propUserId }) => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [receiveHistory, setReceiveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user);
  const userId = propUserId || user?.id;

  useEffect(() => {
    const fetchHistories = async () => {
      if (!userId) {
        setLoading(false);
        setDonationHistory([]);
        setReceiveHistory([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Lấy lịch sử hiến máu
        const donationResponse = await api.get(`/blood-register/history/${userId}`);
        const sortedDonationHistory = donationResponse.data.sort(
          (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
        );
        setDonationHistory(sortedDonationHistory);

        // Lấy lịch sử nhận máu (giả định endpoint)
        const receiveResponse = await api.get(`/blood-receive/get-list-receive-by-user-id?userId=${userId}`);
        const sortedReceiveHistory = receiveResponse.data.sort(
          (a, b) => new Date(b.receiveDate) - new Date(a.receiveDate)
        );
        setReceiveHistory(sortedReceiveHistory);
      } catch (err) {
        console.error("Failed to fetch histories:", err);
        setError("Không thể tải lịch sử. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, [userId]);

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;

    if (error)
      return (
        <div className="text-center py-12">
          <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      );

    return (
      <div className="relative">
        {/* Lịch sử hiến máu */}
        {donationHistory.length > 0 && (
          <>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Lịch sử hiến máu</h3>
            {donationHistory.map((donation, index) => (
              <HistoryItem
                key={donation.id || index}
                donation={donation}
                isLast={index === donationHistory.length - 1}
                isDonation={true}
              />
            ))}
          </>
        )}

        {/* Lịch sử nhận máu */}
        {receiveHistory.length > 0 && (
          <>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4">Lịch sử nhận máu</h3>
            {receiveHistory.map((receive, index) => (
              <HistoryItem
                key={receive.id || index}
                donation={receive}
                isLast={index === receiveHistory.length - 1}
                isDonation={false}
              />
            ))}
          </>
        )}

        {donationHistory.length === 0 && receiveHistory.length === 0 && (
          <div className="text-center py-12">
            <FaInbox className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-700">Chưa có lịch sử</p>
            <p className="text-gray-500 mt-2">
              Mỗi lần hiến máu của bạn là một món quà vô giá.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 rounded-full">
          <FaHistory className="text-red-600 text-2xl" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Lịch sử hiến máu và nhận máu
        </h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default HistoryComponent;