import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type z } from 'zod'
import useCourseForm from '@/hooks/forms/useCourseForm'

export function CourseForm () {
  const { formCourseSchema, formCourse, formCourseRef } = useCourseForm()
  // const { mutateLogin, isPendingLogin } = useMutateLogin()
  const isPendingLogin = false

  async function onSubmitLoginForm (formData: z.infer<typeof formCourseSchema>) {
    try {
      console.log(formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="max-w-sm">
      <Form {...formCourse}>
        <form onSubmit={formCourse.handleSubmit(onSubmitLoginForm)}>
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
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
          <div className='flex flex-row justify-end pt-4'>
            <Button type="submit" disabled={isPendingLogin}>
              {!isPendingLogin ? 'Agregar' : 'Agregando...'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
