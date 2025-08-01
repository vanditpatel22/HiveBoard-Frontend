import { useState } from 'react';
import type { MediaAttachment, User } from '@/store/useStore';

interface UseFileUploadProps {
  onUploadComplete: (attachment: MediaAttachment) => void;
  currentUser: User;
}

export function useFileUpload({ onUploadComplete, currentUser }: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, description?: string) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const mockUrl = mediaType === 'image' 
        ? `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      const attachment: MediaAttachment = {
        id: Date.now().toString(),
        type: mediaType,
        url: mockUrl,
        description: description || `Uploaded ${file.name}`,
        uploadedAt: new Date(),
        uploadedBy: currentUser,
      };

      onUploadComplete(attachment);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only images (JPEG, PNG, GIF) and videos (MP4, WebM) are allowed' };
    }

    return { isValid: true };
  };

  return {
    uploadFile,
    validateFile,
    isUploading,
    uploadProgress,
  };
}