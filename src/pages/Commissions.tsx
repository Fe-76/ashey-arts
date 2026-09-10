import { Navigate } from 'react-router-dom'

// Etapa 3.5: Commissions moved into Home as #commissions, so this old
// standalone route just forwards there instead of duplicating content.
export function Commissions() {
  return <Navigate to="/#commissions" replace />
}
