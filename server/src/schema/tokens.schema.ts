import { z } from 'zod';

export const ApproveOrdenSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  })
});

export const RejectOrdenSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID debe ser numérico")
  }),
  body: z.object({
    motivo: z
      .string()
      .min(5, "El motivo debe tener al menos 5 caracteres")
      .max(500, "El motivo no puede exceder 500 caracteres")
      .optional()
  })
});

export const CreateOrdenSchema = z.object({
  body: z.object({
    paquete_id: z
      .number()
      .int("Paquete ID debe ser entero")
      .positive("Paquete ID debe ser positivo"),
  })
});

export type ApproveOrdenInput = z.infer<typeof ApproveOrdenSchema>;
export type RejectOrdenInput = z.infer<typeof RejectOrdenSchema>;
export type CreateOrdenInput = z.infer<typeof CreateOrdenSchema>;
