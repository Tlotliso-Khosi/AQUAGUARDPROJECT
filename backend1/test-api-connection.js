// This is a simple script to test your API connection
// Run it with: node test-api-connection.js

import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const API_URL = "http://localhost:5000"

async function testApiConnection() {
  try {
    console.log("Testing API connection to:", API_URL)

    // Test the health endpoint
    console.log("\nTesting health endpoint...")
    const healthResponse = await fetch(`${API_URL}/api/health`)

    if (!healthResponse.ok) {
      console.log("❌ Health check failed with status:", healthResponse.status)
      const text = await healthResponse.text()
      console.log("Response:", text.substring(0, 500))
    } else {
      const healthData = await healthResponse.json()
      console.log("Health check response:", healthData)
      console.log("✅ API server is running correctly")
    }

    // Try to login
    console.log("\nTesting login functionality...")
    const loginResponse = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: process.env.TEST_USER_EMAIL || "moroeng@gmail.com",
        password: process.env.TEST_USER_PASSWORD || "Thatohtsi2003", // Fixed typo in password
      }),
    })

    console.log("Login response status:", loginResponse.status)

    const loginText = await loginResponse.text()
    console.log("Raw login response:", loginText.substring(0, 200))

    let loginData
    try {
      loginData = JSON.parse(loginText)
      console.log("Login response data:", loginData)

      if (loginData.token) {
        console.log("✅ Login successful, received token")

        // Test the statistics endpoint
        console.log("\nTesting statistics endpoint...")
        const statsResponse = await fetch(`${API_URL}/api/field-data/statistics`, {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
            Accept: "application/json",
          },
        })

        console.log("Statistics response status:", statsResponse.status)
        const statsText = await statsResponse.text()
        console.log("Raw statistics response:", statsText.substring(0, 200))

        try {
          const statsData = JSON.parse(statsText)
          console.log("Statistics response data:", statsData)
          console.log("✅ Statistics endpoint working correctly")
        } catch (e) {
          console.log("❌ Statistics endpoint returned invalid JSON:")
          console.log(statsText.substring(0, 500))
        }
      } else {
        console.log("❌ Login failed, no token received")
      }
    } catch (e) {
      console.log("❌ Login returned invalid JSON:")
      console.log(loginText.substring(0, 500))
    }
  } catch (error) {
    console.error("Error testing API connection:", error)
  }
}

testApiConnection()
