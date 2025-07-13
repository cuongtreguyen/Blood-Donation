
// import React, { useEffect, useState } from "react";
// import { FaHistory } from "react-icons/fa";
// import api from "../../config/api";
// import { useSelector } from "react-redux";

// const HistoryComponent = ({ userId: propUserId }) => {
//   const [donationHistory, setDonationHistory] = useState([]);
//   const user = useSelector((state) => state.user);
// const userId = propUserId || user.id;

//   useEffect(() => {
//     const fetchDonationHistory = async () => {
//       try {
//         if (!userId) {
//           setDonationHistory([]);
//           return;
//         }
//         const response = await api.get(`/blood-register/history/${userId}`);
//         setDonationHistory(response.data);
//       } catch {
//         setDonationHistory([]);
//       }
//     };
//     fetchDonationHistory();
//   }, [userId]);

//   return (
//     <div className="bg-white p-8 rounded-xl shadow-2xl">
//       <h3 className="text-2xl font-bold mb-6 text-gray-800">
//         Lịch sử hiến máu
//       </h3>
//       <div className="space-y-6">
//         {donationHistory.length === 0 ? (
//           <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
//         ) : (
//           donationHistory.map((donation, index) => (
//             <div
//               key={index}
//               className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold text-lg text-gray-800">
//                     {donation.fullName || "Ẩn danh"}
//                   </p>
//                   <p className="text-gray-600">{donation.completedDate}</p>
//                 </div>
//                 <div className="text-red-600 font-bold text-lg">
//                   {donation.unit} ml
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryComponent;


// ✅ HistoryComponent.jsx
import React, { useEffect, useState } from "react";
import { FaPenFancy, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../config/api";
import WriteBlogModal from "./WriteBlogModal";

const HistoryComponent = ({ userId: propUserId }) => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [writtenDonationIds, setWrittenDonationIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const user = useSelector((state) => state.user);
  const userId = propUserId || user.id;

  const fetchData = async () => {
    try {
      const historyRes = await api.get(`/blood-register/history/${userId}`);
      setDonationHistory(historyRes.data);

      const blogRes = await api.get(`/blogs`);
      const allBlogs = blogRes.data;

      const userBlogs = allBlogs.filter(
        (blog) =>
          blog.author?.toLowerCase() === user.username?.toLowerCase() ||
          blog.authorId === user.id
      );

      const donationIds = userBlogs.map(
        (blog) => blog.donationId || blog.idDonor // fallback nếu backend đổi tên
      );
      setWrittenDonationIds(donationIds);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleWriteBlog = (donationId) => {
    setSelectedDonation(donationId);
    setModalOpen(true);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Lịch sử hiến máu</h3>
      <div className="space-y-6">
        {donationHistory.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
        ) : (
          donationHistory.map((donation, index) => {
            const alreadyWritten = writtenDonationIds.includes(donation.id);

            return (
              <div
                key={index}
                className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {donation.fullName || "Ẩn danh"}
                    </p>
                    <p className="text-gray-600">{donation.completedDate}</p>
                  </div>
                  <div className="text-red-600 font-bold text-lg">
                    {donation.unit} ml
                  </div>
                </div>
                <div className="mt-4">
                  {alreadyWritten ? (
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed flex items-center gap-2"
                      disabled
                    >
                      <FaCheck /> Đã viết blog
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                      onClick={() => handleWriteBlog(donation.id)}
                    >
                      <FaPenFancy /> Viết blog
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <WriteBlogModal
        open={modalOpen}
        onClose={(reload) => {
          setModalOpen(false);
          setSelectedDonation(null);
          if (reload) {
            fetchData();
          }
        }}
        donationId={selectedDonation}
        author={user.username}
      />
    </div>
  );
};

export default HistoryComponent;