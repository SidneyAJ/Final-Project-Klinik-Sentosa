const mysql = require('mysql2/promise');

async function checkPrescriptionsSchema() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'klinik_sentosa'
    });

    try {
        console.log('=== CHECKING PRESCRIPTIONS TABLE SCHEMA ===\n');

        const [columns] = await connection.execute(
            `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
             FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions' 
             ORDER BY ORDINAL_POSITION`
        );

        console.log('Current columns:');
        columns.forEach(col => {
            const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
            console.log(`  ${col.COLUMN_NAME.padEnd(20)} ${col.COLUMN_TYPE.padEnd(30)} ${nullable}`);
        });

        // Check required columns
        const requiredColumns = {
            'total_price': "ALTER TABLE prescriptions ADD COLUMN total_price DECIMAL(10,2) DEFAULT 0.00",
            'dispensed': "ALTER TABLE prescriptions ADD COLUMN dispensed TINYINT(1) DEFAULT 0",
            'dispensed_at': "ALTER TABLE prescriptions ADD COLUMN dispensed_at TIMESTAMP NULL",
            'processed_at': "ALTER TABLE prescriptions ADD COLUMN processed_at TIMESTAMP NULL"
        };

        const existingCols = columns.map(c => c.COLUMN_NAME);
        let needsChanges = false;

        for (const [colName, alterSql] of Object.entries(requiredColumns)) {
            if (!existingCols.includes(colName)) {
                console.log(`\n⚠️  Adding missing column: ${colName}`);
                await connection.execute(alterSql);
                console.log(`✅ Added ${colName}`);
                needsChanges = true;
            }
        }

        if (!needsChanges) {
            console.log('\n✅ All required columns already exist');
        }

        // Show final schema
        const [finalCols] = await connection.execute(
            `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = 'klinik_sentosa' AND TABLE_NAME = 'prescriptions' 
             ORDER BY ORDINAL_POSITION`
        );

        console.log('\n📋 Final prescriptions table schema:');
        finalCols.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkPrescriptionsSchema();
