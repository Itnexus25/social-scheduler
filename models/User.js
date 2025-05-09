const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures each email is unique
      lowercase: true, // Store email in lowercase to prevent case-sensitive issues
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'], // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'], // Minimum password length
    },
    name: {
      type: String,
      required: true,
      minlength: [3, 'Name must be at least 3 characters long'], // Name length validation
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Role can only be 'user' or 'admin'
      default: 'user', // Default role is user
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  // Skip password hashing if it hasn't been modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Continue saving the user
  } catch (error) {
    next(error); // Handle any error in the password hashing process
  }
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the stored hashed password
  } catch (error) {
    throw new Error('Error comparing passwords'); // Handle any errors during the comparison
  }
};

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
