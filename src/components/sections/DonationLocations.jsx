import React from 'react';
import { FaMapMarkerAlt, FaClock, FaPhone, FaDirections } from 'react-icons/fa';
//https://react-icons.github.io/react-icons/search/#q=map
/**
 * Component hiển thị danh sách các địa điểm hiến máu
 * Hiển thị thông tin chi tiết về các điểm thu gom máu bao gồm:
 * - Tên địa điểm
 * - Địa chỉ
 * - Giờ làm việc
 * - Số điện thoại liên hệ
 */
const DonationLocations = () => {
  // Mảng chứa thông tin các địa điểm hiến máu
  const locations = [
    {
      id: 1,
      name: "Bệnh viện Chợ Rẫy", // Tên địa điểm
      address: "201B Đường Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM", // Địa chỉ chi tiết
      hours: "8:00 - 16:00 (Thứ 2 - Thứ 6)", // Giờ làm việc
      phone: "(028) 3855 4269" // Số điện thoại liên hệ
    }
  ];

  // Hàm mở Google Maps với địa chỉ được chọn
  const openInGoogleMaps = (name, address) => {
    const searchQuery = `${name} ${address}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`, '_blank');
  };

  // Hàm mở chỉ đường trong Google Maps
  const getDirections = (name, address) => {
    const destination = `${name} ${address}`;
    const encodedDest = encodeURIComponent(destination);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedDest}`, '_blank');
  };

  return (
    <section className="py-12" id="donation-centers">
      <div className="container mx-auto px-4">
        {/* Tiêu đề section */}
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Địa Điểm Hiến Máu
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Các điểm thu gom máu gần bạn
        </p>

        {/* Container chứa danh sách địa điểm */}
        <div className="max-w-2xl mx-auto">
          {/* Map qua mảng locations để render từng địa điểm */}
          {locations.map(location => (
            <div 
              key={location.id}
              className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
            >
              {/* Tên địa điểm */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {location.name}
              </h3>
              
              {/* Thông tin địa chỉ - có thể bấm được */}
              <button 
                onClick={() => openInGoogleMaps(location.name, location.address)}
                className="flex items-center mb-3 hover:text-red-500 transition-colors w-full text-left"
              >
                <FaMapMarkerAlt className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">{location.address}</span>
              </button>
              
              {/* Thông tin giờ làm việc */}
              <div className="flex items-center mb-3">
                <FaClock className="text-red-500 mr-3" />
                <span className="text-gray-600">{location.hours}</span>
              </div>
              
              {/* Thông tin liên hệ */}
              <div className="flex items-center mb-4">
                <FaPhone className="text-red-500 mr-3" />
                <span className="text-gray-600">{location.phone}</span>
              </div>

              {/* Nút chỉ đường */}
              <button
                onClick={() => getDirections(location.name, location.address)}
                className="flex items-center justify-center w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaDirections className="mr-2" />
                <span>Chỉ đường đến địa điểm</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationLocations; 