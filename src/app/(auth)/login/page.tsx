"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("customer") // Default role

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

    try {
      const userData = {
        email: email,
        password: password,
        usertype: role, // Send the selected role to the backend
      }

      setDebugInfo("Attempting to send login data to backend...")

      // Update the URL to use the Node.js backend
      const response = await fetch("http://localhost:5000/api/user/login", {
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
        throw new Error(data.message || "Login failed")
      }

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          usertype: data.user.usertype,
        }),
      )

      // Store token if available
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      // Store selected role
      localStorage.setItem("user_role", data.user.usertype)

      // Success message
      alert("Login successful")

      // Redirect based on user type from the response
      if (data.user.usertype === "farmer") {
        router.push("/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-none bg-transparent dark:bg-transparent border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white sm:text-black">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground">Enter your email to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">{error}</div>}
        {debugInfo && (
          <div className="mb-4 p-3 text-xs text-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-md font-mono whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white sm:text-black" htmlFor="email">
              Email
            </Label>
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
            <div className="flex items-center justify-between">
              <Label className="text-white sm:text-black" htmlFor="password">
                Password
              </Label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-secondary hover:underline">
                Forgot password?
              </Link>
            </div>
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
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent bg-secondary"
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
          </div>

          {/* Role selection dropdown */}
          <div className="space-y-2">
            <Label className="text-white sm:text-black" htmlFor="role">
              I am a
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="farmer">Farmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium text-white sm:text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div>
          <Button className="w-full rounded-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={testBackendConnection}
            disabled={isLoading}
          >
            Test Backend Connection
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-white sm:text-black">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-secondary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
