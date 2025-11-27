const db = require('./database');

db.all("SELECT id, name, email, role, username FROM users WHERE role = 'admin'", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Admin Users:', rows);
});
