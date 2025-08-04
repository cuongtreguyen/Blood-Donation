// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   FaHistory,
//   FaTint,
//   FaCalendarAlt,
//   FaExclamationTriangle,
//   FaInbox,
// } from "react-icons/fa";
// import api from "../../config/api";
// import html2pdf from "html2pdf.js";

// // ⚙️ Hàm định dạng ngày tháng theo chuẩn Việt Nam
// const formatDate = (dateString) => {
//   if (!dateString) return "Không rõ ngày";
//   return new Date(dateString).toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// // 🎨 Hàm tạo HTML template cho chứng nhận
// const createCertificateHTML = (certificateData, donationData) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   return `
// <!DOCTYPE html>
// <html lang="vi">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Chứng Nhận Hiến Máu Tình Nguyện</title>
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
//     <style>
//         :root {
//             --primary-red: #a41e21;
//             --accent-gold: #c9a86a;
//             --text-dark: #333333;
//             --text-light: #555555;
//             --background-light: #fdfbf7;
//         }

//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Lato', sans-serif;
//             background: #f1f1f1;
//             padding: 40px 20px;
//             color: var(--text-dark);
//         }

//         .certificate-container {
//             max-width: 840px;
//             min-height: 594px;
//             margin: 0 auto;
//             background: var(--background-light);
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//             position: relative;
//             padding: 40px;
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//         }

//         .certificate-container::before {
//             content: '';
//             position: absolute;
//             top: 15px;
//             left: 15px;
//             right: 15px;
//             bottom: 15px;
//             border: 2px solid var(--accent-gold);
//             pointer-events: none;
//         }

//         .certificate-container::after {
//             content: '';
//             position: absolute;
//             top: 10px;
//             left: 10px;
//             right: 10px;
//             bottom: 10px;
//             border: 1px solid var(--primary-red);
//             pointer-events: none;
//         }

//         .certificate-header {
//             text-align: center;
//             margin-bottom: 20px;
//         }

//         .header-logo {
//             width: 80px;
//             height: 80px;
//             margin: 0 auto 15px;
//             background-image: url("https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain");
//             background-size: contain;
//             background-repeat: no-repeat;
//             background-position: center;
//         }

//         .main-title {
//             font-family: 'Merriweather', serif;
//             font-size: 28px;
//             font-weight: 700;
//             color: var(--primary-red);
//             text-transform: uppercase;
//             letter-spacing: 2px;
//             margin-bottom: 5px;
//         }

//         .subtitle {
//             font-size: 16px;
//             color: var(--text-light);
//             letter-spacing: 1px;
//         }

//         .certificate-body {
//             text-align: center;
//             padding: 20px 0;
//             flex-grow: 1;
//             background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a41e21' opacity='0.05'%3E%3Cpath d='M12 2C7.58 2 4 5.58 4 10c0 4.42 8 12 8 12s8-7.58 8-12c0-4.42-3.58-8-8-8zm-1.5 10.5H9v-3h1.5v3zm3 0h-1.5v-3H15v3z'/%3E%3C/svg%3E");
//             background-repeat: no-repeat;
//             background-position: center;
//             background-size: 50%;
//         }

//         .acknowledgement-text {
//             font-size: 18px;
//             line-height: 1.7;
//             color: var(--text-light);
//             margin: 20px 0;
//         }

//         .donor-name {
//             font-family: 'Merriweather', serif;
//             font-size: 36px;
//             color: var(--primary-red);
//             font-weight: 700;
//             margin: 20px 0;
//             padding-bottom: 10px;
//             border-bottom: 2px solid var(--accent-gold);
//             display: inline-block;
//         }

//         .donation-details {
//             width: 80%;
//             margin: 30px auto;
//             border-collapse: collapse;
//         }

//         .donation-details td {
//             padding: 12px;
//             font-size: 16px;
//             border-bottom: 1px solid #eee;
//         }

//         .donation-details .detail-label {
//             font-weight: 700;
//             color: var(--primary-red);
//             text-align: left;
//         }

//         .donation-details .detail-value {
//             text-align: right;
//             font-weight: 400;
//             color: var(--text-dark);
//         }

//         .signatures {
//             display: flex;
//             justify-content: space-around;
//             margin-top: 40px;
//         }

