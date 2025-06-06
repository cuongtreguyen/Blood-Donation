// Mock data for the blood donation system
export const doctors = [
  {
    id: "D1",
    name: "Dr. Nguyễn Văn An",
    specialization: "Huyết học",
    experience: "15 năm",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "active",
    phone: "0901234567",
    email: "dr.an@hospital.com",
    schedule: "Thứ 2 - Thứ 6",
    patients: 150,
    successfulDonations: 450
  },
  {
    id: "D2",
    name: "Dr. Trần Thị Bình",
    specialization: "Truyền máu",
    experience: "12 năm",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "active",
    phone: "0901234568",
    email: "dr.binh@hospital.com",
    schedule: "Thứ 3 - Thứ 7",
    patients: 120,
    successfulDonations: 380
  }
];

export const bloodInventory = {
  "A+": { amount: 85, status: "high", lastUpdated: "2024-03-20" },
  "A-": { amount: 45, status: "normal", lastUpdated: "2024-03-20" },
  "B+": { amount: 76, status: "high", lastUpdated: "2024-03-20" },
  "B-": { amount: 30, status: "low", lastUpdated: "2024-03-20" },
  "AB+": { amount: 25, status: "low", lastUpdated: "2024-03-20" },
  "AB-": { amount: 15, status: "critical", lastUpdated: "2024-03-20" },
  "O+": { amount: 92, status: "high", lastUpdated: "2024-03-20" },
  "O-": { amount: 38, status: "normal", lastUpdated: "2024-03-20" }
};

export const appointments = [
  {
    id: "A1",
    donorName: "Nguyễn Văn Cường",
    date: "2024-03-25",
    time: "09:00",
    bloodType: "A+",
    status: "confirmed",
    phone: "0901234571",
    email: "cuong@email.com",
    purpose: "Hiến máu định kỳ"
  },
  {
    id: "A2",
    donorName: "Trần Thị Dung",
    date: "2024-03-25",
    time: "10:30",
    bloodType: "O-",
    status: "pending",
    phone: "0901234572",
    email: "dung@email.com",
    purpose: "Hiến máu lần đầu"
  }
];

export const donations = [
  {
    id: "DN1",
    donorName: "Lê Văn Em",
    date: "2024-03-20",
    bloodType: "B+",
    amount: "450ml",
    status: "completed",
    doctor: "Dr. Nguyễn Văn An",
    nurse: "Phạm Thị Hương"
  },
  {
    id: "DN2",
    donorName: "Phạm Thị Phương",
    date: "2024-03-19",
    bloodType: "A+",
    amount: "350ml",
    status: "completed",
    doctor: "Dr. Trần Thị Bình",
    nurse: "Lê Văn Dũng"
  }
];

export const notifications = [
  {
    id: "N1",
    title: "Yêu cầu hiến máu khẩn cấp",
    message: "Cần gấp 2 đơn vị máu nhóm AB- cho ca phẫu thuật",
    type: "urgent",
    timestamp: "2024-03-20T08:00:00",
    read: false
  },
  {
    id: "N2",
    title: "Cập nhật lịch trực",
    message: "Lịch trực tháng 4 đã được cập nhật",
    type: "info",
    timestamp: "2024-03-19T15:30:00",
    read: true
  }
];

// Helper function to simulate API calls
export const fetchData = (dataType, delay = 1000) => {
  const dataMap = {
    doctors,
    bloodInventory,
    appointments,
    donations,
    notifications
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dataMap[dataType] || []);
    }, delay);
  });
}; 