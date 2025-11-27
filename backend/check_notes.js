const db = require('./database');

db.all("SHOW COLUMNS FROM prescriptions LIKE 'notes'", (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
});
