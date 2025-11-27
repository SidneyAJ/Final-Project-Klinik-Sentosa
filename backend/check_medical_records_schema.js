const mysql = require('mysql2/promise');

async function checkMedicalRecordsSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('Checking medical_records table schema...\n');

        const [columns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'medical_records' ORDER BY ORDINAL_POSITION"
        );

        console.log('Current columns:');
        columns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
        });

        const hasCreatedAt = columns.some(col => col.COLUMN_NAME === 'created_at');
        const hasUpdatedAt = columns.some(col => col.COLUMN_NAME === 'updated_at');

        if (!hasCreatedAt) {
            console.log('\n⚠️  MISSING: created_at column');
            console.log('Adding created_at column...');
            await connection.execute(
                "ALTER TABLE medical_records ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
            );
            console.log('✅ created_at column added');
        }

        if (!hasUpdatedAt) {
            console.log('\n⚠️  MISSING: updated_at column');
            console.log('Adding updated_at column...');
            await connection.execute(
                "ALTER TABLE medical_records ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            );
            console.log('✅ updated_at column added');
        }

        if (hasCreatedAt && hasUpdatedAt) {
            console.log('\n✅ All required columns exist');
        }

        // Show final schema
        const [finalColumns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'medical_records' ORDER BY ORDINAL_POSITION"
        );

        console.log('\n📋 Final schema:');
        finalColumns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkMedicalRecordsSchema();
