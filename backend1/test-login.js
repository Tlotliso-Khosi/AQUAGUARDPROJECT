import fetch from "node-fetch"

// Test user credentials
const testUser = {
  email: "moroeng@gmail.com",
  password: "Thatohatsi123",
}

// Function to test the login endpoint
const testLoginEndpoint = async () => {
  try {
    console.log("Testing login endpoint...")
    console.log("Request body:", testUser)

    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    })

    console.log("Response status:", response.status)

    const contentType = response.headers.get("content-type")
    console.log("Content-Type:", contentType)

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      console.log("Response data:", data)
    } else {
      const text = await response.text()
      console.log("Response text (not JSON):", text.substring(0, 200) + "...")
    }
  } catch (error) {
    console.error("Error testing login endpoint:", error)
  }
}

// Run the test
testLoginEndpoint()

// Run this script with `node test-login.js` to test the login endpoint
// Make sure your server is running before executing this script
// Check the output to see if the endpoint is responding correctly
