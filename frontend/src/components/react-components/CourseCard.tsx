import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { type Course } from '@/type'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/store/cartStore'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  course: Course
}

export default function CourseCard ({ course }: Props) {
  const { cart, setCart, reset } = useCartStore()
  const { toast } = useToast()

  const createHandleClick = (course: Course) => {
    if (cart === null) {
      setCart(course)
    } else {
      toast({
        title: 'El carrito esta lleno.',
        description: 'Solo se puede agregar un curso al carrito, vacialo si es que quieres cambiar el curso.',
        action: <ToastAction altText="Try again" onClick={() => { reset() }}>Vaciar</ToastAction>
      })
    }
  }

  return (
    <Card className="w-[300px] border-muted-foreground">
      <CardHeader className='pb-2 pt-4'>
        <div className='flex px-1 items-center justify-center text-center text-sm h-[49px]'>
          {course.school_name}
        </div>
        <img src={import.meta.env.VITE_BACKEND_HOST + course.image} alt="Course Image" className="top-0 left-0 w-[250.4px] h-[100px] object-cover rounded" />
        <CardTitle className="h-[85px] overflow-auto flex items-center custom-scroll">
          {course.name}
        </CardTitle>
        <Separator className='bg-muted-foreground'/>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 text-foreground pb-1'>
        <div className="h-[65px] overflow-auto custom-scroll text-xs">
          {course.description}
        </div>
        <Separator className='bg-muted-foreground'/>
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
          <Separator className='bg-muted-foreground'/>
      </CardContent>
      <CardFooter className='flex justify-center pb-4 pt-1'>
        <Button className='h-8 w-18 text-sm'
          onClick={() => { createHandleClick(course) }}
        >
          Agregar
        </Button>
      </CardFooter>
    </Card>
  )
}
