import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_PROPERTIES } from './src/data/initialProperties.js';

dotenv.config();

function normalizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  const match = cleaned.match(/^(https:\/\/[a-z0-9-]+\.supabase\.co)/i);
  if (match) return match[1];
  return cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
}

const DEFAULT_SUPABASE_URL = 'https://tgkgfbllswzvmnefkxiu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna2dmYmxsc3d6dm1uZWZreGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjI2NTQsImV4cCI6MjEwOTE5ODY1NH0.k8nmzUnL82cZ_i61Zvb3-K1fn0ccTQFNvoNuRkyolF8';

let serverSupabaseClient: SupabaseClient | null = null;
function getServerSupabaseClient(): SupabaseClient | null {
  const db = loadDB();
  const url = normalizeSupabaseUrl(db.supabaseConfig?.supabaseUrl || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
  const key = (db.supabaseConfig?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY).trim();

  if (!url || !key) return null;

  try {
    if (!serverSupabaseClient) {
      serverSupabaseClient = createClient(url, key);
    }
    return serverSupabaseClient;
  } catch (err) {
    console.error('Failed to create server Supabase client:', err);
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for password hashing
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

// Initial Admin Credentials (paschal / PaschalLuxury2025!)
const DEFAULT_SALT = crypto.randomBytes(16).toString('hex');
const DEFAULT_ADMIN_HASH = hashPassword('PaschalLuxury2025!', DEFAULT_SALT);

interface DatabaseState {
  admin: {
    username: string;
    salt: string;
    passwordHash: string;
    updatedAt: string;
  };
  sessions: Record<string, { username: string; expiresAt: number }>;
  properties: any[];
  enquiries: any[];
  supabaseConfig: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    bucketName: string;
    isConnected: boolean;
    lastTestedAt?: string;
  };
}

function loadDB(): DatabaseState {
  if (!fs.existsSync(DB_FILE)) {
    const initialState: DatabaseState = {
      admin: {
        username: 'paschal',
        salt: DEFAULT_SALT,
        passwordHash: DEFAULT_ADMIN_HASH,
        updatedAt: new Date().toISOString()
      },
      sessions: {},
      properties: INITIAL_PROPERTIES,
      enquiries: [
        {
          id: 'enq-sample-1',
          propertyId: 'pr-001',
          propertyTitle: 'The Obsidian Grand Lagoon Waterfront Villa',
          propertyRefCode: 'PR-BI-01',
          fullName: 'Dr. Adeyemi Adeleke',
          email: 'a.adeleke@energyconsulting.ng',
          phone: '+234 803 555 0192',
          preferredDate: '2025-03-10',
          preferredTime: '14:00',
          budgetRange: '₦80,000,000 - ₦100,000,000 / year',
          movingTimeline: 'Within 30 Days',
          message: 'Relocating to Banana Island from London with family. Require private viewing on arrival in Lagos.',
          status: 'Viewing Scheduled',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'enq-sample-2',
          propertyId: 'pr-002',
          propertyTitle: 'The Sovereign High-Floor Sky Penthouse',
          propertyRefCode: 'PR-ABJ-02',
          fullName: 'Ambassador Christian Vane',
          email: 'c.vane@diplomatic-corps.eu',
          phone: '+234 909 444 8831',
          preferredDate: '2025-03-15',
          preferredTime: '11:00',
          budgetRange: '₦50,000,000 - ₦60,000,000 / year',
          movingTimeline: 'Next Month',
          message: 'Viewing request on behalf of the diplomatic mission. High security protocols required.',
          status: 'New',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      supabaseConfig: {
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        bucketName: 'property-images',
        isConnected: false
      }
    };
    saveDB(initialState);
    return initialState;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading db.json, falling back to initial properties:', err);
    return {
      admin: {
        username: 'paschal',
        salt: DEFAULT_SALT,
        passwordHash: DEFAULT_ADMIN_HASH,
        updatedAt: new Date().toISOString()
      },
      sessions: {},
      properties: INITIAL_PROPERTIES,
      enquiries: [],
      supabaseConfig: {
        supabaseUrl: '',
        supabaseAnonKey: '',
        bucketName: 'property-images',
        isConnected: false
      }
    };
  }
}

function saveDB(state: DatabaseState) {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Auth middleware for protected admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.substring(7).trim();
  const db = loadDB();
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    saveDB(db);
    return res.status(401).json({ error: 'Unauthorized: Session expired. Please log in again.' });
  }

  (req as any).adminUser = session.username;
  next();
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = loadDB();

  if (username.trim().toLowerCase() !== db.admin.username.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid admin username or password' });
  }

  const isValid = verifyPassword(password, db.admin.salt, db.admin.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid admin username or password' });
  }

  // Generate 7-day session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  db.sessions[token] = {
    username: db.admin.username,
    expiresAt
  };

  saveDB(db);

  return res.json({
    token,
    username: db.admin.username,
    role: 'admin',
    message: 'Welcome back, Administrator Paschal'
  });
});

app.get('/api/auth/me', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  return res.json({
    username: db.admin.username,
    role: 'admin',
    updatedAt: db.admin.updatedAt
  });
});

