import express from "express"
import { pool } from "./db.js"
import { authenticateToken, isFarmer } from "./auth-middleware.js"

const router = express.Router()

// Get all fields for the authenticated user
router.get("/api/fields", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const fieldsResult = await pool.query(
      `SELECT 
        f.id, f.fieldname, f.location, f.area, f.croptype, f.status, 
        f.soiltype, f.last_irrigated, f.next_irrigation, f.drainage,
        f.created_at, f.updated_at
      FROM fields f
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC`,
      [userId],
    )

    res.status(200).json({
      success: true,
      fields: fieldsResult.rows,
    })
  } catch (error) {
    console.error("Error fetching fields:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching fields",
      error: error.message,
    })
  }
})

// Get a specific field by ID
router.get("/api/fields/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id
    const userId = req.user.id

    const fieldResult = await pool.query(
      `SELECT 
        f.id, f.fieldname, f.location, f.area, f.croptype, f.status, 
        f.soiltype, f.last_irrigated, f.next_irrigation, f.drainage,
        f.created_at, f.updated_at
      FROM fields f
      WHERE f.id = $1 AND f.user_id = $2`,
      [fieldId, userId],
    )

    if (fieldResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field not found or you don't have access to it",
      })
    }

    // Get devices associated with this field
    const devicesResult = await pool.query(
      `SELECT 
        id, name, mac_address, device_type, status, 
        last_reading, battery_level, firmware_version
      FROM devices
      WHERE field_id = $1`,
      [fieldId],
    )

    const field = fieldResult.rows[0]
    field.devices = devicesResult.rows

    res.status(200).json({
      success: true,
      field,
    })
  } catch (error) {
    console.error("Error fetching field:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching field details",
      error: error.message,
    })
  }
})

// Create a new field
router.post("/api/fields", authenticateToken, isFarmer, async (req, res) => {
  try {
    const { fieldname, location, area, croptype, status, soiltype, drainage } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!fieldname || !location || !area || !croptype || !status || !soiltype) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      })
    }

    // Validate field status
    const validStatuses = ["active", "fallow", "maintenance"]
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: active, fallow, maintenance",
      })
    }

    // Validate soil type
    const validSoilTypes = ["loamy", "sandy", "clay"]
    if (!validSoilTypes.includes(soiltype.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Soil type must be one of: loamy, sandy, clay",
      })
    }

    // Validate drainage if provided
    const drainageValue = drainage || "moderate"
    const validDrainage = ["good", "moderate", "poor"]
    if (!validDrainage.includes(drainageValue.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Drainage must be one of: good, moderate, poor",
      })
    }

    const result = await pool.query(
      `INSERT INTO fields 
        (fieldname, location, area, croptype, status, soiltype, drainage, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        fieldname,
        location,
        area,
        croptype,
        status.toLowerCase(),
        soiltype.toLowerCase(),
        drainageValue.toLowerCase(),
        userId,
      ],
    )

    res.status(201).json({
      success: true,
      message: "Field created successfully",
      field: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating field:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating field",
      error: error.message,
    })
  }
})

// Update a field
router.put("/api/fields/:id", authenticateToken, isFarmer, async (req, res) => {
  try {
    const fieldId = req.params.id
    const userId = req.user.id
    const { fieldname, location, area, croptype, status, soiltype, drainage } = req.body

    // Check if field exists and belongs to user
    const checkField = await pool.query("SELECT * FROM fields WHERE id = $1 AND user_id = $2", [fieldId, userId])

    if (checkField.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field not found or you don't have access to it",
      })
    }

    // Build the update query dynamically based on provided fields
    let updateQuery = "UPDATE fields SET "
    const updateValues = []
    const updateFields = []
    let paramIndex = 1

    if (fieldname) {
      updateFields.push(`fieldname = $${paramIndex}`)
      updateValues.push(fieldname)
      paramIndex++
    }

    if (location) {
      updateFields.push(`location = $${paramIndex}`)
      updateValues.push(location)
      paramIndex++
    }

    if (area) {
      updateFields.push(`area = $${paramIndex}`)
      updateValues.push(area)
      paramIndex++
    }

    if (croptype) {
      updateFields.push(`croptype = $${paramIndex}`)
      updateValues.push(croptype)
      paramIndex++
    }

    if (status) {
      // Validate field status
      const validStatuses = ["active", "fallow", "maintenance"]
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Status must be one of: active, fallow, maintenance",
        })
      }
      updateFields.push(`status = $${paramIndex}`)
      updateValues.push(status.toLowerCase())
      paramIndex++
    }

    if (soiltype) {
      // Validate soil type
      const validSoilTypes = ["loamy", "sandy", "clay"]
      if (!validSoilTypes.includes(soiltype.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Soil type must be one of: loamy, sandy, clay",
        })
      }
      updateFields.push(`soiltype = $${paramIndex}`)
      updateValues.push(soiltype.toLowerCase())
      paramIndex++
    }

    if (drainage) {
      // Validate drainage
      const validDrainage = ["good", "moderate", "poor"]
      if (!validDrainage.includes(drainage.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Drainage must be one of: good, moderate, poor",
        })
      }
      updateFields.push(`drainage = $${paramIndex}`)
      updateValues.push(drainage.toLowerCase())
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
    updateValues.push(fieldId, userId)

    const result = await pool.query(updateQuery, updateValues)

    res.status(200).json({
      success: true,
      message: "Field updated successfully",
      field: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating field:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating field",
      error: error.message,
    })
  }
})

// Delete a field
router.delete("/api/fields/:id", authenticateToken, isFarmer, async (req, res) => {
  try {
    const fieldId = req.params.id
    const userId = req.user.id

    // Check if field exists and belongs to user
    const checkField = await pool.query("SELECT * FROM fields WHERE id = $1 AND user_id = $2", [fieldId, userId])

    if (checkField.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field not found or you don't have access to it",
      })
    }

    // Delete the field
    await pool.query("DELETE FROM fields WHERE id = $1", [fieldId])

    res.status(200).json({
      success: true,
      message: "Field deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting field:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting field",
      error: error.message,
    })
  }
})

export default router
