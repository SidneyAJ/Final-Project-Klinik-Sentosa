const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

const medicines = [
    // Analgesik & Antipiretik
    { name: 'Paracetamol 500mg', category: 'Analgesik', unit: 'tablet', price: 500, stock: 500, description: 'Pereda nyeri dan penurun demam' },
    { name: 'Ibuprofen 400mg', category: 'Analgesik', unit: 'tablet', price: 800, stock: 300, description: 'Pereda nyeri dan anti-inflamasi' },
    { name: 'Asam Mefenamat 500mg', category: 'Analgesik', unit: 'kaplet', price: 1000, stock: 200, description: 'Nyeri gigi dan sakit kepala' },
    { name: 'Neuralgin RX', category: 'Analgesik', unit: 'kaplet', price: 2500, stock: 150, description: 'Nyeri syaraf dan pegal linu' },
    { name: 'Panadol Extra', category: 'Analgesik', unit: 'blister', price: 15000, stock: 100, description: 'Sakit kepala membandel' },

    // Antibiotik (Resep Dokter)
    { name: 'Amoxicillin 500mg', category: 'Antibiotik', unit: 'kaplet', price: 2000, stock: 400, description: 'Antibiotik spektrum luas' },
    { name: 'Cefadroxil 500mg', category: 'Antibiotik', unit: 'kapsul', price: 3000, stock: 250, description: 'Infeksi kulit dan tenggorokan' },
    { name: 'Azithromycin 500mg', category: 'Antibiotik', unit: 'tablet', price: 15000, stock: 100, description: 'Infeksi saluran pernapasan' },
    { name: 'Ciprofloxacin 500mg', category: 'Antibiotik', unit: 'tablet', price: 2500, stock: 150, description: 'Infeksi saluran kemih' },
    { name: 'Doxycycline 100mg', category: 'Antibiotik', unit: 'kapsul', price: 1500, stock: 120, description: 'Infeksi bakteri umum' },

    // Flu & Batuk
    { name: 'OBH Combi Batuk Berdahak', category: 'Batuk & Flu', unit: 'botol', price: 18000, stock: 80, description: 'Sirup obat batuk berdahak' },
    { name: 'Siladex Antitussive', category: 'Batuk & Flu', unit: 'botol', price: 22000, stock: 60, description: 'Batuk kering tidak berdahak' },
    { name: 'Vicks Formula 44', category: 'Batuk & Flu', unit: 'botol', price: 25000, stock: 70, description: 'Meredakan batuk dan flu' },
    { name: 'Procold Flu & Batuk', category: 'Batuk & Flu', unit: 'strip', price: 4000, stock: 200, description: 'Meringankan gejala flu' },
    { name: 'Decolgen', category: 'Batuk & Flu', unit: 'strip', price: 3500, stock: 200, description: 'Sakit kepala dan hidung tersumbat' },

    // Vitamin & Suplemen
    { name: 'Enervon C', category: 'Vitamin', unit: 'botol', price: 45000, stock: 50, description: 'Multivitamin jaga daya tahan tubuh' },
    { name: 'Becomzet', category: 'Vitamin', unit: 'strip', price: 25000, stock: 80, description: 'Vitamin B Kompleks + Zinc' },
    { name: 'Vitacimin 500mg', category: 'Vitamin', unit: 'strip', price: 2000, stock: 500, description: 'Vitamin C hisap lemon' },
    { name: 'Imboost Force', category: 'Vitamin', unit: 'strip', price: 45000, stock: 60, description: 'Immunomodulator' },
    { name: 'Sangobion', category: 'Vitamin', unit: 'kapsul', price: 2500, stock: 150, description: 'Penambah darah' },

    // Pencernaan
    { name: 'Promag', category: 'Pencernaan', unit: 'blister', price: 8000, stock: 300, description: 'Obat sakit maag dan kembung' },
    { name: 'Mylanta Cair', category: 'Pencernaan', unit: 'botol', price: 45000, stock: 40, description: 'Pereda nyeri lambung cepat' },
    { name: 'Polysilane', category: 'Pencernaan', unit: 'tablet', price: 1500, stock: 100, description: 'Obat kembung dan maag' },
    { name: 'Entrostop', category: 'Pencernaan', unit: 'strip', price: 9000, stock: 120, description: 'Obat diare anak dan dewasa' },
    { name: 'Norit', category: 'Pencernaan', unit: 'tube', price: 15000, stock: 50, description: 'Karbon aktif untuk keracunan/diare' },

    // Penyakit Kronis (Resep)
    { name: 'Amlodipine 5mg', category: 'Jantung & Hipertensi', unit: 'tablet', price: 1000, stock: 400, description: 'Obat darah tinggi' },
    { name: 'Amlodipine 10mg', category: 'Jantung & Hipertensi', unit: 'tablet', price: 1500, stock: 300, description: 'Obat darah tinggi dosis tinggi' },
    { name: 'Captopril 25mg', category: 'Jantung & Hipertensi', unit: 'tablet', price: 500, stock: 200, description: 'Hipertensi dan gagal jantung' },
    { name: 'Metformin 500mg', category: 'Diabetes', unit: 'tablet', price: 800, stock: 400, description: 'Obat diabetes tipe 2' },
    { name: 'Simvastatin 20mg', category: 'Kolesterol', unit: 'tablet', price: 1200, stock: 250, description: 'Penurun kolesterol jahat' },

    // Obat Luar
    { name: 'Betadine Solution 30ml', category: 'Antiseptik', unit: 'botol', price: 35000, stock: 40, description: 'Obat luka antiseptik' },
    { name: 'Kalpanax Cair', category: 'Kulit', unit: 'botol', price: 15000, stock: 60, description: 'Obat panu kadas kurap' },
    { name: 'Counterpain 30g', category: 'Otot & Sendi', unit: 'tube', price: 45000, stock: 30, description: 'Krim pereda nyeri otot' },
    { name: 'Salonpas Koyo', category: 'Otot & Sendi', unit: 'pack', price: 12000, stock: 100, description: 'Pereda pegal linu' },
    { name: 'Insto Regular', category: 'Mata', unit: 'botol', price: 15000, stock: 80, description: 'Tetes mata iritasi ringan' }
];

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedMedicines() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('🌱 Starting medicine seeding...');

        // Optional: Clear existing medicines? 
        // Let's NOT clear, just append. Or maybe check if exists.
        // For this task, user wants "tambahkan banyak lagi", so appending is fine.
        // But to avoid duplicates if run multiple times, we can check name.

        const startDate = new Date('2025-01-01');
        const endDate = new Date('2028-12-31');

        let addedCount = 0;

        for (const med of medicines) {
            // Check if exists
            const [rows] = await connection.execute('SELECT id FROM medicines WHERE name = ?', [med.name]);

            if (rows.length === 0) {
                const expiryDate = getRandomDate(startDate, endDate);

                await connection.execute(`
                    INSERT INTO medicines (name, category, unit, price, stock, description, minimum_stock, expiry_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    med.name,
                    med.category,
                    med.unit,
                    med.price,
                    med.stock,
                    med.description,
                    10, // Default min stock
                    expiryDate
                ]);
                addedCount++;
                process.stdout.write('.');
            }
        }

        console.log(`\n✅ Successfully added ${addedCount} new medicines!`);

    } catch (error) {
        console.error('❌ Error seeding medicines:', error);
    } finally {
        await connection.end();
    }
}

seedMedicines();
