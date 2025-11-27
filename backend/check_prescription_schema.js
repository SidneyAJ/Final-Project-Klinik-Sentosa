const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clinic.db');

console.log('Checking prescriptions table schema...\n');

db.all("PRAGMA table_info(prescriptions)", (err, columns) => {
    if (err) {
        console.error('Error getting schema:', err);
        db.close();
        return;
    }

    if (!columns || columns.length === 0) {
        console.log('❌ prescriptions table does NOT exist');
        db.close();
        return;
    }

    console.log('✅ prescriptions table exists');
    console.log('\nTable schema:');
    columns.forEach(col => {
        console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

    // Check if medications column exists
    const hasMedications = columns.some(col => col.name === 'medications');

    if (!hasMedications) {
        console.log('\n⚠️  MISSING: medications column');
        console.log('\nAdding medications column...');

        db.run("ALTER TABLE prescriptions ADD COLUMN medications TEXT", (err) => {
            if (err) {
                console.error('Error adding column:', err);
            } else {
                console.log('✅ medications column added successfully');
            }
            db.close();
        });
    } else {
        console.log('\n✅ medications column exists');

        // Show sample data
        db.all("SELECT * FROM prescriptions LIMIT 3", (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err);
            } else {
                console.log(`\n📊 Total prescriptions: ${rows.length}`);
                if (rows.length > 0) {
                    console.log('\nSample data:');
                    rows.forEach((row, idx) => {
                        console.log(`\n  Record ${idx + 1}:`);
                        console.log(`    ID: ${row.id}`);
                        console.log(`    Patient ID: ${row.patient_id}`);
                        console.log(`    Medications: ${row.medications}`);
                    });
                }
            }
            db.close();
        });
    }
});
