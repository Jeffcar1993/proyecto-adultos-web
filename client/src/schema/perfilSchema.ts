import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const perfilSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres"),
  telefono: z.string().min(7, "Teléfono inválido"),
  whatsapp: z.string().min(7, "WhatsApp inválido"),
  fotos: z
    .any()
    .refine((files) => files?.length > 0, "Debes subir al menos una foto.")
    .refine((files) => files?.length <= 5, "Máximo 5 fotos.")
    .refine(
      (files) => Array.from(files as FileList).every((file) => file.size <= MAX_FILE_SIZE),
      "Cada foto debe pesar menos de 5MB."
    )
    .refine(
      (files) => Array.from(files as FileList).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Solo se admiten formatos JPG, PNG y WEBP."
    ),
});

export type PerfilFormValues = z.infer<typeof perfilSchema>;