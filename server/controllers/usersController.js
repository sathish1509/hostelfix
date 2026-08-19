const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT id, name, email, role, room_number, block, created_at FROM users WHERE role IN ('student', 'warden') ORDER BY name ASC"
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, name, email, role, room_number, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, room_number } = req.body;
    
    const updatedUser = await db.query(
      'UPDATE users SET name = $1, room_number = $2 WHERE id = $3 RETURNING id, name, email, role, room_number',
      [name, room_number, req.user.id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
