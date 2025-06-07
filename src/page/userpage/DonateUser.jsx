

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaCalendar, FaHistory, FaSignOutAlt, FaTint, FaClock, FaMapMarkerAlt, FaCheckCircle, FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// const DonateUser = () => {
//     const [activeTab, setActiveTab] = useState("profile");
//     const [isEditing, setIsEditing] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.user);
//     console.log(userData);
//     // Định nghĩa mảng bloodGroups
//     const bloodGroups = [
//         { label: "A+", value: "A_POSITIVE" },
//         { label: "A-", value: "A_NEGATIVE" },
//         { label: "B+", value: "B_POSITIVE" },
//         { label: "B-", value: "B_NEGATIVE" },
//         { label: "AB+", value: "AB_POSITIVE" },
//         { label: "AB-", value: "AB_NEGATIVE" },
//         { label: "O+", value: "O_POSITIVE" },
//         { label: "O-", value: "O_NEGATIVE" }, // Sửa lỗi typo O_NEGATIVE-
//     ];

//     // Hàm chuyển đổi từ value (API) sang label (hiển thị)
//     const getBloodTypeLabel = (value) => {
//         const group = bloodGroups.find((group) => group.value === value);
//         return group ? group.label : "Chưa xác định";
//     };

//     // // Hàm chuyển đổi từ label (hiển thị) sang value (API) nếu cần
//     // const getBloodTypeValue = (label) => {
//     //     const group = bloodGroups.find((group) => group.label === label);
//     //     return group ? group.value : null;
//     // };



//     const donationHistory = [
//         { date: "15-01-2024", location: "Bệnh Viện Đa Khoa Trung Ương", amount: "250ml" },
//         { date: "10-10-2023", location: "Trung Tâm Huyết Học Quốc Gia", amount: "450ml" },
//         { date: "05-07-2023", location: "Bệnh Viện Chợ Rẫy", amount: "210ml" },
//     ];

//     const [appointments, setAppointments] = useState([
//         {
//             date: "20-03-2024",
//             time: "10:00 Sáng",
//             location: "Bệnh Viện Chợ Rẫy",
//             status: "Đã Xác Nhận",
//         },
//     ]);

//     const [newAppointment, setNewAppointment] = useState({
//         date: "",
//         time: "",
//         location: "",
//     });

//     // useEffect(() => {
//     //     const fetchUserData = async () => {
//     //         const savedUser = localStorage.getItem("user");
//     //         if (savedUser) {
//     //             const parsedUser = JSON.parse(savedUser);
//     //             // setUserData((prev) => ({ ...prev, ...parsedUser }));
//     //         } else {
//     //             try {
//     //                 const response = await api.get(`/${userData.id}`); // Giả định API lấy dữ liệu người dùng
//     //                 const user = response.data;
//     //                 const formattedUser = {
//     //                     id: user.user_id || user.id,
//     //                     full_name: user.full_name || "Người dùng",
//     //                     email: user.email || "Chưa có thông tin",
//     //                     phone: user.phone || "Chưa có thông tin",
//     //                     address: user.address || "Chưa có thông tin",
//     //                     blood_type: user.blood_type || "Chưa xác định", // Lưu dạng A_POSITIVE
//     //                     totalDonations: user.totalDonations || 0,
//     //                     lastDonation: user.last_donation || "Chưa có",
//     //                     isEligible: !!user.last_donation && parseInt(user.last_donation) > 0,
//     //                     profileImage:
//     //                         user.profileImage ||
//     //                         "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     //                 };
//     //                 localStorage.setItem("user", JSON.stringify(formattedUser));
//     //                 setUserData(formattedUser);
//     //             } catch (error) {
//     //                 console.error("Lỗi khi lấy dữ liệu người dùng:", error);
//     //                 toast.error("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại!");
//     //                 navigate("/login");
//     //             }
//     //         }
//     //     };
//     //     fetchUserData();
//     // }, [navigate]);

//     // const handleProfileUpdate = async (e) => {
//     //     e.preventDefault();
//     //     setIsLoading(true);

//     //     if (!userData.id) {
//     //         toast.error("Không thể xác định ID người dùng. Vui lòng đăng nhập lại!");
//     //         setIsLoading(false);
//     //         navigate("/login");
//     //         return;
//     //     }

