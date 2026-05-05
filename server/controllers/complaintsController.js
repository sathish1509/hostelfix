const db = require('../config/db');

exports.createComplaint = async (req, res) => {
  try {
    const { category, description, urgency } = req.body;
    const student_id = req.user.id;

    // Get user's room number
    const userResult = await db.query('SELECT room_number FROM users WHERE id = $1', [student_id]);
    const room_number = userResult.rows[0]?.room_number;

    const newComplaint = await db.query(
      'INSERT INTO complaints (student_id, room_number, category, description, urgency) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [student_id, room_number, category, description, urgency || 'Low']
    );

    res.status(201).json(newComplaint.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const student_id = req.user.id;
    const complaints = await db.query(
      'SELECT * FROM complaints WHERE student_id = $1 ORDER BY created_at DESC',
      [student_id]
    );
    res.json(complaints.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await db.query(
      `SELECT c.*, u.name as student_name 
       FROM complaints c 
       JOIN users u ON c.student_id = u.id 
       ORDER BY c.created_at DESC`
    );
    res.json(complaints.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getWardenComplaints = async (req, res) => {
  try {
    const warden_id = req.user.id;
    
    // Get warden's block
    const userResult = await db.query('SELECT block FROM users WHERE id = $1', [warden_id]);
    const block = userResult.rows[0]?.block;

    let query = `SELECT c.*, u.name as student_name, u.block
                 FROM complaints c 
                 JOIN users u ON c.student_id = u.id`;
    let params = [];

    // If warden has a block assigned, only show complaints from that block
    if (block) {
      query += ` WHERE u.block = $1`;
      params.push(block);
    }
    
    query += ` ORDER BY c.created_at DESC`;

    const complaints = await db.query(query, params);
    res.json(complaints.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedComplaint = await db.query(
      'UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updatedComplaint.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(updatedComplaint.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await db.query(
      'SELECT status, COUNT(*) as count FROM complaints GROUP BY status'
    );
    
    const formattedStats = {
      Pending: 0,
      'In Progress': 0,
      Resolved: 0,
      Escalated: 0
    };

    stats.rows.forEach(row => {
      formattedStats[row.status] = parseInt(row.count, 10);
    });

    res.json(formattedStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
