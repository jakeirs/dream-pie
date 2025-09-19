export interface TestApiPageProps {
  className?: string
}

export interface ApiTestResult {
  endpoint: string
  method: string
  status: 'success' | 'error' | 'loading'
  response?: string
  error?: string
  timestamp?: string
}