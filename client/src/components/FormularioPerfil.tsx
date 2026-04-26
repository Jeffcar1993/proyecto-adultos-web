import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { perfilSchema, type PerfilFormValues } from "@/schema/perfilSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Loader2, Camera, MapPin, Smartphone, User, X, Coins, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/useAuth";

// Importación de datos geográficos
import colombiaData from "@/data/colombia.json";

export function FormularioPerfil() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoItems, setPhotoItems] = useState<{ file: File; url: string }[]>([]);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number | null>(null);

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      descripcion: "",
      departamento: "",
      ciudad: "",
      barrio: "",
      telefono: "",
      whatsapp: "",
      edad: undefined,
      fotos: undefined,
    },
  });

  // Verificar saldo de tokens al montar
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/tokens/billetera`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSaldo(res.data.saldo ?? 0))
      .catch(() => setSaldo(0));
  }, [token]);

  // Observar el cambio de departamento para filtrar ciudades
  const departamentoElegido = form.watch("departamento") as string;

  useEffect(() => {
    if (departamentoElegido) {
      const depMatch = colombiaData.find((d) => d.departamento === departamentoElegido);
      setCiudadesDisponibles(depMatch ? depMatch.ciudades : []);
      // Resetear ciudad si cambia el departamento para evitar datos inconsistentes
      form.setValue("ciudad", "");
    } else {
      setCiudadesDisponibles([]);
    }
  }, [departamentoElegido, form]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: FileList | null) => void
  ) => {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length === 0) return;
    const available = 5 - photoItems.length;
    const toAdd = Array.from(newFiles).slice(0, available).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updated = [...photoItems, ...toAdd];
    setPhotoItems(updated);
    const dt = new DataTransfer();
    updated.forEach((item) => dt.items.add(item.file));
    onChange(dt.files);
    e.target.value = "";
  };

  const removePhoto = (index: number, onChange: (files: FileList | null) => void) => {
    URL.revokeObjectURL(photoItems[index].url);
    const updated = photoItems.filter((_, i) => i !== index);
    setPhotoItems(updated);
    const dt = new DataTransfer();
    updated.forEach((item) => dt.items.add(item.file));
    onChange(dt.files.length > 0 ? dt.files : null);
  };

  async function onSubmit(values: Record<string, unknown>) {
    setLoading(true);
    setSubmitError(null);

    if (!token) {
      setSubmitError("Debes iniciar sesión para publicar tu anuncio.");
      setLoading(false);
      navigate("/iniciar-sesion");
      return;
    }

    const formData = new FormData();

    // Append de campos de texto
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "fotos" && value !== "" && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Append de archivos
    if (values.fotos && values.fotos instanceof FileList) {
      Array.from(values.fotos as FileList).forEach((file) => {
        formData.append("fotos", file);
      });
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/perfiles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSaldo((prev) => (prev !== null ? prev - 1 : null));
      photoItems.forEach((item) => URL.revokeObjectURL(item.url));
      setPhotoItems([]);
      form.reset();
      navigate("/mi-perfil");
    } catch (error) {
      console.error("Error al publicar:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setSubmitError("Tu sesión expiró o no es válida. Inicia sesión nuevamente.");
        } else if (error.response?.status === 400) {
          setSubmitError((error.response.data as { error?: string })?.error ?? "Datos incompletos para publicar el anuncio.");
        } else if (error.response?.status === 402) {
          setSubmitError("No tienes tokens suficientes. Recarga tu billetera para publicar.");
        } else if (error.response?.status === 409) {
          setSubmitError((error.response.data as { error?: string })?.error ?? "Ya tienes un perfil publicado con esta cuenta.");
        } else {
          setSubmitError("No se pudo publicar el anuncio. Revisa los datos e inténtalo de nuevo.");
        }
      } else {
        setSubmitError("No se pudo publicar el anuncio. Revisa los datos e inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Sin saldo → redirigir a billetera
  if (saldo !== null && saldo < 1) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-500">
              <Coins size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Necesitas tokens para publicar</h2>
          <p className="text-zinc-600 max-w-sm mx-auto">
            Publicar un anuncio cuesta <strong>1 token</strong>. Actualmente tienes <strong>0 tokens</strong> en tu billetera.
          </p>
          <Button asChild className="rounded-full bg-zinc-900 text-white hover:bg-zinc-700 font-bold px-8">
            <Link to="/billetera">Ir a Recargar Tokens</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
          Configurar Anuncio
        </h1>
        <p className="text-zinc-500">Completa los detalles para que los clientes te encuentren.</p>
        {saldo !== null && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-bold text-zinc-700">
            <Coins size={14} className="text-yellow-500" />
            Tienes {saldo} token{saldo !== 1 ? "s" : ""} · Publicar cuesta 1 token
          </div>
        )}
      </div>

      {saldo !== null && saldo === 1 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle size={18} className="shrink-0 text-amber-500 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Último token disponible.</strong> Al publicar este anuncio tu saldo quedará en 0.{" "}
            <Link to="/billetera" className="underline font-bold">Recargar ahora</Link>
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* SECCIÓN: IDENTIDAD */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <User size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Información de Perfil
              </span>
            </div>
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nombre Artístico</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                      placeholder="Ej. Valentina"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Edad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={18}
                      max={99}
                      className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                      placeholder="Ej. 25"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => {
                const count = field.value?.length ?? 0;
                const isOver = count > 800;
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-bold">Descripción</FormLabel>
                      <span
                        className={`text-xs font-bold tabular-nums transition-colors ${
                          isOver
                            ? "text-red-600"
                            : count >= 700
                            ? "text-amber-500"
                            : "text-zinc-400"
                        }`}
                      >
                        {count}/800
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        className={`rounded-xl bg-zinc-50 border-none min-h-[120px] focus:ring-2 transition-colors ${
                          isOver
                            ? "ring-2 ring-red-400 focus:ring-red-400 bg-red-50"
                            : "focus:ring-blue-600/10"
                        }`}
                        placeholder="Cuéntanos sobre tus servicios, disponibilidad y lo que te hace única..."
                        {...field}
                      />
                    </FormControl>
                    {isOver && (
                      <p className="text-xs text-red-600 font-semibold">
                        Máximo 800 caracteres — por favor acorta tu descripción.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* SECCIÓN: UBICACIÓN GEOGRÁFICA */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <MapPin size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Ubicación del Servicio
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Departamento
                    </FormLabel>
                    <select
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      className="flex h-12 w-full rounded-xl bg-zinc-50 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none"
                    >
                      <option value="">Selecciona...</option>
                      {colombiaData.map((d) => (
                        <option key={d.departamento} value={d.departamento}>
                          {d.departamento}
                        </option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Ciudad
                    </FormLabel>
                    <select
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      disabled={!departamentoElegido}
                      className="flex h-12 w-full rounded-xl bg-zinc-50 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none disabled:opacity-50"
                    >
                      <option value="">Selecciona ciudad...</option>
                      {ciudadesDisponibles.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="barrio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Barrio / Sector (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                      placeholder="Ej. El Poblado / Chapinero"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SECCIÓN: CONTACTO */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Smartphone size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Contacto Directo
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                        placeholder="Ej. 3001234567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="off"
                        className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                        placeholder="Ej. 573001234567"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-zinc-500">
                      Ingresa el número completo de WhatsApp con código de país. Ejemplo: 57...
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SECCIÓN: FOTOS (DARK UI) */}
          <div className="bg-zinc-950 p-8 rounded-[2rem] text-white space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Camera size={20} className="text-red-500" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Galería de Fotos</h3>
              </div>
              <p className="text-[10px] text-zinc-500 font-black tracking-tighter uppercase">
                Mínimo 1 - Máximo 5 imágenes
              </p>
            </div>

            <FormField
              control={form.control}
              name="fotos"
              render={({ field: { onChange, name, onBlur, ref } }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {photoItems.map((item, i) => (
                        <div key={item.url} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
                          <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(i, onChange)}
                            className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {photoItems.length < 5 && (
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl hover:border-red-500 hover:bg-zinc-900 transition-all cursor-pointer group">
                          <Camera size={24} className="text-zinc-600 mb-2 group-hover:text-red-500" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">
                            {photoItems.length === 0 ? "Subir" : `+Añadir`}
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            name={name}
                            onBlur={onBlur}
                            ref={ref}
                            onChange={(e) => handleImageChange(e, onChange)}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* BOTÓN SUBMIT */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Publicando...
              </>
            ) : (
              "Publicar mi Anuncio Ahora"
            )}
          </Button>

          {/* MENSAJES DE ERROR GLOBALES */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-1 animate-in fade-in slide-in-from-top-2">
              <p className="font-bold uppercase tracking-wide text-xs">Faltan campos por completar:</p>
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <p key={field}>• {error?.message as string}</p>
              ))}
            </div>
          )}

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
              <p className="font-bold uppercase tracking-wide text-xs mb-1">No se pudo publicar</p>
              <p>{submitError}</p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}