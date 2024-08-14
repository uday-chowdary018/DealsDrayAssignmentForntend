import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password }),
      });

      if (response.ok) {
        navigate('/'); 
      } else {
        const result = await response.text();
        setMessage(result);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div >
      <div className="logo">Logo</div>
      <span className='heading'>Create Account</span>
      <div className='login-container'> 
      <form className='login-form' onSubmit={handleCreateAccount}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Username (email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className='login-button' type="submit">Create Account</button>
        {message && <p style={{color:"red"}}>{message}</p>}
      </form>
      </div>

    </div>
  );
};

export default CreateAccountPage;

