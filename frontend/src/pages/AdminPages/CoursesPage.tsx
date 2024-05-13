import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { DataTable } from '@/components/react-components/DataTable'
import { useCoursesAdmin } from '@/hooks/useCourses'
import { ColumnsCourses } from '@/components/datatable-columns/ColumnsCourses'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { CourseForm } from '@/components/react-components/CourseForm'

export default function CoursesPage () {
  const { coursesAdmin, isSuccess } = useCoursesAdmin()

  return (
    <>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Cursos
          </CardTitle>
          <CardDescription>
            Tabla de todos los cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center pb-4'>
            <div className='ml-auto flex items-center gap-2"'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Curso
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Curso</DialogTitle>
                    <DialogDescription>
                      Llena todos los apartados.
                    </DialogDescription>
                  </DialogHeader>

                  <CourseForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <DataTable columns={ColumnsCourses} data={isSuccess ? coursesAdmin : []} message='No hay más transacciones.'/>
        </CardContent>
      </Card>
    </>
  )
}
