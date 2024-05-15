import { Landmark, CreditCard } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function PaymentPage () {
  return (
    <Card className='bg-secondary'>
      <CardHeader>
        <CardTitle>Fromas de pago</CardTitle>
        <CardDescription>Siguientes formas de pago aceptadas</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-4 justify-center'>
        <Card className='max-w-sm'>
          <CardHeader>
            <CardTitle>
              <div>
                <h4 className="flex flex-row gap-4 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                  <Landmark className='h-8'/> Depósito bancario
                </h4>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 pb-8'>
          <img src={import.meta.env.VITE_BACKEND_HOST + 'payment-img/banco.png'} alt="Course Image" className="top-0 left-0 w-[250px] object-cover rounded" />
          </CardContent>
        </Card>
        <Card className='max-w-sm'>
          <CardHeader>
            <CardTitle>
              <div>
                <h4 className="flex flex-row gap-4 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                  <CreditCard className='h-8'/> Transferencia
                </h4>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 pb-8'>
            <img src={import.meta.env.VITE_BACKEND_HOST + 'payment-img/transferencia.png'} alt="Course Image" className="top-0 left-0 w-[250px] object-cover rounded" />
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter>
        <div className='flex flex-col gap-4'>
          <p className="text-xl text-muted-foreground">
            Una vez realizado su pago, diríjase al apartado de pedidos, y suba su recibo.
          </p>
          <p className="text-sm text-muted-foreground">
            La validación de su pago pude tomar un tiempo.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
