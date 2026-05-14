import { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/mi-perfil" replace />;
  }

  return children;
}
