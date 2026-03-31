import { z } from 'zod';

export const CreatePerfilSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100),
    
    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder los 500 caracteres")
      .optional(),
    
    telefono: z
      .string()
      .min(7, "El teléfono es demasiado corto")
      .max(20),
    
    whatsapp: z
      .string()
      .min(7)
      .max(20)
      .optional(),

    edad: z
      .coerce
      .number()
      .int()
      .min(18, "Debes ser mayor de 18 años")
      .max(99, "Edad inválida")
      .optional(),
    
    // Validamos que el array de fotos tenga contenido y no se pase de 5
    fotos: z
      .array(z.string().url("Cada foto debe ser una URL válida"))
      .min(1, "Debes subir al menos una foto")
      .max(5, "El máximo de fotos permitido es 5"),
    
    foto_principal: z
      .string()
      .url("La foto principal debe ser una URL válida")
  })
});

// Esto nos servirá para tipar TypeScript automáticamente basado en el esquema
export type CreatePerfilInput = z.infer<typeof CreatePerfilSchema>['body'];