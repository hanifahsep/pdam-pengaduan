const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all complaints (admin only)
router.get('/complaints', authenticateToken, isAdmin, (req, res) => {
    const sql = `
        SELECT
            c.*,
            u.nama_lengkap,
            u.username,
            c.id_pelanggan as no_pelanggan
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mengambil data' });
        }

        res.json({
            success: true,
            complaints: rows
        });
    });
});

// Get statistics (admin only)
router.get('/statistics', authenticateToken, isAdmin, (req, res) => {
    const sqlTotal = 'SELECT COUNT(*) as total FROM complaints';
    const sqlBaru = "SELECT COUNT(*) as baru FROM complaints WHERE status = 'Baru'";
    const sqlProses = "SELECT COUNT(*) as proses FROM complaints WHERE status = 'Proses'";
    const sqlSelesai = "SELECT COUNT(*) as selesai FROM complaints WHERE status = 'Selesai'";

    Promise.all([
        new Promise((resolve, reject) => {
            db.get(sqlTotal, [], (err, row) => err ? reject(err) : resolve(row.total));
        }),
        new Promise((resolve, reject) => {
            db.get(sqlBaru, [], (err, row) => err ? reject(err) : resolve(row.baru));
        }),
        new Promise((resolve, reject) => {
            db.get(sqlProses, [], (err, row) => err ? reject(err) : resolve(row.proses));
        }),
        new Promise((resolve, reject) => {
            db.get(sqlSelesai, [], (err, row) => err ? reject(err) : resolve(row.selesai));
        })
    ]).then(([total, baru, proses, selesai]) => {
        res.json({
            success: true,
            statistics: { total, baru, proses, selesai }
        });
    }).catch(err => {
        res.status(500).json({ error: 'Gagal mengambil statistik' });
    });
});

// Update complaint status (admin only)
router.put('/complaints/:id/status', authenticateToken, isAdmin, (req, res) => {
    const complaintId = req.params.id;
    const { status, admin_note } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status wajib diisi' });
    }

    const sql = `UPDATE complaints
                 SET status = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

    db.run(sql, [status, admin_note || null, complaintId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Gagal mengupdate status' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
        }

        res.json({
            success: true,
            message: 'Status berhasil diupdate'
        });
    });
});

// Delete complaint (admin only)
router.delete('/complaints/:id', authenticateToken, isAdmin, (req, res) => {
    const complaintId = req.params.id;

    const sql = 'DELETE FROM complaints WHERE id = ?';

    db.run(sql, [complaintId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Gagal menghapus pengaduan' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
        }

        res.json({
            success: true,
            message: 'Pengaduan berhasil dihapus'
        });
    });
});

module.exports = router;
