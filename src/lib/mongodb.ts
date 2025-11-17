import mongoose, { Mongoose } from 'mongoose';

/**
 * Global variable to cache the Mongoose connection.
 * In development, Next.js may reload modules, causing multiple connections.
 * This cache prevents establishing duplicate connections.
 */
declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

/**
 * Cached connection object to store the Mongoose instance and connection promise.
 * This ensures we reuse the same connection across hot reloads in development.
 */
const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = global.mongoose || {
  conn: null,
  promise: null,
};

// Assign the cached object to global in development to persist across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Implements connection caching to prevent multiple connections during development.
 *
 * @returns {Promise<Mongoose>} A promise that resolves to the Mongoose instance
 * @throws {Error} If MONGODB_URI environment variable is not set
 */
async function connectDB(): Promise<Mongoose> {
  // Get MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  // Validate that MONGODB_URI is provided
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If a connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance: Mongoose) => {
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear the promise so we can retry
    cached.promise = null;
    throw error;
  }

  // Return the established connection
  return cached.conn;
}

export default connectDB;

