
// import React, { useEffect, useState } from "react";
// import { FaHistory } from "react-icons/fa";
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// const HistoryComponent = ({ userId: propUserId }) => {
//   const [donationHistory, setDonationHistory] = useState([]);
//   const user = useSelector((state) => state.user);
// const userId = propUserId || user.id;

//   useEffect(() => {
//     const fetchDonationHistory = async () => {
//       try {
//         if (!userId) {
//           setDonationHistory([]);
//           return;
//         }
//         const response = await api.get(`/blood-register/history/${userId}`);
//         setDonationHistory(response.data);
//       } catch {
//         setDonationHistory([]);
//       }
//     };
//     fetchDonationHistory();
//   }, [userId]);

//   return (
//     <div className="bg-white p-8 rounded-xl shadow-2xl">
//       <h3 className="text-2xl font-bold mb-6 text-gray-800">
//         Lịch sử hiến máu
//       </h3>
//       <div className="space-y-6">
//         {donationHistory.length === 0 ? (
//           <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
//         ) : (
//           donationHistory.map((donation, index) => (
//             <div
//               key={index}
//               className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold text-lg text-gray-800">
//                     {donation.fullName || "Ẩn danh"}
//                   </p>
//                   <p className="text-gray-600">{donation.completedDate}</p>
//                 </div>
//                 <div className="text-red-600 font-bold text-lg">
//                   {donation.unit} ml
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryComponent;












// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { FaHistory, FaTint, FaCalendarAlt, FaExclamationTriangle, FaInbox } from "react-icons/fa";
// import api from "../../config/api";

// // Helper function để định dạng ngày tháng
// const formatDate = (dateString) => {
//   if (!dateString) return "Không rõ ngày";
//   return new Date(dateString).toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// // Component cho một mục trong lịch sử (Timeline Item)
// const HistoryItem = ({ donation, isLast }) => (
//   <div className="relative pl-12 pb-8">
//     {/* Dấu chấm trên timeline */}
//     <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-8 ring-white">
//       <FaTint className="h-3 w-3 text-white" />
//     </div>
//     {/* Đường kẻ dọc của timeline */}
//     {!isLast && (
//       <div className="absolute left-3 top-8 h-full w-0.5 bg-red-200"></div>
//     )}

//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-red-50 border border-red-100 rounded-xl shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300">
//       <div>
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
//           <FaCalendarAlt />
//           <span>{formatDate(donation.completedDate)}</span>
//         </div>
//         <p className="font-bold text-xl text-gray-800">
//           {donation.fullName || "Tình nguyện viên ẩn danh"}
//         </p>
//       </div>
//       <div className="mt-4 sm:mt-0 text-right">
//         <p className="font-bold text-2xl text-red-600">
//           {donation.unit}
//           <span className="text-lg font-medium ml-1">ml</span>
//         </p>
//       </div>
//     </div>
//   </div>
// );

// // Component Skeleton cho trạng thái đang tải
// const SkeletonLoader = () => (
//   <div className="space-y-8">
//     {[...Array(3)].map((_, i) => (
//       <div key={i} className="flex gap-4 animate-pulse">
//         <div className="h-12 w-12 rounded-full bg-gray-200"></div>
//         <div className="flex-1 space-y-3">
//           <div className="h-4 w-3/4 rounded bg-gray-200"></div>
//           <div className="h-4 w-1/2 rounded bg-gray-200"></div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const HistoryComponent = ({ userId: propUserId }) => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const user = useSelector((state) => state.user);
//   const userId = propUserId || user?.id;

//   useEffect(() => {
//     const fetchDonationHistory = async () => {
//       if (!userId) {
//         setLoading(false);
//         setHistory([]);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await api.get(`/blood-register/history/${userId}`);
//         // Sắp xếp lịch sử theo ngày mới nhất lên đầu
//         const sortedHistory = response.data.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
//         setHistory(sortedHistory);
//       } catch (err) {
//         console.error("Failed to fetch donation history:", err);
//         setError("Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonationHistory();
//   }, [userId]);

//   const renderContent = () => {
//     if (loading) {
//       return <SkeletonLoader />;
//     }

//     if (error) {
//       return (
//         <div className="text-center py-12">
//           <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
//           <p className="text-lg text-gray-600">{error}</p>
//         </div>
//       );
//     }

