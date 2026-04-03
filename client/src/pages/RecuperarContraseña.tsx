import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";

export function RecuperarContraseña() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  // Estados para el flujo
  const [step, setStep] = useState<"request" | "reset">(token ? "reset" : "request");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Si hay token en URL, ir directo a reset
  useEffect(() => {
    if (token) {
      setStep("reset");
    }
  }, [token]);

  // PASO 1: Solicitar reset — el token llega por correo, no en la respuesta
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        { email }
      );
      setSuccessMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSubmitError(
          error.response?.data?.error ??
            "No pudimos procesar tu solicitud. Intenta de nuevo."
        );
      } else {
        setSubmitError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Restablecer contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!newPassword || !confirmPassword) {
      setSubmitError("Ambos campos son obligatorios.");
      return;
    }

    if (newPassword.length < 6) {
      setSubmitError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError("Las contraseñas no coinciden.");
      return;
    }

    if (!token) {
      setSubmitError("Token no encontrado. Por favor, solicita uno nuevo.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        token,
        newPassword,
      });

      setSuccessMessage("Tu contraseña ha sido actualizada exitosamente.");

      setTimeout(() => {
        navigate("/iniciar-sesion");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSubmitError(
          error.response?.data?.error ??
            "No pudimos restablecer tu contraseña. Intenta de nuevo."
        );
      } else {
        setSubmitError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] w-full bg-white overflow-hidden rounded-3xl shadow-2xl my-auto">
      {/* LADO IZQUIERDO: Imagen e Impacto (Oculto en móvil) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white lg:w-[45%] lg:flex">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=1200&q=80"
            className="h-full w-full object-cover opacity-50 grayscale"
            alt="Recuperar contraseña"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>

        <Link to="/" className="relative z-10 inline-block" aria-label="Ir al inicio">
          <img
            src="/logo.png"
            alt="Erotik Colombia"
            className="h-16 w-auto object-contain drop-shadow-sm"
          />
        </Link>

        <div className="relative z-10 space-y-6">
          {step === "request" ? (
            <>
              <h2 className="text-5xl font-black leading-tight tracking-tighter">
                RECUPERA TU <br /> <span className="text-zinc-400">ACCESO</span>
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                Te enviaremos un enlace seguro para restablecer tu contraseña en
                minutos.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-black leading-tight tracking-tighter">
                NUEVA <br /> <span className="text-zinc-400">CONTRASEÑA</span>
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                Escoge una contraseña segura para proteger tu cuenta.
              </p>
            </>
          )}
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[55%] lg:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link
              to="/iniciar-sesion"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-zinc-900 transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Volver a Iniciar Sesión
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
              {step === "request"
                ? "¿Olvidaste tu contraseña?"
                : "Restablecer contraseña"}
            </h1>
            <p className="text-zinc-500">
              {step === "request"
                ? "Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña."
                : "Ingresa tu nueva contraseña para recuperar acceso a tu cuenta."}
            </p>
          </div>

          {/* PASO 1: Solicitar Reset */}
          {step === "request" && (
            <>
              {successMessage ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <CheckCircle className="mx-auto text-green-600" size={40} />
                    <p className="text-sm font-bold text-green-700 uppercase tracking-widest">
                      ✓ Correo enviado
                    </p>
                    <p className="mt-2 text-green-700">{successMessage}</p>
                  </div>
                  <p className="text-xs text-green-600 text-center">
                    Revisa tu bandeja de entrada (y la carpeta de spam).
                    El enlace expira en <strong>15 minutos</strong>.
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleRequestReset}>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ejemplo@correo.com"
                        className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Enviando...
                      </>
                    ) : (
                      "Enviar instrucciones"
                    )}
                  </Button>

                  {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                </form>
              )}

              <p className="text-center text-sm text-zinc-500">
                ¿No tienes una cuenta?{" "}
                <Link to="/crear-cuenta" className="font-bold text-blue-600 hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </>
          )}

          {/* PASO 2: Restablecer Contraseña */}
          {step === "reset" && (
            <>
              {successMessage ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8 space-y-4 text-center">
                  <CheckCircle className="mx-auto text-green-600" size={48} />
                  <div>
                    <p className="text-sm font-bold text-green-700 uppercase tracking-widest">
                      ✓ Contraseña actualizada
                    </p>
                    <p className="mt-2 text-green-700">{successMessage}</p>
                  </div>
                  <p className="text-xs text-green-600">
                    Serás redirigido a iniciar sesión en 2 segundos...
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 focus:ring-green-600/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-zinc-200 bg-zinc-50 pl-11 focus:ring-green-600/20"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500">
                    La contraseña debe tener al menos 6 caracteres.
                  </p>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar contraseña"
                    )}
                  </Button>

                  {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                </form>
              )}

              <p className="text-center text-xs text-zinc-400">
                El enlace de recuperación es válido por 1 hora.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
