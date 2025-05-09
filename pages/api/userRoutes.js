// ==================================================================
// Delete User Route
// ==================================================================
const express = require('express');
const User = require('../models/User'); // Ensure you have a User model
const router = express.Router();

// DELETE /user/:id
// This route deletes the user with the given id
router.delete('/user/:id', async (req, res) => {
  try {
    // Retrieve the user id from the URL parameters
    const userId = req.params.id;

    // Find the user by id and delete it from the database
    const deletedUser = await User.findByIdAndDelete(userId);

    // If no user is found, return a 404 error
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return a success response with the deleted user information
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    // Log the error details and return a 500 error response
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error while deleting user.' });
  }
});

module.exports = router;