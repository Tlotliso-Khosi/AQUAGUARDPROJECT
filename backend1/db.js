import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

// Log database connection parameters (without password)
console.log("Database connection parameters:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "aquaguard",
  port: process.env.DB_PORT || 5432,
  // Password omitted for security
})

// Create connection pool with connection timeout and SSL disabled
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "aquaguard",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  connectionTimeoutMillis: 5000, // 5 seconds
  query_timeout: 10000, // 10 seconds
  ssl: false, // Explicitly disable SSL
})

// Test database connection with more detailed error handling
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error details:", {
      code: err.code,
      message: err.message,
      detail: err.detail,
      hint: err.hint,
      position: err.position,
      severity: err.severity,
    })

    // Common error codes and their meanings
    const errorGuide = {
      ECONNREFUSED: "PostgreSQL server is not running or not accepting connections",
      ETIMEDOUT: "Connection timed out - check network or firewall settings",
      "28P01": "Invalid password for database user",
      28000: "Invalid authorization specification",
      "3D000": "Database does not exist",
      "42P01": "Relation (table) does not exist",
    }

    if (errorGuide[err.code]) {
      console.error("Possible solution:", errorGuide[err.code])
    }

    // Check if this is a pg_hba.conf error
    if (err.message && err.message.includes("no pg_hba.conf entry")) {
      console.error("pg_hba.conf error detected. This means PostgreSQL is rejecting the connection.")
      console.error(
        "Solutions: 1) Check if PostgreSQL is running 2) Verify credentials 3) Update pg_hba.conf to allow connections",
      )
    }
  } else {
    console.log("Database connected successfully at:", res.rows[0].now)
  }
})

export { pool }
