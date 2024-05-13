import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type CoursesAdmin } from '@/type'
import { useEffect } from 'react'

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
  school_id: z.string()
})

export type FormCourseType = z.infer<typeof formCourseSchema>

const createFileListFromUrl = async (imageUrl: string): Promise<FileList | undefined> => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const file = new File([blob], 'imagen_descargada.jpg', { type: blob.type })

    const fileList = new DataTransfer()
    fileList.items.add(file)

    return fileList.files
  } catch (error) {
    console.error('Error al descargar la imagen:', error)
  }
}

export default function useCourseForm (data?: CoursesAdmin) {
  const formCourse = useForm<z.infer<typeof formCourseSchema>>({
    resolver: zodResolver(formCourseSchema),
    defaultValues: {
      id: data?.id ?? undefined,
      name: data?.name ?? '',
      description: data?.description ?? '',
      price: data?.price ?? '',
      instructor: data?.instructor ?? '',
      modality: data?.modality ?? undefined,
      school_id: data?.school_id.toString() ?? undefined
    }
  })

  useEffect(() => {
    const fetchImage = async () => {
      if (data?.image != null) {
        const imageFileList = await createFileListFromUrl(`${import.meta.env.VITE_BACKEND_HOST}${data.image}`)
        formCourse.setValue('image', imageFileList)
      }
    }

    void fetchImage()
  }, [data, formCourse])

  const formCourseRef = formCourse.register('image')

  return ({ formCourseSchema, formCourse, formCourseRef })
}
