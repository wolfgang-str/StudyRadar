import './Login.css';
import { useState } from "react";
function Login() {
  const [username, setUsername] = useState('username');
  const [password, setPassword] = useState('password');
  return (
    <div className="Login">
      <header className="App-header">
        <p>
          Please Enter your Username and Password
        </p>
        <input
	  type="text"
	  required
	  value={username}
	  onChange={(e) => setUsername(e.target.value)}
        />
        <input
	  type="text"
	  required
	  value={password}
	  onChange={(e) => setPassword(e.target.value)}
        />
      </header>
    </div>
  );
}

export default Login;
