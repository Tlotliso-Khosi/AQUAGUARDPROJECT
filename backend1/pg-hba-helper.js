import { exec } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to find PostgreSQL's pg_hba.conf file location
const findPgHbaLocation = () => {
  return new Promise((resolve, reject) => {
    // Try to find pg_hba.conf location using PostgreSQL command
    exec('psql -U postgres -c "SHOW hba_file;"', (error, stdout, stderr) => {
      if (error) {
        console.log("Couldn't determine pg_hba.conf location automatically:", error.message)
        console.log("You'll need to locate and edit it manually.")

        // Common locations by OS
        const commonLocations = {
          windows: [
            "C:\\Program Files\\PostgreSQL\\<version>\\data\\pg_hba.conf",
            "C:\\Program Files\\PostgreSQL\\<version>\\data\\pg_hba.conf",
          ],
          mac: ["/usr/local/var/postgres/pg_hba.conf", "/opt/homebrew/var/postgres/pg_hba.conf"],
          linux: ["/etc/postgresql/<version>/main/pg_hba.conf", "/var/lib/postgresql/<version>/main/pg_hba.conf"],
        }

        console.log("Common pg_hba.conf locations:")
        console.log("Windows:", commonLocations.windows.join("\n         "))
        console.log("Mac:", commonLocations.mac.join("\n     "))
        console.log("Linux:", commonLocations.linux.join("\n       "))

        resolve(null)
        return
      }

      const location = stdout.trim()
      console.log("Found pg_hba.conf at:", location)
      resolve(location)
    })
  })
}

// Function to check and suggest pg_hba.conf changes
const checkPgHbaConfig = async () => {
  const location = await findPgHbaLocation()

  if (!location) {
    return {
      found: false,
      suggestions: `
# Add these lines to your pg_hba.conf file:

# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# or for less secure but easier testing:
host    all             all             127.0.0.1/32            trust

# IPv6 local connections:
host    all             all             ::1/128                 md5
# or for less secure but easier testing:
host    all             all             ::1/128                 trust
`,
    }
  }

  try {
    const content = fs.readFileSync(location, "utf8")
    console.log("Successfully read pg_hba.conf")

    // Check for common issues
    const hasLocalhost = content.includes("127.0.0.1/32")
    const hasIPv6 = content.includes("::1/128")
    const hasTrust = content.includes("trust")
    const hasMd5 = content.includes("md5")

    return {
      found: true,
      location,
      hasLocalhost,
      hasIPv6,
      hasTrust,
      hasMd5,
      suggestions: !hasLocalhost
        ? `
# Add these lines to your pg_hba.conf file at ${location}:

# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
`
        : "",
    }
  } catch (err) {
    console.error("Error reading pg_hba.conf:", err.message)
    return {
      found: true,
      location,
      error: err.message,
      suggestions: `
# Add these lines to your pg_hba.conf file at ${location}:

# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# or for less secure but easier testing:
host    all             all             127.0.0.1/32            trust

# IPv6 local connections:
host    all             all             ::1/128                 md5
# or for less secure but easier testing:
host    all             all             ::1/128                 trust
`,
    }
  }
}

// Run the function if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkPgHbaConfig()
    .then((result) => {
      console.log("PG_HBA Check Results:", JSON.stringify(result, null, 2))
      if (result.suggestions) {
        console.log("\nSuggested changes:")
        console.log(result.suggestions)
      }
    })
    .catch((err) => {
      console.error("Error checking pg_hba.conf:", err)
    })
}

export { checkPgHbaConfig, findPgHbaLocation }
