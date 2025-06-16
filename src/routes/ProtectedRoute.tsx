import type React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import type { RootState } from "../redux/store"

interface ProtectedRouteProps {
  children?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user)

  if (!user?.id) {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
