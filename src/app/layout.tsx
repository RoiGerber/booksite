import './globals.css'
import { Heebo } from 'next/font/google'

const heebo = Heebo({ subsets: ['hebrew', 'latin'] })

export const metadata = {
  title: 'רועי בנימין גרבר',
  description: 'האתר הרשמי של רועי בנימין גרבר. מתמטיקאי, היסטוריון וסופר חובב.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
                

      <body className={`${heebo.className} bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800`}>
        {children}
      </body>
    </html>
  )
}

