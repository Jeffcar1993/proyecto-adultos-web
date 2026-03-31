import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditFormState {
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  barrio: string;
  telefono: string;
  whatsapp: string;
}

const initialForm: EditFormState = {
  nombre: "",
  descripcion: "",
  departamento: "",
  ciudad: "",
  barrio: "",
  telefono: "",
  whatsapp: "",
};

export function EditarPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form, setForm] = useState<EditFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!token || !id) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/perfiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const perfil = response.data as Record<string, unknown> | null;

        if (!perfil) {
          setSubmitError("No se encontró el perfil que intentas editar.");
          return;
        }

        setForm({
          nombre: String(perfil.nombre ?? ""),
          descripcion: String(perfil.descripcion ?? ""),
          departamento: String(perfil.departamento ?? ""),
          ciudad: String(perfil.ciudad ?? ""),
          barrio: String(perfil.barrio ?? ""),
          telefono: String(perfil.telefono ?? ""),
          whatsapp: String(perfil.whatsapp ?? ""),
        });
      } catch {
        setSubmitError("No se pudo cargar el perfil para editar.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [token, id]);

  const handleChange = (key: keyof EditFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    setSaving(true);
    setSubmitError(null);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/perfiles/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/mi-perfil");
    } catch {
      setSubmitError("No se pudo actualizar el perfil. Verifica los datos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Editar Perfil</h1>
        <p className="mt-1 text-zinc-500">Actualiza la información principal de tu perfil.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} placeholder="Nombre" required />
          <Textarea value={form.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} placeholder="Descripción" required />
          <Input value={form.departamento} onChange={(e) => handleChange("departamento", e.target.value)} placeholder="Departamento" required />
          <Input value={form.ciudad} onChange={(e) => handleChange("ciudad", e.target.value)} placeholder="Ciudad" required />
          <Input value={form.barrio} onChange={(e) => handleChange("barrio", e.target.value)} placeholder="Barrio" />
          <Input value={form.telefono} onChange={(e) => handleChange("telefono", e.target.value)} placeholder="Teléfono" required />
          <Input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder="WhatsApp" required />

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-blue-600 text-white hover:bg-blue-700">
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/mi-perfil")}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
