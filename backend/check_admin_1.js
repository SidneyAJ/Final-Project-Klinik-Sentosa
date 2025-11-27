const db = require('./database');

db.get("SELECT id, name, email, role FROM users WHERE id = 1", [], (err, row) => {
    if (err) console.error(err);
    else console.log('Admin ID 1:', row);
});
