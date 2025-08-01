import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Register a new admin
/**
 * @param {Object} data - Admin data
 * @param {string} data.name - Name
 * @param {string} data.email - Email
 * @param {string} data.username - Username
 * @param {string} data.password - Password
 * @param {string} data.confirm_password - Confirm password
 * @returns {Object} - Success or error object
 */
export const registerAdmin = async ({ name, email, username, password, confirm_password }) => {
  
  // Check if email/username already exists
  const existing = await Admin.findOne({
    $or: [{ email }, { username }]
  });

  if (existing) {
    return { error: { message: 'Email/Username already exists. Please use a different one.', status: 409 } };
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new admin
  const admin = new Admin({
    name,
    email,
    username,
    password: hashedPassword
  });

  // Save the admin
  await admin.save();

  return { success: true };
};

  /**
   * @function loginAdmin
   * @description Logs in an admin with username and password and returns a JWT token
   * @param {Object} data - Admin data
   * @param {string} data.username - Username
   * @param {string} data.password - Password
   * @returns {Object} - Success or error object with a JWT token
   */
  export const loginAdmin = async ({ username, email, password }) => {
  // Find the admin by username or email
  const admin = await Admin.findOne({ $or: [{ username }, { email }] });
  if (!admin) {
    return { error: { message: 'Invalid credentials.', status: 401 } };
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return { error: { message: 'Invalid credentials.', status: 401 } };
  }

  // Generate a JWT token with the admin's id and role
  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { token };
};
