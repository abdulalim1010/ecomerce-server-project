const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.emeucb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let productsCollection; // Declare outside to use in route

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();

    const database = client.db("productCollections");
    productsCollection = database.collection("products");

    // Confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");

    // Start server only after DB is connected
    app.listen(port, () => {
      console.log(`🚀 Store is running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

run(); // Don't close the client!

// Routes
app.get('/', (req, res) => {
  res.send('🛒 Ecommerce API is running');
});

app.get('/products', async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.send(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send({ error: 'Failed to fetch products' });
  }
});
