const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
        }
    }
});

// Submit new complaint
router.post('/submit', authenticateToken, upload.single('lampiran'), (req, res) => {
    const { kategori, id_pelanggan, tanggal, deskripsi } = req.body;
    const user_id = req.user.id;
    const lampiran = req.file ? req.file.filename : null;

    if (!kategori || !tanggal || !deskripsi) {
        return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const sql = `INSERT INTO complaints (user_id, kategori, id_pelanggan, tanggal, deskripsi, lampiran)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [user_id, kategori, id_pelanggan || null, tanggal, deskripsi, lampiran], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal mengirim pengaduan' });
        }

        res.json({
            success: true,
            message: 'Pengaduan berhasil dikirim',
            complaintId: this.lastID
        });
    });
});

// Get user's complaints history
router.get('/history', authenticateToken, (req, res) => {
    const user_id = req.user.id;

    const sql = `SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC`;

    db.all(sql, [user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mengambil data' });
        }

        res.json({
            success: true,
            complaints: rows
        });
    });
});

// Get complaint detail
router.get('/:id', authenticateToken, (req, res) => {
    const complaintId = req.params.id;
    const user_id = req.user.id;

    const sql = `SELECT * FROM complaints WHERE id = ? AND user_id = ?`;

    db.get(sql, [complaintId, user_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
        }

        res.json({
            success: true,
            complaint: row
        });
    });
});

module.exports = router;
