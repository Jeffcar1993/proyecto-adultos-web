import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { perfilSchema } from "@/schema/perfilSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Loader2, Camera, MapPin, Smartphone, User, X } from "lucide-react";

// Importación de datos geográficos
import colombiaData from "@/data/colombia.json";

export function FormularioPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(perfilSchema),
    mode: "onChange",
  });

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

  // Manejador de previsualización de fotos
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: FileList | null) => void
  ) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
      onChange(files);
    }
  };

  async function onSubmit(values: Record<string, unknown>) {
    setLoading(true);
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
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setPreviews([]);
      form.reset();
      // Redirigir al inicio con un estado de éxito
      navigate("/", { state: { anuncioPublicado: true } });
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error al procesar el anuncio. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
          Configurar Anuncio
        </h1>
        <p className="text-zinc-500">Completa los detalles para que los clientes te encuentren.</p>
      </div>

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
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-xl bg-zinc-50 border-none min-h-[120px] focus:ring-2 focus:ring-blue-600/10"
                      placeholder="Cuéntanos sobre tus servicios, disponibilidad y lo que te hace única..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                    <FormControl>
                      <Input
                        className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                        placeholder="Teléfono"
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
                    <FormControl>
                      <Input
                        className="rounded-xl bg-zinc-50 border-none h-12 focus:ring-2 focus:ring-blue-600/10"
                        placeholder="WhatsApp (con código de país)"
                        {...field}
                      />
                    </FormControl>
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
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl hover:border-red-500 hover:bg-zinc-900 transition-all cursor-pointer group">
                        <Camera size={24} className="text-zinc-600 mb-2 group-hover:text-red-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Subir</span>
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

                      {previews.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPreviews((p) => p.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
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
        </form>
      </Form>
    </div>
  );
}