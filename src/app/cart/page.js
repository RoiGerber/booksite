'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart } = useCart()
  
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">עגלת קניות</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">העגלה שלך ריקה</p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/')}
          >
            חזרה לחנות
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <Card key={index} className="p-4">
                <CardContent className="flex justify-between items-center p-0">
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">₪{item.price}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => removeFromCart(index)}
                  >
                    הסר
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">₪{total}</span>
              <span className="text-xl">סה"כ לתשלום:</span>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
              >
                המשך בקניות
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Implement checkout logic
                  alert('מעבר לתשלום')
                }}
              >
                לתשלום
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
