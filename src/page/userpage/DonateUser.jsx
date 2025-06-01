
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendar, FaHistory, FaSignOutAlt, FaTint, FaClock, FaMapMarkerAlt, FaCheckCircle, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";

const DonateUser = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser 
            ? JSON.parse(savedUser) 
            : { 
                id: null, 
                full_name: "Người dùng", 
                email: "Chưa có thông tin", 
                phone: "Chưa có thông tin", 
                address: "Chưa có thông tin", 
                blood_type: "Chưa xác định", 
                totalDonations: 0, 
                lastDonation: "Chưa có", 
                isEligible: false, 
                profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            };
    });

    const donationHistory = [
        { date: "15-01-2024", location: "Bệnh Viện Đa Khoa Trung Ương", amount: "250ml" },
        { date: "10-10-2023", location: "Trung Tâm Huyết Học Quốc Gia", amount: "450ml" },
        { date: "05-07-2023", location: "Bệnh Viện Chợ Rẫy", amount: "210ml" },
    ];

    const [appointments, setAppointments] = useState([
        {
            date: "20-03-2024",
            time: "10:00 Sáng",
            location: "Bệnh Viện Chợ Rẫy",
            status: "Đã Xác Nhận",
        },
    ]);

    const [newAppointment, setNewAppointment] = useState({
        date: "",
        time: "",
        location: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUserData(prev => ({ ...prev, ...parsedUser }));
            } else {
                try {
                    const response = await api.get(`/17`); // Lấy dữ liệu dựa trên user_id
                    const user = response.data;
                    const formattedUser = {
                        id: user.user_id || user.id,
                        full_name: user.full_name || "Người dùng",
                        email: user.email || "Chưa có thông tin",
                        phone: user.phone || "Chưa có thông tin",
                        address: user.address || "Chưa có thông tin",
                        blood_type: user.blood_type || "Chưa xác định",
                        totalDonations: user.totalDonations || 0,
                        lastDonation: user.last_donation || "Chưa có",
                        isEligible: !!user.last_donation && parseInt(user.last_donation) > 0,
                        profileImage: user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    };
                    localStorage.setItem("user", JSON.stringify(formattedUser));
                    setUserData(formattedUser);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
                    toast.error("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại!");
                    navigate("/login");
                }
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userData.id) {
            toast.error("Không thể xác định ID người dùng. Vui lòng đăng nhập lại!");
            setIsLoading(false);
            navigate("/login");
            return;
        }

        try {
            const response = await api.put(`/${userData.id}`, {
                full_name: userData.full_name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                blood_type: userData.blood_type,
            });

            const updatedUser = { ...userData, ...response.data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserData(updatedUser);
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

    const handleScheduleAppointment = (e) => {
        e.preventDefault();
        const appointment = {
            ...newAppointment,
            status: "Đã Xác Nhận",
        };
        setAppointments([...appointments, appointment]);
        setNewAppointment({ date: "", time: "", location: "" });
        toast.success("Đặt lịch hẹn thành công!");
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        navigate("/login");
        toast.info("Đã đăng xuất!");
    };

    const renderProfile = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            {!isEditing ? (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    src={userData.profileImage}
                                    alt="Hồ sơ"
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-red-100 shadow-lg"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{userData.full_name}</h2>
                                <div className="flex items-center bg-red-50 px-4 py-2 rounded-full">
                                    <FaTint className="text-red-600 mr-2 animate-pulse" />
                                    <span className="text-xl font-semibold text-red-600">{userData.blood_type}</span>
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
                        <p className="text-gray-600"><strong>Tên:</strong> {userData.full_name}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {userData.email}</p>
                        <p className="text-gray-600"><strong>Điện thoại:</strong> {userData.phone}</p>
                        <p className="text-gray-600"><strong>Địa chỉ:</strong> {userData.address}</p>
                        <p className="text-gray-600"><strong>Nhóm máu:</strong> {userData.blood_type}</p>
                    </div>
                </>
            ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Tên</label>
                            <input
                                type="text"
                                value={userData.full_name || ""}
                                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={userData.email || ""}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Điện thoại</label>
                            <input
                                type="tel"
                                value={userData.phone || ""}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Địa chỉ</label>
                            <textarea
                                value={userData.address || ""}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Nhóm máu</label>
                            <input
                                type="text"
                                value={userData.blood_type || ""}
                                onChange={(e) => setUserData({ ...userData, blood_type: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                disabled={isLoading}
                            />
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
                            onClick={() => setIsEditing(false)}
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
                        <span className="text-3xl font-bold text-red-600">{userData.totalDonations}</span>
                    </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Lần Hiến Cuối</span>
                        <span className="text-xl font-semibold text-red-600">{userData.lastDonation}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm">
                <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 text-xl mr-3" />
                    <span className="text-green-700 font-semibold text-lg">
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
                {donationHistory.map((donation, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg text-gray-800">{donation.location}</p>
                                <p className="text-gray-600">{donation.date}</p>
                            </div>
                            <div className="text-red-600 font-bold text-lg">{donation.amount}</div>
                        </div>
                    </div>
                ))}
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
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Giờ</label>
                            <input
                                type="time"
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
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
                        Đặt Lịch Hẹn
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch Hẹn Sắp Tới</h3>
                {appointments.map((appointment, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm">
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
                            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold">
                                Sửa
                            </button>
                            <button className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-300 font-semibold">
                                Hủy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!userData) {
        return <div>Đang chuyển hướng...</div>;
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