const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// For creating the schema on startup
const initDB = async () => {
  const setupQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) CHECK (role IN ('student', 'warden', 'admin')) DEFAULT 'student',
      room_number VARCHAR(20),
      block VARCHAR(10),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      room_number VARCHAR(20) UNIQUE NOT NULL,
      occupancy_status VARCHAR(10) CHECK (occupancy_status IN ('Occupied', 'Vacant')) DEFAULT 'Vacant',
      student_id INT REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id SERIAL PRIMARY KEY,
      student_id INT REFERENCES users(id) ON DELETE CASCADE,
      room_number VARCHAR(20),
      category VARCHAR(50) CHECK (category IN ('Electrical', 'Plumbing', 'Cleanliness', 'Furniture', 'Internet', 'Other')),
      description TEXT NOT NULL,
      urgency VARCHAR(10) CHECK (urgency IN ('Low', 'Medium', 'High')) DEFAULT 'Low',
      status VARCHAR(20) CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Escalated')) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(setupQuery);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB
};
