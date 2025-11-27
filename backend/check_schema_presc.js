const db = require('./database');

db.all('DESCRIBE prescriptions', (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
});
