// This is a test script you can run with Node.js to verify your API
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const API_URL = "http://localhost:5000"
let token

async function login() {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      }),
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message)
    }

    token = data.token
    console.log("Login successful")
    return token
  } catch (error) {
    console.error("Login failed:", error.message)
    process.exit(1)
  }
}

async function testAddFieldData() {
  try {
    if (!token) {
      token = await login()
    }

    const testData = {
      field_id: 1, // Replace with a valid field_id from your database
      crop_type: "Corn",
      yield_amount: 150.5,
      unit: "kg",
      measurement_date: new Date().toISOString().split("T")[0],
      notes: "Test data entry",
    }

    console.log("Sending test data:", testData)

    const response = await fetch(`${API_URL}/api/field-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    })

    const data = await response.json()
    console.log("API Response:", data)

    if (data.success) {
      console.log("✅ Test passed: Field data added successfully")
    } else {
      console.log("❌ Test failed:", data.message)
    }
  } catch (error) {
    console.error("Test failed with error:", error.message)
  }
}

async function testGetFieldData() {
  try {
    if (!token) {
      token = await login()
    }

    const response = await fetch(`${API_URL}/api/field-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    console.log("API Response:", data)

    if (data.success) {
      console.log(`✅ Test passed: Retrieved ${data.fieldData.length} field data records`)
    } else {
      console.log("❌ Test failed:", data.message)
    }
  } catch (error) {
    console.error("Test failed with error:", error.message)
  }
}

// Run the tests
async function runTests() {
  console.log("=== Testing Field Data API ===")
  await testAddFieldData()
  await testGetFieldData()
  console.log("=== Tests completed ===")
}

runTests()
