// BlogComponent.jsx
import React, { useState } from "react";
import { FaPenFancy } from "react-icons/fa";
import WriteBlogModal from "./WriteBlogModal";
import { useSelector } from "react-redux";

const BlogComponent = () => {
  const [showBlogModal, setShowBlogModal] = useState(false);
  const userData = useSelector((state) => state.user) || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Chia sẻ blog</h2>
        <button
          onClick={() => setShowBlogModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaPenFancy />
          Viết blog chia sẻ
        </button>
      </div>

      <p className="text-gray-500 italic">
        Bạn chưa có blog nào (chức năng xem blog sẽ hiển thị khi có API).
      </p>

      <WriteBlogModal
        open={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        author={userData.fullName}
        donationId={null}
      />
    </div>
  );
};

export default BlogComponent;
