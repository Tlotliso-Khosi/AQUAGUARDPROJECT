import express from "express"
import { pool } from "./db.js"
import { authenticateToken, isFarmer } from "./auth-middleware.js"

const router = express.Router()

// Get all devices for the authenticated user
router.get("/api/devices", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const devicesResult = await pool.query(
      `SELECT 
        d.id, d.name, d.mac_address, d.device_type, d.status, 
        d.field_id, d.last_reading, d.battery_level, d.firmware_version,
        d.created_at, d.updated_at,
        f.fieldname as field_name
      FROM devices d
      LEFT JOIN fields f ON d.field_id = f.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC`,
      [userId],
    )

    res.status(200).json({
      success: true,
      devices: devicesResult.rows,
    })
  } catch (error) {
    console.error("Error fetching devices:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching devices",
      error: error.message,
    })
  }
})

// Get a specific device by ID
router.get("/api/devices/:id", authenticateToken, async (req, res) => {
  try {
    const deviceId = req.params.id
    const userId = req.user.id

    const deviceResult = await pool.query(
      `SELECT 
        d.id, d.name, d.mac_address, d.device_type, d.status, 
        d.field_id, d.last_reading, d.battery_level, d.firmware_version,
        d.created_at, d.updated_at,
        f.fieldname as field_name
      FROM devices d
      LEFT JOIN fields f ON d.field_id = f.id
      WHERE d.id = $1 AND d.user_id = $2`,
      [deviceId, userId],
    )

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found or you don't have access to it",
      })
    }

    // Get recent sensor readings for this device
    const readingsResult = await pool.query(
      `SELECT 
        id, reading_type, value, unit, timestamp
      FROM sensor_readings
      WHERE device_id = $1
      ORDER BY timestamp DESC
      LIMIT 20`,
      [deviceId],
    )

    const device = deviceResult.rows[0]
    device.readings = readingsResult.rows

    res.status(200).json({
      success: true,
      device,
    })
  } catch (error) {
    console.error("Error fetching device:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching device details",
      error: error.message,
    })
  }
})

// Create a new device
router.post("/api/devices", authenticateToken, isFarmer, async (req, res) => {
  try {
    const { name, mac_address, device_type, field_id } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!name || !mac_address) {
      return res.status(400).json({
        success: false,
        message: "Device name and MAC address are required",
      })
    }

    // Validate MAC address format
    const macRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/
    if (!macRegex.test(mac_address)) {
      return res.status(400).json({
        success: false,
        message: "MAC address must be in format XX:XX:XX:XX:XX:XX",
      })
    }

    // Check if MAC address is already registered
    const macCheck = await pool.query("SELECT * FROM devices WHERE mac_address = $1", [mac_address.toUpperCase()])
    if (macCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A device with this MAC address already exists",
      })
    }

    // If field_id is provided, verify it belongs to the user
    if (field_id) {
      const fieldCheck = await pool.query("SELECT * FROM fields WHERE id = $1 AND user_id = $2", [field_id, userId])
      if (fieldCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Field not found or you don't have access to it",
        })
      }
    }

    const deviceTypeValue = device_type || "sensor"

    const result = await pool.query(
      `INSERT INTO devices 
        (name, mac_address, device_type, field_id, user_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [name, mac_address.toUpperCase(), deviceTypeValue, field_id || null, userId],
    )

    res.status(201).json({
      success: true,
      message: "Device registered successfully",
      device: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating device:", error)
    res.status(500).json({
      success: false,
      message: "Server error while registering device",
      error: error.message,
    })
  }
})

// Update a device
router.put("/api/devices/:id", authenticateToken, isFarmer, async (req, res) => {
  try {
    const deviceId = req.params.id
    const userId = req.user.id
    const { name, device_type, status, field_id } = req.body

    // Check if device exists and belongs to user
    const checkDevice = await pool.query("SELECT * FROM devices WHERE id = $1 AND user_id = $2", [deviceId, userId])

    if (checkDevice.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found or you don't have access to it",
      })
    }

    // If field_id is provided, verify it belongs to the user
    if (field_id) {
      const fieldCheck = await pool.query("SELECT * FROM fields WHERE id = $1 AND user_id = $2", [field_id, userId])
      if (fieldCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Field not found or you don't have access to it",
        })
      }
    }

    // Build the update query dynamically based on provided fields
    let updateQuery = "UPDATE devices SET "
    const updateValues = []
    const updateFields = []
    let paramIndex = 1

    if (name) {
      updateFields.push(`name = $${paramIndex}`)
      updateValues.push(name)
      paramIndex++
    }

    if (device_type) {
      updateFields.push(`device_type = $${paramIndex}`)
      updateValues.push(device_type)
      paramIndex++
    }

    if (status) {
      // Validate status
      const validStatuses = ["active", "inactive", "maintenance"]
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Status must be one of: active, inactive, maintenance",
        })
      }
      updateFields.push(`status = $${paramIndex}`)
      updateValues.push(status.toLowerCase())
      paramIndex++
    }

    if (field_id !== undefined) {
      updateFields.push(`field_id = $${paramIndex}`)
      updateValues.push(field_id === null ? null : field_id)
      paramIndex++
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = $${paramIndex}`)
    updateValues.push(new Date())
    paramIndex++

    // If no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      })
    }

    updateQuery += updateFields.join(", ")
    updateQuery += ` WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`
    updateValues.push(deviceId, userId)

    const result = await pool.query(updateQuery, updateValues)

    res.status(200).json({
      success: true,
      message: "Device updated successfully",
      device: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating device:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating device",
      error: error.message,
    })
  }
})

// Delete a device
router.delete("/api/devices/:id", authenticateToken, isFarmer, async (req, res) => {
  try {
    const deviceId = req.params.id
    const userId = req.user.id

    // Check if device exists and belongs to user
    const checkDevice = await pool.query("SELECT * FROM devices WHERE id = $1 AND user_id = $2", [deviceId, userId])

    if (checkDevice.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found or you don't have access to it",
      })
    }

    // Delete the device
    await pool.query("DELETE FROM devices WHERE id = $1", [deviceId])

    res.status(200).json({
      success: true,
      message: "Device deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting device:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting device",
      error: error.message,
    })
  }
})

export default router
