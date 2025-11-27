const mysql = require('mysql2/promise');

async function fixPrescriptionsTable() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('Fixing prescriptions table schema...\n');

        // Check current schema
        const [columns] = await connection.execute(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions'"
        );

        const existingColumns = columns.map(col => col.COLUMN_NAME);
        console.log('Current columns:', existingColumns.join(', '));

        // Define required columns
        const requiredColumns = {
            'appointment_id': "ALTER TABLE prescriptions ADD COLUMN appointment_id INT NULL AFTER doctor_id",
            'notes': "ALTER TABLE prescriptions ADD COLUMN notes TEXT NULL",
            'created_at': "ALTER TABLE prescriptions ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            'updated_at': "ALTER TABLE prescriptions ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        };

        // Add missing columns
        for (const [columnName, alterSql] of Object.entries(requiredColumns)) {
            if (!existingColumns.includes(columnName)) {
                console.log(`\n⚠️  Adding missing column: ${columnName}`);
                try {
                    await connection.execute(alterSql);
                    console.log(`✅ Added ${columnName}`);
                } catch (error) {
                    console.error(`❌ Error adding ${columnName}:`, error.message);
                }
            } else {
                console.log(`✅ Column ${columnName} already exists`);
            }
        }

        // Show final schema
        const [finalColumns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions' ORDER BY ORDINAL_POSITION"
        );

        console.log('\n📋 Final prescriptions table schema:');
        finalColumns.forEach(col => {
            const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${nullable}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixPrescriptionsTable();
