'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth'; // Use your AuthContext
import { useRouter } from 'next/navigation'; // For navigation
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes,uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { storage, db } from '@/lib/firebaseConfig';


export default function Manage() {
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter();

  // Ensure hooks are called consistently
  const [folders, setFolders] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});



  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user) return;
  
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setFolders(data.folders || []);
      } else {
        console.log('No folders found for this user.');
      }
    };
  
    fetchFolders();
  }, [user]);

  // Render a loading state if still verifying authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render an empty page if unauthenticated (router.push will handle navigation)
  if (!user) {
    return null;
  }

  const handleMultipleFileUpload = async (folderId, files) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const uploadedFiles = [];
  
      for (const file of files) {
        const filePath = `${user.uid}/${folderId}/${file.name}`;
        const storageRef = ref(storage, filePath);
  
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress((prev) => ({
              ...prev,
              [folderId]: progress,
            }));
          },
          (error) => {
            console.error('Upload error:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedFiles.push({ name: file.name, url: downloadURL });
  
            // Reset progress for this folder once complete
            setUploadProgress((prev) => ({
              ...prev,
              [folderId]: 0,
            }));
  
            // Update Firestore and state when all files are uploaded
            const updatedFolders = folders.map((folder) =>
              folder.id === folderId
                ? {
                    ...folder,
                    files: [...folder.files, ...uploadedFiles],
                  }
                : folder
            );
  
            await updateDoc(userDocRef, { folders: updatedFolders });
            setFolders(updatedFolders);
          }
        );
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload files.');
    }
  };

  const handleFileUpload = async (folderId, file) => {
    try {
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
  
      // Create a unique path in Firebase Storage for the file
      const filePath = `${user.uid}/${folderId}/${file.name}`;
      const storageRef = ref(storage, filePath);
  
      // Upload the file to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref); // Get the file's public URL
  
      // Update local folders state with the new file
      const updatedFolders = folders.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              files: [...folder.files, { name: file.name, url: downloadURL }],
            }
          : folder
      );
  
      // Update the local state immediately to reflect changes in the UI
      setFolders(updatedFolders);
  
      // Save the updated folders array to Firestore
      await updateDoc(userDocRef, { folders: updatedFolders });
  
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file.');
    }
  };
  
const handleCreateFolder = async () => {
  const newFolder = {
    id: folders.length + 1,
    name: `Untitled Folder`,
    files: [],
  };

  try {
    const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document

    // Check if the document exists
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Document exists: Update the folders array
      await updateDoc(userDocRef, {
        folders: arrayUnion(newFolder),
      });
    } else {
      // Document does not exist: Create it with the initial folder
      await setDoc(userDocRef, { folders: [newFolder] });
    }

    // Update local state
    setFolders((prev) => [...prev, newFolder]);
  } catch (error) {
    console.error('Firestore Write Error:', error);
  }
};

  const handleRenameFolder = async (folderId) => {
    if (!newFolderName.trim()) return;
  
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId ? { ...folder, name: newFolderName } : folder
    );
  
    setFolders(updatedFolders);
  
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { folders: updatedFolders });
  
    setEditingFolderId(null);
    setNewFolderName('');
  };
  
  const handleRemoveFolder = async (folderId) => {
    const updatedFolders = folders.filter((folder) => folder.id !== folderId);
  
    setFolders(updatedFolders);
  
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { folders: updatedFolders });
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
        <p className="text-gray-600 mt-2">Organize your files effortlessly with modern tools.</p>
      </motion.div>
  
      {/* Create Folder Button */}
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
  
      {/* Folder Grid */}
      {folders.map((folder) => (
  <motion.div
    key={folder.id}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleMultipleFileUpload(folder.id, files);
      }
    }}
    className={`relative border rounded-lg p-6 ${
      dragging ? 'bg-indigo-100' : 'bg-white'
    } shadow-md transition-transform ${
      dragging ? 'scale-95 border-indigo-600' : 'hover:scale-105'
    }`}
    onDragEnter={() => setDragging(true)}
    onDragLeave={() => setDragging(false)}
  >
    {/* Folder Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-indigo-800 truncate">{folder.name}</h2>
      <div>
        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              handleMultipleFileUpload(folder.id, files);
            }
          }}
          className="hidden"
          id={`upload-${folder.id}`}
        />
        <label
          htmlFor={`upload-${folder.id}`}
          className="text-indigo-600 cursor-pointer hover:underline"
        >
          Upload Files
        </label>
      </div>
    </div>

    {/* Progress Bar */}
    {uploadProgress[folder.id] > 0 && (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
          style={{ width: `${uploadProgress[folder.id]}%` }}
        ></div>
      </div>
    )}

    {/* Files List */}
    <ul className="space-y-2">
      {folder.files.map((file, index) => (
        <li key={index} className="text-sm text-gray-700 truncate">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  </motion.div>
))}

    </div>
  );
  
}
