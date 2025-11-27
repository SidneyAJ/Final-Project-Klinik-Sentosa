const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function debugIssue() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // 1. Check Schema
        console.log('--- Schema ---');
        const [schema] = await connection.execute("DESCRIBE medicines");
        console.log(schema.find(c => c.Field === 'unit'));

        // 2. Test Update
        console.log('\n--- Test Update ---');
        const testId = 12; // Decolgen
        const newUnit = 'TestUnit';

        // Update
        await connection.execute("UPDATE medicines SET unit = ? WHERE id = ?", [newUnit, testId]);
        console.log(`Updated ID ${testId} to ${newUnit}`);

        // Verify
        const [rows] = await connection.execute("SELECT unit FROM medicines WHERE id = ?", [testId]);
        console.log(`Fetched ID ${testId}:`, rows[0]);

        if (rows[0].unit === newUnit) {
            console.log('Update SUCCESS');
        } else {
            console.log('Update FAILED');
        }

        // Revert
        await connection.execute("UPDATE medicines SET unit = 'strip' WHERE id = ?", [testId]);
        console.log('Reverted to strip');

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

debugIssue();
