const mysql = require('mysql2/promise');

async function checkAppointmentsSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('Checking appointments table schema...\n');

        const [columns] = await connection.execute(
            "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'appointments'"
        );

        console.log('Current columns:');
        columns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
        });

        const hasUpdatedAt = columns.some(col => col.COLUMN_NAME === 'updated_at');

        if (!hasUpdatedAt) {
            console.log('\n⚠️  MISSING: updated_at column');
            console.log('Adding updated_at column...');

            await connection.execute(
                "ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            );
            console.log('✅ updated_at column added successfully');
        } else {
            console.log('\n✅ updated_at column already exists');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkAppointmentsSchema();
