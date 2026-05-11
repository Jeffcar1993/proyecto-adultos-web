import { z } from 'zod';

const emailSchema = z
  .string()
  .email("Email inválido")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número");

export const RegisterSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
});

export const LoginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "La contraseña es requerida"),
  })
});

export const RequestPasswordResetSchema = z.object({
  body: z.object({
    email: emailSchema,
  })
});

export const ResetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token requerido"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
});

export const GoogleAuthSchema = z.object({
  body: z.object({
    credential: z.string().min(1, "Token de Google requerido").optional(),
    idToken: z.string().min(1, "Token de Google requerido").optional(),
  }).refine((data) => !!(data.credential || data.idToken), {
    message: "Token de Google requerido",
    path: ["credential"],
  })
});

export type RegisterInput = z.infer<typeof RegisterSchema>['body'];
export type LoginInput = z.infer<typeof LoginSchema>['body'];
export type RequestPasswordResetInput = z.infer<typeof RequestPasswordResetSchema>['body'];
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>['body'];
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>['body'];
