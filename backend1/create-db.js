import pg from "pg"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database connection for admin operations with better error handling
const adminConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Connect to 'postgres' database to create our application database
  database: "postgres",
  // Explicitly disable SSL
  ssl: false,
  connectionTimeoutMillis: 5000, // 5 seconds timeout
}

console.log("Attempting to connect to PostgreSQL with admin privileges...")
console.log("Connection config (without password):", {
  user: adminConfig.user,
  host: adminConfig.host,
  database: adminConfig.database,
  port: adminConfig.port,
  ssl: "disabled",
})

const adminPool = new pg.Pool(adminConfig)

const createDatabase = async () => {
  try {
    // Test connection first
    try {
      const testConnection = await adminPool.query("SELECT version()")
      console.log("PostgreSQL connection successful:", testConnection.rows[0].version)
    } catch (connError) {
      console.error("PostgreSQL connection error:", connError.message)
      if (connError.code === "ECONNREFUSED") {
        console.error("Connection refused. Make sure PostgreSQL is running.")
      }
      throw connError
    }

    // Check if database exists
    const checkResult = await adminPool.query("SELECT 1 FROM pg_database WHERE datname = $1", ["aquaguard"])

    if (checkResult.rowCount === 0) {
      console.log("Database 'aquaguard' does not exist. Creating...")
      await adminPool.query("CREATE DATABASE aquaguard")
      console.log("Database 'aquaguard' created successfully!")
    } else {
      console.log("Database 'aquaguard' already exists.")
    }

    // Close admin connection
    await adminPool.end()

    // Connect to the aquaguard database to create tables
    const appPool = new pg.Pool({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      database: "aquaguard",
      ssl: false, // Explicitly disable SSL
    })

    console.log("Connected to 'aquaguard' database. Creating tables...")

    // Read schema file
    const schemaPath = path.join(__dirname, "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Execute schema
    await appPool.query(schemaSql)
    console.log("Database tables created successfully!")

    // Close connection
    await appPool.end()

    console.log("Database setup completed successfully!")
    return true
  } catch (error) {
    console.error("Database setup error:", error)
    return false
  }
}

// Run the function if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createDatabase()
    .then((success) => {
      if (success) {
        console.log("Database setup completed. You can now start the server.")
        process.exit(0)
      } else {
        console.error("Database setup failed.")
        process.exit(1)
      }
    })
    .catch((err) => {
      console.error("Unexpected error:", err)
      process.exit(1)
    })
}

export { createDatabase }
