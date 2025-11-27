const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function deleteUser27() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const userId = 27;

        // 1. Get user role
        const [users] = await connection.execute("SELECT role FROM users WHERE id = ?", [userId]);
        if (users.length === 0) {
            console.log('User not found');
            return;
        }
        const role = users[0].role;
        console.log('User role:', role);

        // 2. Cascade Delete based on role
        if (role === 'patient') {
            const [patients] = await connection.execute("SELECT id FROM patients WHERE user_id = ?", [userId]);
            if (patients.length > 0) {
                const patientId = patients[0].id;
                console.log('Patient ID:', patientId);

                // Get Appointment IDs to clean up Queues
                console.log('Deleting prescriptions...');
                await connection.execute("DELETE FROM prescriptions WHERE patient_id = ?", [patientId]);

                console.log('Deleting medical_records...');
                await connection.execute("DELETE FROM medical_records WHERE patient_id = ?", [patientId]);

                console.log('Deleting payments...');
                await connection.execute("DELETE FROM payments WHERE patient_id = ?", [patientId]);

                // Delete profile
                console.log('Deleting patient profile...');
                await connection.execute("DELETE FROM patients WHERE id = ?", [patientId]);
            }
        }

        // 3. Delete common user-related data
        console.log('Deleting notifications...');
        await connection.execute("DELETE FROM notifications WHERE user_id = ?", [userId]);

        console.log('Deleting audit_logs...');
        await connection.execute("DELETE FROM audit_logs WHERE user_id = ?", [userId]);

        // 4. Delete User
        console.log('Deleting user...');
        await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

        console.log('SUCCESS! User deleted.');

    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('SQL:', error.sql);
    } finally {
        await connection.end();
    }
}

deleteUser27();
