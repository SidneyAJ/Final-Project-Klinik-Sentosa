const db = require('./database');

db.get('SELECT * FROM appointments WHERE id = 28', (err, row) => {
    if (err) console.error(err);
    else console.log(row);
});
