import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { AlertTriangle, ArrowUp, Check, Coins, Loader2, Trash2, X } from "lucide-react";
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

  // Estado acciones de anuncios
  const [saldo, setSaldo] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [subirModal, setSubirModal] = useState<number | null>(null);
  const [subirLoading, setSubirLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [meResponse, anunciosResponse, billeteraResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/perfiles/mis-anuncios`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/tokens/billetera`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = meResponse.data?.user;
        if (userData?.id && userData?.email) {
          login(token, {
            id: userData.id,
            nombre: userData.nombre ?? null,
            email: userData.email,
            is_admin: userData.is_admin ?? false,
          });
        }

        setAnuncios(Array.isArray(anunciosResponse.data) ? anunciosResponse.data : []);
        setSaldo(billeteraResponse.data?.saldo ?? 0);
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

  const handleEliminarAnuncio = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/perfiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // si falla, simplemente limpiar el estado de confirmación
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSubirAnuncio = async () => {
    if (subirModal === null) return;
    setSubirLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/perfiles/${subirModal}/subir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaldo((prev) => (prev !== null ? prev - 1 : null));
      // Mover el anuncio al tope de la lista localmente
      setAnuncios((prev) => {
        const idx = prev.findIndex((a) => a.id === subirModal);
        if (idx < 0) return prev;
        return [prev[idx], ...prev.filter((_, i) => i !== idx)];
      });
      setSubirModal(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 402) {
        setSubirModal(null);
        navigate("/billetera");
      }
    } finally {
      setSubirLoading(false);
    }
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

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2 sm:ml-auto">
                    {confirmDeleteId === anuncio.id ? (
                      <>
                        <span className="text-xs font-bold text-red-600">¿Eliminar?</span>
                        <button
                          onClick={() => handleEliminarAnuncio(anuncio.id)}
                          disabled={deletingId === anuncio.id}
                          title="Confirmar eliminación"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === anuncio.id
                            ? <Loader2 size={15} className="animate-spin" />
                            : <Check size={15} />}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={deletingId === anuncio.id}
                          title="Cancelar"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (saldo !== null && saldo < 1) {
                              navigate("/billetera");
                            } else {
                              setSubirModal(anuncio.id);
                            }
                          }}
                          title="Subir al tope (cuesta 1 token)"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(anuncio.id)}
                          title="Eliminar anuncio"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* MODAL: Subir anuncio al tope */}
    {subirModal !== null && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => !subirLoading && setSubirModal(null)}
        />
        <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-zinc-900 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowUp size={20} className="text-white" />
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Subir al tope</h2>
            </div>
            {!subirLoading && (
              <button onClick={() => setSubirModal(null)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 border border-zinc-200 px-4 py-3">
              <Coins size={18} className="text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tu saldo actual</p>
                <p className={`text-lg font-black ${saldo === 0 ? "text-red-600" : "text-zinc-900"}`}>
                  {saldo ?? "..."} token{saldo !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {saldo !== null && saldo < 1 ? (
              <>
                <p className="text-sm font-semibold text-red-600">
                  No tienes tokens suficientes para subir este anuncio.
                </p>
                <Button
                  asChild
                  className="w-full h-12 rounded-xl bg-zinc-900 text-white font-black hover:bg-zinc-700"
                >
                  <Link to="/billetera" onClick={() => setSubirModal(null)}>Ir a Recargar Tokens</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-600">
                  Tu anuncio aparecerá <strong>de primero</strong> en su ciudad y en todos los perfiles.
                  Esta acción cuesta <strong>1 token</strong>.
                </p>
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    disabled={subirLoading}
                    onClick={() => setSubirModal(null)}
                    className="flex-1 h-12 rounded-xl border-zinc-200 font-bold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={subirLoading}
                    onClick={handleSubirAnuncio}
                    className="flex-1 h-12 rounded-xl bg-zinc-900 text-white font-black hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {subirLoading ? (
                      <><Loader2 size={16} className="animate-spin mr-2" />Subiendo...</>
                    ) : (
                      "Confirmar (1 token)"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}

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
