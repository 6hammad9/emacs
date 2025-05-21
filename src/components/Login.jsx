import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onSubmit(username, password);
      if (success) {
        // Clear the form fields after successful login
        setUsername('');
        setPassword('');
        // Redirect to homepage on success
        navigate('/homepage');
        // Ensure execution stops after navigation
        return;
      } else {
        // Set error message if login fails
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      // Set error message if an error occurs
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
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
  );
}

export default LoginForm;