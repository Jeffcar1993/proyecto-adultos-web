import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { AlertTriangle, Loader2, X } from "lucide-react";
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

  // Estado del modal de borrar cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "ELIMINAR") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      setDeleteError("No se pudo eliminar la cuenta. Intenta de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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

          <Button
            variant="outline"
            onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(""); setDeleteError(null); }}
            className="h-12 rounded-xl border-red-200 px-6 font-bold text-red-600 hover:bg-red-50 hover:border-red-300 sm:ml-auto"
          >
            Eliminar cuenta
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

    {/* MODAL: Confirmar eliminación de cuenta */}
    {showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setShowDeleteModal(false)}
        />

        {/* Panel */}
        <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header rojo */}
          <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={22} className="text-white" />
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Eliminar cuenta
              </h2>
            </div>
            {!deleting && (
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-6 space-y-5">
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 space-y-1">
              <p className="text-sm font-bold text-red-700">Esta acción es permanente e irreversible:</p>
              <ul className="text-sm text-red-600 space-y-1 mt-2 list-none">
                <li>• Tu cuenta será eliminada completamente</li>
                <li>• Todos tus anuncios serán borrados</li>
                <li>• No podrás recuperar tus datos</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">
                Escribe{" "}
                <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  ELIMINAR
                </span>{" "}
                para confirmar
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                disabled={deleting}
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50 font-mono tracking-widest focus:ring-red-500/20"
              />
            </div>

            {deleteError && (
              <p className="text-sm text-red-600 font-semibold">{deleteError}</p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-12 rounded-xl border-zinc-200 font-bold"
              >
                Cancelar
              </Button>
              <Button
                disabled={deleteConfirmText !== "ELIMINAR" || deleting}
                onClick={handleDeleteAccount}
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <><Loader2 size={16} className="animate-spin mr-2" />Eliminando...</>
                ) : (
                  "Eliminar mi cuenta"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
