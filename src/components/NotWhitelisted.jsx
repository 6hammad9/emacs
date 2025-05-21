import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/NotWhitelisted.css';

const NotWhitelisted = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    setLoading(true);
    setError('');

    try {
      // Placeholder data for UI testing (remove when backend is ready)
      setPersons([
        {
          _id: "1",
          name: "John Doe",
          department: "IT",
          section: "Security",
          camera: "Entrance Cam 1",
          findings: "Unauthorized access",
          date: new Date().toISOString(),
          time: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Jane Smith",
          department: "HR",
          section: "Lobby",
          camera: "Reception Cam",
          findings: "Suspicious behavior",
          date: new Date().toISOString(),
          time: new Date().toISOString(),
        }
      ]);

      // Uncomment the actual API call when backend is ready
      /*
      const response = await axios.get('/api/nonwhitelisted', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersons(response.data);
      */
    } catch (error) {
      console.error("API Error:", error);
      setError('Failed to load non-whitelisted persons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const registerPerson = (personId) => {
    console.log(`Registering person with ID ${personId}`);
  };

  return (
    <div className="not-whitelisted">
      <h1>Not Whitelisted Persons</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : persons.length === 0 ? (
        <p>No non-whitelisted persons found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Person</th>
              <th>Department</th>
              <th>Section</th>
              <th>Camera</th>
              <th>Findings</th>
              <th>Date</th>
              <th>Time</th>
              <th>Register</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person._id}>
                <td>{person.name}</td>
                <td>{person.department}</td>
                <td>{person.section}</td>
                <td>{person.camera}</td>
                <td>{person.findings}</td>
                <td>{new Date(person.date).toLocaleDateString()}</td>
                <td>{new Date(person.time).toLocaleTimeString()}</td>
                <td>
                  <button onClick={() => registerPerson(person._id)}>Register</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotWhitelisted;