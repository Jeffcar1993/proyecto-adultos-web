import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { PerfilCard } from "@/components/PerfilCard";

interface PerfilListado {
  id: string;
  nombre: string;
  foto_principal: string;
  telefono: string;
  whatsapp: string;
  ciudad: string;
  barrio?: string;
  departamento: string;
}

export function TodosPerfiles() {
  const [searchParams] = useSearchParams();
  const [perfiles, setPerfiles] = useState<PerfilListado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const params = new URLSearchParams();
        const departamento = searchParams.get("departamento");
        const ciudad = searchParams.get("ciudad");
        const barrio = searchParams.get("barrio");
        const q = searchParams.get("q");

        if (departamento) params.append("departamento", departamento);
        if (ciudad) params.append("ciudad", ciudad);
        if (barrio) params.append("barrio", barrio);
        if (q) params.append("q", q);

        const query = params.toString();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/perfiles${query ? `?${query}` : ""}`);
        setPerfiles(Array.isArray(response.data) ? response.data : []);
      } catch {
        setPerfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfiles();
  }, [searchParams]);

  const departamento = searchParams.get("departamento");
  const ciudad = searchParams.get("ciudad");
  const barrio = searchParams.get("barrio");
  const q = searchParams.get("q");

  const activeFilters = [departamento, ciudad, barrio, q].filter(Boolean) as string[];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <Helmet>
        <title>Todos los perfiles | Erotik Colombia</title>
        <meta
          name="description"
          content="Listado completo de perfiles recientes en Erotik Colombia. Explora y encuentra el perfil ideal en tu ciudad."
        />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900">Todos los perfiles</h1>
        <p className="mt-2 text-zinc-600">Perfiles recientes creados en la plataforma.</p>
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {departamento && <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">Departamento: {departamento}</span>}
            {ciudad && <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">Ciudad: {ciudad}</span>}
            {barrio && <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">Barrio: {barrio}</span>}
            {q && <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">Búsqueda: {q}</span>}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[45vh] items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : perfiles.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {perfiles.map((perfil) => (
            <PerfilCard
              key={perfil.id}
              id={perfil.id}
              nombre={perfil.nombre}
              fotoPrincipal={perfil.foto_principal}
              telefono={perfil.telefono}
              whatsapp={perfil.whatsapp}
              ciudad={perfil.ciudad}
              barrio={perfil.barrio}
              departamento={perfil.departamento}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600">
          Aún no hay perfiles disponibles.
        </div>
      )}
    </div>
  );
}
