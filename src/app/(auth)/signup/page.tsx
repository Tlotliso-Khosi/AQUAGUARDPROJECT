"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  const [email, setEmail] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [usertype, setUserType] = useState("")

  // Test the backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test")
      const data = await response.json()
      setDebugInfo(`Backend connection successful: ${data.message}`)
      return true
    } catch (error) {
      setDebugInfo(`Backend connection failed: ${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  // Test the database connection
  const testDatabaseConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/db-test")
      const data = await response.json()
      setDebugInfo(`Database connection: ${data.message}`)
      return data.message.includes("successful")
    } catch (error) {
      setDebugInfo(`Database test failed: ${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo("")

    // First test the connection
    const isConnected = await testBackendConnection()
    if (!isConnected) {
      setError("Cannot connect to the backend server. Please make sure it's running.")
      setIsLoading(false)
      return
    }

    // Then test the database connection
    const isDatabaseConnected = await testDatabaseConnection()
    if (!isDatabaseConnected) {
      setError("Database connection failed. Please check your database configuration.")
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        firstname,
        lastname,
        email,
        usertype,
        password,
      }

      setDebugInfo("Attempting to send data to backend...")

      // Update the URL to use the new Node.js backend
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }).catch((err) => {
        throw new Error(`Network error: ${err.message}`)
      })

      if (!response) {
        throw new Error("No response received from server")
      }

      setDebugInfo(`Response status: ${response.status}`)

      const data = await response.json().catch((err) => {
        throw new Error(`Failed to parse response: ${err.message}`)
      })

      setDebugInfo((prev) => `${prev}\nResponse data: ${JSON.stringify(data)}`)

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Registration successful
      alert("Registration successful")
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength validation
  const passwordStrength = () => {
    if (!password) return { strength: 0, text: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const strengthText = ["Weak", "Fair", "Good", "Strong"]
    return {
      strength,
      text: strengthText[strength - 1] ?? "",
    }
  }

  const { strength, text } = passwordStrength()

  return (
    <Card className="w-full shadow-none bg-transparent dark:bg-transparent border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details to create your AquaGuardAI account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">{error}</div>}
        {debugInfo && (
          <div className="mb-4 p-3 text-xs text-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-md font-mono whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <div className="relative">
                <Input
                  id="first-name"
                  placeholder="Thabo"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="pl-10"
                />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last name</Label>
              <div className="relative">
                <Input
                  id="type"
                  placeholder="Mashilo"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="pl-10"
                />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
                className="pl-10"
              />
              <MailIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usertype">User type</Label>
            <div className="relative">
              <Input
                id="user_type"
                placeholder="farmer or customer"
                type="text"
                value={usertype}
                onChange={(e) => setUserType(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <LockIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>

            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Password strength:</span>
                  <span
                    className={`text-sm font-medium ${
                      strength === 4 ? "text-green-500" : strength >= 2 ? "text-amber-500" : "text-red-500"
                    }`}
                  >
                    {text}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full ${
                        level <= strength
                          ? level === 4
                            ? "bg-green-500"
                            : level >= 2
                              ? "bg-amber-500"
                              : "bg-red-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-x-2">
                <CheckIcon className={`h-3.5 w-3.5 ${password.length >= 8 ? "text-primary" : "opacity-50"}`} />
                <span className={password.length >= 8 ? "text-foreground" : ""}>At least 8 characters</span>
              </li>
              <li className="flex items-center gap-x-2">
                <CheckIcon className={`h-3.5 w-3.5 ${/[A-Z]/.test(password) ? "text-primary" : "opacity-50"}`} />
                <span className={/[A-Z]/.test(password) ? "text-foreground" : ""}>One uppercase letter</span>
              </li>
              <li className="flex items-center gap-x-2">
                <CheckIcon className={`h-3.5 w-3.5 ${/[0-9]/.test(password) ? "text-primary" : "opacity-50"}`} />
                <span className={/[0-9]/.test(password) ? "text-foreground" : ""}>One number</span>
              </li>
              <li className="flex items-center gap-x-2">
                <CheckIcon className={`h-3.5 w-3.5 ${/[^A-Za-z0-9]/.test(password) ? "text-primary" : "opacity-50"}`} />
                <span className={/[^A-Za-z0-9]/.test(password) ? "text-foreground" : ""}>One special character</span>
              </li>
            </ul>
          </div>

          <Button className="w-full rounded-full" type="submit" disabled={isLoading || strength < 2}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={testBackendConnection}
              disabled={isLoading}
            >
              Test Backend
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={testDatabaseConnection}
              disabled={isLoading}
            >
              Test Database
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium hover:underline text-secondary">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
