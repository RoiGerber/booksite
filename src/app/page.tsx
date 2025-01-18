'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Headphones, ShoppingCart, ChevronDown } from 'lucide-react'
import PDFViewer from "@/components/PDFViewer"; // Import your PDFViewer component

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BooksShowcase />
      <PodcastsSection />
      <RecommendationsSection />
      <ExampleChaptersSection />
      <PurchaseSection />
    </main>
  )
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
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">לרכישה</Button>
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

function BooksShowcase() {
  const books = [
    { title: "תנו למספרים לדבר", cover: "/pictures/let_the_number_talk_camera.jpg" },
    { title: "עשרה פרקים על", cover: "/pictures/ten_episodes_on_camera.jpg" },
  ]

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
              className="text-center"
            >
              <Image src={book.cover || "/placeholder.svg"} alt={book.title} width={300} height={400} className="rounded-lg shadow-2xl mb-6 transition-transform duration-300 hover:scale-105" />
              <h3 className="text-2xl font-semibold text-indigo-800">{book.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PodcastsSection() {
  // Track the currently active podcast (or null if none is active)
  const [activePodcast, setActivePodcast] = useState<number | null>(null);

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

  const togglePodcast = (index: number) => {
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
                  <p className="text-lg mb-6 text-indigo-800">&apos'{rec.text}&apos'</p>
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

function PurchaseSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-900">רכישת הספרים</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "עשרה פרקים על", price: "₪79" },
            { title: "תנו למספרים לדבר", price: "₪89" },
            { title: '"טובים השניים"', price: "₪149", discount: "חסכון של ₪19" },
          ].map((item, index) => (
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
                    <p className="text-4xl font-bold mb-4">{item.price}</p>
                    {item.discount && <p className="mb-6 text-sm">{item.discount}</p>}
                  </div>
                  <Button className={index === 2 ? "bg-white text-indigo-600 hover:bg-gray-100" : "bg-indigo-600 text-white hover:bg-indigo-700"}>
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
