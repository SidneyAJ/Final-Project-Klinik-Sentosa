const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function addExpiryDateColumn() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('🔧 Adding expiry_date column to medicines table...\n');

        // Check if column already exists
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'klinik_sentosa' 
            AND TABLE_NAME = 'medicines'
            AND COLUMN_NAME = 'expiry_date'
        `);

        if (columns.length === 0) {
            await connection.execute(`
                ALTER TABLE medicines 
                ADD COLUMN expiry_date DATE NULL
            `);
            console.log('✅ expiry_date column added successfully!\n');
        } else {
            console.log('⏭️  expiry_date column already exists, skipping.\n');
        }

        console.log('✨ Migration complete!\n');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

// Run the migration
addExpiryDateColumn()
    .then(() => {
        console.log('🎉 Migration successful!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });
