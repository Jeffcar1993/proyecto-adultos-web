import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom"; // Importar

export function CrearCuenta() {
  const navigate = useNavigate(); // Inicializar

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría tu lógica de axios.post('/auth/register', ...)
    try {
      // Supongamos que el registro es exitoso:
      console.log("Cuenta creada");
      
      // REDIRECCIÓN AL FORMULARIO DE PERFIL
      navigate("/nuevo"); 
    } catch {
      console.error("Error al crear cuenta");
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
                <Input placeholder="Tu nombre" className="h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:ring-blue-600/10" />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Correo Electrónico</label>
                <Input type="email" placeholder="ejemplo@correo.com" className="h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:ring-blue-600/10" />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contraseña</label>
                <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-zinc-200 bg-zinc-50 focus:ring-blue-600/10" />
              </div>

              <Button type="submit" className="text-white w-full h-14 rounded-xl bg-blue-600 text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all cursor-pointer">
                Crear Mi Cuenta
              </Button>
            </form>

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
              Registrarse con Google
            </Button>

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