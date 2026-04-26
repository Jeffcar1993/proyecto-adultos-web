import { Link, useNavigate, } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import axios from "axios";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";


export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 pr-11 focus:ring-blue-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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

          <GoogleAuthButton label="Iniciar sesión con Google" />
        </div>
      </div>
    </div>
  );
}