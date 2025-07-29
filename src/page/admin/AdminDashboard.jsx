// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Statistic, Table, Button, Tag, Progress, List, Avatar } from 'antd';
// import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
// import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';
// import BankOutlined from '@ant-design/icons/lib/icons/BankOutlined';
// import CalendarOutlined from '@ant-design/icons/lib/icons/CalendarOutlined';
// import {
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
// } from '@ant-design/icons';
// import api from '../../config/api';

// const roles = ['donor', 'staff', 'doctor', 'admin'];

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bloodInventory, setBloodInventory] = useState([]);

//   useEffect(() => {
//     // Gọi API lấy toàn bộ user giống trang AdminUsersPage
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const res = await api.get('/user/get-user-by-role', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         let allUsers = [];
//         if (Array.isArray(res.data)) {
//           allUsers = res.data;
//         } else if (typeof res.data === 'object') {
//           allUsers = Object.values(res.data).flat();
//         }
//         // Map lại dữ liệu giống AdminUsersPage
//         const usersFromApi = allUsers.map((user, idx) => ({
//           key: user.id || idx + 1,
//           id: user.id,
//           name: user.fullName,
//           email: user.email,
//           phone: user.phone,
//           role: user.role === "MEMBER" ? "donor" : user.role?.toLowerCase(),
//           status: user.status || "active",
//           joinDate: user.joinDate || (user.birthdate ? new Date(user.birthdate).toLocaleDateString('vi-VN') : "-"),
//           address: user.address || '',
//           gender: user.gender || '',
//           birthdate: user.birthdate || '',
//           height: user.height || '',
//           weight: user.weight || '',
//           lastDonation: user.lastDonation || '',
//           medicalHistory: user.medicalHistory || '',
//           emergencyName: user.emergencyName || '',
//           emergencyPhone: user.emergencyPhone || '',
//           bloodType: user.bloodType || '',
//         }));
//         setUsers(usersFromApi);
//       } catch (e) {
//         console.log(e);
//         setUsers([]);
//       }
//       setLoading(false);
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     // Gọi API lấy tồn kho máu
//     const fetchBloodInventory = async () => {
//       try {
//         const res = await api.get('/blood-inventory/get-all');
//         console.log('Blood inventory API response:', res.data);
//         setBloodInventory(Array.isArray(res.data) ? res.data : []);
//       } catch (e) {
//         console.log(e);
//         setBloodInventory([]);
//       }
//     };
//     fetchBloodInventory();
//   }, []);

//   // Thống kê
//   const totalUsers = users.length;
//   const usersByRole = roles.reduce((acc, role) => {
//     acc[role] = users.filter(u => (u.role === role || u.role?.toLowerCase() === role)).length;
//     return acc;
//   }, {});

//   // Gộp các nhóm máu trùng nhau và cộng tổng số lượng
//   const mergedBloodInventory = Object.values(
//     bloodInventory.reduce((acc, item) => {
//       if (!acc[item.bloodType]) {
//         acc[item.bloodType] = { ...item };
//       } else {
//         acc[item.bloodType].unitsAvailable += item.unitsAvailable || 0;
//       }
//       return acc;
//     }, {})
//   );

//   // Top 5 người dùng mới nhất (ưu tiên sort theo joinDate, nếu không có thì lấy đầu mảng)
//   const sortedUsers = users.slice().sort((a, b) => {
//     if (a.joinDate && b.joinDate) {
//       return new Date(b.joinDate) - new Date(a.joinDate);
//     }
//     return 0;
//   });
//   const top5Users = sortedUsers.slice(0, 5);

//   // Columns for top 5 users table (chỉ các trường: Tên, Email, Nhóm máu, Vai trò)
//   const topUserColumns = [
//     {
//       title: 'Tên',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text) => text || '-',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//       render: (text) => text || '-',
//     },
//     {
//       title: 'Nhóm máu',
//       dataIndex: 'bloodType',
//       key: 'bloodType',
//       render: (type) => {
//         if (!type) return '-';
//         const bloodMap = {
//           'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
//           'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
//           'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
//           'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
//         };
//         return bloodMap[type] || type;
//       }
//     },
//     {
//       title: 'Vai trò',
//       dataIndex: 'role',
//       key: 'role',
//       render: (role) => {
//         const labels = {
//           donor: 'Người hiến máu',
//           staff: 'Nhân viên',
//           doctor: 'Bác sĩ',
//           admin: 'Quản trị viên',
//         };
//         return labels[role] || '-';
//       },
//     },
//   ];

//   return (
//     <div>
//       <h1 style={{ marginBottom: 24 }}>Tổng quan Admin</h1>

//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Tổng người dùng"
//               value={totalUsers}
//               prefix={<UserOutlined />}
//               valueStyle={{ color: '#3f8600' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Số người hiến máu"
//               value={usersByRole['donor'] || 0}
//               valueStyle={{ color: '#1890ff' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Số nhân viên"
//               value={usersByRole['staff'] || 0}
//               valueStyle={{ color: '#389e0d' }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Main content */}
//       <Row gutter={16}>
//         <Col xs={24} lg={16}>
//           <Card title="Người dùng mới nhất" style={{ marginBottom: 24 }}>
//             <Table
//               dataSource={top5Users}
//               columns={topUserColumns}
//               pagination={false}
//               rowKey={record => record.id || record.email}
//               loading={loading}
//               size="small"
//             />
//           </Card>
//         </Col>
//         <Col xs={24} lg={8}>
//           <Card title="Tình trạng nhóm máu">
//             {!Array.isArray(mergedBloodInventory) || mergedBloodInventory.length === 0 ? (
//               <div>Không có dữ liệu tồn kho máu.</div>
//             ) : (
//               mergedBloodInventory.map(item => (
//                 <div key={item.bloodType} style={{ marginBottom: 12 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span>Nhóm máu {(() => {
//                       const bloodMap = {
//                         'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
//                         'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
//                         'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
//                         'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
//                       };
//                       return bloodMap[item.bloodType] || item.bloodType;
//                     })()}</span>
//                     <span>{item.unitsAvailable} đơn vị</span>
//                   </div>
//                   <Progress
//                     percent={Math.min(item.unitsAvailable * 10, 100)}
//                     showInfo={false}
//                     status={
//                       item.unitsAvailable < 4 ? "exception" :
//                       item.unitsAvailable > 8 ? "success" : "active"
//                     }
//                   />
//                 </div>
//               ))
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default AdminDashboard; 

// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Statistic, Table, Button, Tag, Progress, List, Avatar } from 'antd';
// import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
// import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';
// import BankOutlined from '@ant-design/icons/lib/icons/BankOutlined';
// import CalendarOutlined from '@ant-design/icons/lib/icons/CalendarOutlined';
// import {
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
// } from '@ant-design/icons';
// import api from '../../config/api';

// const roles = ['donor', 'staff', 'doctor', 'admin'];

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bloodInventory, setBloodInventory] = useState([]);

