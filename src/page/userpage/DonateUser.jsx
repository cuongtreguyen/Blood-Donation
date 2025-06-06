

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
                                    src={userData.profileImage || "https://th.bing.com/th/id/R.0fc39422f37d0bdee3f71bbbd079af4b?rik=Nf2iHwQ8QsIKJw&pid=ImgRaw&r=0"}
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

