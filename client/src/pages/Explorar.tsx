import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import colombiaData from "@/data/colombia.json";
import axios from "axios";

interface Perfil {
  id: string;
  nombre: string;
  foto_principal: string;
  telefono: string;
  whatsapp: string;
  ciudad: string;
  barrio?: string;
  departamento: string;
}

export function Explorar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);

  // Estados de filtros
  const [departamento, setDepartamento] = useState(searchParams.get("departamento") || "");
  const [ciudad, setCiudad] = useState(searchParams.get("ciudad") || "");
  const [barrio, setBarrio] = useState(searchParams.get("barrio") || "");
  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");

  // Actualizar ciudades disponibles cuando cambia el departamento
  useEffect(() => {
    if (departamento) {
      const depMatch = colombiaData.find((d) => d.departamento === departamento);
      setCiudadesDisponibles(depMatch ? depMatch.ciudades : []);
      setCiudad(""); // Resetear ciudad
    } else {
      setCiudadesDisponibles([]);
    }
  }, [departamento]);

  // Cargar perfiles cuando cambian los filtros
  useEffect(() => {
    const fetchPerfiles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (departamento) params.append("departamento", departamento);
        if (ciudad) params.append("ciudad", ciudad);
        if (barrio) params.append("barrio", barrio);
        if (busqueda) params.append("q", busqueda);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/perfiles?${params.toString()}`
        );
        setPerfiles(response.data);
      } catch (error) {
        console.error("Error cargando perfiles:", error);
        setPerfiles([]);
      } finally {
        setLoading(false);
      }
    };

    // Actualizar query params en URL
    const newParams = new URLSearchParams();
    if (departamento) newParams.set("departamento", departamento);
    if (ciudad) newParams.set("ciudad", ciudad);
    if (barrio) newParams.set("barrio", barrio);
    if (busqueda) newParams.set("q", busqueda);
    setSearchParams(newParams);

    // Con delay para evitar demasiadas requests
    const timer = setTimeout(fetchPerfiles, 300);
    return () => clearTimeout(timer);
  }, [departamento, ciudad, barrio, busqueda, setSearchParams]);

  return (
    <div className="flex flex-col w-full bg-white">
      <Helmet>
        <title>Explorar Perfiles | Erotik Colombia</title>
        <meta
          name="description"
          content="Encuentra perfiles verificados en tu ciudad. Búsqueda discreta y segura."
        />
      </Helmet>

      {/* SECCIÓN: HERO + FILTROS */}
      <section className="bg-gradient-to-br from-zinc-50 to-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase mb-2">
              Explorar Perfiles
            </h1>
            <p className="text-zinc-500">
              {perfiles.length} resultado{perfiles.length !== 1 ? "s" : ""} encontrado
              {perfiles.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* FILTROS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda por texto */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="h-12 rounded-xl bg-zinc-100 border-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Departamento */}
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="h-12 rounded-xl bg-zinc-100 border-none px-3 focus:ring-2 focus:ring-blue-600/20 outline-none"
            >
              <option value="">Todos los departamentos</option>
              {colombiaData.map((d) => (
                <option key={d.departamento} value={d.departamento}>
                  {d.departamento}
                </option>
              ))}
            </select>

            {/* Ciudad */}
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              disabled={!departamento}
              className="h-12 rounded-xl bg-zinc-100 border-none px-3 focus:ring-2 focus:ring-blue-600/20 outline-none disabled:opacity-50"
            >
              <option value="">Todas las ciudades</option>
              {ciudadesDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Barrio */}
            <Input
              placeholder="Barrio/Sector"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
              className="h-12 rounded-xl bg-zinc-100 border-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Botón Limpiar filtros */}
          {(departamento || ciudad || barrio || busqueda) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDepartamento("");
                setCiudad("");
                setBarrio("");
                setBusqueda("");
              }}
              className="text-zinc-600 border-zinc-300"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </section>

      {/* GRID DE PERFILES */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : perfiles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {perfiles.map((perfil) => (
              <div
                key={perfil.id}
                className="group relative overflow-hidden rounded-2xl bg-zinc-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={perfil.foto_principal}
                    alt={perfil.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info al hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-black text-lg mb-2">{perfil.nombre}</p>
                  <div className="space-y-1 text-xs text-zinc-200">
                    {perfil.ciudad && (
                      <p className="flex items-center gap-1">
                        <MapPin size={12} /> {perfil.ciudad}
                        {perfil.barrio && `, ${perfil.barrio}`}
                      </p>
                    )}
                    {perfil.whatsapp && (
                      <p className="text-green-400 font-bold">WhatsApp disponible</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9"
                  >
                    Ver perfil
                  </Button>
                </div>

                {/* Badge ubicación */}
                <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full text-[10px] text-white font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  {perfil.ciudad}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Search size={48} className="text-zinc-300 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No se encontraron perfiles</h3>
            <p className="text-zinc-500 max-w-md">
              Intenta ajustar los filtros o realiza una nueva búsqueda.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
