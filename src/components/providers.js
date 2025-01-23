'use client'

import { CartProvider } from '@/lib/cart-context'

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
