import { Image } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  TransformWrapper,
  TransformComponent
} from 'react-zoom-pan-pinch'
import { Button } from '@/components/ui/button'

interface Props {
  image: string
}

export default function CheckImage ({ image }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex justify-center'>
          <Button variant="outline">
            <Image className='mr-2 h-4 w-4'/> Ver recibo
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className='pt-4'>
          <TransformWrapper>
            <TransformComponent>
              <img src={import.meta.env.VITE_BACKEND_HOST + image} className="zoomedImage"/>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  )
}
