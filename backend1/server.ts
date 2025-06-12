// JavaScript version as a fallback if TypeScript setup continues to have issues
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./db.js"
import bcrypt from "bcrypt"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())

// Routes
app.post("/api/user/register", async (req, res) => {
  try {
    const { firstname, lastname, email, usertype, password } = req.body

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname, email, usertype, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstname, lastname, email, usertype, hashedPassword],
    )

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
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
})

// Add a test endpoint to check if the server is running
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Backend server is running" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
