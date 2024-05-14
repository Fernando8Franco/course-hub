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
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useSchools } from '@/hooks/useSchools'
import { ColumnsSchools } from '@/components/datatable-columns/ColumnsSchools'
import { SchoolForm } from '@/components/react-components/SchoolForm'

export default function SchoolsPage () {
  const { schools, isSuccess } = useSchools()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenChange = (nextOpenState: boolean) => {
    setIsDialogOpen(nextOpenState)
  }

  return (
    <>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Escuelas
          </CardTitle>
          <CardDescription>
            Tabla de todas las escuelas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center pb-4'>
            <div className='ml-auto flex items-center gap-2"'>
              <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Escuela
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Escuela</DialogTitle>
                    <DialogDescription>
                      Llena todos los apartados.
                    </DialogDescription>
                  </DialogHeader>

                  <SchoolForm type='ADD' messages={['Agregar', 'Agregando']} handleOpenChange={handleOpenChange}/>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <DataTable columns={ColumnsSchools} data={isSuccess ? schools : []} message='No hay más escuelas.'/>
        </CardContent>
      </Card>
    </>
  )
}