//         .signature-block {
//             text-align: center;
//             width: 40%;
//         }

//         .signature-title {
//             font-family: 'Merriweather', serif;
//             font-size: 16px;
//             font-weight: 700;
//             color: var(--text-dark);
//             margin-bottom: 50px;
//         }

//         .signature-line {
//             border-top: 1px dotted var(--text-dark);
//             padding-top: 8px;
//             font-size: 16px;
//             font-weight: 700;
//         }

//         .certificate-footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #eee;
//             font-size: 12px;
//             color: #999;
//         }

//         @media print {
//             body {
//                 background: white;
//                 padding: 0;
//             }
//             .certificate-container {
//                 box-shadow: none;
//                 margin: 0;
//                 max-width: 100%;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="certificate-container">
//         <header class="certificate-header">
//             <div class="header-logo"></div>
//             <h1 class="main-title">Chứng Nhận Hiến Máu Tình Nguyện</h1>
//             <p class="subtitle">Certificate of Voluntary Blood Donation</p>
//         </header>

//         <main class="certificate-body">
//             <p class="acknowledgement-text">Trân trọng chứng nhận và ghi nhận nghĩa cử cao đẹp của:</p>

//             <div class="donor-name">${certificateData.donorName}</div>

//             <p class="acknowledgement-text">
//                 Đã tình nguyện hiến máu cứu người, một hành động nhân văn sâu sắc.
//             </p>

//             <table class="donation-details">
//                 <tbody>
//                     <tr>
//                         <td class="detail-label">Ngày hiến máu:</td>
//                         <td class="detail-value">${formatDate(donationData.completedDate)}</td>
//                     </tr>
//                     <tr>
//                         <td class="detail-label">Lượng máu đã hiến:</td>
//                         <td class="detail-value">${donationData.unit} ml</td>
//                     </tr>
//                     <tr>
//                         <td class="detail-label">Ngày cấp chứng nhận:</td>
//                         <td class="detail-value">${formatDate(certificateData.issueDate)}</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </main>

//         <div class="signatures">
//             <div class="signature-block">
//                 <div class="signature-title">Người Hiến Máu</div>
//                 <div class="signature-line">${certificateData.donorName}</div>
//             </div>
//             <div class="signature-block">
//                 <div class="signature-title">Đại Diện Đơn Vị Tiếp Nhận</div>
//                 <div class="signature-line">${certificateData.staffName}</div>
//             </div>
//         </div>

//         <footer class="certificate-footer">
//             <p>Trung tâm Huyết học - Truyền máu Quốc gia</p>
//             <p>Mỗi giọt máu cho đi, một cuộc đời ở lại. Xin chân thành cảm ơn!</p>
//         </footer>
//     </div>
// </body>
// </html>`;
// };

// // 🔻 Component thể hiện một mục hiến máu trong timeline
// const HistoryItem = ({ donation, isLast, isDonation = true }) => {
//   const handleDownload = async () => {
//     if (isDonation) {
//       try {
//         const response = await api.get(`/certificates/get-certificate-by-id/${donation.certificateId}`);
//         const certificateData = response.data;

//         const htmlContent = createCertificateHTML(certificateData, donation);

//         // Create a temporary container for the HTML content
//         const element = document.createElement('div');
//         element.innerHTML = htmlContent;
//         document.body.appendChild(element);

//         // Configure html2pdf options
//         const opt = {
//           margin: 0,
//           filename: `ChungNhanHienMau-${donation.certificateId}-${certificateData.donorName}.pdf`,
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: { scale: 2, useCORS: true },
//           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//         };

//         // Generate and download PDF
//         await html2pdf().from(element).set(opt).save();

//         // Clean up
//         document.body.removeChild(element);
//       } catch (error) {
//         alert("Không thể tải chứng nhận hiến máu. Đơn có thể không tồn tại.");
//         console.error("Lỗi khi tải chứng nhận:", error);
//       }
//     }
//   };

//   // Lấy ngày đúng dựa trên loại (hiến máu hoặc nhận máu)
//   const getDate = () => {
//     if (isDonation) {
//       return donation.completedDate;
//     } else {
//       return donation.receiveDate; // Sử dụng receiveDate cho nhận máu
//     }
//   };

