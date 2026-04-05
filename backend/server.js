const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const User = require('./models/User');

const app = express();

const allowedOrigins = Array.from(new Set([
  ...(process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  'http://localhost:3000',
  'http://localhost:5173',
]));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const adminRoutes = require('./routes/adminRoutes');
const routeRoutes = require('./routes/routeRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('WasteWise API is running...');
});

let mongoServer;

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Production MongoDB connected');
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log(`Local in-memory MongoDB connected at ${uri}`);
};

const seedDemoUsers = async () => {
  const demoUsers = [
    {
      name: 'Demo User',
      email: 'demo@wastewise.app',
      password: 'DemoUser123!',
      role: 'user',
    },
    {
      name: 'Demo Admin',
      email: 'admin@wastewise.app',
      password: 'DemoAdmin123!',
      role: 'admin',
    },
  ];

  for (const demoUser of demoUsers) {
    await User.deleteOne({ email: demoUser.email });
    await User.create(demoUser);
  }

  console.log('Demo accounts seeded');
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoUsers();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

startServer();
