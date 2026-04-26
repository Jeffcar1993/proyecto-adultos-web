import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import axios from "axios";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecial: /[^A-Za-z0-9]/,
};

function isStrongPassword(password: string): boolean {
  return (
    password.length >= PASSWORD_REQUIREMENTS.minLength &&
    PASSWORD_REQUIREMENTS.hasUppercase.test(password) &&
    PASSWORD_REQUIREMENTS.hasLowercase.test(password) &&
    PASSWORD_REQUIREMENTS.hasNumber.test(password) &&
    PASSWORD_REQUIREMENTS.hasSpecial.test(password)
  );
}

export function CrearCuenta() {
  const navigate = useNavigate(); // Inicializar
  const { login } = useAuth(); // Obtener función de login del contexto de autenticación

  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setSubmitError(
        "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo."
      );
      return;
    }

    setLoading(true);
    setSubmitError(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        nombre,
        email,
        password
      });

      // Si el registro te loguea automáticamente (recomendado)
      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate("/mi-perfil");
      } else {
        navigate("/iniciar-sesion"); // O ir al login si prefieres
      }
    } catch {
      setSubmitError("Error al crear cuenta. El correo podría estar en uso.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-[90vh] w-full bg-white lg:p-4">
      <div className="mx-auto flex w-full max-w-[1400px] overflow-hidden lg:rounded-3xl lg:border lg:border-zinc-100 lg:shadow-2xl">
        
        {/* LADO IZQUIERDO: Imagen (Ajustada en altura) */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white lg:flex">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=1200&q=80" 
              className="h-full w-full object-cover opacity-50 grayscale"
              alt="Erotik Registro"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          </div>

          <Link to="/" className="relative z-10 inline-block" aria-label="Ir al inicio">
            <img src="/logo.png" alt="Erotik Colombia" className="h-16 w-auto object-contain drop-shadow-sm" />
          </Link>

          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter">
              ÚNETE A LA <br /> RED MÁS <span className="text-red-600">EXCLUSIVA.</span>
            </h2>
            <p className="text-zinc-400 font-medium italic">Discreción total en cada paso.</p>
          </div>
        </div>

        {/* LADO DERECHO: Formulario y Registro con Google */}
        <div className="flex w-full flex-col justify-center px-6 py-10 lg:w-1/2 lg:px-20 bg-white overflow-y-auto">
          <div className="mx-auto w-full max-w-md space-y-8">
            
            <div className="space-y-2 text-center lg:text-left">
              <Link to="/iniciar-sesion" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-2">
                <ArrowLeft size={14} /> ¿Ya tienes cuenta? Inicia sesión
              </Link>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Crea tu cuenta</h1>
            </div>

            <form className="space-y-5" onSubmit={handleRegistro}>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nombre Completo</label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:ring-blue-600/10"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Correo Electrónico</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ejemplo@correo.com" className="h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:ring-blue-600/10" />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (submitError) setSubmitError(null);
                    }}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pr-11 focus:ring-blue-600/10"
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
                <p className="text-[11px] text-zinc-500">
                  Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !isStrongPassword(password)}
                className="text-white w-full h-14 rounded-xl bg-blue-600 text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all cursor-pointer"
              >
                {loading ? "Creando cuenta..." : "Crear Mi Cuenta"}
              </Button>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
            </form>

            <GoogleAuthButton label="Registrarse con Google" />

            <p className="text-center text-[11px] text-zinc-400 leading-relaxed uppercase tracking-tight font-medium">
              Al registrarte, confirmas que eres mayor de 18 años y aceptas nuestra{" "}
              <Link to="/politica-privacidad" className="text-zinc-900 underline font-bold">Política de Privacidad</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}