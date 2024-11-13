import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // State to store the user data
  const [backendData, setBackendData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [editId, setEditId] = useState(null); // Track which user is being edited

  // Fetch users from backend when component mounts
  useEffect(() => {
    fetch("/api/user")
      .then(response => response.json())
      .then(data => setBackendData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handle form submission for creating a user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const newUser = { name, age, city };

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setBackendData([...backendData, data]);
      setName('');
      setAge('');
      setCity('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle form submission for updating a user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const updatedUser = { name, age, city };

    try {
      const response = await fetch(`/api/user/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      const updatedData = backendData.map(user =>
        user._id === data._id ? data : user
      );
      setBackendData(updatedData);
      setName('');
      setAge('');
      setCity('');
      setEditId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle delete action
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBackendData(backendData.filter(user => user._id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle editing a user (populate the form with existing user data)
  const handleEditUser = (user) => {
    setName(user.name);
    setAge(user.age);
    setCity(user.city);
    setEditId(user._id);
  };

  // Validate the age input (non-negative, <= 100)
  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 100) {
      setAge(value);
    } else if (value === '') {
      setAge(''); // Allow clearing the input
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      <form onSubmit={editId ? handleUpdateUser : handleCreateUser}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age: </label>
          <input
            type="number"
            value={age}
            onChange={handleAgeChange}  // Updated to use handleAgeChange
            required
            min="18"  // Ensures the input is at least 0
            max="70" // Ensures the input does not exceed 100
          />
        </div>
        <div>
          <label>City: </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={age < 0 || age > 100}>
          {editId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <h2>Users List</h2>
      <ul>
        {backendData.length === 0 ? (
          <p>No users available.</p>
        ) : (
          backendData.map((user) => (
            <li key={user._id}>
              <p>
                {user.name} - {user.age} - {user.city}
              </p>
              <button onClick={() => handleEditUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
