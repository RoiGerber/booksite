'use client'

import { CartProvider } from '@/lib/cart-context'

export default function CartWrapper({ children }) {
  return <CartProvider>{children}</CartProvider>
}
