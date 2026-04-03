import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // React Router v6 guarda { idx } en el estado del historial del navegador.
  // idx > 0 significa que hay al menos una página anterior dentro de la app.
  const canGoBack = (window.history.state?.idx ?? 0) > 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-10">

        {/* Número 404 */}
        <div className="relative select-none">
          <p className="text-[10rem] font-black leading-none tracking-tighter text-zinc-100">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-lg">
                <AlertTriangle size={36} className="text-amber-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-200">
                Página no encontrada
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            Esta ruta no existe
          </h1>
          <p className="text-zinc-500 leading-relaxed">
            La dirección{" "}
            <code className="bg-zinc-100 text-zinc-700 text-sm font-mono px-2 py-0.5 rounded-lg">
              {location.pathname}
            </code>{" "}
            no existe o fue eliminada. Puedes regresar a donde estabas o ir al inicio.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => canGoBack ? navigate(-1) : navigate("/")}
            variant="outline"
            className="w-full sm:w-auto h-12 rounded-xl font-bold gap-2 border-zinc-200 hover:bg-zinc-50"
          >
            <ArrowLeft size={16} />
            Volver atrás
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
          >
            <Link to="/">
              <Home size={16} />
              Ir al inicio
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-12 rounded-xl font-bold gap-2 border-zinc-200 hover:bg-zinc-50"
          >
            <Link to="/perfiles">
              <Search size={16} />
              Ver perfiles
            </Link>
          </Button>
        </div>

        {/* Links rápidos */}
        <div className="border-t border-zinc-100 pt-8">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
            O visita una de estas páginas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Inicio", to: "/" },
              { label: "Perfiles", to: "/perfiles" },
              { label: "Iniciar Sesión", to: "/iniciar-sesion" },
              { label: "Crear Cuenta", to: "/crear-cuenta" },
              { label: "Contacto", to: "/contacto" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-semibold text-zinc-500 hover:text-blue-600 underline-offset-4 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
