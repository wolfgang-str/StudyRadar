import './Login.css';
import logo from './logo.png';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/', 
        { username, password }, 
        { withCredentials: true }
      );

      // Store the access token for authentication
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
	
      navigate('/dashboard');
      setMessage("Login Successful!");
      console.log('Login Successful:', response.data);

    } catch (err) {
      setMessage("Login Failed: " + (err.response?.data?.message || 'Unknown error'));
      console.error('Login Failed:', err.response?.data);
    }
  };

  return (
    <div className="Login">
      <header className="App-header">
        <img src={logo} className="Login-logo" alt="logo" />
        <p>Please enter your username and password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default Login;
