const authService = require('./auth.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const existingUserByEmail = await authService.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    // You might add a check for existing username here too if needed
    const newUser = await authService.registerUser(req.body);
    const { password: _, ...userToReturn } = newUser;
    res.status(201).json({ message: 'User registered successfully!', user: userToReturn });
  } catch (error) {
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'User with this email or username already exists.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password: plainTextPassword } = req.body;
    if (!email || !plainTextPassword) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await authService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(plainTextPassword, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const tokenPayload = { userId: user.id, username: user.username, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful!', token: token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};

module.exports = { registerController, loginController };
