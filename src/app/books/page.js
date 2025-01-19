'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from 'next/navigation'

export default function BookProductPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">טוען נתונים...</p>}>
      <BookContent />
    </Suspense>
  );
}

function BookContent() {
  const searchParams = useSearchParams(); // Use the hook to get query params
  const bookData = searchParams.get('bookData'); // Extract the bookData parameter

  const [book, setBook] = useState(null); // Initialize state for book data
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // UseEffect to parse bookData only once
  useEffect(() => {
    if (bookData) {
      try {
        setBook(JSON.parse(bookData));
      } catch (error) {
        console.error('Invalid bookData format:', error);
      }
    }
  }, [bookData]);

  // Render a loading state if book data is not ready
  if (!book) {
    return <p className="text-center text-gray-600">טוען נתונים...</p>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % book.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + book.images.length) % book.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 text-right"
        >
          {/* Book Images */}
          <div className="relative">
            <div className="relative h-[600px] w-full">
              <Image
                src={book.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${book.title} - תמונה ${currentImageIndex + 1}`}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
              <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                <ChevronLeft className="w-6 h-6 text-indigo-600" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                <ChevronRight className="w-6 h-6 text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Book Details */}
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">{book.title}</h1>
            <p className="text-xl text-indigo-700 mb-4">מאת {book.author}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className={`w-5 h-5 ${index < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="mr-2 text-indigo-600">{book.rating}</span>
            </div>
            <p className="text-3xl font-bold text-indigo-900 mb-6">₪{book.price}</p>
            <p className="text-gray-700 mb-6">{book.description}</p>
            <div className="flex items-center space-x-4 mb-8 justify-end">
              <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1 text-indigo-600">
                  -
                </button>
                <span className="px-3 py-1 border-x">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 text-indigo-600">
                  +
                </button>
              </div>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <ShoppingCart className="mr-2 h-5 w-5" /> הוסף לסל הקניות
              </Button>
              <Button variant="outline" className="bg-white hover:bg-indigo-50">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="description" className="w-full text-right">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">תיאור מורחב</TabsTrigger>
                <TabsTrigger value="details">פרטי הספר</TabsTrigger>
                <TabsTrigger value="shipping">משלוח</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">{book.longDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li><strong>מספר עמודים:</strong> {book.details.pages}</li>
                      <li><strong>שפה:</strong> {book.details.language}</li>
                      <li><strong>הוצאה לאור:</strong> {book.details.publisher}</li>
                      <li><strong>תאריך הוצאה:</strong> {book.details.publicationDate}</li>
                      <li><strong>ISBN:</strong> {book.details.isbn}</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipping">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">משלוח חינם בהזמנות מעל ₪200. זמן אספקה משוער: 3-5 ימי עסקים.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