//   return (
//     <div className="relative pl-12 pb-8">
//       <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-8 ring-white">
//         <FaTint className="h-3 w-3 text-white" />
//       </div>

//       {!isLast && <div className="absolute left-3 top-8 h-full w-0.5 bg-red-200"></div>}

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-red-50 border border-red-100 rounded-xl shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300">
//         <div>
//           <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
//             <FaCalendarAlt />
//             <span>{formatDate(getDate())}</span>
//           </div>
//           <p className="font-bold text-xl text-gray-800">
//             {donation.fullName || "Tình nguyện viên ẩn danh"}
//           </p>
//         </div>

//         <div className="mt-4 sm:mt-0 text-right">
//           <p className="font-bold text-2xl text-red-600">
//             {donation.unit}
//             <span className="text-lg font-medium ml-1">ml</span>
//           </p>
//           {isDonation && (
//             <button
//               onClick={handleDownload}
//               className="mt-3 px-4 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//             >
//               Tải chứng nhận
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ⏳ Component loader giả lập trạng thái loading
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

// // 🧠 Component chính hiển thị lịch sử hiến máu và nhận máu
// const HistoryComponent = ({ userId: propUserId }) => {
//   const [donationHistory, setDonationHistory] = useState([]);
//   const [receiveHistory, setReceiveHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const user = useSelector((state) => state.user);
//   const userId = propUserId || user?.id;

//   useEffect(() => {
//     const fetchHistories = async () => {
//       if (!userId) {
//         setLoading(false);
//         setDonationHistory([]);
//         setReceiveHistory([]);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       let donationData = [];
//       let receiveData = [];

//       try {
//         // Lấy lịch sử hiến máu
//         try {
//           const donationResponse = await api.get(`/blood-register/history/${userId}`);
//           const sortedDonationHistory = donationResponse.data.sort(
//             (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
//           );
//           donationData = sortedDonationHistory;
//         } catch (donationErr) {
//           console.warn("Không thể tải lịch sử hiến máu:", donationErr);
//           donationData = [];
//         }

//         // Lấy lịch sử nhận máu
//         try {
//           const receiveResponse = await api.get(`/blood-receive/get-list-receive-by-user-id?userId=${userId}`);
//           const sortedReceiveHistory = receiveResponse.data.sort(
//             (a, b) => new Date(b.receiveDate) - new Date(a.receiveDate)
//           );
//           receiveData = sortedReceiveHistory;
//         } catch (receiveErr) {
//           console.warn("Không thể tải lịch sử nhận máu:", receiveErr);
//           receiveData = [];
//         }

//         // Cập nhật state
//         setDonationHistory(donationData);
//         setReceiveHistory(receiveData);

//         // Chỉ set error nếu cả hai đều fail
//         if (donationData.length === 0 && receiveData.length === 0) {
//           // Kiểm tra xem có phải do lỗi API không
//           // Nếu không có dữ liệu thì không phải lỗi
//         }

//       } catch (err) {
//         console.error("Failed to fetch histories:", err);
//         setError("Không thể tải lịch sử. Vui lòng thử lại sau.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistories();
//   }, [userId]);

//   const renderContent = () => {
//     if (loading) return <SkeletonLoader />;

//     // Chỉ hiển thị error khi có lỗi nghiêm trọng (không phải do không có dữ liệu)
//     if (error && donationHistory.length === 0 && receiveHistory.length === 0)
//       return (
//         <div className="text-center py-12">
//           <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
//           <p className="text-lg text-gray-600">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//           >
//             Thử lại
//           </button>
//         </div>
//       );

//     return (
//       <div className="relative">
//         {/* Lịch sử hiến máu */}
//         {donationHistory.length > 0 ? (
//           <>
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Lịch sử hiến máu</h3>
//             {donationHistory.map((donation, index) => (
//               <HistoryItem
//                 key={donation.id || index}
//                 donation={donation}
//                 isLast={index === donationHistory.length - 1 && receiveHistory.length === 0}
//                 isDonation={true}
//               />
//             ))}
//           </>
//         ) : (
//           <div className="text-center py-6 mb-4 bg-blue-50 rounded-lg border border-blue-200">
//             <FaTint className="mx-auto text-3xl text-blue-400 mb-2" />
//             <p className="text-blue-700 font-medium">Chưa có lịch sử hiến máu</p>
//             <p className="text-blue-600 text-sm mt-1">Hãy tham gia hiến máu để cứu người!</p>
//           </div>
//         )}

