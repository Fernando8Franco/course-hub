import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useCourseForm, { type FormCourseType } from '@/hooks/forms/useCourseForm'
import { useSchools } from '@/hooks/useSchools'
import { type CoursesAdmin } from '@/type'
import { useMutateCreateCourse, useMutateEditCourse } from '@/hooks/useMutateCourses'

interface Props {
  data?: CoursesAdmin
  type: 'ADD' | 'EDIT'
  messages: string[]
  handleOpenChange: (isOpen: boolean) => void
}

export function CourseForm ({ data, type, messages, handleOpenChange }: Props) {
  const { formCourse, formCourseRef } = useCourseForm(data ?? undefined)
  const { schools } = useSchools()
  const { mutateCreateCourse, isPendingCreate } = useMutateCreateCourse()
  const { mutateEditCourse, isPendingEdit } = useMutateEditCourse()

  async function onSubmitAddForm (formData: FormCourseType) {
    try {
      void mutateCreateCourse(formData)
      handleOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  async function onSubmitEditForm (formData: FormCourseType) {
    try {
      void mutateEditCourse(formData)
      handleOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="max-w-sm max-h-[400px] px-4 overflow-auto custom-scroll">
      <Form {...formCourse}>
        <form onSubmit={formCourse.handleSubmit(type === 'ADD' ? onSubmitAddForm : onSubmitEditForm)}>
          <div className='flex flex-col gap-2'>
            <FormField
              control={formCourse.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="modality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una modalidad." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ON-SITE">Presencial</SelectItem>
                      <SelectItem value="REMOTE">Remoto</SelectItem>
                      <SelectItem value="HYBRID">Hibrido</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escuela</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una escuela." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        schools?.map((school) => {
                          return (
                            <SelectItem key={school.id} value={school.id.toString()}>{school.name}</SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={formCourse.control}
              name="image"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Imagen'
                        type="file"
                        accept='.jpg, .jpeg, .png'
                        {...formCourseRef}
                        className="dark:file:text-foreground"
                        onChange={(event) => {
                          field.onChange(event.target?.files?.[0] ?? undefined)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      La imagen debe de medir 250 ancho 100 largo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
          <div className='flex flex-row justify-end pt-4'>
            <Button type="submit" disabled={isPendingCreate || isPendingEdit}>
              {(!isPendingCreate || !isPendingEdit) ? messages[0] : messages[1]}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
