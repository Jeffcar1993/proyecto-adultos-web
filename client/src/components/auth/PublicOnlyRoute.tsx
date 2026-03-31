import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/mi-perfil" replace />;
  }

  return children;
}
