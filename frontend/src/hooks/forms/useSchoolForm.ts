import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type School } from '@/type'

const formSchoolSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: 'Nombre demasiado corto'
  }).max(150, {
    message: 'Nombre demasiado largo'
  })
})

export type FormSchoolType = z.infer<typeof formSchoolSchema>

export default function useSchoolForm (data?: School) {
  const formSchool = useForm<z.infer<typeof formSchoolSchema>>({
    resolver: zodResolver(formSchoolSchema),
    defaultValues: {
      id: data?.id ?? undefined,
      name: data?.name ?? ''
    }
  })

  return ({ formSchool })
}
