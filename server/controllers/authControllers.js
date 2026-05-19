const bcrypt = require('bcrypt');

const {
  createUser,
  findUserByEmail,
} = require('../models/userModel');

const sanitizeUser = (user) => ({
  user_id: user.user_id,
  username: user.username,
  email: user.email,
  friend_code: user.friend_code,
  favorite_game: user.favorite_game,
  preferred_rules: user.preferred_rules,
});

const register = async (
  req,
  res
) => {
  try {
    const {
      username,
      email,
      friend_code,
      password,
    } = req.body;

    if (
      !username ||
      !email ||
      !friend_code ||
      !password
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user = await createUser(
      username,
      email,
      friend_code,
      passwordHash
    );

    const currentUser =
      sanitizeUser(user);

    req.session.currentUser =
      currentUser;

    res.status(201).json(
      currentUser
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        'Failed to register user',
    });
  }
};

const login = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        error:
          'Email and password are required',
      });
    }

    const user =
      await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error:
          'Invalid credentials',
      });
    }

    const isValid =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isValid) {
      return res.status(401).json({
        error:
          'Invalid credentials',
      });
    }

    const currentUser =
      sanitizeUser(user);

    req.session.currentUser =
      currentUser;

    res.json(currentUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to login',
    });
  }
};

const logout = (req, res) => {
  req.session = null;

  res.json({
    message: 'Logged out',
  });
};

const getMe = (req, res) => {
  res.json(
    req.session.currentUser || null
  );
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
