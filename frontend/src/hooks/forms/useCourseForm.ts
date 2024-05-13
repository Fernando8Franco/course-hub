import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const MAX_IMAGE_SIZE_BYTES = 300 * 1024

const formCourseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(5, {
    message: 'Nombre demasiado corto'
  }).max(80, {
    message: 'Nombre demasiado largo'
  }),
  description: z.string(),
  price: z.string().min(0, {
    message: 'Intruduzca un precio'
  }).max(10, {
    message: 'Precio muy largo'
  }).regex(/^\d+(\.\d{1,2})?$/, {
    message: 'No es un número valido'
  }),
  instructor: z.string().min(5, {
    message: 'Nombre demasiado corto'
  }).max(80, {
    message: 'Nombre demasiado largo'
  }),
  modality: z.enum(['ON-SITE', 'REMOTE', 'HYBRID']),
  image: z.instanceof(FileList)
    .optional()
    .refine((file) => file?.length === 1, 'Seleccione una imagen')
    .refine((fileList) => {
      const file = fileList?.[0]
      return (file != null) ? file.size <= MAX_IMAGE_SIZE_BYTES : true
    }, { message: 'La imagen es demasiado grande. El tamaño máximo permitido es de 300 KB' }),
  school_id: z.number().positive({ message: 'Curso no valido' })
})

export default function useCourseForm (id?: number) {
  const formCourse = useForm<z.infer<typeof formCourseSchema>>({
    resolver: zodResolver(formCourseSchema),
    defaultValues: {
      id,
      name: '',
      description: '',
      price: '',
      instructor: ''
    }
  })

  const formCourseRef = formCourse.register('image')

  return ({ formCourseSchema, formCourse, formCourseRef })
}
