// // Login function without JWT handling
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
    console.log('Response data:', data); // Log the response body for further inspection

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    return data; // Return the data (e.g., message or user info)
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

// Utility function to handle logout
export const logout = () => {
  // No token to remove, but you can add other cleanup logic here if needed
  console.log('User logged out.');
};

// Function to make regular fetch requests (without JWT authentication)
export const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to fetch data.');
  }

  return response.json(); // Parse and return the response data
};