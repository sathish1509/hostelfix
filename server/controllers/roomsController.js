const db = require('../config/db');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await db.query(
      `SELECT r.id, r.room_number, r.occupancy_status, r.student_id, u.name as student_name 
       FROM rooms r 
       LEFT JOIN users u ON r.student_id = u.id
       ORDER BY r.room_number ASC`
    );
    res.json(rooms.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addRoom = async (req, res) => {
  try {
    const { room_number, occupancy_status } = req.body;
    const newRoom = await db.query(
      'INSERT INTO rooms (room_number, occupancy_status) VALUES ($1, $2) RETURNING *',
      [room_number, occupancy_status || 'Vacant']
    );
    res.status(201).json(newRoom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { occupancy_status, student_id } = req.body;

    const updatedRoom = await db.query(
      'UPDATE rooms SET occupancy_status = $1, student_id = $2 WHERE id = $3 RETURNING *',
      [occupancy_status, student_id || null, id]
    );

    if (updatedRoom.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updatedRoom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
