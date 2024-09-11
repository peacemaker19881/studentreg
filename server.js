const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Your MySQL username
    password: '',        // Your MySQL password
    database: 'manualdevdb' // Your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Add a student
app.post('/api/students', (req, res) => {
    const { id, Names, sex, phone, district, school, trade, module, Degree, accountnumber } = req.body;
    const sql = `INSERT INTO students (id, Names, sex, phone, district, school, trade, module, Degree, accountnumber)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [id, Names, sex, phone, district, school, trade, module, Degree, accountnumber], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Student added successfully', studentId: result.insertId });
    });
});

// Update a student
app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const { Names, sex, phone, district, school, trade, module, Degree, accountnumber } = req.body;
    const sql = `UPDATE students SET Names = ?, sex = ?, phone = ?, district = ?, school = ?, trade = ?, module = ?, Degree = ?, accountnumber = ?
                 WHERE id = ?`;
    db.query(sql, [Names, sex, phone, district, school, trade, module, Degree, accountnumber, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    });
});

// Get all students
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});