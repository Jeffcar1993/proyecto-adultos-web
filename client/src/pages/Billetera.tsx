import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Loader2, Coins, CheckCircle2, Clock, XCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";

interface Paquete {
  id: number;
  nombre: string;
  cantidad_tokens: number;
  precio_cop: string;
}

interface OrdenHistorial {
  id: number;
  paquete: string;
  cantidad_tokens: number;
  monto_total: string;
  estado: "pendiente" | "completado" | "cancelado";
  created_at: string;
}

interface BilleteraData {
  saldo: number;
  historial: OrdenHistorial[];
}

const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/l/VPOS_6EJ08x";

import qr1 from "@/img/qr1.png";

const PACK_BADGES: Record<string, string> = {
  "Pack Básico": "bg-zinc-800 text-zinc-100",
  "Pack Estándar": "bg-blue-600 text-white",
  "Pack Premium": "bg-red-600 text-white",
};

const PACK_BENEFITS: Record<string, string> = {
  "Pack Básico": "Ideal para 1 anuncio + 1 destacado",
  "Pack Estándar": "Ahorras ~15% · 2 tokens extra",
  "Pack Premium": "Recomendado para agencias o modelos Top",
};

function formatCOP(value: string | number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function EstadoBadge({ estado }: { estado: OrdenHistorial["estado"] }) {
  if (estado === "completado")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
        <CheckCircle2 size={11} /> Completado
      </span>
    );
  if (estado === "cancelado")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
        <XCircle size={11} /> Cancelado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
      <Clock size={11} /> Pendiente
    </span>
  );
}

