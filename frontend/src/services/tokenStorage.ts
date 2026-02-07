export type Tokens = {
  accessToken: string
  refreshToken: string
}

const KEY = 'usersapi_tokens'

export const getTokens = (): Tokens | null => {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Tokens
  } catch {
    return null
  }
}

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem(KEY, JSON.stringify(tokens))
}

export const clearTokens = () => {
  localStorage.removeItem(KEY)
}
