// src/page/userpage/EmergencyComponent.jsx
import React, { useState } from "react";
import { FaTint, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";

const EmergencyComponent = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    bloodType: "",
    location: "",
    bloodTypeDetail: "",
  });

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

  const handleSearchDonors = async (e) => {
    e.preventDefault();
    if (
      !searchCriteria.bloodType &&
      !searchCriteria.location &&
      !searchCriteria.bloodTypeDetail
    ) {
      toast.error("Vui lòng chọn ít nhất một tiêu chí tìm kiếm!");
      return;
    }
    try {
      const response = await api.get("/donors/search", {
        params: {
          bloodType: searchCriteria.bloodType,
          location: searchCriteria.location,
          bloodType_detail: searchCriteria.bloodTypeDetail,
        },
      });
      toast.success("Tìm kiếm thành công!");
      console.log("Donors found:", response.data);
    } catch (err) {
      console.error("Error searching donors:", err);
      toast.error("Tìm kiếm thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-2xl">
        <h4 className="text-xl font-bold mb-4 text-gray-800">
          Tìm người hiến máu
        </h4>
        <form onSubmit={handleSearchDonors} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nhóm máu</label>
            <select
              value={searchCriteria.bloodType}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  bloodType: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Tất cả</option>
              {bloodGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Loại máu (hồng cầu, huyết tương, tiểu cầu)
            </label>
            <select
              value={searchCriteria.bloodTypeDetail}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  bloodTypeDetail: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Tất cả</option>
              <option value="red_blood">Hồng cầu</option>
              <option value="plasma">Huyết tương</option>
              <option value="platelets">Tiểu cầu</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Khu vực</label>
            <input
              type="text"
              value={searchCriteria.location}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  location: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="Nhập khu vực (VD: TP.HCM)"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
          >
            <FaSearch className="mr-2" /> Tìm kiếm
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyComponent;