//     //     try {
//     //         const response = await api.put(`/${userData.id}`, {
//     //             full_name: userData.full_name,
//     //             email: userData.email,
//     //             phone: userData.phone,
//     //             address: userData.address,
//     //             blood_type: userData.blood_type, // Gửi dạng A_POSITIVE
//     //         });

//     //         const updatedUser = { ...userData, ...response.data };
//     //         localStorage.setItem("user", JSON.stringify(updatedUser));
//     //         setUserData(updatedUser);
//     //         toast.success("Cập nhật thông tin thành công!");
//     //         setIsEditing(false);
//     //     } catch (error) {
//     //         console.error("Lỗi khi cập nhật thông tin:", error);
//     //         if (error.response?.status === 404) {
//     //             toast.error("Không tìm thấy người dùng. Vui lòng kiểm tra lại!");
//     //         } else {
//     //             toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
//     //         }
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };

//     const handleScheduleAppointment = (e) => {
//         e.preventDefault();
//         const appointment = {
//             ...newAppointment,
//             status: "Đã Xác Nhận",
//         };
//         setAppointments([...appointments, appointment]);
//         setNewAppointment({ date: "", time: "", location: "" });
//         toast.success("Đặt lịch hẹn thành công!");
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("userToken");
//         localStorage.removeItem("user");
//         navigate("/login");
//         toast.info("Đã đăng xuất!");
//     };

