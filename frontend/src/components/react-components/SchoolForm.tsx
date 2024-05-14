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
import { type School } from '@/type'
import useSchoolForm, { type FormSchoolType } from '@/hooks/forms/useSchoolForm'
import { useMutateCreateSchool, useMutateEditSchool } from '@/hooks/useMutateSchools'

interface Props {
  data?: School
  type: 'ADD' | 'EDIT'
  messages: string[]
  handleOpenChange: (isOpen: boolean) => void
}

export function SchoolForm ({ data, type, messages, handleOpenChange }: Props) {
  const { formSchool } = useSchoolForm(data ?? undefined)
  const { mutateCreateSchool, isPendingCreate } = useMutateCreateSchool()
  const { mutateEditSchool, isPendingEdit } = useMutateEditSchool()

  async function onSubmitAddForm (formData: FormSchoolType) {
    try {
      void mutateCreateSchool(formData)
      handleOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  async function onSubmitEditForm (formData: FormSchoolType) {
    try {
      void mutateEditSchool(formData)
      handleOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="max-w-sm max-h-[400px] px-4 overflow-auto custom-scroll">
      <Form {...formSchool}>
        <form onSubmit={formSchool.handleSubmit(type === 'ADD' ? onSubmitAddForm : onSubmitEditForm)}>
          <div className='flex flex-col gap-2'>
            <FormField
              control={formSchool.control}
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
