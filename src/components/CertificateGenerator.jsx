import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ⚙️ Hàm định dạng ngày tháng theo chuẩn Việt Nam
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// 🎨 Hàm tạo HTML template cho chứng nhận
const createCertificateHTML = (donationData, doctorName) => {
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
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a41e21'%3E%3Cpath d='M12 2C7.58 2 4 5.58 4 10c0 4.42 8 12 8 12s8-7.58 8-12c0-4.42-3.58-8-8-8zm-1.5 10.5H9v-3h1.5v3zm3 0h-1.5v-3H15v3z'/%3E%3C/svg%3E");
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

            <div class="donor-name">${donationData.fullName}</div>

            <p class="acknowledgement-text">
                Đã tình nguyện hiến máu cứu người, một hành động nhân văn sâu sắc.
            </p>

            <table class="donation-details">
                <tbody>
                    <tr>
                        <td class="detail-label">Mã chứng nhận:</td>
                        <td class="detail-value">#${donationData.id || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Ngày hiến máu:</td>
                        <td class="detail-value">${formatDate(donationData.completedDate)}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Lượng máu đã hiến:</td>
                        <td class="detail-value">${donationData.unit} ml</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Nhóm máu:</td>
                        <td class="detail-value">${donationData.bloodType || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </main>

        <div class="signatures">
            <div class="signature-block">
                <div class="signature-title">Người Hiến Máu</div>
                <div class="signature-line">${donationData.fullName}</div>
            </div>
            <div class="signature-block">
                <div class="signature-title">Đại Diện Đơn Vị Tiếp Nhận</div>
                <div class="signature-line">${doctorName || 'Bác sĩ phụ trách'}</div>
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

// 📄 Hàm tạo và tải chứng nhận dưới dạng PDF
export const downloadCertificateFile = async (donationData, doctorName) => {
  try {
    // Tạo container ẩn để render HTML
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '840px'; // Chiều rộng chứng nhận
    element.innerHTML = createCertificateHTML(donationData, doctorName);
    document.body.appendChild(element);

    // Đợi font và hình ảnh tải xong
    await document.fonts.ready;

    // Chuyển đổi HTML thành canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#fdfbf7',
    });

    // Tạo PDF từ canvas
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // Chiều rộng A4 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Tải PDF
    pdf.save(`ChungNhanHienMau-${donationData.fullName.replace(/\s+/g, '_')}.pdf`);

    // Dọn dẹp
    document.body.removeChild(element);
    return true;
  } catch (error) {
    console.error("Lỗi khi tạo chứng nhận:", error);
    throw error;
  }
};

// 📄 Hàm chỉ tạo chứng nhận mà không tải xuống (dành cho bác sĩ)
export const createCertificateOnly = async (donationData, doctorName) => {
  try {
    // Tạo container ẩn để render HTML
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '840px'; // Chiều rộng chứng nhận
    element.innerHTML = createCertificateHTML(donationData, doctorName);
    document.body.appendChild(element);

    // Đợi font và hình ảnh tải xong
    await document.fonts.ready;

    // Chuyển đổi HTML thành canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#fdfbf7',
    });

    // Dọn dẹp
    document.body.removeChild(element);
    return true;
  } catch (error) {
    console.error("Lỗi khi tạo chứng nhận:", error);
    throw error;
  }
};