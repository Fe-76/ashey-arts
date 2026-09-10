import { Navigate } from 'react-router-dom'

// Etapa 3.5: How it Works moved into Home as #how-it-works.
export function HowItWorks() {
  return <Navigate to="/#how-it-works" replace />
}