//   useEffect(() => {
//     // Gọi API lấy toàn bộ user giống trang AdminUsersPage
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const res = await api.get('/user/get-user-by-role', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         let allUsers = [];
//         if (Array.isArray(res.data)) {
//           allUsers = res.data;
//         } else if (typeof res.data === 'object') {
//           allUsers = Object.values(res.data).flat();
//         }
//         // Map lại dữ liệu giống AdminUsersPage
//         const usersFromApi = allUsers.map((user, idx) => ({
//           key: user.id || idx + 1,
//           id: user.id,
//           name: user.fullName,
//           email: user.email,
//           phone: user.phone,
//           role: user.role === "MEMBER" ? "donor" : user.role?.toLowerCase(),
//           status: user.status || "active",
//           joinDate: user.joinDate || (user.birthdate ? new Date(user.birthdate).toLocaleDateString('vi-VN') : "-"),
//           address: user.address || '',
//           gender: user.gender || '',
//           birthdate: user.birthdate || '',
//           height: user.height || '',
//           weight: user.weight || '',
//           lastDonation: user.lastDonation || '',
//           medicalHistory: user.medicalHistory || '',
//           emergencyName: user.emergencyName || '',
//           emergencyPhone: user.emergencyPhone || '',
//           bloodType: user.bloodType || '',
//         }));
//         setUsers(usersFromApi);
//       } catch (e) {
//         console.log(e);
//         setUsers([]);
//       }
//       setLoading(false);
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     // Gọi API lấy tồn kho máu
//     const fetchBloodInventory = async () => {
//       try {
//         const res = await api.get('/blood-inventory/get-all');
//         console.log('Blood inventory API response:', res.data);
//         setBloodInventory(Array.isArray(res.data) ? res.data : []);
//       } catch (e) {
//         console.log(e);
//         setBloodInventory([]);
//       }
//     };
//     fetchBloodInventory();
//   }, []);

//   // Thống kê
//   const activeUsers = users.filter(user => user.status === 'active' || user.status === 'ACTIVE');
//   const totalUsers = activeUsers.length;
//   const usersByRole = roles.reduce((acc, role) => {
//     acc[role] = activeUsers.filter(u => (u.role === role || u.role?.toLowerCase() === role)).length;
//     return acc;
//   }, {});

//   // Gộp các nhóm máu trùng nhau và cộng tổng số lượng
//   // const mergedBloodInventory = Object.values(
//   //   bloodInventory.reduce((acc, item) => {
//   //     if (!acc[item.bloodType]) {
//   //       acc[item.bloodType] = { ...item };
//   //     } else {
//   //       acc[item.bloodType].unitsAvailable += item.unitsAvailable || 0;
//   //     }
//   //     return acc;
//   //   }, {})
//   // );

//   // Top 5 người dùng mới nhất (ưu tiên sort theo joinDate, nếu không có thì lấy đầu mảng) - chỉ lấy active users
//   const sortedUsers = activeUsers.slice().sort((a, b) => {
//     if (a.joinDate && b.joinDate) {
//       return new Date(b.joinDate) - new Date(a.joinDate);
//     }
//     return 0;
//   });
//   const top5Users = sortedUsers.slice(0, 5);

//   // Columns for top 5 users table (chỉ các trường: Tên, Email, Nhóm máu, Vai trò)
//   const topUserColumns = [
//     {
//       title: 'Tên',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text) => text || '-',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//       render: (text) => text || '-',
//     },
//     {
//       title: 'Nhóm máu',
//       dataIndex: 'bloodType',
//       key: 'bloodType',
//       render: (type) => {
//         if (!type) return '-';
//         const bloodMap = {
//           'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
//           'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
//           'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
//           'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
//         };
//         return bloodMap[type] || type;
//       }
//     },
//     {
//       title: 'Vai trò',
//       dataIndex: 'role',
//       key: 'role',
//       render: (role) => {
//         const labels = {
//           donor: 'Người hiến máu',
//           staff: 'Nhân viên',
//           doctor: 'Bác sĩ',
//           admin: 'Quản trị viên',
//         };
//         return labels[role] || '-';
//       },
//     },
//   ];

//   return (
//     <div>
//       <h1 style={{ marginBottom: 24 }}>Tổng quan Admin</h1>

//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Tổng người dùng"
//               value={totalUsers}
//               prefix={<UserOutlined />}
//               valueStyle={{ color: '#3f8600' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Số người hiến máu"
//               value={usersByRole['donor'] || 0}
//               valueStyle={{ color: '#1890ff' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8} lg={8}>
//           <Card>
//             <Statistic
//               title="Số nhân viên"
//               value={usersByRole['staff'] || 0}
//               valueStyle={{ color: '#389e0d' }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Main content */}
//       <Row gutter={16}>
//         <Col xs={24} lg={16}>
//           <Card title="Người dùng mới nhất" style={{ marginBottom: 24 }}>
//             <Table
//               dataSource={top5Users}
//               columns={topUserColumns}
//               pagination={false}
//               rowKey={record => record.id || record.email}
//               loading={loading}
//               size="small"
//             />
//           </Card>
//         </Col>
//         <Col xs={24} lg={8}>
//           <Card title="Tình trạng nhóm máu">
//             {!Array.isArray(bloodInventory) || bloodInventory.length === 0 ? (
//               <div>Không có dữ liệu tồn kho máu.</div>
//             ) : (
//               bloodInventory.map(item => (
//                 <div key={item.bloodType} style={{ marginBottom: 12 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span>Nhóm máu {(() => {
//                       const bloodMap = {
//                         'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
//                         'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
//                         'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
//                         'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
//                       };
//                       return bloodMap[item.bloodType] || item.bloodType;
//                     })()}</span>
//                     <span>{item.total} đơn vị</span>
//                   </div>
//                   <Progress
//                     percent={Math.min((item.total || 0) * 10, 100)}
//                     showInfo={false}
//                     status={
//                       (item.total || 0) < 4 ? "exception" :
//                       (item.total || 0) > 8 ? "success" : "active"
//                     }
//                   />
//                 </div>
//               ))
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default AdminDashboard; 












import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Tag, Progress, List, Avatar } from 'antd';
import { UserOutlined, HeartOutlined, BankOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../../config/api';

const roles = ['donor', 'staff', 'doctor', 'admin'];

// Danh sách tất cả các nhóm máu để đảm bảo hiển thị đầy đủ
const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodInventory, setBloodInventory] = useState([]);

  useEffect(() => {
    // Fetch users (unchanged)
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/user/get-user-by-role', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        let allUsers = [];
        if (Array.isArray(res.data)) {
          allUsers = res.data;
        } else if (typeof res.data === 'object') {
          allUsers = Object.values(res.data).flat();
        }
        const usersFromApi = allUsers.map((user, idx) => ({
          key: user.id || idx + 1,
          id: user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role === "MEMBER" ? "donor" : user.role?.toLowerCase(),
          status: user.status || "active",
          joinDate: user.joinDate || (user.birthdate ? new Date(user.birthdate).toLocaleDateString('vi-VN') : "-"),
          address: user.address || '',
          gender: user.gender || '',
          birthdate: user.birthdate || '',
          height: user.height || '',
          weight: user.weight || '',
          lastDonation: user.lastDonation || '',
          medicalHistory: user.medicalHistory || '',
          emergencyName: user.emergencyName || '',
          emergencyPhone: user.emergencyPhone || '',
          bloodType: user.bloodType || '',
        }));
        setUsers(usersFromApi);
      } catch (e) {
        console.log(e);
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch blood inventory
    const fetchBloodInventory = async () => {
      try {
        const res = await api.get('/blood-inventory/get-all');
        console.log('Blood inventory data:', res.data);
        const inventory = Array.isArray(res.data) ? res.data : [];
        // Đảm bảo tất cả nhóm máu đều có trong danh sách, mặc định total là 0 nếu không có
        const inventoryMap = inventory.reduce((acc, item) => {
          const bloodType = (() => {
            const bloodMap = {
              'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
              'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
              'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
              'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
            };
            return bloodMap[item.bloodType] || item.bloodType;
          })();
          acc[bloodType] = { bloodType, total: item.total || 0 };
          return acc;
        }, {});
        const completeInventory = allBloodTypes.map(bloodType => 
          inventoryMap[bloodType] || { bloodType, total: 0 }
        );
        setBloodInventory(completeInventory);
      } catch (e) {
        console.log(e);
        setBloodInventory([]);
      }
    };
    fetchBloodInventory();
  }, []);

  // Function to convert ml to units (1 unit = 250 ml)
  const convertMlToUnits = (ml) => {
    if (!ml && ml !== 0) return 0;
    return Math.round(ml / 250);
  };

  // Statistics
  const activeUsers = users.filter(user => user.status === 'active' || user.status === 'ACTIVE');
  const totalUsers = activeUsers.length;
  const usersByRole = roles.reduce((acc, role) => {
    acc[role] = activeUsers.filter(u => (u.role === role || u.role?.toLowerCase() === role)).length;
    return acc;
  }, {});

  // Top 5 users (unchanged)
  const sortedUsers = activeUsers.slice().sort((a, b) => {
    if (a.joinDate && b.joinDate) {
      return new Date(b.joinDate) - new Date(a.joinDate);
    }
    return 0;
  });
  const top5Users = sortedUsers.slice(0, 5);

  // Columns for top 5 users table (unchanged)
  const topUserColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (type) => {
        if (!type) return '-';
        const bloodMap = {
          'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
          'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
          'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
          'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
        };
        return bloodMap[type] || type;
      }
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const labels = {
          donor: 'Người hiến máu',
          staff: 'Nhân viên',
          doctor: 'Bác sĩ',
          admin: 'Quản trị viên',
        };
        return labels[role] || '-';
      },
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Tổng quan Admin</h1>

      {/* Statistics Cards (unchanged) */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} lg={8}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={8}>
          <Card>
            <Statistic
              title="Số người hiến máu"
              value={usersByRole['donor'] || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={8}>
          <Card>
            <Statistic
              title="Số nhân viên"
              value={usersByRole['staff'] || 0}
              valueStyle={{ color: '#389e0d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main content */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Người dùng mới nhất" style={{ marginBottom: 24 }}>
            <Table
              dataSource={top5Users}
              columns={topUserColumns}
              pagination={false}
              rowKey={record => record.id || record.email}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tình trạng nhóm máu">
            {!Array.isArray(bloodInventory) || bloodInventory.length === 0 ? (
              <div>Không có dữ liệu tồn kho máu.</div>
            ) : (
              bloodInventory.map(item => (
                <div key={item.bloodType} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nhóm máu {item.bloodType}</span>
                    <span>{convertMlToUnits(item.total)} đơn vị</span>
                  </div>
                  <Progress
                    percent={Math.min((convertMlToUnits(item.total) || 0) * 10, 100)}
                    showInfo={false}
                    status={
                      (convertMlToUnits(item.total) || 0) < 4 ? "exception" :
                      (convertMlToUnits(item.total) || 0) > 8 ? "success" : "active"
                    }
                  />
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;