const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrate = async () => {
  try {
    console.log("Running migrations...");

    // 1. Add block to users
    try {
      await pool.query('ALTER TABLE users ADD COLUMN block VARCHAR(10);');
      console.log("Added block column to users.");
    } catch (e) {
      console.log("Column block might already exist.");
    }

    // 2. Drop constraint on users role and re-add it
    try {
      await pool.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;');
      await pool.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'warden', 'admin'));");
      console.log("Updated users role constraint.");
    } catch (e) {
      console.log("Error updating users role constraint:", e.message);
    }

    // 3. Drop constraint on complaints status and re-add it
    try {
      await pool.query('ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;');
      await pool.query("ALTER TABLE complaints ADD CONSTRAINT complaints_status_check CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Escalated'));");
      console.log("Updated complaints status constraint.");
    } catch (e) {
      console.log("Error updating complaints status constraint:", e.message);
    }

    console.log("Migrations complete.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