app.post('/api/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const db = loadDB();
  const isValid = verifyPassword(currentPassword, db.admin.salt, db.admin.passwordHash);

  if (!isValid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  db.admin.salt = newSalt;
  db.admin.passwordHash = newHash;
  db.admin.updatedAt = new Date().toISOString();

  saveDB(db);

  return res.json({ success: true, message: 'Admin password successfully updated' });
});

app.post('/api/auth/logout', requireAdminAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const db = loadDB();
    delete db.sessions[token];
    saveDB(db);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// PROPERTIES API
// -------------------------------------------------------------

app.get('/api/properties', (req: Request, res: Response) => {
  const db = loadDB();
  return res.json(db.properties);
});

app.get('/api/properties/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const property = db.properties.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  return res.json(property);
});

app.post('/api/properties', requireAdminAuth, (req: Request, res: Response) => {
  const propertyData = req.body;

  if (!propertyData.title || !propertyData.priceNaira || !propertyData.location) {
    return res.status(400).json({ error: 'Title, price and location are required' });
  }

  const db = loadDB();
  const newId = `pr-${Date.now().toString(36)}`;
  const slug = propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProperty = {
    ...propertyData,
    id: newId,
    slug: slug || newId,
    refCode: propertyData.refCode || `PR-${Math.floor(100 + Math.random() * 900)}`,
    images: Array.isArray(propertyData.images) && propertyData.images.length > 0 
      ? propertyData.images 
      : ['/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg'],
    amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.properties.unshift(newProperty);
  saveDB(db);

  return res.status(201).json(newProperty);
});

app.put('/api/properties/:id', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  const index = db.properties.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const updatedProperty = {
    ...db.properties[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  db.properties[index] = updatedProperty;
  saveDB(db);

  return res.json(updatedProperty);
});

app.patch('/api/properties/:id/availability', requireAdminAuth, (req: Request, res: Response) => {
  const { availability } = req.body;
  if (!availability) {
    return res.status(400).json({ error: 'Availability status is required' });
  }

  const db = loadDB();
  const property = db.properties.find(p => p.id === req.params.id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  property.availability = availability;
  property.updatedAt = new Date().toISOString();
  saveDB(db);

  return res.json(property);
});

app.delete('/api/properties/:id', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  const initialLength = db.properties.length;
  db.properties = db.properties.filter(p => p.id !== req.params.id);

  if (db.properties.length === initialLength) {
    return res.status(404).json({ error: 'Property not found' });
  }

  saveDB(db);
  return res.json({ success: true, message: 'Property deleted successfully' });
});

// -------------------------------------------------------------
// ENQUIRIES API
// -------------------------------------------------------------

app.post('/api/enquiries', (req: Request, res: Response) => {
  const {
    propertyId,
    propertyTitle,
    propertyRefCode,
    fullName,
    email,
    phone,
    preferredDate,
    preferredTime,
    budgetRange,
    movingTimeline,
    message
  } = req.body;

  if (!fullName || !phone || !message) {
    return res.status(400).json({ error: 'Full name, phone number, and enquiry message are required' });
  }

  const db = loadDB();
  const newEnquiry = {
    id: `enq-${Date.now().toString(36)}`,
    propertyId: propertyId || '',
    propertyTitle: propertyTitle || 'General Rental Advisory',
    propertyRefCode: propertyRefCode || 'GENERAL',
    fullName,
    email: email || '',
    phone,
    preferredDate: preferredDate || '',
    preferredTime: preferredTime || '',
    budgetRange: budgetRange || '',
    movingTimeline: movingTimeline || '',
    message,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  db.enquiries.unshift(newEnquiry);
  saveDB(db);

  // Mirror to Supabase if table is configured
  const supabase = getServerSupabaseClient();
  if (supabase) {
    (async () => {
      try {
        const { error } = await supabase.from('enquiries').insert([{
          id: newEnquiry.id,
          property_id: newEnquiry.propertyId || null,
          property_title: newEnquiry.propertyTitle,
          property_ref_code: newEnquiry.propertyRefCode,
          full_name: newEnquiry.fullName,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          preferred_date: newEnquiry.preferredDate,
          preferred_time: newEnquiry.preferredTime,
          budget_range: newEnquiry.budgetRange,
          moving_timeline: newEnquiry.movingTimeline,
          message: newEnquiry.message,
          status: newEnquiry.status
        }]);
        if (error && error.code !== 'PGRST205') {
          console.warn('Supabase enquiry mirror notice:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase enquiry error:', err?.message);
      }
    })();
  }

  return res.status(201).json({
    success: true,
    message: 'Enquiry received. Our Paschal Realty private concierge will contact you shortly.',
    enquiry: newEnquiry
  });
});

app.get('/api/enquiries', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  return res.json(db.enquiries);
});

app.patch('/api/enquiries/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const db = loadDB();
  const enquiry = db.enquiries.find(e => e.id === req.params.id);

  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  enquiry.status = status;
  saveDB(db);

  return res.json(enquiry);
});

app.delete('/api/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);
  saveDB(db);
  return res.json({ success: true, message: 'Enquiry deleted' });
});

// -------------------------------------------------------------
// SUPABASE CONFIGURATION & SYNC API
// -------------------------------------------------------------

app.get('/api/supabase/config', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  return res.json({
    supabaseUrl: db.supabaseConfig.supabaseUrl,
    supabaseAnonKey: db.supabaseConfig.supabaseAnonKey,
    bucketName: db.supabaseConfig.bucketName || 'property-images',
    isConnected: db.supabaseConfig.isConnected,
    lastTestedAt: db.supabaseConfig.lastTestedAt
  });
});

