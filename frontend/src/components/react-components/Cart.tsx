import { CreditCard, Trash2 } from 'lucide-react'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type Course } from '@/type'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/store/cartStore'

interface Props {
  course: Course
}

export default function Cart ({ course }: Props) {
  const { reset } = useCartStore()

  return (
    <div className="w-[300px]">
      <CardHeader className='pb-2 pt-4'>
        <div className='flex px-1 items-center justify-center text-center text-sm h-[49px]'>
          {course.school_name}
        </div>
        <img src={'http://localhost:8080/backend/' + course.image} alt="Course Image" className="relative top-0 left-0 w-[250.4px] h-[100px] object-cover rounded-t" />
        <CardTitle className="h-[80px] overflow-auto flex items-center custom-scroll">
          {course.name}
        </CardTitle>
        <Separator/>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 text-foreground pb-1'>
        <div className="h-[60px] overflow-auto custom-scroll text-xs">
          {course.description}
        </div>
        <Separator />
          <div className='flex justify-end pr-1'>
            {course.instructor}
          </div>
          <div className='flex flex-row justify-between items-center gap-1'>
            <p>
              {parseFloat(course.price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} - MXN
            </p>
            <Badge>
              {
                course.modality === 'ON-SITE'
                  ? 'Presencial'
                  : course.modality === 'REMOTE'
                    ? 'Remoto'
                    : course.modality === 'HYBRID' ? 'Híbrido' : ''
              }
            </Badge>
          </div>
          <Separator/>
      </CardContent>
      <CardFooter className='flex flex-row justify-around pt-2'>
        <Button className='flex items-center h-8 px-4 text-sm' variant='outline'>
          <Trash2 className="h-5 w-5 mr-2" />
          Vaciar
        </Button>
        <Button className='flex items-center h-8 px-4 text-sm' onClick={() => { reset() } }>
          <CreditCard className="h-5 w-5 mr-2" />
          Pagar
        </Button>
      </CardFooter>
    </div>
  )
}
