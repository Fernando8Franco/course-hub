import { Button } from '@/components/ui/button'
import Header from '../components/react-components/Header'
import { Link } from 'react-router-dom'

export default function NotFoundPage () {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header/>
      <div className='flex flex-col justify-center items-center gap-10 min-h-screen'>
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          Error 404: Página no econtrada
        </h1>
        <div>
          <Button>
            <Link to='/'>
              Regresar a la pagina principal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
