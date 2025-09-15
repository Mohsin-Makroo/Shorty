import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma/client.js';

// Auth middleware to protect routes (reads token from Authorization header)
function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token found in authorization header' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration to allow your frontend origin
const corsOptions = {
  origin: 'https://shorty-nu.vercel.app', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // enable if you use credentials/cookies
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Hello from the Shorty Backend!');
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong during sign up.' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
});

// Shorten URL route (protected)
app.post('/api/shorten', authMiddleware, async (req, res) => {
  const { longUrl } = req.body;
  const userId = req.user.id;
  const API_KEY = process.env.SHORTIO_API_KEY;
  const DOMAIN = process.env.SHORTIO_DOMAIN;

  try {
    const createResponse = await axios.post(
      'https://api.short.io/links',
      { originalURL: longUrl, domain: DOMAIN },
      { headers: { authorization: API_KEY } }
    );
    const { shortURL } = createResponse.data;
    const path = new URL(shortURL).pathname.slice(1);

    const expandResponse = await axios.get(
      'https://api.short.io/links/expand',
      {
        headers: { authorization: API_KEY },
        params: { domain: DOMAIN, path },
      }
    );

    const idString = expandResponse.data.idString || expandResponse.data.id;
    if (!idString) throw new Error('Failed to get Short.io link ID.');

    await prisma.link.create({
      data: {
        originalUrl: longUrl,
        shortUrl: shortURL,
        shortioIdString: idString,
        userId,
      },
    });

    res.json({ shortUrl: shortURL });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Error creating short link.' });
  }
});

// Get all links for user with click stats (protected)
app.get('/api/links', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const API_KEY = process.env.SHORTIO_API_KEY;

    const linksFromDb = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const linksWithStats = await Promise.all(
      linksFromDb.map(async (link) => {
        try {
          const statsResponse = await axios.get(
            `https://api-v2.short.io/statistics/link/${link.shortioIdString}`,
            {
              headers: { authorization: API_KEY },
              params: { period: 'total' },
            }
          );

          return {
            id: link.id,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            totalClicks: statsResponse.data.totalClicks ?? 0,
          };
        } catch (error) {
          return {
            id: link.id,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            totalClicks: 0,
          };
        }
      })
    );

    res.json(linksWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while fetching links.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