//     if (history.length === 0) {
//       return (
//         <div className="text-center py-12">
//           <FaInbox className="mx-auto text-6xl text-gray-300 mb-4" />
//           <p className="text-xl font-semibold text-gray-700">Chưa có lịch sử</p>
//           <p className="text-gray-500 mt-2">
//             Mỗi lần hiến máu của bạn là một món quà vô giá.
//           </p>
//           {/* Bạn có thể thêm một nút kêu gọi hành động ở đây */}
//           {/* <button className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
//             Đăng ký hiến máu ngay
//           </button> */}
//         </div>
//       );
//     }

//     return (
//       <div className="relative">
//         {history.map((donation, index) => (
//           <HistoryItem
//             key={donation.id || index}
//             donation={donation}
//             isLast={index === history.length - 1}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
//       <div className="flex items-center gap-4 mb-8">
//         <div className="p-3 bg-red-100 rounded-full">
//           <FaHistory className="text-red-600 text-2xl" />
//         </div>
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
//           Lịch sử hiến máu
//         </h2>
//       </div>
//       {renderContent()}
//     </div>
//   );
// };

// export default HistoryComponent;







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
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chứng Nhận Hiến Máu</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            background: linear-gradient(135deg, #fef7f7 0%, #fff5f5 100%);
            padding: 40px 20px;
            color: #333;
        }
        
        .certificate-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(220, 38, 38, 0.1);
            overflow: hidden;
            position: relative;
        }
        
        .certificate-header {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .certificate-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            background-size: 50px 50px;
        }
        
        .certificate-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }
        
        .certificate-subtitle {
            font-size: 18px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .certificate-body {
            padding: 50px 40px;
            text-align: center;
        }
        
        .blood-drop {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
        }
        
        .blood-drop::before {
            content: '❤️';
            transform: rotate(45deg);
            font-size: 30px;
        }
        
        .donor-name {
            font-size: 28px;
            color: #dc2626;
            font-weight: bold;
            margin: 30px 0;
            border-bottom: 3px solid #dc2626;
            display: inline-block;
            padding-bottom: 5px;
        }
        
        .certificate-text {
            font-size: 18px;
            line-height: 1.8;
            margin: 30px 0;
            color: #555;
        }
        
        .donation-details {
            background: #fef7f7;
            border-left: 5px solid #dc2626;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 10px 10px 0;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 16px;
        }
        
        .detail-label {
            font-weight: bold;
            color: #dc2626;
        }
        
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding: 0 40px;
        }
        
        .signature-block {
            text-align: center;
            flex: 1;
        }
        
        .signature-title {
            font-weight: bold;
            margin-bottom: 40px;
            color: #dc2626;
        }
        
        .signature-name {
            border-top: 2px solid #333;
            padding-top: 10px;
            font-weight: bold;
        }
        
        .certificate-footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        
        .decorative-border {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 3px solid #dc2626;
            border-radius: 15px;
            pointer-events: none;
        }
        
        .corner-decoration {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 3px solid #dc2626;
        }
        
        .corner-decoration.top-left {
            top: 10px;
            left: 10px;
            border-right: none;
            border-bottom: none;
        }
        
        .corner-decoration.top-right {
            top: 10px;
            right: 10px;
            border-left: none;
            border-bottom: none;
        }
        
        .corner-decoration.bottom-left {
            bottom: 10px;
            left: 10px;
            border-right: none;
            border-top: none;
        }
        
        .corner-decoration.bottom-right {
            bottom: 10px;
            right: 10px;
            border-left: none;
            border-top: none;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="decorative-border"></div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
        
        <div class="certificate-header">
            <h1 class="certificate-title">Chứng Nhận Hiến Máu</h1>
            <p class="certificate-subtitle">Blood Donation Certificate</p>
        </div>
        
        <div class="certificate-body">
            <div class="blood-drop"></div>
            
            <p class="certificate-text">
                Xin chân thành cảm ơn
            </p>
            
            <div class="donor-name">${certificateData.donorName}</div>
            
            <p class="certificate-text">
                đã tham gia hiến máu tình nguyện, thể hiện tinh thần cao đẹp "Giọt máu hồng - Trái tim vàng". 
                Hành động cao đẹp của bạn đã góp phần cứu chữa những sinh mạng quý giá.
            </p>
            
            <div class="donation-details">
                <div class="detail-row">
                    <span class="detail-label">Mã chứng nhận:</span>
                    <span>#${certificateData.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ngày hiến máu:</span>
                    <span>${formatDate(donationData.completedDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lượng máu hiến:</span>
                    <span>${donationData.unit} ml</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ngày cấp chứng nhận:</span>
                    <span>${formatDate(certificateData.issueDate)}</span>
                </div>
            </div>
            
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-title">Người hiến máu</div>
                    <div class="signature-name">${certificateData.donorName}</div>
                </div>
                <div class="signature-block">
                    <div class="signature-title">Cán bộ y tế</div>
                    <div class="signature-name">${certificateData.staffName}</div>
                </div>
            </div>
        </div>
        
        <div class="certificate-footer">
            <p>Cảm ơn bạn đã đồng hành cùng chúng tôi trong việc cứu chữa sinh mạng</p>
            <p>Trung tâm Huyết học - Truyền máu</p>
        </div>
    </div>
</body>
</html>`;
};

// 🔻 Component thể hiện một mục hiến máu trong timeline
const HistoryItem = ({ donation, isLast }) => {
  // 📥 Hàm tải chứng nhận hiến máu theo ID
  const handleDownload = async () => {
    try {
      const response = await api.get(`/blood-register/get-certificate/${donation.id}`);
      const certificateData = response.data;
      
      // Tạo HTML certificate
      const htmlContent = createCertificateHTML(certificateData, donation);
      
      // Tạo Blob và tải xuống
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `ChungNhanHienMau-${donation.id}-${certificateData.donorName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
    } catch (error) {
      alert("Không thể tải chứng nhận hiến máu. Đơn có thể không tồn tại.");
      console.error("Lỗi khi tải chứng nhận:", error);
    }
  };

  return (
    <div className="relative pl-12 pb-8">
      {/* Dấu chấm trên timeline */}
      <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-8 ring-white">
        <FaTint className="h-3 w-3 text-white" />
      </div>

      {/* Đường dọc timeline */}
      {!isLast && <div className="absolute left-3 top-8 h-full w-0.5 bg-red-200"></div>}

      {/* Thông tin đơn hiến máu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-red-50 border border-red-100 rounded-xl shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FaCalendarAlt />
            <span>{formatDate(donation.completedDate)}</span>
          </div>
          <p className="font-bold text-xl text-gray-800">
            {donation.fullName || "Tình nguyện viên ẩn danh"}
          </p>
        </div>

        {/* Số ml + nút tải chứng nhận */}
        <div className="mt-4 sm:mt-0 text-right">
          <p className="font-bold text-2xl text-red-600">
            {donation.unit}
            <span className="text-lg font-medium ml-1">ml</span>
          </p>
          <button
            onClick={handleDownload}
            className="mt-3 px-4 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Tải chứng nhận
          </button>
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

// 🧠 Component chính hiển thị lịch sử hiến máu
const HistoryComponent = ({ userId: propUserId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧍 Lấy ID người dùng từ Redux hoặc props
  const user = useSelector((state) => state.user);
  const userId = propUserId || user?.id;

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!userId) {
        setLoading(false);
        setHistory([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/blood-register/history/${userId}`);
        const sortedHistory = response.data.sort(
          (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
        );
        setHistory(sortedHistory);
      } catch (err) {
        console.error("Failed to fetch donation history:", err);
        setError("Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [userId]);

  // 📦 Xử lý trạng thái giao diện
  const renderContent = () => {
    if (loading) return <SkeletonLoader />;

    if (error)
      return (
        <div className="text-center py-12">
          <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      );

    if (history.length === 0)
      return (
        <div className="text-center py-12">
          <FaInbox className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl font-semibold text-gray-700">Chưa có lịch sử</p>
          <p className="text-gray-500 mt-2">
            Mỗi lần hiến máu của bạn là một món quà vô giá.
          </p>
        </div>
      );

    return (
      <div className="relative">
        {history.map((donation, index) => (
          <HistoryItem
            key={donation.id || index}
            donation={donation}
            isLast={index === history.length - 1}
          />
        ))}
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
          Lịch sử hiến máu
        </h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default HistoryComponent;