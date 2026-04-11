export interface User {
  id: string
  email: string | undefined
  full_name?: string
  avatar_url?: string
}

export interface AuthError {
  message: string
  status?: number
}
