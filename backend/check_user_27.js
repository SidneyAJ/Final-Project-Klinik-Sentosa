const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function checkUser27() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [users] = await connection.execute("SELECT * FROM users WHERE id = 27");
        if (users.length === 0) {
            console.log('User 27 not found');
            return;
        }
        const user = users[0];
        console.log('User 27:', user);

        if (user.role === 'doctor') {
            const [docs] = await connection.execute("SELECT * FROM doctors WHERE user_id = 27");
            console.log('Doctor Profile:', docs);
            if (docs.length > 0) {
                const docId = docs[0].id;
                const [prescriptions] = await connection.execute("SELECT COUNT(*) as count FROM prescriptions WHERE doctor_id = ?", [docId]);
                console.log('Prescriptions:', prescriptions[0].count);
                const [appointments] = await connection.execute("SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ?", [docId]);
                console.log('Appointments:', appointments[0].count);
            }
        } else if (user.role === 'patient') {
            const [pats] = await connection.execute("SELECT * FROM patients WHERE user_id = 27");
            console.log('Patient Profile:', pats);
            if (pats.length > 0) {
                const patId = pats[0].id;
                const [prescriptions] = await connection.execute("SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?", [patId]);
                console.log('Prescriptions:', prescriptions[0].count);
                const [appointments] = await connection.execute("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?", [patId]);
                console.log('Appointments:', appointments[0].count);
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

checkUser27();
