import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import fieldRoutes from "./field-routes.js"
import deviceRoutes from "./device-routes.js"
import fieldDataRoutes from "./field-data-routes.js"
import { authenticateToken } from "./auth-middleware.js"

// JavaScript version as a fallback if TypeScript setup continues to have issues

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "aquaguard_secret_key"

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
)
app.use(express.json())

// Register routes
console.log("Registering routes...")
app.use(fieldRoutes)
app.use(deviceRoutes)
app.use(fieldDataRoutes)
console.log("Routes registered")

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Test endpoint
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Backend server is running" })
})

// Database test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.status(200).json({
      message: "Database connection successful",
      timestamp: result.rows[0].now,
      config: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: "aquaguard",
        port: process.env.DB_PORT || 5432,
        // Password omitted for security
      },
    })
  } catch (error) {
    console.error("Database test error:", error)
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      code: error.code,
      detail: error.detail || "No additional details",
      hint: error.hint || "No hint provided",
    })
  }
})

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body)

    const { firstname, lastname, email, usertype, password } = req.body

    // Validate required fields
    if (!firstname || !lastname || !email || !usertype || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Check database connection first
    try {
      await pool.query("SELECT NOW()")
      console.log("Database connection confirmed")
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return res.status(500).json({
        success: false,
        message: "Database connection error",
        error: dbError.message,
      })
    }

    // Check if users table exists
    try {
      await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'users'
        )
      `)
      console.log("Users table exists")
    } catch (tableError) {
      console.error("Error checking users table:", tableError)

      // Try to create the users table if it doesn't exist
      try {
        console.log("Attempting to create users table...")
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(100) NOT NULL,
            lastname VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            usertype VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `)
        console.log("Users table created successfully")
      } catch (createError) {
        console.error("Failed to create users table:", createError)
        return res.status(500).json({
          success: false,
          message: "Failed to create users table",
          error: createError.message,
        })
      }
    }

    // Check if user already exists
    try {
      const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email])

      if (userCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        })
      }
    } catch (checkError) {
      console.error("Error checking existing user:", checkError)
      return res.status(500).json({
        success: false,
        message: "Error checking existing user",
        error: checkError.message,
      })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert new user
    try {
      const newUser = await pool.query(
        "INSERT INTO users (firstname, lastname, email, usertype, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [firstname, lastname, email, usertype, hashedPassword],
      )

      console.log("User registered successfully:", newUser.rows[0].id)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.rows[0].id,
          firstname: newUser.rows[0].firstname,
          lastname: newUser.rows[0].lastname,
          email: newUser.rows[0].email,
          usertype: newUser.rows[0].usertype,
        },
      })
    } catch (insertError) {
      console.error("Error inserting new user:", insertError)
      return res.status(500).json({
        success: false,
        message: "Error creating user",
        error: insertError.message,
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    })
  }
})

// Login endpoint - IMPORTANT: Changed from /api/user/login to /api/login to match test script
app.post("/api/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)

    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Check database connection first
    try {
      await pool.query("SELECT NOW()")
      console.log("Database connection confirmed for login")
    } catch (dbError) {
      console.error("Database connection error during login:", dbError)
      return res.status(500).json({
        success: false,
        message: "Database connection error",
        error: dbError.message,
      })
    }

    // Find user by email
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const user = userResult.rows[0]

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        usertype: user.usertype,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    })
  }
})

// Keep the old endpoint for backward compatibility
app.post("/api/user/login", async (req, res) => {
  // Forward to the new endpoint
  try {
    const { email, password } = req.body

    // Find user by email
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const user = userResult.rows[0]

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        usertype: user.usertype,
      },
    })
  } catch (error) {
    console.error("Login error at /api/user/login:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    })
  }
})

// User profile endpoint
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const userResult = await pool.query(
      "SELECT id, firstname, lastname, email, usertype, created_at FROM users WHERE id = $1",
      [userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user statistics
    const fieldCountResult = await pool.query("SELECT COUNT(*) FROM fields WHERE user_id = $1", [userId])
    const deviceCountResult = await pool.query("SELECT COUNT(*) FROM devices WHERE user_id = $1", [userId])
    const dataCountResult = await pool.query(
      `SELECT COUNT(*) FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE fd.user_id = $1 OR f.user_id = $1`,
      [userId],
    )

    const user = userResult.rows[0]
    user.stats = {
      fieldCount: Number.parseInt(fieldCountResult.rows[0].count),
      deviceCount: Number.parseInt(deviceCountResult.rows[0].count),
      dataCount: Number.parseInt(dataCountResult.rows[0].count),
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    })
  }
})

// Environment variables check endpoint
app.get("/api/env-check", (req, res) => {
  res.status(200).json({
    dbUser: process.env.DB_USER ? "Set" : "Not set",
    dbHost: process.env.DB_HOST ? "Set" : "Not set",
    dbPassword: process.env.DB_PASSWORD ? "Set (value hidden)" : "Not set",
    dbPort: process.env.DB_PORT || "Using default (5432)",
    nodeEnv: process.env.NODE_ENV || "Not set",
    jwtSecret: process.env.JWT_SECRET ? "Set (value hidden)" : "Not set",
  })
})

// Create .env template endpoint
app.get("/api/create-env-template", (req, res) => {
  const envTemplatePath = path.join(__dirname, ".env.template")
  const envTemplate = `# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
`

  fs.writeFile(envTemplatePath, envTemplate, (err) => {
    if (err) {
      console.error("Error creating .env template:", err)
      return res.status(500).json({
        success: false,
        message: "Failed to create .env template",
        error: err.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Created .env template file",
      path: envTemplatePath,
    })
  })
})

// Start server with detailed error handling
console.log("Starting server on port", PORT, "...")
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`)
  console.log(`Login endpoint: http://localhost:${PORT}/api/login`)
})

// Add error handling for server startup
server.on("error", (error) => {
  console.error("SERVER STARTUP ERROR:", error)
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`)
  }
})

// Error handling middleware for 404 Not Found
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
  })
})
