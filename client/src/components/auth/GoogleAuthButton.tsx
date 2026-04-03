import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  label?: string;
}

const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export function GoogleAuthButton({ label = "Continuar con Google" }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        // Obtenemos la info del usuario desde Google con el access_token
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        // Enviamos al backend para crear/encontrar la cuenta
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/google`,
          { credential: tokenResponse.access_token, userInfo: userInfo.data }
        );

        login(response.data.token, response.data.user);
        navigate("/mi-perfil");
      } catch {
        setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("El inicio de sesión con Google fue cancelado o falló.");
    },
  });

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={() => handleGoogleLogin()}
        className="w-full h-12 rounded-xl border-zinc-200 flex items-center justify-center gap-3 font-bold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
        ) : (
          <GoogleIcon />
        )}
        {loading ? "Conectando..." : label}
      </Button>
      {error && (
        <p className="text-xs text-red-600 text-center font-semibold">{error}</p>
      )}
    </div>
  );
}
