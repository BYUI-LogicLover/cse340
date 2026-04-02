import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = async (req, res) => {
  const title = 'Register';
  res.render('register', { title });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await createUser(name, email, passwordHash);
    req.flash('success', 'Registration successful! You can now log in.');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

const showLoginForm = async (req, res) => {
  const title = 'Login';
  res.render('login', { title });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  const user = await authenticateUser(email, password);

  if (user) {
    req.session.user = user;
    req.flash('success', 'Login successful!');
    console.log(user);
    res.redirect('/dashboard');
  } else {
    req.flash('error', 'Login failed. Please check your email and password.');
    res.redirect('/login');
  }
};

const processLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to access this page.');
    return res.redirect('/login');
  }
  next();
};

const requireRole = (roleName) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }
    if (req.session.user.role_name !== roleName) {
      req.flash('error', 'You do not have permission to access this page.');
      return res.redirect('/');
    }
    next();
  };
};

const showDashboard = async (req, res) => {
  const { name, email } = req.session.user;
  const title = 'Dashboard';
  res.render('dashboard', { title, name, email });
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard
};
