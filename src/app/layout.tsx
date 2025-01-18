import './globals.css'
import { Heebo } from 'next/font/google'

const heebo = Heebo({ subsets: ['hebrew', 'latin'] })

export const metadata = {
  title: 'Author Name - Official Website',
  description: 'Official website of Author Name, featuring books, podcasts, and more.',
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

