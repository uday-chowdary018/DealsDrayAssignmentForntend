import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';


    const Header = ({ onLogout }) => {
        const [employeeName, setEmployeeName] = useState('');
      
        useEffect(() => {
          const fetchEmployeeName = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/login/userinfo', {
              method:'GET',
              credentials: 'include' 
              });
              if (response.ok) {
                const data = await response.text(); 
                setEmployeeName(data);
              } else {
                console.error('Failed to fetch employee name');
              }
            } catch (error) {
              console.error('Error fetching employee name:', error);
            }
          };
      
          fetchEmployeeName();
        }, []);
      
  return (
    <div>
        <div className="logo">Logo</div>
    <header>
      
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/create-employee">Create Employee</Link>
        <Link to="/employee-list">Employee List</Link>
      </nav>
      <div className="user-info">
        <span>{employeeName}-</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
    </div>
  );
};

export default Header;