//     const renderProfile = () => (
//         <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
//             {!isEditing ? (
//                 <>
//                     <div className="flex justify-between items-center mb-8">
//                         <div className="flex items-center space-x-6">
//                             <div className="relative">
//                                 <img
//                                     src={"https://th.bing.com/th/id/R.0fc39422f37d0bdee3f71bbbd079af4b?rik=Nf2iHwQ8QsIKJw&pid=ImgRaw&r=0"}
//                                     alt="Hồ sơ"
//                                     className="w-24 h-24 rounded-full object-cover ring-4 ring-red-100 shadow-lg"
//                                 />
//                             </div>
//                             <div>
//                                 <h2 className="text-3xl font-bold text-gray-800 mb-2">{userData.full_name}</h2>
//                                 <div className="flex items-center bg-red-50 px-4 py-2 rounded-full">
//                                     <FaTint className="text-red-600 mr-2 animate-pulse" />
//                                     <span className="text-xl font-semibold text-red-600">{getBloodTypeLabel(userData.blood_type)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
//                             disabled={isLoading}
//                         >
//                             <FaEdit className="text-red-600 text-xl" />
//                         </button>
//                     </div>
//                     <div className="space-y-4 mb-8">
//                         <p className="text-gray-600"><strong>Tên:</strong> {userData.full_name}</p>
//                         <p className="text-gray-600"><strong>Email:</strong> {userData.email}</p>
//                         <p className="text-gray-600"><strong>Điện thoại:</strong> {userData.phone}</p>
//                         <p className="text-gray-600"><strong>Địa chỉ:</strong> {userData.address}</p>
//                         <p className="text-gray-600"><strong>Nhóm máu:</strong> {getBloodTypeLabel(userData.blood_type)}</p>
//                     </div>
//                 </>
//             ) : (
//                 <form onSubmit={handleProfileUpdate} className="space-y-6">
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-gray-700 mb-2">Tên</label>
//                             <input
//                                 type="text"
//                                 value={userData.full_name || ""}
//                                 onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 mb-2">Email</label>
//                             <input
//                                 type="email"
//                                 value={userData.email || ""}
//                                 onChange={(e) => setUserData({ ...userData, email: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 mb-2">Điện thoại</label>
//                             <input
//                                 type="tel"
//                                 value={userData.phone || ""}
//                                 onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 mb-2">Địa chỉ</label>
//                             <textarea
//                                 value={userData.address || ""}
//                                 onChange={(e) => setUserData({ ...userData, address: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 mb-2">Nhóm máu</label>
//                             <select
//                                 value={userData.blood_type || ""}
//                                 onChange={(e) => setUserData({ ...userData, blood_type: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 disabled={isLoading}
//                             >
//                                 <option value="">Chưa xác định</option>
//                                 {bloodGroups.map((group) => (
//                                     <option key={group.value} value={group.value}>
//                                         {group.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="flex space-x-4">
//                         <button
//                             type="submit"
//                             className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => setIsEditing(false)}
//                             className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 disabled:border-red-400 disabled:text-red-400"
//                             disabled={isLoading}
//                         >
//                             Hủy
//                         </button>
//                     </div>
//                 </form>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <span className="text-gray-700 font-medium">Tổng Lần Hiến</span>
//                         <span className="text-3xl font-bold text-red-600">{userData.totalDonations}</span>
//                     </div>
//                 </div>
//                 <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <span className="text-gray-700 font-medium">Lần Hiến Cuối</span>
//                         <span className="text-xl font-semibold text-red-600">{userData.lastDonation}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
//                 <div className="flex items-center">
//                     <FaCheckCircle className="text-red-500 text-xl mr-3" />
//                     <span className="text-red-700 font-semibold text-lg">
//                         {userData.isEligible ? "Đủ điều kiện cho lần hiến tiếp theo" : "Chưa đủ điều kiện hiến máu"}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderHistory = () => (
//         <div className="bg-white p-8 rounded-xl shadow-2xl">
//             <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch Sử Hiến Máu</h3>
//             <div className="space-y-6">
//                 {donationHistory.map((donation, index) => (
//                     <div
//                         key={index}
//                         className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
//                     >
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <p className="font-semibold text-lg text-gray-800">{donation.location}</p>
//                                 <p className="text-gray-600">{donation.date}</p>
//                             </div>
//                             <div className="text-red-600 font-bold text-lg">{donation.amount}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     const renderAppointments = () => (
//         <div className="space-y-8">
//             <div className="bg-white p-8 rounded-xl shadow-2xl">
//                 <h3 className="text-2xl font-bold mb-6 text-gray-800">Đặt Lịch Hẹn Mới</h3>
//                 <form onSubmit={handleScheduleAppointment} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-gray-700 mb-2">Ngày</label>
//                             <input
//                                 type="date"
//                                 value={newAppointment.date}
//                                 onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 mb-2">Giờ</label>
//                             <input
//                                 type="time"
//                                 value={newAppointment.time}
//                                 onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
//                                 className="w-full p-3 border rounded-lg"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Địa điểm</label>
//                         <select
//                             value={newAppointment.location}
//                             onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
//                             className="w-full p-3 border rounded-lg"
//                             required
//                         >
//                             <option value="">Chọn địa điểm</option>
//                             <option value="Bệnh Viện Đa Khoa Trung Ương">Bệnh Viện Đa Khoa Trung Ương</option>
//                             <option value="Trung Tâm Huyết Học Quốc Gia">Trung Tâm Huyết Học Quốc Gia</option>
//                             <option value="Bệnh Viện Chợ Rẫy">Bệnh Viện Chợ Rẫy</option>
//                         </select>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
//                         disabled={isLoading}
//                     >
//                         Đặt Lịch Hẹn
//                     </button>
//                 </form>
//             </div>

