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
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
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

export const formUpdateCustomerSchema = z.object({
  id: z.string(),
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
  birthday: z.coerce.date({
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
  })
})

export const formUpdatePasswordSchema = z.object({
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }),
  new_password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  })
})

const MAX_IMAGE_SIZE_BYTES = 300 * 1024

export const formImageSchema = z.object({
  transaction_id: z.string(),
  image: z.instanceof(FileList)
    .optional()
    .refine((file) => file?.length === 1, 'Seleccione una imagen')
    .refine((fileList) => {
      const file = fileList?.[0]
      return (file != null) ? file.size <= MAX_IMAGE_SIZE_BYTES : true
    }, { message: 'La imagen es demasiado grande. El tamaño máximo permitido es de 300 KB' })
})
