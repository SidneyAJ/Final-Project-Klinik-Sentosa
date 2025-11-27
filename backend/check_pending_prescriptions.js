const mysql = require('mysql2/promise');

async function checkPendingPrescriptions() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('=== CHECKING PENDING PRESCRIPTIONS ===\n');

        // Check all prescriptions
        const [allPrescriptions] = await connection.execute(
            'SELECT id, patient_id, doctor_id, status, created_at FROM prescriptions ORDER BY created_at DESC LIMIT 10'
        );

        console.log('Last 10 prescriptions:');
        allPrescriptions.forEach(p => {
            console.log(`  ID: ${p.id} | Patient: ${p.patient_id} | Doctor: ${p.doctor_id} | Status: ${p.status} | Created: ${p.created_at}`);
        });

        // Check pending prescriptions
        const [pendingPrescriptions] = await connection.execute(
            "SELECT id, patient_id, doctor_id, status, created_at FROM prescriptions WHERE status = 'pending'"
        );

        console.log(`\n✅ Found ${pendingPrescriptions.length} pending prescriptions`);

        if (pendingPrescriptions.length > 0) {
            console.log('\nPending prescriptions:');
            pendingPrescriptions.forEach(p => {
                console.log(`  ID: ${p.id} | Patient: ${p.patient_id} | Doctor: ${p.doctor_id} | Created: ${p.created_at}`);
            });
        } else {
            console.log('\n⚠️  No pending prescriptions found!');
            console.log('\nTip: Create a prescription as a doctor first.');
        }

        // Check if medications field has data
        if (pendingPrescriptions.length > 0) {
            const [prescription] = await connection.execute(
                'SELECT medications FROM prescriptions WHERE id = ?',
                [pendingPrescriptions[0].id]
            );
            console.log('\nSample medications data:');
            console.log(prescription[0].medications);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkPendingPrescriptions();
