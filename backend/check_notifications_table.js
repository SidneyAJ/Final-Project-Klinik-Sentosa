const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clinic.db');

// Check if notifications table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='notifications'", (err, row) => {
    if (err) {
        console.error('Error checking table:', err);
        return;
    }

    if (!row) {
        console.log('❌ notifications table does NOT exist');
        console.log('\nCreating notifications table...');

        // Create the table
        db.run(`
            CREATE TABLE notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT DEFAULT 'info',
                is_read INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('✅ notifications table created successfully');
            }
            db.close();
        });
    } else {
        console.log('✅ notifications table exists');

        // Check table schema
        db.all("PRAGMA table_info(notifications)", (err, columns) => {
            if (err) {
                console.error('Error getting schema:', err);
            } else {
                console.log('\nTable schema:');
                columns.forEach(col => {
                    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
                });
            }

            // Check if there are any notifications
            db.get("SELECT COUNT(*) as count FROM notifications", (err, result) => {
                if (err) {
                    console.error('Error counting notifications:', err);
                } else {
                    console.log(`\n📊 Total notifications: ${result.count}`);
                }
                db.close();
            });
        });
    }
});
