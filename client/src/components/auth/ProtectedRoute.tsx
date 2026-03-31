import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children;
}
