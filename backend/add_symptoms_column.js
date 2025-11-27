const db = require('./database');

async function migrate() {
    try {
        console.log('Adding symptoms column to medical_records...');
        await db.query('ALTER TABLE medical_records ADD COLUMN symptoms TEXT AFTER diagnosis');
        console.log('✅ Successfully added symptoms column');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ Column symptoms already exists');
            process.exit(0);
        }
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
