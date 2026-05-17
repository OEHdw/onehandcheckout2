const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'onehandcheckout';

const product = {
  name: 'AirZen Pro Max',
  brand: 'AirZen Studio',
  description: 'Immergiti nel suono con le AirZen Pro Max. Driver da 40mm con risposta in frequenza 20Hz–20kHz, cancellazione attiva del rumore a 3 livelli e microfoni a matrice per chiamate cristalline. Compatibili con tutti i dispositivi, con un tasto per il checkout immediato.',
  price: 149,
  priceOriginal: 249,
  image: '🎧',
  imageUrl: null,
};

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  await db.collection('products').deleteMany({});
  await db.collection('products').insertOne(product);
  console.log('Prodotto inserito nel database.');
  await client.close();
}

seed().catch(err => {
  console.error('Seed fallito:', err.message);
  process.exit(1);
});
