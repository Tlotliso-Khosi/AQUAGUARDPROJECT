import pg from "pg"
import dotenv from "dotenv"
import { exec } from "child_process"
import { fileURLToPath } from "url"

dotenv.config()

// Function to check if PostgreSQL is running
const checkPostgresRunning = () => {
  return new Promise((resolve) => {
    // Different commands based on OS
    let cmd = ""
    if (process.platform === "win32") {
      // Try multiple possible service names on Windows
      cmd = "tasklist | findstr postgres"
    } else {
      cmd = "ps aux | grep postgres"
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log("Could not automatically detect PostgreSQL process.")
        console.log("This doesn't necessarily mean PostgreSQL isn't running.")
        resolve(false)
        return
      }

      const isRunning = stdout.length > 0
      console.log("PostgreSQL process detection:", isRunning ? "FOUND" : "NOT FOUND")
      resolve(isRunning)
    })
  })
}

// Function to test database connection with detailed diagnostics
const testDatabaseConnection = async () => {
  console.log("\n=== PostgreSQL Connection Diagnostic ===\n")

  // 1. Check environment variables
  console.log("1. Checking environment variables:")
  const envVars = {
    DB_USER: process.env.DB_USER || "postgres",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PASSWORD: process.env.DB_PASSWORD ? "Set (value hidden)" : "NOT SET",
    DB_PORT: process.env.DB_PORT || "5432 (default)",
  }

  console.log(envVars)

  if (!process.env.DB_PASSWORD) {
    console.log("\n⚠️ WARNING: DB_PASSWORD environment variable is not set!")
    console.log("Make sure you have a .env file with DB_PASSWORD=thatohatsi")
  }

  // 2. Check if PostgreSQL service is running
  console.log("\n2. Checking if PostgreSQL process is running:")
  await checkPostgresRunning()

  // 3. Test connection to postgres database
  console.log("\n3. Testing connection to 'postgres' database:")

  const adminConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: "postgres",
    ssl: false, // Explicitly disable SSL
    connectionTimeoutMillis: 3000,
  }

  try {
    const adminPool = new pg.Pool(adminConfig)
    const result = await adminPool.query("SELECT version()")
    console.log("✅ Successfully connected to 'postgres' database!")
    console.log("PostgreSQL version:", result.rows[0].version)
    await adminPool.end()
  } catch (error) {
    console.log("❌ Failed to connect to 'postgres' database:")
    console.log("Error:", error.message)

    if (error.code === "ECONNREFUSED") {
      console.log("\n⚠️ Connection refused. PostgreSQL is likely not running.")
      console.log("Start PostgreSQL service before continuing.")
    }

    return false
  }

  // 5. Test connection to aquaguard database
  console.log("\n5. Testing connection to 'aquaguard' database:")

  const appConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: "aquaguard",
    ssl: false, // Explicitly disable SSL
    connectionTimeoutMillis: 3000,
  }

  try {
    const appPool = new pg.Pool(appConfig)
    await appPool.query("SELECT NOW()")
    console.log("✅ Successfully connected to 'aquaguard' database!")

    // Check if users table exists
    try {
      const tableResult = await appPool.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')",
      )

      if (tableResult.rows[0].exists) {
        console.log("✅ 'users' table exists in the database.")
      } else {
        console.log("❌ 'users' table does not exist in the database.")
        console.log("Run the create-db.js script to create the necessary tables.")
      }
    } catch (tableError) {
      console.log("Error checking for 'users' table:", tableError.message)
    }

    await appPool.end()
    return true
  } catch (error) {
    console.log("❌ Failed to connect to 'aquaguard' database:")
    console.log("Error:", error.message)

    if (error.code === "3D000") {
      console.log("\n⚠️ The 'aquaguard' database does not exist!")
      console.log("Run the create-db.js script to create the database and tables.")
    }

    return false
  }
}

// Run the function if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  testDatabaseConnection()
    .then((success) => {
      if (success) {
        console.log("\n✅ All database checks passed successfully!")
      } else {
        console.log("\n❌ Some database checks failed. Review the output above for details.")
      }
    })
    .catch((err) => {
      console.error("\nUnexpected error during database diagnostics:", err)
    })
}

export { testDatabaseConnection }
