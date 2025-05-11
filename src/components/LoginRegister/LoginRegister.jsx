import { useState } from 'react';
import { login, register } from '../../api/auth.js';
import './loginRegister.scoped.css';

export default function LoginRegister({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setError(null);
    try {
      if (isRegister) {
        console.log("Registering user:", username, email);
        await register(username, password, email);
        console.log("Registration successful, logging in");
        const data = await login(username, password);
        console.log("Login successful", data);
        localStorage.setItem('token', data.access_token);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        } else {
          console.warn("onLoginSuccess callback is not defined");
        }
      } else {
        console.log("Logging in user:", username);
        const data = await login(username, password);
        console.log("Login successful", data);
        localStorage.setItem('token', data.access_token);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        } else {
          console.warn("onLoginSuccess callback is not defined");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      if (err.response) {
        // If error response from backend is available
        const errorData = await err.response.json();
        setError(errorData.message || 'Authentication failed');
      } else {
        setError(err.message || 'Authentication failed');
      }
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="login-register-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        {isRegister && (
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
        )}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p className="toggle-text">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}
