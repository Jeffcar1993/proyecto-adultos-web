import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { perfilSchema } from "@/schema/perfilSchema";
import type { PerfilFormValues } from "@/schema/perfilSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function FormularioPerfil() {
  const [loading, setLoading] = useState(false);

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      telefono: "",
      whatsapp: "",
    },
  });

  async function onSubmit(values: PerfilFormValues) {
    setLoading(true);
    const formData = new FormData();
    
    // Agregamos los campos de texto
    formData.append("nombre", values.nombre);
    formData.append("descripcion", values.descripcion);
    formData.append("telefono", values.telefono);
    formData.append("whatsapp", values.whatsapp);

    // Agregamos las fotos (son un FileList)
    Array.from(values.fotos as FileList).forEach((file) => {
      formData.append("fotos", file);
    });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/perfiles`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("¡Perfil creado con éxito!");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Error al crear el perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center">Crear Nuevo Perfil</h2>
        
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Artístico</FormLabel>
              <FormControl><Input placeholder="Ej. Pepita" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl><Textarea placeholder="Cuéntanos sobre ti..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl><Input placeholder="310..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl><Input placeholder="310..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fotos"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Fotos (Máximo 5)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)} 
                  {...rest} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...</> : "Publicar Perfil"}
        </Button>
      </form>
    </Form>
  );
}