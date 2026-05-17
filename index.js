const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'onehandcheckout';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('Connected to MongoDB');
}

app.use(express.static('public'));

app.get('/api/product', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({});
    if (!product) return res.status(404).json({ error: 'Nessun prodotto trovato' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Errore database' });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
