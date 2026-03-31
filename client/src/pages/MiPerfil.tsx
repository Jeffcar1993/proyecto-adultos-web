import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import axios from "axios";

interface Anuncio {
  id: number;
  nombre: string;
  descripcion: string;
  foto_principal: string | null;
  ciudad: string;
  departamento: string;
}

export function MiPerfil() {
  const navigate = useNavigate();
  const { user, token, logout, login } = useAuth();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [meResponse, anunciosResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/perfiles/mis-anuncios`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = meResponse.data?.user;
        if (userData?.id && userData?.email) {
          login(token, {
            id: userData.id,
            nombre: userData.nombre ?? null,
            email: userData.email,
          });
        }

        setAnuncios(Array.isArray(anunciosResponse.data) ? anunciosResponse.data : []);
      } catch {
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Mi Perfil</h1>
          <p className="mt-1 text-zinc-500">Estos son tus datos básicos de cuenta.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{user?.nombre || "Sin nombre"}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Correo</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{user?.email || "Sin correo"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate("/nuevo")}
            className="h-12 rounded-xl bg-blue-600 px-6 font-bold text-white hover:bg-blue-700"
          >
            Crear Anuncio
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-12 rounded-xl border-zinc-300 px-6 font-bold"
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-black tracking-tight text-zinc-900">Mis anuncios</h2>
          <p className="mt-1 text-sm text-zinc-500">Estos son los anuncios que ya has publicado.</p>

          {loading ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Cargando anuncios...
            </div>
          ) : anuncios.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Aún no tienes anuncios creados.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={anuncio.foto_principal || "/placeholder-user.png"}
                      alt={anuncio.nombre}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-zinc-900">{anuncio.nombre}</p>
                      <p className="text-sm text-zinc-500">{anuncio.ciudad}, {anuncio.departamento}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