export function Billetera() {
  const { token } = useAuth();
  const [billetera, setBilletera] = useState<BilleteraData | null>(null);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de compra
  const [selectedPack, setSelectedPack] = useState<Paquete | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billeteraRes, paquetesRes] = await Promise.all([
          axios.get(`${apiUrl}/tokens/billetera`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/tokens/paquetes`),
        ]);
        setBilletera(billeteraRes.data);
        setPaquetes(paquetesRes.data);
      } catch {
        // handled by loading state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, apiUrl]);

  function openModal(pack: Paquete) {
    setSelectedPack(pack);
    setFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess(false);
  }

  function closeModal() {
    setSelectedPack(null);
    setFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    if (picked) {
      setPreviewUrl(URL.createObjectURL(picked));
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleComprar() {
    if (!selectedPack) return;
    setBuying(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("paquete_id", String(selectedPack.id));
      if (file) formData.append("comprobante", file);

      await axios.post(`${apiUrl}/tokens/comprar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      // Refrescar billetera
      const billeteraRes = await axios.get(`${apiUrl}/tokens/billetera`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBilletera(billeteraRes.data);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Error al procesar la compra"
          : "Error al procesar la compra";
      setError(msg);
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Helmet>
        <title>Billetera | Erotik Colombia</title>
      </Helmet>

      {/* SALDO */}
      <div className="mb-10 rounded-3xl bg-zinc-900 p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
            <Coins size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Saldo actual</p>
            <p className="text-5xl font-black tabular-nums">{billetera?.saldo ?? 0}</p>
            <p className="text-sm text-zinc-400 mt-0.5">tokens disponibles</p>
          </div>
        </div>
        <p className="text-sm text-zinc-500 max-w-xs">
          Los tokens son tu moneda en Erotik Colombia. Úsalos para publicar y destacar anuncios.
        </p>
      </div>

      {/* PACKS */}
      <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-zinc-900">Recargar Tokens</h2>
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {paquetes.map((pack) => {
          const badgeClass = PACK_BADGES[pack.nombre] ?? "bg-zinc-700 text-white";
          const benefit = PACK_BENEFITS[pack.nombre] ?? "";
          return (
            <div
              key={pack.id}
              className="relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {pack.nombre === "Pack Estándar" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow">
                  Popular
                </span>
              )}
              <span className={`self-start rounded-full px-3 py-1 text-xs font-bold mb-4 ${badgeClass}`}>
                {pack.nombre}
              </span>
              <p className="text-5xl font-black tabular-nums text-zinc-900">{pack.cantidad_tokens}</p>
              <p className="text-sm font-bold text-zinc-500 mb-1">tokens</p>
              <p className="text-2xl font-black text-zinc-900 mb-1">{formatCOP(pack.precio_cop)}</p>
              <p className="text-xs text-zinc-500 mb-6">{benefit}</p>
              <Button
                onClick={() => openModal(pack)}
                className="mt-auto w-full rounded-2xl bg-zinc-900 text-white hover:bg-zinc-700 font-bold"
              >
                Comprar
              </Button>
            </div>
          );
        })}
      </div>

      {/* HISTORIAL */}
      <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-zinc-900">Historial de Recargas</h2>
      {billetera?.historial.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
          Aún no tienes recargas. ¡Compra tu primer pack!
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-zinc-600">#</th>
                <th className="px-4 py-3 font-bold text-zinc-600">Pack</th>
                <th className="px-4 py-3 font-bold text-zinc-600 text-right">Tokens</th>
                <th className="px-4 py-3 font-bold text-zinc-600 text-right">Monto</th>
                <th className="px-4 py-3 font-bold text-zinc-600">Estado</th>
                <th className="px-4 py-3 font-bold text-zinc-600">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {billetera?.historial.map((orden) => (
                <tr key={orden.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-400 font-mono">#{orden.id}</td>
                  <td className="px-4 py-3 font-bold text-zinc-800">{orden.paquete}</td>
                  <td className="px-4 py-3 text-right font-bold text-zinc-900">{orden.cantidad_tokens}</td>
                  <td className="px-4 py-3 text-right text-zinc-700">{formatCOP(orden.monto_total)}</td>
                  <td className="px-4 py-3"><EstadoBadge estado={orden.estado} /></td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(orden.created_at).toLocaleDateString("es-CO", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE COMPRA */}
      {selectedPack && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 pt-6 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-xs max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:max-w-sm sm:max-h-[80vh] sm:p-5">
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 sm:right-4 sm:top-4"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            {success ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 size={52} className="text-emerald-500" />
                <h3 className="text-xl font-black text-zinc-900">¡Solicitud enviada!</h3>
                <p className="text-sm text-zinc-600 max-w-xs">
                  Tu comprobante fue recibido. En breve revisamos el pago y acreditamos tus tokens.
                </p>
                <Button onClick={closeModal} className="mt-4 rounded-full bg-zinc-900 text-white hover:bg-zinc-700">
                  Entendido
                </Button>
              </div>
            ) : (
              <>
                <h3 className="mb-1 pr-10 text-lg font-black text-zinc-900 sm:text-xl">{selectedPack.nombre}</h3>
                <p className="mb-4 text-xs text-zinc-500 sm:mb-5 sm:text-sm">
                  {selectedPack.cantidad_tokens} tokens · {formatCOP(selectedPack.precio_cop)}
                </p>

                {/* Pago online con enlace */}
                <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 space-y-2 sm:mb-5 sm:p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Pagar online</p>
                  <p className="text-xs text-emerald-800">
                    Puedes pagar este pack por Wompi (tarjeta, PSE y otros métodos).
                  </p>
                  <a
                    href={WOMPI_CHECKOUT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition-colors hover:bg-emerald-700 sm:h-10 sm:text-sm"
                  >
                    Pagar {selectedPack.nombre} en Wompi
                  </a>
                </div>

                {/* Pago por QR */}
                <div className="mb-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-3 sm:mb-5 sm:p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Pagar por QR</p>
                  <p className="mb-3 text-xs text-zinc-500">
                    Escanea este QR para realizar el pago y luego sube tu comprobante.
                  </p>
                  <img
                    src={qr1}
                    alt="Código QR para pago"
                    className="mx-auto w-36 rounded-xl border border-zinc-200 bg-white p-2 sm:w-44"
                  />
                </div>

                {/* Upload comprobante */}
                <div className="mb-4 sm:mb-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Pantallazo del pago</p>
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Comprobante"
                        className="w-full max-h-48 rounded-xl object-contain bg-zinc-100"
                      />
                      <button
                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 py-6 text-zinc-400 hover:border-zinc-400 hover:text-zinc-500 transition-colors"
                    >
                      <Upload size={24} />
                      <span className="text-xs font-bold">Subir pantallazo (opcional)</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {error && (
                  <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 font-bold">{error}</p>
                )}

                <Button
                  onClick={handleComprar}
                  disabled={buying}
                  className="w-full rounded-2xl bg-zinc-900 text-white hover:bg-zinc-700 font-bold h-12"
                >
                  {buying ? (
                    <><Loader2 size={16} className="animate-spin mr-2" /> Enviando...</>
                  ) : (
                    "Confirmar Compra"
                  )}
                </Button>
                <p className="mt-3 text-center text-[11px] text-zinc-400">
                  Puedes enviar el comprobante después si aún estás pagando.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-3 w-full text-center text-xs font-bold text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
                >
                  Cerrar ventana
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
