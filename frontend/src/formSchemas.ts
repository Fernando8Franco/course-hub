import { z } from 'zod'

export const formUserSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre muy corto.'
  }).max(40, {
    message: 'Nombre muy largo.'
  }),
  father_last_name: z.string().min(2, {
    message: 'Appellido paterno muy corto.'
  }).max(40, {
    message: 'Appellido paterno muy largo.'
  }),
  mother_last_name: z.string().min(2, {
    message: 'Appellido materno muy corto.'
  }).max(40, {
    message: 'Appellido materno muy largo.'
  }),
  birthday: z.date({
    required_error: 'Se requiere la fecha de nacimiento.'
  }),
  phone_number: z.string().regex(/^\d+$/, {
    message: 'Solo se pueden ingresar números.'
  }).min(10, {
    message: 'Número de teléfono muy corto.'
  }).max(15, {
    message: 'Número de teléfono muy largo.'
  }),
  email: z.string().email({
    message: 'Email no valido.'
  }).max(60, {
    message: 'Email muy largo.'
  }),
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  })
})

export const formOTPShema = z.object({
  verification_code: z.string().min(6, {
    message: 'Código no es válido.'
  }),
  email: z.string().email({
    message: 'Email no válido.'
  }).max(60, {
    message: 'Email muy largo.'
  })
})

export const formLoginSchema = z.object({
  email: z.string().email({
    message: 'Email no válido.'
  }).max(60, {
    message: 'Email muy largo.'
  }),
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  })
})
