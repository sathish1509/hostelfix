const bcrypt = require('bcrypt'); 
const { Pool } = require('pg'); 
const pool = new Pool({ connectionString: 'postgresql://postgres:root@localhost:5432/hostel_db' }); 
async function run() { 
    try {
        const salt = await bcrypt.genSalt(10); 
        const hash = await bcrypt.hash('warden123', salt); 
        await pool.query('INSERT INTO users (name, email, password, role, block) VALUES ($1, $2, $3, $4, $5)', ['Warden Block A', 'warden.a@hostel.com', hash, 'warden', 'A']); 
        console.log('Warden created: warden.a@hostel.com / warden123'); 
    } catch(err) {
        console.log("Already exists or error", err);
    }
    process.exit(0); 
} 
run();
