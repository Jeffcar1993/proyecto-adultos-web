import { Link, useNavigate, } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import axios from "axios";


export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password
      });

      login(response.data.token, response.data.user);
      
      navigate("/mi-perfil");
    } catch {
      setSubmitError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-[85vh] min-h-[600px] w-full bg-white overflow-hidden rounded-3xl shadow-2xl my-auto">
      {/* LADO IZQUIERDO: Imagen e Impacto (Oculto en móvil) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white lg:w-[45%] lg:flex">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=1200&q=80" 
            className="h-full w-full object-cover opacity-50 grayscale transition-transform duration-1000 hover:scale-105"
            alt="Ambiente Erotik"
          />
          {/* El gradiente negro abajo es vital para que el texto sea legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        <Link to="/" className="relative z-10 inline-block" aria-label="Ir al inicio">
          <img src="/logo.png" alt="Erotik Colombia" className="h-16 w-auto object-contain drop-shadow-sm" />
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black leading-tight tracking-tighter">
            TU PRIVACIDAD ES <br /> NUESTRA <span className="text-red-600">PRIORIDAD.</span>
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <ShieldCheck className="text-blue-500" size={18} /> Perfiles Verificados
            </div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <Lock className="text-blue-500" size={18} /> Datos Encriptados
            </div>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[55%] lg:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-zinc-900 transition-colors mb-4">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-red-900 uppercase">Bienvenido de nuevo</h1>
            <p className="text-zinc-500">Ingresa tus credenciales para gestionar tu perfil.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="ejemplo@correo.com" 
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Contraseña</label>
                <Link to="/recuperar-contraseña" className="text-xs font-bold text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="text-white w-full h-12 rounded-xl bg-blue-600 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all cursor-pointer">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </form>

          <p className="text-center text-sm text-zinc-500">
            ¿No tienes una cuenta?{" "}
            <Link to="/crear-cuenta" className="font-bold text-red-600 hover:underline">Regístrate gratis</Link>
          </p>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-zinc-200 flex items-center justify-center gap-3 font-bold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer"
            onClick={() => {/* Lógica de Google */}}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Iniciar sesión con Google
          </Button>
        </div>
      </div>
    </div>
  );
}