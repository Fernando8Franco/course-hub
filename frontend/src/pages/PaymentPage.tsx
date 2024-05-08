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
      <CardContent className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
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
            <div className="text-center text-lg font-semibold">
              Nombre: Juan Pérez Pérez
            </div>
            <div className="text-center text-lg font-semibold">
              CLABE: 123456789123456789
            </div>
          </CardContent>
        </Card>
        <Card>
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
            <div className="text-center text-lg font-semibold">
              Nombre: Juan Pérez Pérez
            </div>
            <div className="text-center text-lg font-semibold">
              CLABE: 123456789123456789
            </div>
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
