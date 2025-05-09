import React, { useState } from 'react';
import axios from 'axios';

// Define the TypeScript interface for our form data
interface FormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  // Set initial state for the form fields
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  // Handle input changes and update form state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // Optionally, trim values to remove accidental leading/trailing spaces
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password, // Don't trim password in case spaces are intended
      };

      // Send a POST request to your backend's signup endpoint
      const response = await axios.post('http://localhost:5000/api/auth/signup', trimmedData);
      
      // Alert a success message using the response from the server
      alert(response.data.message || 'Signup successful!');

      // Optionally, you might redirect the user to the login page or clear the form here
      // For example, window.location.href = '/login';
    } catch (error: any) {
      // If there is an error response, alert the error message, otherwise alert a generic error
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      {/* Render the signup form */}
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Submit button */}
        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;