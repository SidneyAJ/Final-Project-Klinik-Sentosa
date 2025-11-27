const db = require('./database');

async function createVitalSignsSchema() {
    try {
        console.log('Creating vital signs schema...');

        // 1. Create vital_signs table
        console.log('Creating vital_signs table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS vital_signs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                patient_id INT NOT NULL,
                appointment_id INT,
                queue_id INT,
                nurse_id INT NOT NULL,
                
                -- Vital Signs Data
                blood_pressure_systolic INT,
                blood_pressure_diastolic INT,
                heart_rate INT,
                temperature DECIMAL(4,1),
                weight DECIMAL(5,2),
                height DECIMAL(5,2),
                blood_type VARCHAR(5),
                oxygen_saturation INT,
                
                notes TEXT,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (patient_id) REFERENCES patients(id),
                FOREIGN KEY (nurse_id) REFERENCES nurses(id),
                FOREIGN KEY (appointment_id) REFERENCES appointments(id),
                FOREIGN KEY (queue_id) REFERENCES queues(id)
            )
        `);
        console.log('✅ vital_signs table created');

        // 2. Check and add columns to queues table
        const queueColumns = await db.query("SHOW COLUMNS FROM queues");
        const queueColumnNames = queueColumns.map(c => c.Field);

        if (!queueColumnNames.includes('nurse_status')) {
            console.log('Adding nurse_status column to queues...');
            await db.query(`
                ALTER TABLE queues 
                ADD COLUMN nurse_status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending'
            `);
            console.log('✅ nurse_status column added');
        }

        if (!queueColumnNames.includes('vital_signs_id')) {
            console.log('Adding vital_signs_id column to queues...');
            await db.query(`
                ALTER TABLE queues 
                ADD COLUMN vital_signs_id INT,
                ADD FOREIGN KEY (vital_signs_id) REFERENCES vital_signs(id)
            `);
            console.log('✅ vital_signs_id column added');
        }

        console.log('✅ Vital signs schema created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating schema:', error);
        process.exit(1);
    }
}

createVitalSignsSchema();
