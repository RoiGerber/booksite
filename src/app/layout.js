import './globals.css'
import CartWrapper from '@/components/cart-wrapper'

export const metadata = {
  title: 'חנות ספרים',
  description: 'חנות ספרים דיגיטלית',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
        

      <head>
        <title>חנות ספרים</title>
      </head>
      <body>
        <CartWrapper>
          {children}
        </CartWrapper>
      </body>
    </html>
  )
}
