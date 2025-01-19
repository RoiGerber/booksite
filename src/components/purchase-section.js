'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const purchaseOptions = [
  { title: "עשרה פרקים על", price: 79, description: "עשרה פרקים על הוא ספר בלתי שגרתי בעליל. הוא מספר את כל מה שצריך לדעת על 500 השנים הכי מעניינות (האחרונות) בצורה של סיפור, בלשון קלה, הומוריסטית ומרתקת. הספר מתאים לכל הגילאים ונמכר ביותר מ1000 עותקים. הצטרפו לקולומבוס, נפוליאון, הרצל, רייגן ועוד! בואו תעשו היסטוריה." },
  { title: "תנו למספרים לדבר", price: 89, description: "מתמטיקה זה יותר ממספרים. הרבה יותר. מתמטיקה היא השפה של היקום כולו. היא שוברת את גבולות ההיגיון ובכל זאת מצליחה לתאר את היקום בדיוק של ייאמן. למה? איך? הצטרפו לגדולי המתמטיקאים והפילוסופים של כל הזמנים כדי לצאת יותר סקרנים משנכנסתם. הנאה מובטחת!" },
  { title: '"טובים השניים"', price: 149, discount: "חסכון של ₪19", description: "עשרה פרקים על + תנו למספרים לדבר" },
]

export default function PurchaseSection() {
  const router = useRouter()
  const { addToCart } = useCart()

  const handleAddToCart = (item) => {
    addToCart(item)
    router.push('/cart')
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">אפשרויות רכישה</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {purchaseOptions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-3xl font-bold mb-6">₪{item.price}</p>
                    <p className="mb-6">{item.description}</p>
                    {item.discount && <p className="mb-6 text-sm">{item.discount}</p>}
                  </div>
                  <Button 
                    className={index === 2 ? "bg-white text-indigo-600 hover:bg-gray-100" : "bg-indigo-600 text-white hover:bg-indigo-700"}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="mr-2" />
                    הוסף לעגלה
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
