import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import { 
  MapPin, Smartphone, Eye, 
  ExternalLink, Plus, Loader2, Camera 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerfilDashboard {
  id: number;
  nombre: string;
  foto_principal: string | null;
  telefono: string;
  whatsapp: string;
  ciudad: string;
  barrio: string | null;
  departamento: string;
  descripcion: string;
}

export function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/perfiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerfil(res.data);
      } catch{
        console.error("Aún no tiene perfil o error de carga");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPerfil();
    else navigate("/iniciar-sesion");
  }, [token, navigate]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* HEADER DEL DASHBOARD */}
      <div className="bg-zinc-950 text-white pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Mi Panel</h1>
            <p className="text-zinc-400 font-medium">Gestiona tu presencia en la red.</p>
          </div>
          <Button onClick={logout} variant="ghost" className="text-zinc-500 hover:text-white hover:bg-zinc-900 uppercase text-xs font-bold tracking-widest">
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16">
        {perfil ? (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LADO IZQUIERDO: VISTA PREVIA DEL ANUNCIO */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden relative">
                <div className="flex justify-between items-start mb-8">
                  <span className="inline-flex bg-green-100 text-green-700 border-none px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest">
                    Anuncio Activo
                  </span>
                  <Link to={`/perfil/${perfil.id}`} className="text-zinc-400 hover:text-red-600 transition-colors">
                    <ExternalLink size={20} />
                  </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* Foto Principal */}
                  <div className="w-40 h-40 rounded-3xl bg-zinc-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
                    <img 
                      src={perfil.foto_principal || "/placeholder-user.png"} 
                      alt={perfil.nombre} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">
                      {perfil.nombre}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="flex items-center gap-1 text-sm font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-lg">
                        <MapPin size={14} /> {perfil.ciudad}, {perfil.departamento}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-lg">
                        <Smartphone size={14} /> {perfil.whatsapp}
                      </span>
                    </div>
                    <p className="text-zinc-500 line-clamp-2 italic leading-relaxed">
                      "{perfil.descripcion}"
                    </p>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="grid grid-cols-1 gap-4 mt-10">
                  <Button 
                    variant="outline"
                    className="h-14 rounded-2xl border-2 border-zinc-100 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50"
                  >
                    <Camera size={16} className="mr-2" /> Gestionar Fotos
                  </Button>
                </div>
              </div>

              {/* STATS RÁPIDAS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm text-center">
                  <Eye className="mx-auto mb-2 text-blue-500" size={24} />
                  <p className="text-2xl font-black text-zinc-900">1,240</p>
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Vistas</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm text-center">
                  <Smartphone className="mx-auto mb-2 text-green-500" size={24} />
                  <p className="text-2xl font-black text-zinc-900">85</p>
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Clicks WhatsApp</p>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: OPCIONES DE CUENTA */}
            <div className="space-y-6">
              <div className="bg-zinc-950 rounded-[2rem] p-8 text-white">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-600 mb-6">Estado del Servicio</h3>
                <p className="mb-4 text-xs text-zinc-400">Cuenta: {user?.email ?? "Sin correo"}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl">
                    <span className="text-xs font-bold uppercase">Visible en la Red</span>
                    <div className="h-6 w-11 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Al desactivar, tu perfil dejará de aparecer en los resultados de búsqueda pero conservarás toda tu información.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Seguridad</h3>
                <Button variant="link" className="p-0 h-auto text-zinc-900 font-bold text-sm hover:text-red-600">
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO SIN PERFIL */
          <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl border border-zinc-100 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Plus size={40} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter mb-4">
              ¿Lista para empezar?
            </h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto">
              Aún no tienes un anuncio publicado. Crea tu perfil ahora para empezar a recibir clientes.
            </p>
            <Button 
              onClick={() => navigate("/nuevo")}
              className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200"
            >
              Publicar mi primer Anuncio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}