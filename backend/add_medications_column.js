const mysql = require('mysql2/promise');

async function addMedicationsColumn() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('Checking prescriptions table schema...\n');

        // Check current schema
        const [columns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions'"
        );

        console.log('✅ Current prescriptions table columns:');
        columns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
        });

        // Check if medications column exists
        const hasMedications = columns.some(col => col.COLUMN_NAME === 'medications');

        if (!hasMedications) {
            console.log('\n⚠️  MISSING: medications column');
            console.log('Adding medications column...\n');

            await connection.execute(
                "ALTER TABLE prescriptions ADD COLUMN medications TEXT AFTER appointment_id"
            );

            console.log('✅ medications column added successfully');
        } else {
            console.log('\n✅ medications column already exists');
        }

        // Show updated schema
        const [updatedColumns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions' ORDER BY ORDINAL_POSITION"
        );

        console.log('\n📋 Updated table schema:');
        updatedColumns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
        });

        // Show count
        const [count] = await connection.execute("SELECT COUNT(*) as total FROM prescriptions");
        console.log(`\n📊 Total prescriptions: ${count[0].total}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

addMedicationsColumn();
