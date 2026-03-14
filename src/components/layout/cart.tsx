import { ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CartDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex items-center p-2 text-muted-foreground hover:text-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            2
          </span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left text-2xl">Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col gap-6">
          {/* Example Cart Item */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex flex-col">
              <span className="font-medium">Monstera Deliciosa</span>
              <span className="text-sm text-muted-foreground">Qty: 1</span>
            </div>
            <span className="font-medium">$45.00</span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex flex-col">
              <span className="font-medium">Snake Plant</span>
              <span className="text-sm text-muted-foreground">Qty: 1</span>
            </div>
            <span className="font-medium">$25.00</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t bg-background p-6">
          <button className="w-full rounded-md bg-foreground py-4 text-background font-medium hover:bg-foreground/90 transition-colors">
            Checkout • $70.00
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}