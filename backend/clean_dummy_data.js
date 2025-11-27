const db = require('./database');

async function cleanDummyData() {
    try {
        console.log('Cleaning dummy test data...');

        // Delete dummy payments for test patients
        const result = await db.query(`
            DELETE p FROM payments p
            INNER JOIN patients pat ON p.patient_id = pat.id
            WHERE pat.full_name LIKE '%test%' OR pat.full_name LIKE '%mandiri test%'
        `);

        console.log(`Deleted ${result.affectedRows || 0} dummy payment records.`);

        console.log('✅ Dummy data cleaned successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning data:', error);
        process.exit(1);
    }
}

cleanDummyData();
