const knex = require('knex');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'pbr_anywhere',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  },
  debug: process.env.NODE_ENV === 'development'
};

// Create knex instance
const db = knex(dbConfig);

// Test database connection
async function connectDB() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connected successfully');
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Close database connection
async function closeDB() {
  try {
    await db.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
}

// Health check for database
async function healthCheck() {
  try {
    await db.raw('SELECT 1');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message, 
      timestamp: new Date().toISOString() 
    };
  }
}

module.exports = {
  db,
  connectDB,
  closeDB,
  healthCheck,
  dbConfig
};
