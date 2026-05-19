import pool from '../db/pool.js';

export const createUser = async (
  username,
  email,
  friendCode,
  passwordHash
) => {
  const query = `
    INSERT INTO users
    (
      username,
      email,
      friend_code,
      password_hash
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      user_id,
      username,
      email,
      friend_code
  `;

  const values = [
    username,
    email,
    friendCode,
    passwordHash,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

export const findUserById = async (userId) => {
  const query = `
    SELECT
      user_id,
      username,
      email,
      friend_code
    FROM users
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
};