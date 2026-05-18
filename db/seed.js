const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'onehandcheckout';

const products = [
  {
    name: 'AirZen Pro Max',
    brand: 'AirZen Studio',
    description: 'Immergiti nel suono con le AirZen Pro Max. Driver da 40mm con risposta in frequenza 20Hz–20kHz, cancellazione attiva del rumore a 3 livelli e microfoni a matrice per chiamate cristalline.',
    price: 149,
    priceOriginal: 249,
    image: '🎧',
    imageUrl: null,
    storeId: 'store-roma-01',
  },
  {
    name: 'Profumo Noir',
    brand: 'Maison Lumière',
    description: 'Fragranza legnosa e speziata per chi ama lasciare il segno. Note di sandalo, ambra e bergamotto. 50ml, flacone in vetro.',
    price: 79,
    priceOriginal: null,
    image: '🧴',
    imageUrl: null,
    storeId: 'store-roma-01',
  },
  {
    name: 'Occhiali Milo',
    brand: 'Studio Milo',
    description: 'Montatura leggera in acetato italiano, lenti polarizzate UV400. Design minimalista, massima protezione.',
    price: 199,
    priceOriginal: 260,
    image: '🕶️',
    imageUrl: null,
    storeId: 'store-roma-02',
  },
];

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  await db.collection('products').deleteMany({});
  await db.collection('products').insertMany(products);
  console.log(`${products.length} prodotti inseriti nel database.`);
  await client.close();
}

seed().catch(err => {
  console.error('Seed fallito:', err.message);
  process.exit(1);
});