//             <div className="bg-white p-8 rounded-xl shadow-2xl">
//                 <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch Hẹn Sắp Tới</h3>
//                 {appointments.map((appointment, index) => (
//                     <div key={index} className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                                 <FaCalendar className="text-red-600 text-xl mr-3" />
//                                 <span className="font-semibold text-lg">{appointment.date}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
//                                 {appointment.status}
//                             </span>
//                         </div>
//                         <div className="flex items-center text-gray-700 text-base mb-2">
//                             <FaClock className="mr-3" />
//                             <span>{appointment.time}</span>
//                         </div>
//                         <div className="flex items-center text-gray-700 text-base mb-4">
//                             <FaMapMarkerAlt className="mr-3" />
//                             <span>{appointment.location}</span>
//                         </div>
//                         <div className="flex space-x-4">
//                             <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold">
//                                 Sửa
//                             </button>
//                             <button className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-300 font-semibold">
//                                 Hủy
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     if (!userData) {
//         return <div>Đang chuyển hướng...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
//                 <div className="container mx-auto px-6 py-8">
//                     <div className="flex justify-between items-center">
//                         <div className="flex-shrink-0 flex items-center">
//                             <img
//                                 src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
//                                 alt="Biểu tượng"
//                                 className="h-8 w-8 text-red-100 animate-pulse rounded-full"
//                             />
//                             <span className="ml-2 text-2xl font-bold text-white">Dòng Máu Việt</span>
//                         </div>
//                         <button
//                             onClick={handleLogout}
//                             className="flex items-center gap-2 text-white font-semibold px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-red-700 transition-all duration-300"
//                         >
//                             <FaSignOutAlt />
//                             <span>Đăng xuất</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-6 py-8">
//                 <div className="flex flex-wrap gap-4 mb-8">
//                     {["profile", "history", "appointments"].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
//                                 activeTab === tab
//                                     ? "bg-red-600 text-white shadow-lg transform scale-105"
//                                     : "bg-white text-gray-600 hover:bg-red-50 hover:scale-102"
//                             }`}
//                         >
//                             {tab === "profile" && <FaUser />}
//                             {tab === "history" && <FaHistory />}
//                             {tab === "appointments" && <FaCalendar />}
//                             <span className="capitalize">{tab === "profile" ? "Hồ sơ" : tab === "history" ? "Lịch sử" : "Lịch hẹn"}</span>
//                         </button>
//                     ))}
//                 </div>

//                 <div className="transition-all duration-300">
//                     {activeTab === "profile" && renderProfile()}
//                     {activeTab === "history" && renderHistory()}
//                     {activeTab === "appointments" && renderAppointments()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DonateUser;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendar, FaHistory, FaSignOutAlt, FaTint, FaClock, FaMapMarkerAlt, FaCheckCircle, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/features/userSlice"; // Assuming you have a logout action

const DonateUser = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user) || {};
    const [formData, setFormData] = useState(userData); // Local state for editing
    const [donationHistory, setDonationHistory] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const bloodGroups = [
        { label: "A+", value: "A_POSITIVE" },
        { label: "A-", value: "A_NEGATIVE" },
        { label: "B+", value: "B_POSITIVE" },
        { label: "B-", value: "B_NEGATIVE" },
        { label: "AB+", value: "AB_POSITIVE" },
        { label: "AB-", value: "AB_NEGATIVE" },
        { label: "O+", value: "O_POSITIVE" },
        { label: "O-", value: "O_NEGATIVE" },
    ];

    const getBloodTypeLabel = (value) => {
        const group = bloodGroups.find((group) => group.value === value);
        return group ? group.label : "Chưa xác định";
    };

    // Fetch user data if Redux state is empty
    useEffect(() => {
        const fetchUserData = async () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                dispatch(login(parsedUser)); // Update Redux state
                setFormData(parsedUser);
            } else {
                toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
                navigate("/login");
            }
        };

        if (!userData || Object.keys(userData).length === 0) {
            fetchUserData();
        } else {
            setFormData(userData);
        }
    }, [userData, navigate, dispatch]);

    // Fetch donation history
    useEffect(() => {
        const fetchDonationHistory = async () => {
            try {
                const response = await api.get(`/donations/${userData.id}`);
                setDonationHistory(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử hiến máu:", error);
                toast.error("Không thể tải lịch sử hiến máu.");
                setDonationHistory([
                    { date: "15-01-2024", location: "Bệnh Viện Đa Khoa Trung Ương", amount: "250ml" },
                    { date: "10-10-2023", location: "Trung Tâm Huyết Học Quốc Gia", amount: "450ml" },
                    { date: "05-07-2023", location: "Bệnh Viện Chợ Rẫy", amount: "210ml" },
                ]);
            }
        };

        const fetchAppointments = async () => {
            try {
                const response = await api.get(`/appointments/${userData.id}`);
                setAppointments(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy lịch hẹn:", error);
                toast.error("Không thể tải lịch hẹn.");
                setAppointments([
                    {
                        id: 1,
                        date: "20-03-2024",
                        time: "10:00 Sáng",
                        location: "Bệnh Viện Chợ Rẫy",
                        status: "Đã Xác Nhận",
                    },
                ]);
            }
        };

        if (userData.id) {
            fetchDonationHistory();
            fetchAppointments();
        }
    }, [userData.id]);

    const [newAppointment, setNewAppointment] = useState({
        date: "",
        time: "",
        location: "",
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.full_name || !formData.email) {
            toast.error("Tên và email là bắt buộc!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.put(`/users/${userData.id}`, {
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                blood_type: formData.blood_type,
            });

            const updatedUser = { ...userData, ...response.data };
            dispatch(login(updatedUser)); // Update Redux state
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setFormData(updatedUser);
            toast.success("Cập nhật thông tin thành công!");
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            if (error.response?.status === 404) {
                toast.error("Không tìm thấy người dùng. Vui lòng kiểm tra lại!");
            } else {
                toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleAppointment = async (e) => {
        e.preventDefault();
        if (!newAppointment.date || !newAppointment.time || !newAppointment.location) {
            toast.error("Vui lòng điền đầy đủ thông tin lịch hẹn!");
            return;
        }

        const today = new Date();
        const selectedDate = new Date(newAppointment.date);
        if (selectedDate < today.setHours(0, 0, 0, 0)) {
            toast.error("Ngày hẹn không thể là ngày trong quá khứ!");
            return;
        }

        // Kiểm tra xung đột lịch hẹn
        const conflict = appointments.find(
            (appt) =>
                appt.date === newAppointment.date &&
                appt.time === newAppointment.time &&
                appt.location === newAppointment.location
        );
        if (conflict) {
            toast.error("Lịch hẹn đã tồn tại tại thời gian và địa điểm này!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post(`/appointments`, {
                user_id: userData.id,
                date: newAppointment.date,
                time: newAppointment.time,
                location: newAppointment.location,
                status: "Đã Xác Nhận",
            });
            setAppointments([...appointments, response.data]);
            setNewAppointment({ date: "", time: "", location: "" });
            toast.success("Đặt lịch hẹn thành công!");
        } catch (error) {
            console.error("Lỗi khi đặt lịch hẹn:", error);
            toast.error("Đặt lịch hẹn thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditAppointment = (appointment) => {
        setNewAppointment({
            date: appointment.date,
            time: appointment.time,
            location: appointment.location,
        });
        setAppointments(appointments.filter((appt) => appt.id !== appointment.id));
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
            try {
                await api.delete(`/appointments/${appointmentId}`);
                setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
                toast.success("Hủy lịch hẹn thành công!");
            } catch (error) {
                console.error("Lỗi khi hủy lịch hẹn:", error);
                toast.error("Hủy lịch hẹn thất bại. Vui lòng thử lại!");
            }
        }
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    };

    const renderProfile = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            {!isEditing ? (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    src={userData.profileImage || "data:image/webp;base64,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"}
                                    alt="Hồ sơ"
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-red-100 shadow-lg"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{userData.full_name || "Người dùng"}</h2>
                                <div className="flex items-center bg-red-50 px-4 py-2 rounded-full">
                                    <FaTint className="text-red-600 mr-2 animate-pulse" />
                                    <span className="text-xl font-semibold text-red-600">{getBloodTypeLabel(userData.blood_type)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                            disabled={isLoading}
                        >
                            <FaEdit className="text-red-600 text-xl" />
                        </button>
                    </div>
                    <div className="space-y-4 mb-8">
                        <p className="text-gray-600"><strong>Tên:</strong> {userData.full_name || "Chưa có thông tin"}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {userData.email || "Chưa có thông tin"}</p>
                        <p className="text-gray-600"><strong>Điện thoại:</strong> {userData.phone || "Chưa có thông tin"}</p>
                        <p className="text-gray-600"><strong>Địa chỉ:</strong> {userData.address || "Chưa có thông tin"}</p>
                        <p className="text-gray-600"><strong>Nhóm máu:</strong> {getBloodTypeLabel(userData.blood_type)}</p>
                    </div>
                </>
            ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Tên</label>
                            <input
                                type="text"
                                value={formData.full_name || ""}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Địa chỉ</label>
                            <textarea
                                value={formData.address || ""}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Nhóm máu</label>
                            <select
                                value={formData.blood_type || ""}
                                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            >
                                <option value="">Chưa xác định</option>
                                {bloodGroups.map((group) => (
                                    <option key={group.value} value={group.value}>
                                        {group.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(userData); // Reset form to original data
                            }}
                            className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 disabled:border-red-400 disabled:text-red-400"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Tổng Lần Hiến</span>
                        <span className="text-3xl font-bold text-red-600">{userData.totalDonations || 0}</span>
                    </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Lần Hiến Cuối</span>
                        <span className="text-xl font-semibold text-red-600">{userData.lastDonation || "Chưa có"}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
                <div className="flex items-center">
                    <FaCheckCircle className="text-red-500 text-xl mr-3" />
                    <span className="text-red-700 font-semibold text-lg">
                        {userData.isEligible ? "Đủ điều kiện cho lần hiến tiếp theo" : "Chưa đủ điều kiện hiến máu"}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch Sử Hiến Máu</h3>
            <div className="space-y-6">
                {donationHistory.length === 0 ? (
                    <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
                ) : (
                    donationHistory.map((donation, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-lg text-gray-800">{donation.location}</p>
                                    <p className="text-gray-600">{donation.date}</p>
                                </div>
                                <div className="text-red-600 font-bold text-lg">{donation.amount}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderAppointments = () => (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Đặt Lịch Hẹn Mới</h3>
                <form onSubmit={handleScheduleAppointment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Ngày</label>
                            <input
                                type="date"
                                value={newAppointment.date}
                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                min={new Date().toISOString().split("T")[0]} // Chỉ cho phép chọn ngày từ hôm nay trở đi
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Giờ</label>
                            <select
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            >
                                <option value="">Chọn giờ</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const hour = 8 + i; // Từ 8:00 đến 17:00
                                    return (
                                        <option key={hour} value={`${hour}:00`}>
                                            {`${hour}:00`}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Địa điểm</label>
                        <select
                            value={newAppointment.location}
                            onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                            required
                        >
                            <option value="">Chọn địa điểm</option>
                            <option value="Bệnh Viện Đa Khoa Trung Ương">Bệnh Viện Đa Khoa Trung Ương</option>
                            <option value="Trung Tâm Huyết Học Quốc Gia">Trung Tâm Huyết Học Quốc Gia</option>
                            <option value="Bệnh Viện Chợ Rẫy">Bệnh Viện Chợ Rẫy</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Đặt Lịch Hẹn"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch Hẹn Sắp Tới</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-600">Chưa có lịch hẹn nào.</p>
                ) : (
                    appointments.map((appointment, index) => (
                        <div key={index} className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <FaCalendar className="text-red-600 text-xl mr-3" />
                                    <span className="font-semibold text-lg">{appointment.date}</span>
                                </div>
                                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                                    {appointment.status}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-700 text-base mb-2">
                                <FaClock className="mr-3" />
                                <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center text-gray-700 text-base mb-4">
                                <FaMapMarkerAlt className="mr-3" />
                                <span>{appointment.location}</span>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEditAppointment(appointment)}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-300 font-semibold"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    if (!userData || Object.keys(userData).length === 0) {
        return <div className="text-center py-8">Đang chuyển hướng...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img
                                src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                                alt="Biểu tượng"
                                className="h-8 w-8 text-red-100 animate-pulse rounded-full"
                            />
                            <span className="ml-2 text-2xl font-bold text-white">Dòng Máu Việt</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-white font-semibold px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-red-700 transition-all duration-300"
                        >
                            <FaSignOutAlt />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap gap-4 mb-8">
                    {["profile", "history", "appointments"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                                activeTab === tab
                                    ? "bg-red-600 text-white shadow-lg transform scale-105"
                                    : "bg-white text-gray-600 hover:bg-red-50 hover:scale-102"
                            }`}
                        >
                            {tab === "profile" && <FaUser />}
                            {tab === "history" && <FaHistory />}
                            {tab === "appointments" && <FaCalendar />}
                            <span className="capitalize">{tab === "profile" ? "Hồ sơ" : tab === "history" ? "Lịch sử" : "Lịch hẹn"}</span>
                        </button>
                    ))}
                </div>

                <div className="transition-all duration-300">
                    {activeTab === "profile" && renderProfile()}
                    {activeTab === "history" && renderHistory()}
                    {activeTab === "appointments" && renderAppointments()}
                </div>
            </div>
        </div>
    );
};

export default DonateUser;

