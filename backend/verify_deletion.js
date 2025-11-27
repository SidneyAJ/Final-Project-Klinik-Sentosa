const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function verifyDeletion() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check User
        const [users] = await connection.execute("SELECT * FROM users WHERE id = 27");
        if (users.length === 0) {
            console.log('User 27 is GONE.');

            // Check if any appointments remain for the patient profile (which should also be gone)
            // But we don't know the patient_id anymore if the patient record is gone.
            // However, we saw in previous step patient_id was 21.
            const patientId = 21;
            const [apps] = await connection.execute("SELECT * FROM appointments WHERE patient_id = ?", [patientId]);
            console.log(`Appointments for Patient ID ${patientId}: ${apps.length}`);

            const [pats] = await connection.execute("SELECT * FROM patients WHERE id = ?", [patientId]);
            console.log(`Patient Profile ID ${patientId}: ${pats.length}`);

        } else {
            console.log('User 27 STILL EXISTS.');
            console.log('Please try deleting it again from the Admin Dashboard.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

verifyDeletion();
