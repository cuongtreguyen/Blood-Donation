import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
//@react-google-maps/api

const DonationMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // địa điểm Bệnh viện Chợ Rẫy
  const locations = [
    {
      id: 1,
      name: "Bệnh viện Chợ Rẫy",
      position: { lat: 10.7573, lng: 106.6574 }, // Tọa độ của bệnh viện
      address: "201B Đường Nguyễn Chí Thanh, Quận 5, TP.HCM",
      phone: "(028) 3855 4269",
      hours: "8:00 - 16:00 (Thứ 2 - Thứ 6)"
    }
  ];

  // Cấu hình cho Google Map
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  // Đặt trung tâm bản đồ là vị trí Bệnh viện Chợ Rẫy
  const center = {
    lat: 10.7573,
    lng: 106.6574
  };
//Không tắt các thành phần giao diện mặc định của Google Map (như nút zoom, compass, v.v.)
//Hiển thị nút phóng to/thu nhỏ (+ / -) trên bản đồ.
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
  };

  return (
    //tải thư viện
    //thêm api
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={options}
      >
        {locations.map(location => (
          <Marker
            key={location.id}
            position={location.position}
            onClick={() => setSelectedLocation(location)}
            icon={{
              url: '/blood-drop-marker.png',
              scaledSize: { width: 30, height: 40 }
            }}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
          >
          
            <div className="p-2 max-w-xs">
            //thông tin bệnh viện , địa chỉ , giờ hoạt động , số điện thoại,nút chỉ đường
              <h3 className="font-bold text-red-600 mb-2">{selectedLocation.name}</h3>
              <p className="text-sm mb-1">{selectedLocation.address}</p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Giờ mở cửa:</span> {selectedLocation.hours}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Điện thoại:</span>{" "}
                <a href={`tel:${selectedLocation.phone}`} className="text-blue-600 hover:underline">
                  {selectedLocation.phone}
                </a>
              </p>
              <button
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.position.lat},${selectedLocation.position.lng}`, '_blank')}
              >
                Chỉ đường
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default DonationMap; 