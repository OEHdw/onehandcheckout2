const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

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

app.use(express.json());
app.use(express.static(path.join(__dirname, 'app')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Product by ID — used by QR code links (?id=xxx)
app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Prodotto non trovato' });
    res.json(product);
  } catch {
    res.status(400).json({ error: 'ID non valido' });
  }
});

// Fallback: first product (for demo without QR)
app.get('/api/product', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({});
    if (!product) return res.status(404).json({ error: 'Nessun prodotto trovato' });
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Errore database' });
  }
});

// Purchase: creates transaction, returns receipt data + daily pattern
app.post('/api/purchase', async (req, res) => {
  try {
    const { productId, storeId } = req.body;
    let product;
    if (productId) {
      product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    } else {
      product = await db.collection('products').findOne({});
    }
    if (!product) return res.status(404).json({ error: 'Prodotto non trovato' });

    const sid = storeId || product.storeId || 'store-roma-01';
    const transaction = {
      productId: product._id,
      productName: product.name,
      price: product.price,
      storeId: sid,
      timestamp: new Date(),
      status: 'completed',
    };

    const result = await db.collection('transactions').insertOne(transaction);
    const today = new Date().toISOString().split('T')[0];
    const pattern = generatePattern(sid, today);

    res.json({
      transactionId: result.insertedId.toString().slice(-8).toUpperCase(),
      storeId: sid,
      timestamp: transaction.timestamp,
      pattern,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il pagamento' });
  }
});

// Daily pattern for merchant dashboard
app.get('/api/pattern/:storeId', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const pattern = generatePattern(req.params.storeId, today);
  res.json({ storeId: req.params.storeId, date: today, pattern });
});

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function generatePattern(storeId, date) {
  const seed = hashCode(storeId + date);
  const abs = Math.abs(seed);
  const colorSets = [
    ['#00D4FF', '#8B5CF6', '#FF006E'],
    ['#8B5CF6', '#FF006E', '#00D4FF'],
    ['#FF006E', '#00D4FF', '#8B5CF6'],
    ['#00D4FF', '#FF006E', '#8B5CF6'],
    ['#FF006E', '#8B5CF6', '#00D4FF'],
    ['#8B5CF6', '#00D4FF', '#FF006E'],
  ];
  const shapeNames = ['cerchi', 'triangoli', 'diamanti', 'quadrati', 'stelle'];
  const speedLabels = ['lenta', 'media', 'veloce'];
  const idx = abs % colorSets.length;
  const shapeIdx = (abs >> 4) % shapeNames.length;
  const count = 3 + ((abs >> 8) % 5);
  const speedIdx = (abs >> 12) % 3;
  return {
    colors: colorSets[idx],
    shape: shapeNames[shapeIdx],
    count,
    speed: speedIdx + 1,
    speedLabel: speedLabels[speedIdx],
    seed,
  };
}

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
