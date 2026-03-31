import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerfilDetalleData {
  id: number;
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  barrio: string | null;
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
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
            <img
              src={selectedImage ?? "/placeholder-user.png"}
              alt={perfil.nombre}
              className="h-[320px] w-full object-cover object-top md:h-[380px]"
            />
          </div>

          {fotos.length > 1 && (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(fotos.length, 5)}, 1fr)` }}>
              {fotos.map((foto) => (
                <button
                  key={foto}
                  type="button"
                  className={`overflow-hidden rounded-xl border transition ${
                    selectedImage === foto ? "border-blue-600 ring-2 ring-blue-400" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                  onClick={() => setSelectedImage(foto)}
                >
                  <img src={foto} alt={`Foto de ${perfil.nombre}`} className="h-16 w-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900">{perfil.nombre}</h1>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
            <MapPin size={14} />
            {perfil.ciudad}
            {perfil.barrio ? `, ${perfil.barrio}` : ""}
            {perfil.departamento ? ` - ${perfil.departamento}` : ""}
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Descripción</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-zinc-700">{perfil.descripcion}</p>
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
