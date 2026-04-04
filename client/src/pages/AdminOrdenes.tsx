import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";

interface OrdenAdmin {
  id: number;
  email: string;
  usuario_nombre: string;
  paquete: string;
  cantidad_tokens: number;
  monto_total: string;
  url_comprobante: string | null;
  created_at: string;
}

function formatCOP(value: string | number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function AdminOrdenes() {
  const { token, user } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchOrdenes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/ordenes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrdenes(res.data);
    } catch {
      setError("No se pudieron cargar las órdenes o no tienes acceso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, [token]);

  async function handleAction(ordenId: number, action: "aprobar" | "rechazar") {
    setActionLoading(ordenId);
    try {
      await axios.post(
        `${apiUrl}/admin/ordenes/${ordenId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Quitar la orden de la lista localmente
      setOrdenes((prev) => prev.filter((o) => o.id !== ordenId));
    } catch {
      setError(`Error al ${action === "aprobar" ? "aprobar" : "rechazar"} la orden.`);
    } finally {
      setActionLoading(null);
    }
  }

  if (!user?.is_admin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-zinc-500">
        <ShieldAlert size={48} className="text-red-400" />
        <p className="text-lg font-bold">Acceso restringido</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Helmet>
        <title>Admin · Órdenes Pendientes | Erotik Colombia</title>
      </Helmet>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900">Órdenes Pendientes</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {ordenes.length} orden{ordenes.length !== 1 ? "es" : ""} esperando revisión
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => { setLoading(true); fetchOrdenes(); }}
          className="rounded-full text-sm"
        >
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
      ) : ordenes.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-400" />
          <p className="font-bold">Todo al día — no hay órdenes pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-start gap-5"
            >
              {/* Comprobante */}
              <div className="shrink-0">
                {orden.url_comprobante ? (
                  <a href={orden.url_comprobante} target="_blank" rel="noopener noreferrer">
                    <img
                      src={orden.url_comprobante}
                      alt="Comprobante"
                      className="h-28 w-28 rounded-xl object-cover border border-zinc-200 hover:opacity-80 transition-opacity cursor-zoom-in"
                    />
                  </a>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-400 text-center p-2">
                    Sin comprobante
                  </div>
                )}
              </div>

              {/* Datos */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-zinc-400">#{orden.id}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">pendiente</span>
                </div>
                <p className="font-black text-zinc-900 truncate">{orden.usuario_nombre}</p>
                <p className="text-sm text-zinc-500 truncate mb-3">{orden.email}</p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="text-zinc-400">Pack: </span>
                    <span className="font-bold text-zinc-800">{orden.paquete}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Tokens: </span>
                    <span className="font-bold text-zinc-800">{orden.cantidad_tokens}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Monto: </span>
                    <span className="font-bold text-zinc-800">{formatCOP(orden.monto_total)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Fecha: </span>
                    <span className="font-bold text-zinc-800">
                      {new Date(orden.created_at).toLocaleDateString("es-CO", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex md:flex-col gap-2 shrink-0">
                <Button
                  onClick={() => handleAction(orden.id, "aprobar")}
                  disabled={actionLoading === orden.id}
                  className="flex-1 md:flex-none rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5"
                >
                  {actionLoading === orden.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <><CheckCircle2 size={14} className="mr-1.5" /> Aprobar</>
                  )}
                </Button>
                <Button
                  onClick={() => handleAction(orden.id, "rechazar")}
                  disabled={actionLoading === orden.id}
                  variant="outline"
                  className="flex-1 md:flex-none rounded-xl border-red-200 text-red-500 hover:bg-red-50 font-bold px-5"
                >
                  <XCircle size={14} className="mr-1.5" /> Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
