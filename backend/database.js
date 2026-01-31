const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'pdam.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nama_lengkap TEXT NOT NULL,
            no_pelanggan TEXT,
            telepon TEXT,
            alamat TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Complaints table
    db.run(`
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            kategori TEXT NOT NULL,
            id_pelanggan TEXT,
            tanggal DATE NOT NULL,
            deskripsi TEXT NOT NULL,
            lampiran TEXT,
            status TEXT DEFAULT 'Baru',
            admin_note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Add id_pelanggan column if it doesn't exist (for existing databases)
    db.run(`ALTER TABLE complaints ADD COLUMN id_pelanggan TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding id_pelanggan column:', err);
        }
    });

    // Create default admin account (username: admin, password: admin123)
    const bcrypt = require('bcryptjs');
    const adminPassword = bcrypt.hashSync('admin123', 10);

    db.run(`
        INSERT OR IGNORE INTO users (id, username, email, password, nama_lengkap, role)
        VALUES (1, 'admin', 'admin@pdam.com', ?, 'Administrator', 'admin')
    `, [adminPassword]);

    console.log('Database initialized successfully');
});

module.exports = db;
