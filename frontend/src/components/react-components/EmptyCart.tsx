import { Frown } from 'lucide-react'

export default function EmptyCart () {
  return (
    <div className="flex flex-col justify-center items-center w-[250px] h-[100px] text-center">
      <h3>
        El carrito esta vacio
      </h3>
      <Frown className="h-5 w-5 mr-2" />
    </div>
  )
}
