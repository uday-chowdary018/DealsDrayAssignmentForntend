import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password }),
     credentials: 'include'
      });

      if (response.ok) {
        onLogin();
        navigate('/home');
      } else {
        const result = await response.json();
        setMessage(result.message || 'An error occurred');
      }
    } catch (error) {
      setMessage('username or password was incorrect');
    }
  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <div>
      <div className="logo">Logo</div>
     <span className='heading'>Login page</span>
    <div className='login-container'> 
       <form className='login-form' onSubmit={handleSubmit}>
       <label>Username:</label>
        <input
          type="text"
          placeholder="Username (email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='login-button' type="submit">Login</button>
        {message && <p style={{color:"red"}}>{message}</p>}
      </form>
     
      
    </div>
    <p className='createacc-message'>
        Don't have an account? <a className='account-create-link' onClick={handleCreateAccount}>Create Account</a>
      </p>
    </div>
  );
};

export default LoginPage;
