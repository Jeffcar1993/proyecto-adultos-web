import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ChevronDown, ChevronUp, ImageIcon, Loader2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerfilDetalleData {
  id: number;
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  barrio: string | null;
  edad: number | null;
  telefono: string;
  whatsapp: string;
  foto_principal: string | null;
  fotos?: unknown;
}

function normalizeFotos(input: unknown, principal: string | null): string[] {
  const fromArray = Array.isArray(input) ? input.filter((item): item is string => typeof item === "string") : [];
  const withPrincipal = principal ? [principal, ...fromArray] : fromArray;
  return Array.from(new Set(withPrincipal.filter(Boolean)));
}

export function PerfilDetalle() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState<PerfilDetalleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedDesc, setExpandedDesc] = useState(false);

  const MAX_DESC = 800;

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!id) {
        setError("Perfil no encontrado.");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/perfiles/${id}`);
        const data = response.data as PerfilDetalleData;
        setPerfil(data);
      } catch {
        setError("No se pudo cargar el detalle del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [id]);

  const fotos = useMemo(() => normalizeFotos(perfil?.fotos, perfil?.foto_principal ?? null), [perfil]);

  useEffect(() => {
    if (!selectedImage && fotos.length > 0) {
      setSelectedImage(fotos[0]);
    }
  }, [fotos, selectedImage]);

  const handleWhatsApp = () => {
    if (!perfil?.whatsapp) return;
    const cleanNumber = perfil.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  const handleCall = () => {
    if (!perfil?.telefono) return;
    window.open(`tel:${perfil.telefono}`);
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4 py-10">
        <Loader2 className="animate-spin text-blue-600" size={42} />
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error ?? "Perfil no disponible."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Helmet>
        <title>{`${perfil.nombre} | Perfil`}</title>
        <meta name="description" content={perfil.descripcion || `Conoce el perfil de ${perfil.nombre}.`} />
      </Helmet>

      <div className="mb-6">
        <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link to="/perfiles">
            <ArrowLeft size={16} className="mr-2" />
            Volver a todos los perfiles
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)]">
            <div className="grid gap-3 p-3 md:p-4 lg:grid-cols-[minmax(0,1fr)_150px] xl:grid-cols-[minmax(0,1fr)_170px]">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.2),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#e5e7eb_100%)]">
                <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <ImageIcon size={14} />
                  {fotos.length} foto{fotos.length === 1 ? "" : "s"}
                </div>
                <img
                  src={selectedImage ?? "/placeholder-user.png"}
                  alt={perfil.nombre}
                  className="h-[360px] w-full object-contain p-3 md:h-[460px] md:p-4 lg:h-[540px]"
                />
              </div>

              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[540px] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
                  {fotos.map((foto, index) => (
                    <button
                      key={foto}
                      type="button"
                      className={`group relative min-w-[86px] overflow-hidden rounded-2xl border bg-zinc-100 transition duration-200 lg:min-w-0 ${
                        selectedImage === foto
                          ? "border-blue-600 ring-2 ring-blue-300 shadow-lg shadow-blue-100"
                          : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}
                      onClick={() => setSelectedImage(foto)}
                    >
                      <div className="absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                        {index + 1}
                      </div>
                      <img
                        src={foto}
                        alt={`Foto ${index + 1} de ${perfil.nombre}`}
                        className="h-24 w-24 object-contain p-1.5 md:h-28 md:w-28 lg:h-[96px] lg:w-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900">{perfil.nombre}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
              <MapPin size={14} />
              {perfil.ciudad}
              {perfil.barrio ? `, ${perfil.barrio}` : ""}
              {perfil.departamento ? ` - ${perfil.departamento}` : ""}
            </div>
            {perfil.edad && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {perfil.edad} años
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Descripción</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-zinc-700">
              {expandedDesc || perfil.descripcion.length <= MAX_DESC
                ? perfil.descripcion
                : perfil.descripcion.slice(0, MAX_DESC) + "…"}
            </p>
            {perfil.descripcion.length > MAX_DESC && (
              <button
                type="button"
                onClick={() => setExpandedDesc((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {expandedDesc ? (
                  <><ChevronUp size={14} /> Ver menos</>
                ) : (
                  <><ChevronDown size={14} /> Ver más</>
                )}
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={handleCall} className="h-12 bg-blue-600 text-white hover:bg-blue-700">
              <Phone size={16} className="mr-2" />
              Llamar
            </Button>
            <Button onClick={handleWhatsApp} className="h-12 bg-green-600 text-white hover:bg-green-700">
              <MessageCircle size={16} className="mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
