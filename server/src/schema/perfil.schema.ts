import { z } from 'zod';

export const CreatePerfilSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    
    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder los 500 caracteres")
      .optional(),
    
    departamento: z
      .string()
      .min(2, "El departamento es requerido")
      .max(100),
    
    ciudad: z
      .string()
      .min(2, "La ciudad es requerida")
      .max(100),
    
    barrio: z
      .string()
      .min(2, "El barrio es requerido")
      .max(100)
      .optional(),
    
    telefono: z
      .string()
      .regex(/^[\d+\-\s()]+$/, "Teléfono inválido")
      .min(7, "El teléfono es demasiado corto")
      .max(20, "El teléfono es demasiado largo"),
    
    whatsapp: z
      .string()
      .regex(/^[\d+\-\s()]+$/, "WhatsApp inválido")
      .min(7, "WhatsApp demasiado corto")
      .max(20, "WhatsApp demasiado largo")
      .optional(),

    edad: z
      .coerce
      .number()
      .int()
      .min(18, "Debes ser mayor de 18 años")
      .max(99, "Edad inválida")
      .optional(),
  })
});

export const VerifyPerfilSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  })
});

export const UploadPerfilSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  })
});

export const DeletePerfilSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  })
});

export const GetPerfilSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  })
});

// Type inference
export type CreatePerfilInput = z.infer<typeof CreatePerfilSchema>['body'];
export type VerifyPerfilInput = z.infer<typeof VerifyPerfilSchema>;
export type UploadPerfilInput = z.infer<typeof UploadPerfilSchema>;
export type DeletePerfilInput = z.infer<typeof DeletePerfilSchema>;
export type GetPerfilInput = z.infer<typeof GetPerfilSchema>;