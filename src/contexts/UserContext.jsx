import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

// Simulated user database
const USERS = [
  {
    id: 'N001',
    name: 'Nguyễn Thị A',
    email: 'nurse@example.com',
    password: 'nurse123', // In real app, this should be hashed
    role: 'nurse',
    department: 'Khoa Huyết học',
    position: 'Y tá',
    joinDate: '2023-01-01'
  },
  {
    id: 'D001',
    name: 'Bác sĩ Trần B',
    email: 'doctor@example.com',
    password: 'doctor123', // In real app, this should be hashed
    role: 'doctor',
    department: 'Khoa Huyết học',
    position: 'Bác sĩ',
    joinDate: '2022-01-01'
  }
];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = USERS.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // Don't include password in the user state
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 