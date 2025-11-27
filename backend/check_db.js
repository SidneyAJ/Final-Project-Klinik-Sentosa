const db = require('./database');

async function checkData() {
    try {
        console.log('--- Latest Medical Records ---');
        const records = await new Promise((resolve, reject) => {
            db.all('SELECT id, appointment_id, diagnosis FROM medical_records ORDER BY id DESC LIMIT 3', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        console.log(records);

        if (records.length > 0) {
            const lastAppId = records[0].appointment_id;
            console.log(`\n--- Prescription for Appointment ID ${lastAppId} ---`);
            const prescription = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM prescriptions WHERE appointment_id = ?', [lastAppId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            console.log(prescription);
        }

    } catch (error) {
        console.error(error);
    }
}

checkData();
