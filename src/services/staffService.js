// Khóa lưu trữ trong localStorage
const STAFF_STORAGE_KEY = 'staffList';
const CURRENT_USER_KEY = 'currentUser';

// Lấy danh sách nhân viên từ localStorage
export const getStaffList = () => {
  const staffList = localStorage.getItem(STAFF_STORAGE_KEY);
  return staffList ? JSON.parse(staffList) : [];
};

// Lưu danh sách nhân viên vào localStorage
export const saveStaffList = (staffList) => {
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
};

// Khởi tạo dữ liệu người dùng
export const initializeUserData = (userData) => {
  // Thêm vào danh sách nhân viên nếu chưa có
  const staffList = getStaffList();
  const existingStaff = staffList.find(staff => staff.email === userData.email);
  
  if (!existingStaff) {
    staffList.push({
      ...userData,
      joinDate: new Date().toISOString(),
      password: userData.password || '123456'
    });
    saveStaffList(staffList);
  }
  
  // Lưu thông tin người dùng hiện tại
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  return userData;
};

// Cập nhật thông tin một nhân viên
export const updateStaffMember = (updatedStaff) => {
  const staffList = getStaffList();
  const index = staffList.findIndex(staff => staff.email === updatedStaff.email);
  
  if (index !== -1) {
    // Cập nhật trong danh sách nhân viên
    staffList[index] = { ...staffList[index], ...updatedStaff };
    saveStaffList(staffList);
    
    // Nếu là người dùng hiện tại, cập nhật thông tin người dùng
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
    if (currentUser.email === updatedStaff.email) {
      const updatedUser = {
        ...currentUser,
        ...updatedStaff
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return updatedUser; // Trả về dữ liệu người dùng đã cập nhật
    }
    
    return true;
  }
  return false;
};

// Thêm nhân viên mới
export const addStaffMember = (newStaff) => {
  const staffList = getStaffList();
  // Kiểm tra email đã tồn tại chưa
  if (staffList.some(staff => staff.email === newStaff.email)) {
    throw new Error('Email đã tồn tại trong hệ thống');
  }
  staffList.push(newStaff);
  saveStaffList(staffList);
};

// Xóa nhân viên
export const deleteStaffMember = (email) => {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
  if (currentUser.email === email) {
    throw new Error('Không thể xóa tài khoản đang đăng nhập');
  }
  
  const staffList = getStaffList();
  const filteredList = staffList.filter(staff => staff.email !== email);
  saveStaffList(filteredList);
};

// Lấy thông tin một nhân viên theo email
export const getStaffByEmail = (email) => {
  const staffList = getStaffList();
  return staffList.find(staff => staff.email === email);
};

// Cập nhật mật khẩu
export const updatePassword = (email, oldPassword, newPassword) => {
  const staffList = getStaffList();
  const staff = staffList.find(staff => staff.email === email);
  
  if (!staff) {
    return false;
  }

  // Kiểm tra mật khẩu cũ
  if (staff.password !== oldPassword) {
    return false;
  }

  // Cập nhật mật khẩu mới
  staff.password = newPassword;
  saveStaffList(staffList);
  
  // Cập nhật mật khẩu cho người dùng hiện tại nếu cần
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
  if (currentUser.email === email) {
    const updatedUser = {
      ...currentUser,
      password: newPassword
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  }
  
  return true;
}; 