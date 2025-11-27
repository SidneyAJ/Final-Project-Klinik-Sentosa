const db = require('./database');

async function fixPatientsSchema() {
    try {
        console.log('Checking patients table schema...');

        // Check columns in patients table
        const columns = await db.query("SHOW COLUMNS FROM patients");
        const columnNames = columns.map(c => c.Field);
        console.log('Current columns:', columnNames);

        // List of required columns
        const requiredColumns = [
            { name: 'nik', type: 'VARCHAR(20)' },
            { name: 'phone', type: 'VARCHAR(20)' },
            { name: 'address', type: 'TEXT' },
            { name: 'date_of_birth', type: 'DATE' },
            { name: 'gender', type: "ENUM('L', 'P')" },
            { name: 'patient_type', type: "ENUM('mandiri', 'bpjs') DEFAULT 'mandiri'" },
            { name: 'bpjs_number', type: 'VARCHAR(50)' }
        ];

        for (const col of requiredColumns) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding missing column: ${col.name}`);
                await db.query(`ALTER TABLE patients ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Added ${col.name}`);
            }
        }

        console.log('Patients table schema fixed.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing schema:', error);
        process.exit(1);
    }
}

fixPatientsSchema();
