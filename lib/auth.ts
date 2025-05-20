import Cookies from "js-cookie"

interface User {
  id?: number
  name?: string
  username?: string
  role?: string
}

// Mock authentication for testing (REMOVE IN PRODUCTION)
export const mockLogin = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  // Simple validation
  if (username === "admin" && password === "password") {
    const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)
    const mockUser = {
      id: 1,
      name: "Admin User",
      username: "admin",
      role: "super-admin",
    }

    // Store in cookies
    setToken(mockToken)
    setUser(mockUser)

    return { token: mockToken, user: mockUser }
  } else {
    throw new Error("Invalid username or password")
  }
}

// Token management
export const getToken = (): string | undefined => {
  return Cookies.get("auth_token")
}

export const setToken = (token: string): void => {
  // Set cookie to expire in 1 day
  Cookies.set("auth_token", token, { expires: 1 })
}

export const removeToken = (): void => {
  Cookies.remove("auth_token")
  Cookies.remove("user")
}

// User management
export const setUser = (user: User): void => {
  Cookies.set("user", JSON.stringify(user), { expires: 1 })
}

export const getUserFromCookie = (): User | null => {
  const userStr = Cookies.get("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (e) {
    console.error("Error parsing user from cookie:", e)
    return null
  }
}

// Authentication functions
export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Login failed" }))
    throw new Error(error.message || `Login failed with status ${response.status}`)
  }

  const data = await response.json()
  console.log("API Response:", data) // Debug log

  // Handle different possible response structures
  let token = ""
  let user = { username }

  if (data.data && data.data.token) {
    // Expected structure
    token = data.data.token
    user = data.data.user || { username }
  } else if (data.token) {
    // Alternative structure
    token = data.token
    user = data.user || { username }
  } else {
    console.error("Unexpected API response structure:", data)
    throw new Error("Unexpected response from server")
  }

  // Store token and user in cookies
  setToken(token)
  setUser(user)

  return { token, user }
}

export const verifyToken = async (): Promise<boolean> => {
  const token = getToken()

  if (!token) {
    return false
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      removeToken()
      return false
    }

    return true
  } catch (error) {
    console.error("Token verification error:", error)
    removeToken()
    return false
  }
}

export const logout = async (): Promise<void> => {
  const token = getToken()

  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "logout" }),
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Always remove token and user from cookies
  removeToken()
}
