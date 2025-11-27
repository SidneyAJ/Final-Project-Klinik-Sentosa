const db = require('./database');

async function checkSchema() {
    try {
        console.log('Checking medical_records schema...');
        const columns = await db.query('DESCRIBE medical_records');
        console.log(columns);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
