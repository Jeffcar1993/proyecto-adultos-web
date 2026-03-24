import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { perfilSchema, type PerfilFormValues } from "@/schema/perfilSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Loader2, Camera, MapPin, Smartphone, User, X } from "lucide-react";

export function FormularioPerfil() {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: "", descripcion: "", telefono: "", whatsapp: "", ciudad: "", barrio: ""
    },
  });

  // Simulación: Cargar datos previos del usuario (correo/nombre)
  useEffect(() => {
    // Aquí podrías hacer un fetch a tu API para traer datos de la sesión
    // form.reset({ nombre: user.name, ... });
  }, [form]);

  // Manejador de previsualización de fotos
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: FileList | null) => void
  ) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      onChange(files);
    }
  };

  async function onSubmit(values: PerfilFormValues) {
    setLoading(true);
    const formData = new FormData();
    
    // Iterar sobre todos los valores para el FormData
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "fotos") formData.append(key, value as string);
    });

    Array.from(values.fotos as FileList).forEach((file) => {
      formData.append("fotos", file);
    });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/perfiles`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("¡Tu anuncio ha sido publicado con éxito!");
      setPreviews([]);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu anuncio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">Configurar Anuncio</h1>
        <p className="text-zinc-500">Completa los detalles para que los clientes te encuentren.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECCIÓN: IDENTIDAD */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <User size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Información de Perfil</span>
            </div>
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nombre Artístico</FormLabel>
                  <FormControl><Input className="rounded-xl bg-zinc-50 border-none h-12" placeholder="Ej. Valentina" {...field} /></FormControl>
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
                  <FormControl><Textarea className="rounded-xl bg-zinc-50 border-none min-h-[120px]" placeholder="Cuéntanos sobre tus servicios y disponibilidad..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SECCIÓN: UBICACIÓN Y CONTACTO */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <MapPin size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Ubicación</span>
              </div>
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input className="rounded-xl bg-zinc-50 border-none h-12" placeholder="Ciudad (Ej. Bogotá)" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barrio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input className="rounded-xl bg-zinc-50 border-none h-12" placeholder="Barrio / Sector" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Smartphone size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Contacto Directo</span>
              </div>
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input className="rounded-xl bg-zinc-50 border-none h-12" placeholder="Teléfono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input className="rounded-xl bg-zinc-50 border-none h-12" placeholder="WhatsApp" {...field} /></FormControl>
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
              <p className="text-[10px] text-zinc-500 font-black tracking-tighter uppercase">Máximo 5 imágenes</p>
            </div>

            <FormField
              control={form.control}
              name="fotos"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {/* Botón de Carga */}
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl hover:border-red-500 hover:bg-zinc-900 transition-all cursor-pointer">
                        <Camera size={24} className="text-zinc-600 mb-2" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Añadir</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, onChange)} {...rest} />
                      </label>

                      {/* Render de Previsualización */}
                      {previews.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <button type="button" onClick={() => setPreviews(p => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} />
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

          <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200">
            {loading ? <><Loader2 className="mr-2 animate-spin" /> Publicando...</> : "Publicar mi Anuncio Ahora"}
          </Button>
        </form>
      </Form>
    </div>
  );
}