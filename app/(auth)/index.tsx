import { Redirect } from 'expo-router'

export default function AuthIndex() {
  // Redirect to onboarding as the first screen in auth flow
  return <Redirect href="/(auth)/(onboarding)/step1" />
}
