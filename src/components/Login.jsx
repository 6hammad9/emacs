import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import UserProfile from './UserProfile.jsx';

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onSubmit(username, password);
      if (success) {
        setLoggedIn(true);
        setUsername('');
        setPassword('');
        navigate('/homepage');  // Redirect to homepage on success
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      {loggedIn ? (
        <UserProfile username={username} />
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default LoginForm;
