import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "./db.js"

const app = express()

// Secret key for JWT - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || "aquaguard_secret_key"

// Login endpoint
app.post("/api/user/login", async (req, res) => {
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
