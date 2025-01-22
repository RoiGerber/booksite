'use client';

import useUserRole from '@/hooks/useUserRole'; // Custom hook to fetch user role
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Images, Settings, Calendar } from 'lucide-react';

const MainPage = () => {
  const userRole = useUserRole();

  if (!userRole) {
    return <div>Loading...</div>; // Show a loading state while fetching the role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      {userRole === 'photographer' ? (
        <PhotographerDashboard />
      ) : userRole === 'client' ? (
        <ClientDashboard />
      ) : (
        <div>Invalid user role</div>
      )}
    </div>
  );
};

const PhotographerDashboard = () => {
  return (
    <div className="flex p-4 space-x-4 h-[75vh] relative z-10">
      {/* Marketplace Section */}
      <motion.div
        className="h-full flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 transition-all duration-300 cursor-pointer ml-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href="/marketplace" className="w-full h-full flex flex-col items-center justify-center text-center">
          <Camera className="w-12 h-12 mb-4 text-white opacity-90" />
          <div className="text-white text-4xl font-bold mb-4">Marketplace</div>
          <p className="text-white text-lg opacity-80">
            Explore and showcase your work to potential clients.
          </p>
        </Link>
      </motion.div>

      {/* Manage Section */}
      <motion.div
        className="h-full flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-teal-600 to-cyan-600 transition-all duration-300 cursor-pointer mr-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href="/manage" className="w-full h-full flex flex-col items-center justify-center text-center">
          <Images className="w-12 h-12 mb-4 text-white opacity-90" />
          <div className="text-white text-4xl font-bold mb-4">Manage</div>
          <p className="text-white text-lg opacity-80">
            Organize your bookings, clients, and portfolio.
          </p>
        </Link>
      </motion.div>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <div className="flex p-4 space-x-4 h-[75vh] relative z-10">
      {/* Post Event Section */}
      <motion.div
        className="h-full flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 transition-all duration-300 cursor-pointer ml-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href="/post-event" className="w-full h-full flex flex-col items-center justify-center text-center">
          <Calendar className="w-12 h-12 mb-4 text-white opacity-90" />
          <div className="text-white text-4xl font-bold mb-4">Post Event</div>
          <p className="text-white text-lg opacity-80">
            Share your event photos and experiences.
          </p>
        </Link>
      </motion.div>

      {/* Gallery Section */}
      <motion.div
        className="h-full flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-teal-600 to-cyan-600 transition-all duration-300 cursor-pointer mr-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href="/gallery" className="w-full h-full flex flex-col items-center justify-center text-center">
          <Images className="w-12 h-12 mb-4 text-white opacity-90" />
          <div className="text-white text-4xl font-bold mb-4">Gallery</div>
          <p className="text-white text-lg opacity-80">
            Browse through your event photos and memories.
          </p>
        </Link>
      </motion.div>
    </div>
  );
};

export default MainPage;