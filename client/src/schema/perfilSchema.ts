import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const isFileList = (value: unknown): value is FileList => value instanceof FileList;

export const perfilSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres"),
  departamento: z.string().min(1, "El departamento es obligatorio"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  barrio: z.string().optional(), // Barrio es opcional
  telefono: z.string().min(7, "Teléfono inválido"),
  whatsapp: z.string().min(7, "WhatsApp inválido"),
  fotos: z
    .any()
    .refine((files) => isFileList(files) && files.length > 0, "Debes subir al menos una foto.")
    .refine((files) => !isFileList(files) || files.length <= 5, "Máximo 5 fotos.")
    .refine(
      (files) => !isFileList(files) || Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "Cada foto debe pesar menos de 5MB."
    )
    .refine(
      (files) => !isFileList(files) || Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Solo se admiten formatos JPG, PNG y WEBP."
    ),
});

export type PerfilFormValues = z.infer<typeof perfilSchema>;