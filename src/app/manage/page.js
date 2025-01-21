'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth'; // Use your AuthContext
import { useRouter } from 'next/navigation'; // For navigation

export default function Manage() {
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter();

  // Ensure hooks are called consistently
  const [folders, setFolders] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  // Render a loading state if still verifying authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render an empty page if unauthenticated (router.push will handle navigation)
  if (!user) {
    return null;
  }

  // Folder management functions
  const handleCreateFolder = () => {
    const newFolder = {
      id: folders.length + 1,
      name: `Untitled Folder`,
      files: [],
    };
    setFolders([...folders, newFolder]);
  };

  const handleRenameFolder = (folderId) => {
    if (!newFolderName.trim()) return;
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, name: newFolderName } : folder
      )
    );
    setEditingFolderId(null); // Exit edit mode
    setNewFolderName(''); // Clear input
  };

  const handleRemoveFolder = (folderId) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  };

  const handleDrop = (event, folderId) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: [...folder.files, ...files] }
          : folder
      )
    );
    setDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold text-indigo-800" style={{ marginTop: '10vh' }}>
          Manage Your Folders
        </h1>
        <p className="text-gray-600 mt-2">Organize your photos effortlessly with modern tools.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mb-6"
      >
        <Button
          onClick={handleCreateFolder}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg shadow-md"
        >
          <PlusIcon className="w-5 h-5" />
          Create Folder
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            className={`relative border rounded-lg p-6 bg-white shadow-md transition-transform ${
              dragging ? 'scale-95 border-indigo-600' : 'hover:scale-105'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => handleDrop(e, folder.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              {editingFolderId === folder.id ? (
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => handleRenameFolder(folder.id)}
                  className="w-full border-b-2 border-indigo-600 outline-none text-lg font-semibold"
                  placeholder="Rename folder"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-bold text-indigo-800 cursor-pointer truncate"
                  onClick={() => {
                    setEditingFolderId(folder.id);
                    setNewFolderName(folder.name);
                  }}
                >
                  {folder.name}
                </h2>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingFolderId(folder.id);
                    setNewFolderName(folder.name);
                  }}
                >
                  <PencilIcon className="w-5 h-5 text-gray-600 hover:text-indigo-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveFolder(folder.id)}>
                  <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                </Button>
              </div>
            </div>
            <ul className="space-y-2">
              {folder.files.map((file, index) => (
                <li key={index} className="text-sm text-gray-700 truncate" title={file.name}>
                  {file.name}
                </li>
              ))}
            </ul>
            {folder.files.length === 0 && <p className="text-gray-400 text-sm mt-4">Drag and drop files here</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
