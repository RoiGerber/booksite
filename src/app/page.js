'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Headphones, ShoppingCart, ChevronDown,ChevronRight,ChevronLeft } from 'lucide-react'
import PDFViewer from "@/components/PDFViewer"; // Import your PDFViewer component
import books from './booksData'; // Import the books data
import { Spinner } from "@/components/ui/spinner"; // Replace with your spinner if needed



function BookPage({ book, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bookImages = book.images || [book.cover];

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % bookImages.length
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + bookImages.length) % bookImages.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <Button 
          onClick={onBack} 
          className="mb-8"
          variant="outline"
        >
          חזור לדף הראשי
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 text-right"
        >
          {/* Book Image */}
          <div className="relative">
            <div className="relative h-[600px] w-full">
              <Image
                src={bookImages[currentImageIndex]}
                alt={`${book.title} - תמונה ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg shadow-lg"
              />
              {bookImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-indigo-600" />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-indigo-600" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {bookImages.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {bookImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentImageIndex === index 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300 hover:bg-indigo-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Book Details */}
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">{book.title}</h1>
            <p className="text-xl text-indigo-700 mb-4">מאת {book.author}</p>
            <p className="text-3xl font-bold text-indigo-900 mb-6">₪{book.price}</p>
            <p className="text-gray-700 mb-6">{book.description}</p>
            
            {/* Add to Cart Section */}
            <div className="flex items-center space-x-4 mb-8 justify-end">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="px-3 py-1 text-indigo-600"
                >
                  -
                </button>
                <span className="px-3 py-1 border-x ">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  className="px-3 py-1 text-indigo-600"
                >
                  +
                </button>
                
              </div>
              ⠀⠀⠀⠀  
              <Button
                onClick={() => {
                  onAddToCart(quantity);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <ShoppingCart className="mr-2 h-5 w-5 justify-start" /> הוסף לסל הקניות
              </Button>
            </div>

            {/* Additional Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">פרטי הספר</h3>
                <ul className="space-y-2">
                  <li><strong>מספר עמודים:</strong> {book.details.pages}</li>
                  <li><strong>שפה:</strong> {book.details.language}</li>
                  <li><strong>הוצאה לאור:</strong> {book.details.publisher}</li>
                  <li><strong>תאריך הוצאה:</strong> {book.details.publicationDate}</li>
                  <li><strong>ISBN:</strong> {book.details.isbn}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


function PurchasePage({ cart, onBack, onPurchase, onUpdateCart }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "שם הוא שדה חובה";
    if (!formData.phone.trim()) newErrors.phone = "טלפון הוא שדה חובה";
    if (!formData.address.trim()) newErrors.address = "כתובת היא שדה חובה";
    if (!formData.email.trim()) newErrors.email = "כתובת דואר אלקטרוני הוא שדה חובה";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("אנא מלא את כל השדות הנדרשים בטופס.");
      return;
    }

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      total: totalPrice,
      order: cart
        .map(
          (item) =>
            `${item.title} (כמות: ${item.quantity}, ₪${
              item.price * item.quantity
            })`
        )
        .join(", "),
    };

    setLoading(true); // Start loading spinner
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxCxJH-Ie2UOzuilq1y2VPvYlmggNH1QAhx776YuNtQmlQa-WH_74o6_KUS8_ysT-Za/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log(response)
    
      onPurchase(formData);
    } catch (error) {
      console.error("Error:", error);
      alert("שגיאה בחיבור לשרת. אנא נסה שוב.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    onUpdateCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      {/* Page Content */}
      <div className="container mx-auto px-4">
        <Button onClick={onBack} className="mb-8" variant="outline">
          המשך לקנות
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-4 text-right">
              סיכום הזמנה
            </h2>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-right"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      כמות: {item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 text-sm mt-2"
                    >
                      הסר פריט
                    </button>
                  </div>
                  <span className="text-gray-600">
                    ₪{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">₪{totalPrice}</span>
                  <span className="text-xl font-bold">סה"כ לתשלום</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div>
            <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-right">
              פרטי משלוח
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-right mb-2 text-indigo-900">
                  שם מלא
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md text-right ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="הכנס את שמך המלא"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-right mb-2 text-indigo-900">
                  טלפון
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md text-right ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="הכנס את מספר הטלפון שלך"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-right mb-2 text-indigo-900">
                  כתובת
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md text-right ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="3"
                  placeholder="הכנס את כתובת המשלוח המלאה"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-right mb-2 text-indigo-900">
                  כתובת דואר אלקטרוני
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md text-right ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="הכנס את כתובת הדואר האלקטרוני שלך"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
                disabled={loading}
              >
                {loading ? "טוען..." : `סיים רכישה - ₪${totalPrice}`}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [cart, setCart] = useState([]);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePurchase = (formData) => {
    console.log("Purchase data:", { cart, formData });
    setCart([]);
    setShowPurchase(false);
    setShowConfirmation(true); // Show the confirmation page
  };

  const handleAddToCart = (book, quantity) => {
    setCart((prevCart) => [...prevCart, { ...book, quantity }]);
    setShowPurchase(true);
  };

  if (showConfirmation) {
    return (
      <OrderConfirmation 
        onReturnHome={() => setShowConfirmation(false)} 
      />
    );
  }

  if (showPurchase) {
    return (
      <PurchasePage
        cart={cart}
        onBack={() => setShowPurchase(false)}
        onPurchase={handlePurchase}
        onUpdateCart={setCart}
      />
    );
  }

  if (selectedBook) {
    return (
      <BookPage
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
        onAddToCart={(quantity) => handleAddToCart(selectedBook, quantity)}
      />
    );
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <BooksShowcase onBookSelect={setSelectedBook} />
      <PodcastsSection />
      <RecommendationsSection />
      <ExampleChaptersSection />
      <PurchaseSection onBookSelect={setSelectedBook} />
    </main>
  );
}



function BooksShowcase({ onBookSelect }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">הספרים שלי</h2>
        <div className="flex flex-wrap justify-center gap-16">
          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center cursor-pointer"
              onClick={() => onBookSelect(book)}
            >
              <Image
                src={book.cover}
                alt={book.title}
                width={300}
                height={400}
                className="rounded-lg shadow-lg mb-6 transition-transform duration-300 hover:scale-105"
              />
              <h3 className="text-2xl font-semibold text-indigo-800">{book.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <Image
          src="/pictures/author.png"
          alt="Author Name"
          width={200}
          height={200}
          className="rounded-full mx-auto mb-8 border-4 border-white shadow-lg"
        />
        <h1 className="text-5xl font-bold mb-4 text-indigo-900">רועי בנימין גרבר</h1>
        <p className="text-xl text-indigo-700 max-w-2xl mx-auto mb-8">סופר, מתמטיקאי והיסטוריון חובב, בוגר תואר ראשון במדעי המחשב. רועי מפתח תוכנה באמזון.</p>
        <Button 
          size="lg" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white mb-16"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          לרכישה
        </Button>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10"
      >
        <ChevronDown className="w-8 h-8 text-indigo-600" />
      </motion.div>
    </section>
  )
}

function PodcastsSection() {
  // Track the currently active podcast (or null if none is active)
  // const [activePodcast, setActivePodcast] = useState<number | null>(null);
  const [activePodcast, setActivePodcast] = useState(null);
  const podcasts = [
    { 
      title: "ראיון בתכנית הבוקר פותחים יום בערוץ 13", 
      duration: "05:14", 
      videoUrl: "https://www.youtube.com//embed/H6zkVOq23Bs" 
    },
    { 
      title: "ראיון לפודקאסט על המשמעות על ההיסטוריה של העולם", 
      duration: "40:28", 
      videoUrl: "https://www.youtube.com/embed/2j7kPqwSjLU" 
    },
    { 
      title: "ראיון לפודקאסט דרך המחשבה על הפילוסופיה של המתמטיקה", 
      duration: "56:08", 
      videoUrl: "https://www.youtube.com/embed/GZY7-nVpDAo",
    },
  ];

  const togglePodcast = (index) => {
    setActivePodcast(activePodcast === index ? null : index); // Toggle the active podcast
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">ראיונות</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {podcasts.map((podcast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <Headphones className="w-10 h-10 text-indigo-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">{podcast.title}</h3>
                      <p className="text-sm text-gray-500">{podcast.duration}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-indigo-50"
                    onClick={() => togglePodcast(index)} // Handle button click
                  >
                    האזן עכשיו
                  </Button>
                </CardContent>
              </Card>

              {/* YouTube Video Section */}
              {activePodcast === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={podcast.videoUrl}
                      title={podcast.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg shadow-lg"
                    ></iframe>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderConfirmation({ onReturnHome }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">תודה על ההזמנה שלך!</h1>
        <p className="text-xl text-indigo-700 mb-6">
          ההזמנה שלך התקבלה בהצלחה. הסופר ייצור איתך קשר לתשלום ואישור פרטי ההזמנה.
        </p>
        <Image
          src="/pictures/order-success.png"
          alt="Order Success"
          width={150}
          height={150}
          className="mx-auto mb-8"
        />
        <Button 
          onClick={onReturnHome} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg"
        >
          חזור לדף הראשי
        </Button>
      </motion.div>
    </div>
  );
}


function RecommendationsSection() {
  const recommendations = [
    { text: "ספר מרתק שלא יכולתי להניח מהיד!", author: "קורא נלהב" },
    { text: "כתיבה מבריקה ועלילה סוחפת. חובה לכל חובב ספרות!", author: "מבקר ספרות" },
    { text: "יצירת מופת שתישאר אתכם עוד זמן רב אחרי סיום הקריאה.", author: "עיתון הארץ" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">מה אומרים עליי</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <p className="text-lg mb-6 text-indigo-800">&apos;{rec.text}&apos;</p>
                  <p className="text-sm text-indigo-600 text-left">- {rec.author}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExampleChaptersSection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chapters = [
    {
      title: "עשרה פרקים על - כשעבדות מפסיקה לעבוד",
      content: "עבדות. איזה באסה זה. העבדות התקיימה מאז ומתמיד. עוד לפני שמדינות הפכו למדינות, לפני שהייתה להן חוקה ולפני שקמה להן מערכת משפטית במובן המודרני של המילה.",
      pdfUrl: "/pdfs/slavery.pdf",
    },
    {
      title: "תנו למספרים לדבר - מלכת המדעים",
      content: "מה כל כך מיוחד במתמטיקה? במה היא שונה מהפיזיקה, מהביולוגיה, מהמוזיקה, מהאסטרונומיה, או מהפסיכולוגיה? הדעות כמובן מגוונות, ואין תשובה אחת נכונה – פילוסופיה זה לא מדע מדויק, בניגוד למתמטיקה שהיא בדיוק כן. ואולי פה קבור הכלב.",
      pdfUrl: "/pdfs/scienceQueen.pdf",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">
          פרקים לדוגמה
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex mb-8">
            {chapters.map((chapter, index) => (
              <Button
                key={index}
                variant={activeChapter === index ? "default" : "outline"}
                onClick={() => setActiveChapter(index)}
                className="flex-1 mr-4 last:mr-0"
              >
                {chapter.title}
              </Button>
            ))}
          </div>
          <Card>
            <CardContent className="p-8">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-indigo-800">
                  {chapters[activeChapter].title}
                </h3>
                <p className="text-lg mb-6 text-indigo-700">
                  {chapters[activeChapter].content}
                </p>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => setIsModalOpen(true)}
                >
                  קרא עוד
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for PDF Viewer */}
      <PDFViewer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={chapters[activeChapter].pdfUrl}
        title={chapters[activeChapter].title}
      />
    </section>
  );
}

function PurchaseSection({ onBookSelect }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">רכישת הספרים</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className={`h-full ${index === 2 ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-white'}`}>
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-4xl font-bold mb-4">{item.price} &#8362;</p>
                    {item.discount && <p className="mb-6 text-sm">{item.discount}</p>}
                  </div>
                  <Button 
                    onClick={() => onBookSelect(item)}
                    className={index === 2 ? "bg-white text-indigo-600 hover:bg-gray-100" : "bg-indigo-600 text-white hover:bg-indigo-700"}
                  >
                    <ShoppingCart className="mr-2" />
                    קנה עכשיו
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