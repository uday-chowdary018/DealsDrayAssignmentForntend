
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccount';
import HomePage from './pages/HomePage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import EmployeeListPage from './pages/EmployeeList';
import Header from './pages/Header';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={
              <>
                <Header employeeName="Admin" onLogout={handleLogout} />
                <HomePage />
              </>
            } />
            <Route path="/create-employee" element={
              <>
                <Header employeeName="Admin" onLogout={handleLogout} />
                <CreateEmployeePage employee={employeeToEdit} mode={employeeToEdit ? 'edit' : 'create'} />
              </>
            } />
            <Route path="/employee-list" element={
              <>
                <Header employeeName="Admin" onLogout={handleLogout} />
                <EmployeeListPage onEdit={setEmployeeToEdit} />
              </>
            } />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

