import express from "express"
import { pool } from "./db.js"
import { authenticateToken } from "./auth-middleware.js"

const router = express.Router()

// Get all field data for the authenticated user
router.get("/api/field-data", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const fieldDataResult = await pool.query(
      `SELECT 
        fd.id, fd.field_id, fd.crop_type, fd.yield_amount, fd.unit, 
        fd.measurement_date, fd.notes, fd.created_at, fd.updated_at,
        f.fieldname as field_name
      FROM field_data fd
      JOIN fields f ON fd.field_id = f.id
      WHERE fd.user_id = $1 OR f.user_id = $1
      ORDER BY fd.measurement_date DESC`,
      [userId],
    )

    res.status(200).json({
      success: true,
      fieldData: fieldDataResult.rows,
    })
  } catch (error) {
    console.error("Error fetching field data:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching field data",
      error: error.message,
    })
  }
})

// Get field data statistics - MOVE THIS ROUTE BEFORE THE :id ROUTE
router.get("/api/field-data/statistics", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    console.log("Fetching statistics for user:", userId)

    // Get total records count
    const totalRecordsResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE fd.user_id = $1 OR f.user_id = $1`,
      [userId],
    )
    const totalRecords = Number.parseInt(totalRecordsResult.rows[0].total) || 0
    console.log("Total records:", totalRecords)

    // Get last updated timestamp
    const lastUpdatedResult = await pool.query(
      `SELECT 
     GREATEST(MAX(fd.updated_at), MAX(fd.created_at)) as last_updated
   FROM field_data fd
   JOIN fields f ON fd.field_id = f.id
   WHERE fd.user_id = $1 OR f.user_id = $1`,
      [userId],
    )
    const lastUpdated = lastUpdatedResult.rows[0].last_updated || null
    console.log("Last updated:", lastUpdated)

    // Get monthly growth
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const lastMonth = new Date(currentMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const currentMonthRecordsResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE (fd.user_id = $1 OR f.user_id = $1) AND fd.created_at >= $2`,
      [userId, currentMonth],
    )
    const currentMonthRecords = Number.parseInt(currentMonthRecordsResult.rows[0].count) || 0
    console.log("Current month records:", currentMonthRecords)

    const lastMonthRecordsResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE (fd.user_id = $1 OR f.user_id = $1) AND fd.created_at >= $2 AND fd.created_at < $3`,
      [userId, lastMonth, currentMonth],
    )
    const lastMonthRecords = Number.parseInt(lastMonthRecordsResult.rows[0].count) || 0
    console.log("Last month records:", lastMonthRecords)

    // Calculate growth percentage
    let growthPercentage = 0
    if (lastMonthRecords > 0) {
      growthPercentage = ((currentMonthRecords - lastMonthRecords) / lastMonthRecords) * 100
    }
    console.log("Growth percentage:", growthPercentage)

    const statistics = {
      totalRecords,
      lastUpdated,
      currentMonthRecords,
      lastMonthRecords,
      growthPercentage,
    }

    console.log("Sending statistics:", statistics)

    res.status(200).json({
      success: true,
      statistics,
    })
  } catch (error) {
    console.error("Error fetching field data statistics:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
      error: error.message,
      code: error.code,
      detail: error.detail || null,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Get field data by ID
router.get("/api/field-data/:id", authenticateToken, async (req, res) => {
  try {
    const dataId = req.params.id
    const userId = req.user.id

    const fieldDataResult = await pool.query(
      `SELECT 
        fd.id, fd.field_id, fd.crop_type, fd.yield_amount, fd.unit, 
        fd.measurement_date, fd.notes, fd.created_at, fd.updated_at,
        f.fieldname as field_name
      FROM field_data fd
      JOIN fields f ON fd.field_id = f.id
      WHERE fd.id = $1 AND (fd.user_id = $2 OR f.user_id = $2)`,
      [dataId, userId],
    )

    if (fieldDataResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field data not found or you don't have access to it",
      })
    }

    res.status(200).json({
      success: true,
      fieldData: fieldDataResult.rows[0],
    })
  } catch (error) {
    console.error("Error fetching field data:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching field data",
      error: error.message,
    })
  }
})

// Create new field data
router.post("/api/field-data", authenticateToken, async (req, res) => {
  try {
    const { field_id, crop_type, yield_amount, unit, measurement_date, notes } = req.body
    const userId = req.user.id

    console.log("Received field data:", { field_id, crop_type, yield_amount, unit, measurement_date, notes })

    // Validate required fields
    if (!field_id || !crop_type || !yield_amount || !unit || !measurement_date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        missing: {
          field_id: !field_id,
          crop_type: !crop_type,
          yield_amount: !yield_amount,
          unit: !unit,
          measurement_date: !measurement_date,
        },
      })
    }

    // Verify the field exists and user has access to it
    const fieldCheck = await pool.query("SELECT * FROM fields WHERE id = $1 AND user_id = $2", [field_id, userId])
    if (fieldCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Field not found or you don't have access to it",
      })
    }

    console.log("Field check passed, inserting data")

    const result = await pool.query(
      `INSERT INTO field_data 
        (field_id, crop_type, yield_amount, unit, measurement_date, notes, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [field_id, crop_type, yield_amount, unit, measurement_date, notes || null, userId],
    )

    console.log("Data inserted successfully:", result.rows[0])

    // Get the field name for the response
    const fieldResult = await pool.query("SELECT fieldname FROM fields WHERE id = $1", [field_id])
    const fieldName = fieldResult.rows[0]?.fieldname || "Unknown Field"

    const fieldData = result.rows[0]
    fieldData.field_name = fieldName

    res.status(201).json({
      success: true,
      message: "Field data added successfully",
      fieldData,
    })
  } catch (error) {
    console.error("Error creating field data:", error)
    res.status(500).json({
      success: false,
      message: "Server error while adding field data",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Update field data
router.put("/api/field-data/:id", authenticateToken, async (req, res) => {
  try {
    const dataId = req.params.id
    const userId = req.user.id
    const { field_id, crop_type, yield_amount, unit, measurement_date, notes } = req.body

    // Check if field data exists and belongs to user
    const checkData = await pool.query(
      `SELECT fd.* FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE fd.id = $1 AND (fd.user_id = $2 OR f.user_id = $2)`,
      [dataId, userId],
    )

    if (checkData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field data not found or you don't have access to it",
      })
    }

    // If field_id is provided, verify user has access to it
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
    let updateQuery = "UPDATE field_data SET "
    const updateValues = []
    const updateFields = []
    let paramIndex = 1

    if (field_id) {
      updateFields.push(`field_id = $${paramIndex}`)
      updateValues.push(field_id)
      paramIndex++
    }

    if (crop_type) {
      updateFields.push(`crop_type = $${paramIndex}`)
      updateValues.push(crop_type)
      paramIndex++
    }

    if (yield_amount !== undefined) {
      updateFields.push(`yield_amount = $${paramIndex}`)
      updateValues.push(yield_amount)
      paramIndex++
    }

    if (unit) {
      updateFields.push(`unit = $${paramIndex}`)
      updateValues.push(unit)
      paramIndex++
    }

    if (measurement_date) {
      updateFields.push(`measurement_date = $${paramIndex}`)
      updateValues.push(measurement_date)
      paramIndex++
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${paramIndex}`)
      updateValues.push(notes)
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
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`
    updateValues.push(dataId)

    const result = await pool.query(updateQuery, updateValues)

    // Get the field name for the response
    const fieldResult = await pool.query("SELECT fieldname FROM fields WHERE id = $1", [result.rows[0].field_id])
    const fieldName = fieldResult.rows[0]?.fieldname || "Unknown Field"

    const fieldData = result.rows[0]
    fieldData.field_name = fieldName

    res.status(200).json({
      success: true,
      message: "Field data updated successfully",
      fieldData,
    })
  } catch (error) {
    console.error("Error updating field data:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating field data",
      error: error.message,
    })
  }
})

// Delete field data
router.delete("/api/field-data/:id", authenticateToken, async (req, res) => {
  try {
    const dataId = req.params.id
    const userId = req.user.id

    // Check if field data exists and belongs to user
    const checkData = await pool.query(
      `SELECT fd.* FROM field_data fd
       JOIN fields f ON fd.field_id = f.id
       WHERE fd.id = $1 AND (fd.user_id = $2 OR f.user_id = $2)`,
      [dataId, userId],
    )

    if (checkData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field data not found or you don't have access to it",
      })
    }

    // Delete the field data
    await pool.query("DELETE FROM field_data WHERE id = $1", [dataId])

    res.status(200).json({
      success: true,
      message: "Field data deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting field data:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting field data",
      error: error.message,
    })
  }
})

// Get all crop types from fields table
router.get("/api/crop-types", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const cropTypesResult = await pool.query(
      `SELECT DISTINCT croptype 
       FROM fields 
       WHERE user_id = $1 
       ORDER BY croptype`,
      [userId],
    )

    const cropTypes = cropTypesResult.rows.map((row) => row.croptype)

    res.status(200).json({
      success: true,
      cropTypes,
    })
  } catch (error) {
    console.error("Error fetching crop types:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching crop types",
      error: error.message,
    })
  }
})

// Get all fields for dropdown
router.get("/api/fields-dropdown", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const fieldsResult = await pool.query(
      `SELECT id, fieldname 
       FROM fields 
       WHERE user_id = $1 
       ORDER BY fieldname`,
      [userId],
    )

    res.status(200).json({
      success: true,
      fields: fieldsResult.rows,
    })
  } catch (error) {
    console.error("Error fetching fields for dropdown:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching fields",
      error: error.message,
    })
  }
})

export default router
