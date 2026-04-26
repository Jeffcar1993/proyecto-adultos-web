import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2, X, Search } from "lucide-react";
import { PerfilCard } from "@/components/PerfilCard";
import colombiaData from "@/data/colombia.json";

interface PerfilListado {
  id: string;
  usuario_id: number;
  nombre: string;
  foto_principal: string;
  telefono: string;
  whatsapp: string;
  ciudad: string;
  barrio?: string;
  departamento: string;
  verificado: boolean;
}

export function TodosPerfiles() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const departamento = searchParams.get("departamento") ?? "";
  const ciudad = searchParams.get("ciudad") ?? "";
  const barrio = searchParams.get("barrio") ?? "";
  const q = searchParams.get("q") ?? "";

  const activeFilters = [departamento, ciudad, barrio, q].filter(Boolean) as string[];

  // Ciudades del departamento seleccionado
  const ciudadesDisponibles = useMemo(() => {
    if (!departamento) return [];
    return colombiaData.find((d) => d.departamento === departamento)?.ciudades ?? [];
  }, [departamento]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Al cambiar departamento, limpiar ciudad
    if (key === "departamento") next.delete("ciudad");
    setSearchParams(next, { replace: true });
  }

  function removeFilter(key: "departamento" | "ciudad" | "barrio" | "q") {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    if (key === "departamento") next.delete("ciudad");
    setSearchParams(next, { replace: true });
  }

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
      </div>

      {/* CONTROLES DE FILTRO */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Departamento */}
        <select
          value={departamento}
          onChange={(e) => setFilter("departamento", e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los departamentos</option>
          {colombiaData.map((d) => (
            <option key={d.departamento} value={d.departamento}>{d.departamento}</option>
          ))}
        </select>

        {/* Ciudad */}
        <select
          value={ciudad}
          onChange={(e) => setFilter("ciudad", e.target.value)}
          disabled={!departamento}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">Todas las ciudades</option>
          {ciudadesDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Barrio */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por barrio..."
            value={barrio}
            onChange={(e) => setFilter("barrio", e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {barrio && (
            <button
              onClick={() => removeFilter("barrio")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              aria-label="Limpiar barrio"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {departamento && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
              {departamento}
              <button onClick={() => removeFilter("departamento")} className="ml-1 rounded-full hover:bg-zinc-200 p-0.5" aria-label="Quitar departamento">
                <X size={11} />
              </button>
            </span>
          )}
          {ciudad && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {ciudad}
              <button onClick={() => removeFilter("ciudad")} className="ml-1 rounded-full hover:bg-blue-200 p-0.5" aria-label="Quitar ciudad">
                <X size={11} />
              </button>
            </span>
          )}
          {barrio && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
              Barrio: {barrio}
              <button onClick={() => removeFilter("barrio")} className="ml-1 rounded-full hover:bg-zinc-200 p-0.5" aria-label="Quitar barrio">
                <X size={11} />
              </button>
            </span>
          )}
          <button
            onClick={() => setSearchParams({}, { replace: true })}
            className="text-xs font-bold text-red-500 hover:text-red-700 underline"
          >
            Limpiar todos
          </button>
        </div>
      )}

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
              usuarioId={perfil.usuario_id}
              nombre={perfil.nombre}
              fotoPrincipal={perfil.foto_principal}
              telefono={perfil.telefono}
              whatsapp={perfil.whatsapp}
              ciudad={perfil.ciudad}
              barrio={perfil.barrio}
              departamento={perfil.departamento}
              verificado={perfil.verificado}
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
