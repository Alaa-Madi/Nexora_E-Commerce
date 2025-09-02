const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const transporter = require('../config/mailer');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour
    user.reset_token = token;
    user.reset_token_expiry = expiry;
    await user.save();
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}&id=${user.id}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password using this link: ${resetLink}`,
    });
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, id, password } = req.body;
    const user = await User.findOne({ where: { id, reset_token: token } });
    if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, forgetPassword, resetPassword };
