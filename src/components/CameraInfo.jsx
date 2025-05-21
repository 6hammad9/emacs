import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CameraManagement.css';

const CameraManagement = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentAreas, setDepartmentAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add New Camera');
  const [currentCamera, setCurrentCamera] = useState(null);
  const [formData, setFormData] = useState({
    cam_id: '',
    channel: '',
    camera_name: '',
    color: '#ffffff',
    department: '',
    department_area: '',
    stream_source: '0',
    stream_port: 6033,
    stream_type: 'local'
  });
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [newArea, setNewArea] = useState({
    name: '',
    department: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [camerasRes, deptsRes, areasRes] = await Promise.all([
        axios.get('http://localhost:3000/api/cameras'),
        axios.get('http://localhost:3000/api/departments'),
        axios.get('http://localhost:3000/api/departments/areas')
      ]);
      
      setCameras(camerasRes.data);
      setDepartments(deptsRes.data);
      setDepartmentAreas(areasRes.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load camera data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (!formData.cam_id || !formData.channel || !formData.camera_name || !formData.stream_source) {
        throw new Error('Camera ID, Channel, Name, and Stream Source are required');
      }

      const cameraData = {
        cam_id: formData.cam_id,
        channel: formData.channel,
        camera_name: formData.camera_name,
        color: formData.color,
        department: formData.department || null,
        department_area: formData.department_area || null,
        stream_source: formData.stream_source,
        stream_port: formData.stream_port,
        stream_type: formData.stream_type
      };

      if (currentCamera) {
        await axios.put(`http://localhost:3000/api/cameras/${currentCamera._id}`, cameraData);
      } else {
        await axios.post('http://localhost:3000/api/cameras', cameraData);
      }
      
      setShowModal(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save camera');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      if (!newDepartment) {
        throw new Error('Department name is required');
      }
      
      await axios.post('http://localhost:3000/api/departments', { 
        dep_name: newDepartment 
      });
      
      setNewDepartment('');
      setShowDeptModal(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add department');
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();
    try {
      if (!newArea.name || !newArea.department) {
        throw new Error('Area name and department are required');
      }
      
      await axios.post('http://localhost:3000/api/departments/areas', { 
        name: newArea.name,
        department: newArea.department
      });
      
      setNewArea({ name: '', department: '' });
      setShowAreaModal(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add area');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        setLoading(true);
        setError('');
        await axios.delete(`http://localhost:3000/api/cameras/${id}`);
        await fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete camera');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentCamera(null);
    setModalTitle('Add New Camera');
    setFormData({
      cam_id: '',
      channel: '',
      camera_name: '',
      color: '#ffffff',
      department: '',
      department_area: '',
      stream_source: '0',
      stream_port: 6033,
      stream_type: 'local'
    });
    setShowModal(true);
  };

  const handleEdit = (camera) => {
    setCurrentCamera(camera);
    setModalTitle('Edit Camera');
    setFormData({
      cam_id: camera.cam_id,
      channel: camera.channel,
      camera_name: camera.camera_name,
      color: camera.color || '#ffffff',
      department: camera.department?._id || '',
      department_area: camera.department_area?._id || '',
      stream_source: camera.stream_source || '0',
      stream_port: camera.stream_port || 6033,
      stream_type: camera.stream_type || 'local'
    });
    setShowModal(true);
  };

  const filteredAreas = formData.department 
    ? departmentAreas.filter(area => area.department && area.department._id === formData.department)
    : departmentAreas;

  return (
    <div className="camera-management">
      <div className="header">
        <h1>📷 Camera Management</h1>
        <div className="header-buttons">
          <button className="btn btn-primary" onClick={handleAddNew}>+ Add New Camera</button>
          <button className="btn btn-secondary" onClick={() => setShowDeptModal(true)}>+ Add Department</button>
          <button className="btn btn-secondary" onClick={() => setShowAreaModal(true)}>+ Add Area</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {loading && !cameras.length ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="camera-grid">
          {cameras.length > 0 ? (
            cameras.map(camera => (
              <div key={camera._id} className="camera-card" style={{ borderLeft: `5px solid ${camera.color || '#ffffff'}` }}>
                <div className="card-body">
                  <h3 className="card-title">{camera.camera_name}</h3>
                  <p><strong>ID:</strong> {camera.cam_id}</p>
                  <p><strong>Channel:</strong> {camera.channel}</p>
                  <p><strong>Stream:</strong> {camera.stream_source} (Port: {camera.stream_port})</p>
                  {camera.department && <p><strong>Department:</strong> {camera.department.dep_name}</p>}
                  {camera.department_area && <p><strong>Area:</strong> {camera.department_area.area_name}</p>}
                  <div className="actions">
                    <button className="btn btn-outline-primary" onClick={() => handleEdit(camera)}>✏️ Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => handleDelete(camera._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-cameras">
              <p>No cameras found. Add your first camera!</p>
            </div>
          )}
        </div>
      )}

      {/* Camera Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalTitle}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Camera ID *</label>
                    <input 
                      type="text" 
                      name="cam_id" 
                      value={formData.cam_id} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Unique camera identifier" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Channel Number *</label>
                    <input 
                      type="number" 
                      name="channel" 
                      value={formData.channel} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Channel" 
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Camera Name *</label>
                  <input 
                    type="text" 
                    name="camera_name" 
                    value={formData.camera_name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Descriptive name" 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stream Source *</label>
                    <input 
                      type="text" 
                      name="stream_source" 
                      value={formData.stream_source} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="0 for webcam or rtsp://..." 
                    />
                  </div>
                  <div className="form-group">
                    <label>Stream Port</label>
                    <input 
                      type="number" 
                      name="stream_port" 
                      value={formData.stream_port} 
                      onChange={handleInputChange} 
                      min="1024"
                      max="65535"
                      placeholder="Port number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stream Type</label>
                    <select 
                      name="stream_type" 
                      value={formData.stream_type} 
                      onChange={handleInputChange}
                    >
                      <option value="local">Local</option>
                      <option value="rtsp">RTSP</option>
                      <option value="http">HTTP</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input 
                    type="color" 
                    name="color" 
                    value={formData.color} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <div className="select-with-add">
                      <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept._id} value={dept._id}>{dept.dep_name}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setShowModal(false);
                          setShowDeptModal(true);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Area</label>
                    <div className="select-with-add">
                      <select 
                        name="department_area" 
                        value={formData.department_area} 
                        onChange={handleInputChange}
                        disabled={!formData.department}
                      >
                        <option value="">Select Area</option>
                        {filteredAreas.map(area => (
                          <option key={area._id} value={area._id}>{area.area_name}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setShowModal(false);
                          setShowAreaModal(true);
                          setNewArea(prev => ({ ...prev, department: formData.department }));
                        }}
                        disabled={!formData.department}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Camera'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Department</h2>
              <button className="close-btn" onClick={() => setShowDeptModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddDepartment}>
                <div className="form-group">
                  <label>Department Name</label>
                  <input 
                    type="text" 
                    value={newDepartment} 
                    onChange={(e) => setNewDepartment(e.target.value)} 
                    required 
                    placeholder="Department Name" 
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeptModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Area Modal */}
      {showAreaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Area</h2>
              <button className="close-btn" onClick={() => setShowAreaModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddArea}>
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={newArea.department} 
                    onChange={(e) => setNewArea({...newArea, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.dep_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Area Name</label>
                  <input 
                    type="text" 
                    value={newArea.name} 
                    onChange={(e) => setNewArea({...newArea, name: e.target.value})} 
                    required 
                    placeholder="Area Name" 
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAreaModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Area
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraManagement;