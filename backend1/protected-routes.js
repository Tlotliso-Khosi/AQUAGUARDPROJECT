// Example of how to use the authentication middleware
// Add this to your server.js or create a separate routes file

import express from "express"
import { authenticateToken, isFarmer, isCustomer } from "./auth-middleware.js"
import { pool } from "./db.js" // Declare the pool variable

const app = express() // Declare the app variable

// Protected route for all authenticated users
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    // req.user contains the decoded JWT payload
    const userId = req.user.id

    const userResult = await pool.query("SELECT id, firstname, lastname, email, usertype FROM users WHERE id = $1", [
      userId,
    ])

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user: userResult.rows[0],
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// Protected route for farmers only
app.get("/api/farmer/dashboard", authenticateToken, isFarmer, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Farmer dashboard data",
    data: {
      // Farmer-specific data here
    },
  })
})

// Protected route for customers only
app.get("/api/customer/dashboard", authenticateToken, isCustomer, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Customer dashboard data",
    data: {
      // Customer-specific data here
    },
  })
})
