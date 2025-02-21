// Utility function to retrieve the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Utility function to remove the token (e.g., during logout)
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Login function with JWT handling
export const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);  // Log the response body for further inspection
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    // If a token is returned, store it (this is just an example with localStorage)
    if (data.token) {
      localStorage.setItem('authToken', data.token); // Store token in localStorage
    }

    return data; // Return the data (e.g., token, message, or user info)

  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error(error.message); // Rethrow the error so it can be handled in the component
  }
};

// Register a new user
export const registerUser = async (user) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }

    return data; // Return success message or response data
  } catch (error) {
    throw new Error(error.message); // Propagate error message
  }
};

// Utility function to check if the user is logged in by checking the token
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Return true if token exists, false otherwise
};

// Utility function to handle logout
export const logout = () => {
  removeAuthToken(); // Remove token from localStorage on logout
};

// Function to make authenticated requests using JWT
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`, // Add Authorization header with the token
    },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to fetch data.');
  }

  return response.json(); // Parse and return the response data
};
