import { ShoppingCart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import EmptyCart from './EmptyCart'
import Cart from './Cart'
import { useEffect, useState } from 'react'
import useCartStore from '@/store/cartStore'

export default function DDMCart () {
  const { cart } = useCartStore()
  const [open, setOpen] = useState(false)

  const handleOpenChange = (nextOpenState: boolean) => {
    setOpen(nextOpenState)
  }

  useEffect(() => {
    if (cart !== null) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [cart])

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {
          (cart !== null)
            ? <Cart course={cart} />
            : <EmptyCart/>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
