const db = require('./database');

async function migrate() {
    console.log('Starting Payment System Migration (Fixed)...');
    const connection = await db.pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Modify patients table
        console.log('\n1. Checking patients table...');
        const [patientCols] = await connection.query("SHOW COLUMNS FROM patients LIKE 'patient_type'");
        if (patientCols.length === 0) {
            await connection.query(`
                ALTER TABLE patients 
                ADD COLUMN patient_type ENUM('mandiri', 'bpjs') DEFAULT 'mandiri',
                ADD COLUMN bpjs_number VARCHAR(50) NULL
            `);
            console.log('✅ Added patient_type and bpjs_number to patients.');
        } else {
            console.log('✅ patients table already has patient_type.');
        }

        // 2. Modify payments table - Add missing columns
        console.log('\n2. Checking payments table...');

        // Check and add prescription_id
        const [prescCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'prescription_id'");
        if (prescCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN prescription_id INT NULL`);
            console.log('✅ Added prescription_id to payments');
        }

        // Check and add payment_method enum
        const [methodCol] = await connection.query("SHOW COLUMNS FROM payments WHERE Field = 'payment_method'");
        if (methodCol.length === 0 || !methodCol[0].Type.includes('admin_manual')) {
            await connection.query(`
                ALTER TABLE payments 
                MODIFY COLUMN payment_method ENUM('cash', 'transfer', 'admin_manual', 'bpjs') DEFAULT 'cash'
            `);
            console.log('✅ Updated payment_method ENUM');
        }

        // Check and update status enum
        const [statusCol] = await connection.query("SHOW COLUMNS FROM payments WHERE Field = 'status'");
        if (statusCol.length === 0 || !statusCol[0].Type.includes('verified')) {
            await connection.query(`
                ALTER TABLE payments 
                MODIFY COLUMN status ENUM('pending', 'verified', 'rejected', 'paid', 'cancelled') DEFAULT 'pending'
            `);
            console.log('✅ Updated status ENUM');
        }

        // Check and add payment_proof
        const [proofCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'payment_proof'");
        if (proofCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN payment_proof TEXT NULL`);
            console.log('✅ Added payment_proof');
        }

        // Check and add verified_by
        const [verByCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'verified_by'");
        if (verByCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN verified_by INT NULL`);
            console.log('✅ Added verified_by');
        }

        // Check and add verified_at
        const [verAtCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'verified_at'");
        if (verAtCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN verified_at DATETIME NULL`);
            console.log('✅ Added verified_at');
        }

        // Check and add notes
        const [notesCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'notes'");
        if (notesCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN notes TEXT NULL`);
            console.log('✅ Added notes');
        }

        // Check and add payment_date
        const [dateCol] = await connection.query("SHOW COLUMNS FROM payments LIKE 'payment_date'");
        if (dateCol.length === 0) {
            await connection.query(`ALTER TABLE payments ADD COLUMN payment_date DATETIME DEFAULT CURRENT_TIMESTAMP`);
            console.log('✅ Added payment_date');
        }

        // Modify amount to decimal
        await connection.query(`ALTER TABLE payments MODIFY COLUMN amount DECIMAL(10,2) NOT NULL DEFAULT 0`);
        console.log('✅ Ensured amount is DECIMAL(10,2)');

        // 3. Create payment_items table
        console.log('\n3. Creating payment_items table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payment_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                payment_id INT NOT NULL,
                item_type ENUM('examination', 'doctor', 'medicine', 'other') NOT NULL,
                description VARCHAR(255),
                quantity INT DEFAULT 1,
                unit_price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ payment_items table ready');

        await connection.commit();
        console.log('\n🎉 Migration completed successfully!');
    } catch (error) {
        await connection.rollback();
        console.error('\n❌ Migration failed:', error);
    } finally {
        connection.release();
        process.exit();
    }
}

migrate();
