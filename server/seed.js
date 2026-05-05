const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seedDatabase = async () => {
  try {
    console.log("Seeding database with demo users...");
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    // Seed Admin
    const adminCheck = await pool.query("SELECT * FROM users WHERE email = 'admin@hostel.com'");
    if (adminCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ['System Admin', 'admin@hostel.com', hashedPassword, 'admin']
      );
      console.log("Created admin user");
    } else {
        console.log("Admin user already exists");
    }

    // Seed Warden
    const wardenCheck = await pool.query("SELECT * FROM users WHERE email = 'warden@hostel.com'");
    if (wardenCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role, block) VALUES ($1, $2, $3, $4, $5)",
        ['Warden Smith', 'warden@hostel.com', hashedPassword, 'warden', 'A']
      );
      console.log("Created warden user");
    } else {
        console.log("Warden user already exists");
    }

    // Seed Student
    const studentCheck = await pool.query("SELECT * FROM users WHERE email = 'student@hostel.com'");
    if (studentCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role, room_number, block) VALUES ($1, $2, $3, $4, $5, $6)",
        ['John Doe', 'student@hostel.com', hashedPassword, 'student', '101', 'A']
      );
      console.log("Created student user");
    } else {
        console.log("Student user already exists");
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
