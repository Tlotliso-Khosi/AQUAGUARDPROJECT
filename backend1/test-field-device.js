import fetch from "node-fetch"

// Configuration
const API_BASE_URL = "http://localhost:5000"
const TEST_USER = {
  email: "moroeng@gmail.com",
  password: "Thatohatsi123",
}

// Function to test the API endpoints
const testFieldDeviceAPI = async () => {
  try {
    console.log("=== Testing Field and Device API ===\n")

    // Step 1: Login to get token
    console.log("1. Logging in to get authentication token...")
    const loginResponse = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TEST_USER),
    })

    const loginData = await loginResponse.json()

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.message}`)
    }

    console.log("Login successful!")
    console.log(`User: ${loginData.user.firstname} ${loginData.user.lastname} (${loginData.user.usertype})`)

    const token = loginData.token
    console.log("Token received\n")

    // Step 2: Create a new field
    console.log("2. Creating a new field...")
    const fieldData = {
      fieldname: "Test Field",
      location: "Test Location",
      area: 4.5,
      croptype: "Corn",
      status: "active",
      soiltype: "loamy",
      drainage: "good",
    }

    const fieldResponse = await fetch(`${API_BASE_URL}/api/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fieldData),
    })

    const fieldResult = await fieldResponse.json()

    if (!fieldResponse.ok) {
      throw new Error(`Field creation failed: ${fieldResult.message}`)
    }

    console.log("Field created successfully!")
    console.log("Field ID:", fieldResult.field.id)
    console.log("Field Name:", fieldResult.field.fieldname)
    console.log("Field Location:", fieldResult.field.location)
    console.log("Field Area:", fieldResult.field.area, "acres")
    console.log("Field Status:", fieldResult.field.status)
    console.log("Field Soil Type:", fieldResult.field.soiltype)
    console.log("Field Drainage:", fieldResult.field.drainage)
    console.log()

    const fieldId = fieldResult.field.id

    // Step 3: Create a new device
    console.log("3. Creating a new device...")
    const deviceData = {
      name: "Test Sensor",
      mac_address: "AA:BB:CC:DD:EE:FF",
      device_type: "soil_sensor",
      field_id: fieldId,
    }

    const deviceResponse = await fetch(`${API_BASE_URL}/api/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deviceData),
    })

    const deviceResult = await deviceResponse.json()

    if (!deviceResponse.ok) {
      throw new Error(`Device creation failed: ${deviceResult.message}`)
    }

    console.log("Device created successfully!")
    console.log("Device ID:", deviceResult.device.id)
    console.log("Device Name:", deviceResult.device.name)
    console.log("Device MAC:", deviceResult.device.mac_address)
    console.log("Device Type:", deviceResult.device.device_type)
    console.log("Associated Field ID:", deviceResult.device.field_id)
    console.log()

    const deviceId = deviceResult.device.id

    // Step 4: Get all fields
    console.log("4. Fetching all fields...")
    const fieldsResponse = await fetch(`${API_BASE_URL}/api/fields`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const fieldsResult = await fieldsResponse.json()

    if (!fieldsResponse.ok) {
      throw new Error(`Fetching fields failed: ${fieldsResult.message}`)
    }

    console.log(`Retrieved ${fieldsResult.fields.length} fields`)
    console.log()

    // Step 5: Get all devices
    console.log("5. Fetching all devices...")
    const devicesResponse = await fetch(`${API_BASE_URL}/api/devices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const devicesResult = await devicesResponse.json()

    if (!devicesResponse.ok) {
      throw new Error(`Fetching devices failed: ${devicesResult.message}`)
    }

    console.log(`Retrieved ${devicesResult.devices.length} devices`)
    console.log()

    // Step 6: Get field details
    console.log(`6. Fetching details for field ID: ${fieldId}...`)
    const fieldDetailResponse = await fetch(`${API_BASE_URL}/api/fields/${fieldId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const fieldDetailResult = await fieldDetailResponse.json()

    if (!fieldDetailResponse.ok) {
      throw new Error(`Fetching field details failed: ${fieldDetailResult.message}`)
    }

    console.log("Field details retrieved successfully!")
    console.log("Field Name:", fieldDetailResult.field.fieldname)
    console.log("Devices associated with this field:", fieldDetailResult.field.devices.length)
    console.log()

    // Step 7: Get device details
    console.log(`7. Fetching details for device ID: ${deviceId}...`)
    const deviceDetailResponse = await fetch(`${API_BASE_URL}/api/devices/${deviceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const deviceDetailResult = await deviceDetailResponse.json()

    if (!deviceDetailResponse.ok) {
      throw new Error(`Fetching device details failed: ${deviceDetailResult.message}`)
    }

    console.log("Device details retrieved successfully!")
    console.log("Device Name:", deviceDetailResult.device.name)
    console.log("Associated Field:", deviceDetailResult.device.field_name)
    console.log()

    console.log("=== All tests completed successfully! ===")
  } catch (error) {
    console.error("Test failed:", error.message)
  }
}

// Run the tests
testFieldDeviceAPI()