//         {/* Lịch sử nhận máu */}
//         {receiveHistory.length > 0 ? (
//           <>
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4">Lịch sử nhận máu</h3>
//             {receiveHistory.map((receive, index) => (
//               <HistoryItem
//                 key={receive.id || index}
//                 donation={receive}
//                 isLast={index === receiveHistory.length - 1}
//                 isDonation={false}
//               />
//             ))}
//           </>
//         ) : (
//           <div className="text-center py-6 mt-4 bg-green-50 rounded-lg border border-green-200">
//             <FaTint className="mx-auto text-3xl text-green-400 mb-2" />
//             <p className="text-green-700 font-medium">Chưa có lịch sử nhận máu</p>
//             <p className="text-green-600 text-sm mt-1">Chúc bạn luôn khỏe mạnh!</p>
//           </div>
//         )}

//         {/* Chỉ hiển thị thông báo này khi cả hai đều rỗng VÀ không có lỗi */}
//         {donationHistory.length === 0 && receiveHistory.length === 0 && !error && (
//           <div className="text-center py-12">
//             <FaInbox className="mx-auto text-6xl text-gray-300 mb-4" />
//             <p className="text-xl font-semibold text-gray-700">Chưa có lịch sử</p>
//             <p className="text-gray-500 mt-2">
//               Mỗi lần hiến máu của bạn là một món quà vô giá.
//             </p>
//           </div>
//         )}
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
//           Lịch sử
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
  FaDownload,
  FaHeart,
  FaCertificate,
} from "react-icons/fa";
import api from "../../config/api";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

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
                        <td class="detail-value">${formatDate(
                          donationData.completedDate
                        )}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Lượng máu đã hiến:</td>
                        <td class="detail-value">${donationData.unit} ml</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Ngày cấp chứng nhận:</td>
                        <td class="detail-value">${formatDate(
                          certificateData.issueDate
                        )}</td>
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
        const response = await api.get(
          `/certificates/get-certificate-by-id/${donation.certificateId}`
        );
        const certificateData = response.data;

        const htmlContent = createCertificateHTML(certificateData, donation);

        // Create a temporary container for the HTML content
        const element = document.createElement("div");
        element.innerHTML = htmlContent;
        document.body.appendChild(element);

        // Configure html2pdf options
        const opt = {
          margin: 0,
          filename: `ChungNhanHienMau-${donation.certificateId}-${certificateData.donorName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Generate and download PDF
        await html2pdf().from(element).set(opt).save();

        // Clean up
        document.body.removeChild(element);
      } catch (error) {
        // alert("Không thể tải chứng nhận hiến máu. Đơn có thể không tồn tại.");
        toast.error(
          "Không thể tải chứng nhận hiến máu. Chứng Chỉ Chưa được Cấp."
        );
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
    <div className="relative pl-16 pb-10">
      {/* Timeline dot with enhanced design */}
      <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg ring-4 ring-white">
        <FaTint className="h-4 w-4 text-white" />
      </div>

      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-12 h-full w-0.5 bg-gradient-to-b from-red-300 to-red-100"></div>
      )}

      {/* Content card with modern design */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-red-200">
        {/* Background gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            isDonation
              ? "from-red-50 to-pink-50"
              : "from-green-50 to-emerald-50"
          } opacity-60`}
        ></div>

        {/* Content */}
        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left section */}
            <div className="flex-1">
              {/* Date with icon */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    isDonation ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <FaCalendarAlt
                    className={`h-4 w-4 ${
                      isDonation ? "text-red-600" : "text-green-600"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {formatDate(getDate())}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {donation.fullName || "Tình nguyện viên ẩn danh"}
              </h3>

              {/* Type indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isDonation
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isDonation ? "Hiến máu" : "Nhận máu"}
                </div>
                {isDonation && <FaHeart className="h-3 w-3 text-red-500" />}
              </div>
            </div>

            {/* Right section */}
            <div className="text-right lg:text-right">
              {/* Blood amount */}
              <div className="mb-4">
                <p
                  className={`text-3xl font-bold ${
                    isDonation ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {donation.unit}
                  <span className="text-lg font-medium ml-1">ml</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isDonation ? "Đã hiến" : "Đã nhận"}
                </p>
              </div>

              {/* Download button for donations */}
              {isDonation && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaDownload className="h-3 w-3" />
                  Tải chứng nhận
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
            isDonation
              ? "from-red-200 to-red-300"
              : "from-green-200 to-green-300"
          } opacity-20 rounded-bl-full`}
        ></div>
      </div>
    </div>
  );
};

// ⏳ Component loader giả lập trạng thái loading
const SkeletonLoader = () => (
  <div className="space-y-10">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-6 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 w-3/4 rounded-lg bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded-lg bg-gray-200"></div>
          <div className="h-4 w-2/3 rounded-lg bg-gray-200"></div>
        </div>
        <div className="w-24 space-y-2">
          <div className="h-8 w-full rounded-lg bg-gray-200"></div>
          <div className="h-4 w-full rounded-lg bg-gray-200"></div>
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

      let donationData = [];
      let receiveData = [];

      try {
        // Lấy lịch sử hiến máu
        try {
          const donationResponse = await api.get(
            `/blood-register/history/${userId}`
          );
          const sortedDonationHistory = donationResponse.data.sort(
            (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
          );
          donationData = sortedDonationHistory;
        } catch (donationErr) {
          console.warn("Không thể tải lịch sử hiến máu:", donationErr);
          donationData = [];
        }

        // Lấy lịch sử nhận máu
        try {
          const receiveResponse = await api.get(
            `/blood-receive/get-list-receive-by-user-id?userId=${userId}`
          );
          const sortedReceiveHistory = receiveResponse.data.sort(
            (a, b) => new Date(b.receiveDate) - new Date(a.receiveDate)
          );
          receiveData = sortedReceiveHistory;
        } catch (receiveErr) {
          console.warn("Không thể tải lịch sử nhận máu:", receiveErr);
          receiveData = [];
        }

        // Cập nhật state
        setDonationHistory(donationData);
        setReceiveHistory(receiveData);

        // Chỉ set error nếu cả hai đều fail
        if (donationData.length === 0 && receiveData.length === 0) {
          // Kiểm tra xem có phải do lỗi API không
          // Nếu không có dữ liệu thì không phải lỗi
        }
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

    // Chỉ hiển thị error khi có lỗi nghiêm trọng (không phải do không có dữ liệu)
    if (error && donationHistory.length === 0 && receiveHistory.length === 0)
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
            <FaExclamationTriangle className="text-2xl text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Thử lại
          </button>
        </div>
      );

    // Nếu không có dữ liệu gì cả
    if (donationHistory.length === 0 && receiveHistory.length === 0 && !error) {
      return (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <FaInbox className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Chưa có lịch sử
          </h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Mỗi lần hiến máu của bạn là một món quà vô giá dành cho những người
            cần sự giúp đỡ.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Lịch sử hiến máu */}
        {donationHistory.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaTint className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Lịch sử hiến máu
                </h3>
                <p className="text-gray-600">
                  Những lần bạn đã chia sẻ tình yêu thương
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {donationHistory.map((donation, index) => (
                <HistoryItem
                  key={donation.id || index}
                  donation={donation}
                  isLast={
                    index === donationHistory.length - 1 &&
                    receiveHistory.length === 0
                  }
                  isDonation={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lịch sử nhận máu */}
        {receiveHistory.length > 0 && (
          <div className={donationHistory.length > 0 ? "mt-12" : ""}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaHeart className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Lịch sử nhận máu
                </h3>
                <p className="text-gray-600">
                  Những lần bạn được nhận sự hỗ trợ
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {receiveHistory.map((receive, index) => (
                <HistoryItem
                  key={receive.id || index}
                  donation={receive}
                  isLast={index === receiveHistory.length - 1}
                  isDonation={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-8 py-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
            <FaHistory className="text-white text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Lịch Sử Hiến & Nhận Máu
            </h2>
            <p className="text-red-100 text-lg">
              Hành trình chia sẻ yêu thương của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 lg:p-10">{renderContent()}</div>
    </div>
  );
};

export default HistoryComponent;
