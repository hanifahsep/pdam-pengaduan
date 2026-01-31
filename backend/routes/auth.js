const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { SECRET_KEY } = require('../middleware/auth');

// Register
router.post('/register', (req, res) => {
    const { username, email, password, nama_lengkap, no_pelanggan, telepon, alamat } = req.body;

    // Validate input
    if (!username || !email || !password || !nama_lengkap) {
        return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    const sql = `INSERT INTO users (username, email, password, nama_lengkap, no_pelanggan, telepon, alamat)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [username, email, hashedPassword, nama_lengkap, no_pelanggan, telepon, alamat], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Username atau email sudah terdaftar' });
            }
            return res.status(500).json({ error: 'Gagal mendaftar. Silakan coba lagi.' });
        }

        res.json({
            success: true,
            message: 'Registrasi berhasil! Silakan login.',
            userId: this.lastID
        });
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';

    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Check password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nama_lengkap: user.nama_lengkap,
                role: user.role
            }
        });
    });
});

module.exports = router;
