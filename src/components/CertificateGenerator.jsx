import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

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

export const generateCertificatePDF = (donationData, doctorName) => {
  const doc = new jsPDF();
  
  // Header với logo và tiêu đề
  doc.setFillColor(207, 19, 34); // Màu đỏ
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo (placeholder)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("🏥", 20, 25);
  
  // Tiêu đề
  doc.setFontSize(18);
  doc.text("GIẤY CHỨNG NHẬN HIẾN MÁU", 105, 25, { align: "center" });
  doc.setFontSize(12);
  doc.text("BLOOD DONATION CERTIFICATE", 105, 35, { align: "center" });
  
  // Reset màu
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  
  // Thông tin người hiến máu
  const donorInfo = [
    ["Họ và tên:", donationData.fullName || "N/A"],
    ["Ngày sinh:", donationData.birthdate ? dayjs(donationData.birthdate).format("DD/MM/YYYY") : "N/A"],
    ["CMND/CCCD:", donationData.identityNumber || "N/A"],
    ["Địa chỉ:", donationData.address || "N/A"],
    ["Số điện thoại:", donationData.phone || "N/A"],
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [["Thông tin người hiến máu", ""]],
    body: donorInfo,
    theme: "grid",
    headStyles: { 
      fillColor: [207, 19, 34],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 120 }
    }
  });
  
  // Thông tin hiến máu
  const donationInfo = [
    ["Ngày hiến máu:", donationData.completedDate ? dayjs(donationData.completedDate).format("DD/MM/YYYY") : "N/A"],
    ["Nhóm máu:", bloodTypeMap[donationData.bloodType] || donationData.bloodType || "N/A"],
    ["Lượng máu hiến:", `${donationData.unit || 0} ml`],
    ["Địa điểm hiến máu:", donationData.location || "Bệnh viện Trung ương"],
    ["Bác sĩ phụ trách:", doctorName || "N/A"],
  ];
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Thông tin hiến máu", ""]],
    body: donationInfo,
    theme: "grid",
    headStyles: { 
      fillColor: [207, 19, 34],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 120 }
    }
  });
  
  // Kết luận
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("KẾT LUẬN:", 20, finalY + 20);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text("Người hiến máu đã hoàn thành quá trình hiến máu an toàn và đúng quy trình.", 20, finalY + 30);
  doc.text("Máu hiến sẽ được sử dụng để cứu chữa bệnh nhân theo quy định của Bộ Y tế.", 20, finalY + 40);
  
  // Footer
  doc.setFontSize(10);
  doc.text("Chữ ký người hiến máu", 30, finalY + 70);
  doc.text("Chữ ký bác sĩ", 150, finalY + 70);
  
  // Đường kẻ cho chữ ký
  doc.line(20, finalY + 75, 80, finalY + 75);
  doc.line(120, finalY + 75, 180, finalY + 75);
  
  // Thông tin bổ sung
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Giấy chứng nhận này có giá trị pháp lý và được lưu trữ trong hệ thống.", 20, finalY + 90);
  doc.text("Mã chứng nhận:", 20, finalY + 95);
  doc.setFont(undefined, 'bold');
  doc.text(`CERT-${donationData.id}-${dayjs().format('YYYYMMDD')}`, 50, finalY + 95);
  
  return doc;
};

export const downloadCertificateFile = (donationData, doctorName, filename = null) => {
  const doc = generateCertificatePDF(donationData, doctorName);
  const defaultFilename = `GiayChungNhanHienMau_${donationData.fullName || 'Unknown'}_${dayjs().format('YYYYMMDD')}.pdf`;
  doc.save(filename || defaultFilename);
}; 