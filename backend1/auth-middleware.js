import jwt from "jsonwebtoken"

// Secret key for JWT - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || "aquaguard_secret_key"

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    })
  }
}

// Middleware to check if user is a farmer
export const isFarmer = (req, res, next) => {
  if (req.user && req.user.usertype === "farmer") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Farmer role required.",
    })
  }
}

// Middleware to check if user is a customer
export const isCustomer = (req, res, next) => {
  if (req.user && req.user.usertype === "customer") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Customer role required.",
    })
  }
}
