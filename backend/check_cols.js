const db = require('./database');

db.all("SHOW COLUMNS FROM prescriptions", (err, rows) => {
    if (err) console.error(err);
    else console.log(rows.map(r => r.Field));
});