app.post('/api/supabase/config', requireAdminAuth, (req: Request, res: Response) => {
  const { supabaseUrl, supabaseAnonKey, bucketName, isConnected } = req.body;

  const db = loadDB();
  db.supabaseConfig = {
    supabaseUrl: supabaseUrl || '',
    supabaseAnonKey: supabaseAnonKey || '',
    bucketName: bucketName || 'property-images',
    isConnected: Boolean(isConnected),
    lastTestedAt: new Date().toISOString()
  };

  saveDB(db);
  return res.json({ success: true, message: 'Supabase configuration saved successfully', config: db.supabaseConfig });
});

app.post('/api/supabase/sync', requireAdminAuth, async (req: Request, res: Response) => {
  const supabase = getServerSupabaseClient();
  if (!supabase) {
    return res.status(400).json({ error: 'Supabase client is not configured' });
  }

  const db = loadDB();
  const propertiesToSync = db.properties.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    ref_code: p.refCode,
    category: p.category,
    city: p.city,
    location: p.location,
    neighborhood: p.neighborhood,
    price_naira: p.priceNaira,
    price_period: p.pricePeriod,
    service_charge_naira: p.serviceChargeNaira || 0,
    caution_deposit_percentage: p.cautionDepositPercentage || 10,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    toilets: p.toilets || 0,
    parking_spaces: p.parkingSpaces || 2,
    area_sqm: p.areaSqm,
    furnishing: p.furnishing,
    availability: p.availability,
    featured: p.featured,
    images: p.images || [],
    description: p.description,
    amenities: p.amenities || [],
    year_built: p.yearBuilt || 2024,
    security_features: p.securityFeatures || [],
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  try {
    const { error } = await supabase.from('properties').upsert(propertiesToSync);
    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return res.status(400).json({
          error: 'The "properties" table does not exist in your Supabase project yet. Please run the SQL schema script in your Supabase SQL Editor first, then click Sync.'
        });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      success: true,
      message: `Successfully synchronized ${propertiesToSync.length} luxury properties to your Supabase PostgreSQL database!`,
      count: propertiesToSync.length
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to sync to Supabase' });
  }
});

// Direct Image Upload (base64 or direct asset)
app.post('/api/upload', requireAdminAuth, (req: Request, res: Response) => {
  const { dataUrl, fileName } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // If already a valid URL or path, return directly
  if (dataUrl.startsWith('http') || dataUrl.startsWith('/src/assets')) {
    return res.json({ url: dataUrl });
  }

  try {
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const safeName = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

    return res.json({ url: `/uploads/${safeName}` });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to save image' });
  }
});

// Serve uploaded assets in /public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PASCHAL REALTY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
