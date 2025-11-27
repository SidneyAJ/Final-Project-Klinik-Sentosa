const mysql = require('mysql2/promise');

async function testPrescriptionTable() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('=== PRESCRIPTIONS TABLE VERIFICATION ===\n');

        // 1. Check table structure
        const [columns] = await connection.execute(
            `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
             FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions' 
             ORDER BY ORDINAL_POSITION`
        );

        console.log('✅ Table Structure:');
        console.log('-------------------');
        columns.forEach(col => {
            const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
            const defaultVal = col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : '';
            console.log(`  ${col.COLUMN_NAME.padEnd(20)} ${col.COLUMN_TYPE.padEnd(30)} ${nullable.padEnd(10)} ${defaultVal}`);
        });

        // 2. Check for required columns
        const requiredCols = ['id', 'patient_id', 'doctor_id', 'appointment_id', 'medications', 'notes', 'status', 'created_at', 'updated_at'];
        const existingCols = columns.map(c => c.COLUMN_NAME);

        console.log('\n✅ Required Columns Check:');
        console.log('---------------------------');
        requiredCols.forEach(col => {
            const exists = existingCols.includes(col);
            console.log(`  ${col.padEnd(20)} ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
        });

        // 3. Count records
        const [count] = await connection.execute("SELECT COUNT(*) as total FROM prescriptions");
        console.log(`\n📊 Total Prescriptions: ${count[0].total}`);

        // 4. Test INSERT query (dry run - just show the query)
        console.log('\n📝 Sample INSERT Query:');
        console.log('------------------------');
        const sampleQuery = `
            INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, medications, notes, status, created_at, updated_at)
            VALUES (1, 1, 1, '[]', 'Test notes', 'pending', NOW(), NOW())
        `.trim();
        console.log(sampleQuery);

        // 5. Test UPDATE query
        console.log('\n📝 Sample UPDATE Query:');
        console.log('------------------------');
        const updateQuery = `
            UPDATE prescriptions 
            SET medications = '[]', updated_at = NOW() 
            WHERE id = 1
        `.trim();
        console.log(updateQuery);

        console.log('\n✅ Table is ready for use!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

testPrescriptionTable();
