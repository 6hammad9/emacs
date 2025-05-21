import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPerson.css";

const RegisterPerson = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [status, setStatus] = useState("");
  const [camId, setCamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [camerasLoading, setCamerasLoading] = useState(false);
  const [camerasError, setCamerasError] = useState("");
  const [registeredPersons, setRegisteredPersons] = useState([]);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [personsError, setPersonsError] = useState("");
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    fetchCameras();
    fetchRegisteredPersons();
  }, []);

  const fetchCameras = async () => {
    setCamerasLoading(true);
    setCamerasError("");
    try {
      const response = await axios.get("http://localhost:3000/api/cameras");
      setCameras(response.data);
    } catch (error) {
      console.error("Failed to fetch cameras:", error);
      setCamerasError("Failed to load cameras. Please try again.");
    } finally {
      setCamerasLoading(false);
    }
  };

  const fetchRegisteredPersons = async () => {
    setPersonsLoading(true);
    setPersonsError("");
    try {
      const response = await axios.get("http://localhost:3000/register-person");
      setRegisteredPersons(response.data);
    } catch (error) {
      console.error("Error fetching registered persons:", error);
      setPersonsError("Failed to fetch registered persons. Please try again.");
    } finally {
      setPersonsLoading(false);
    }
  };

  const handleStatusChange = (newStatus, cameraId) => {
    setStatus(newStatus);
    setCamId(cameraId);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!name || !camId || !status) {
    setError("All fields are required except image");
    setLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("cam_id", camId);
    formData.append("status", status);
    if (image) {
      formData.append("image", image);
    }

    console.log("Sending formData:", formData);

    const response = await axios.post("http://localhost:3000/register-person", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Response:", response.data);

    await fetchRegisteredPersons();
    resetForm();
  } catch (error) {
    console.error("Failed to save person:", error);
    setError("Failed to save person. Try again.");
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setName("");
    setImage(null);
    setStatus("");
    setCamId("");
    setEditingPerson(null);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setName(person.name);
    setStatus(person.status);
    setCamId(person.cam_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await axios.delete(`http://localhost:3000/register-person/${id}`);
        await fetchRegisteredPersons();
      } catch (error) {
        console.error("Failed to delete person:", error);
        setError("Failed to delete person. Try again.");
      }
    }
  };

  return (
    <div className="register-person">
      <h1>Person Management</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button onClick={() => setError("")} className="close-btn">
            ×
          </button>
        </div>
      )}

      <div className="content-section">
        <div className="register-form">
          <h2>{editingPerson ? "Edit Person" : "Register a Person"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="personName">Name:</label>
              <input
                id="personName"
                name="personName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="personImage">Image:</label>
              <input
                id="personImage"
                name="personImage"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cameraSelect">Whitelisted Cameras:</label>
              {camerasLoading ? (
                <p>Loading cameras...</p>
              ) : camerasError ? (
                <p className="error">{camerasError}</p>
              ) : (
                <select
                  id="cameraSelect"
                  name="cameraSelect"
                  value={camId}
                  onChange={(e) =>
                    handleStatusChange("whitelisted", e.target.value)
                  }
                  required
                >
                  <option value="">Select a camera</option>
                  {cameras.map((camera) => (
                    <option key={camera._id} value={camera.cam_id}>
                      {camera.camera_name} (ID: {camera.cam_id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || camerasLoading}
            >
              {loading ? (editingPerson ? "Updating..." : "Registering...") : editingPerson ? "Update Person" : "Register Person"}
            </button>

            {editingPerson && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="registered-persons">
          <h2>Registered Persons</h2>
          {personsLoading ? (
            <p>Loading persons...</p>
          ) : personsError ? (
            <p className="error">{personsError}</p>
          ) : registeredPersons.length === 0 ? (
            <p>No registered persons found.</p>
          ) : (
            <div className="person-grid">
  {registeredPersons.map((person) => (
    <div key={person._id} className="person-card">
      <div className="card-body">
        {person.image && (
          <img
            src={`http://localhost:3000/uploads/${person.image}`}
            alt={person.name}
            className="person-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150"; // Fallback image
            }}
          />
        )}
        <h3>{person.name}</h3>
        <p><strong>Status:</strong> {person.status}</p>
        <p><strong>Camera ID:</strong> {person.cam_id}</p>
        <button className="btn btn-warning" onClick={() => handleEdit(person)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => handleDelete(person._id)}>
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPerson;
