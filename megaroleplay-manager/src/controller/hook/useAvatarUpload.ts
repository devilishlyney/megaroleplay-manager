import { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateAvatar } from "../service/authService";

export function useAvatarUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>("/default_pfp.webp");
  const [isLoading, setIsLoading] = useState(false);

  // Update avatar URL whenever user changes
  useEffect(() => {
    const url = user?.user_metadata?.avatar_url || "/default_pfp.webp";
    setAvatarUrl(url);
  }, [user?.user_metadata?.avatar_url]);

  const cropImageToSquare = (
    imageSrc: string,
    callback: (croppedImage: string) => void
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = Math.min(img.width, img.height);

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        callback(canvas.toDataURL("image/png"));
      }
    };
    img.src = imageSrc;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        cropImageToSquare(imageSrc, async (croppedImage) => {
          try {
            setIsLoading(true);
            await updateAvatar(croppedImage);
          } catch (error) {
            console.error("Failed to update avatar:", error);
          } finally {
            setIsLoading(false);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    fileInputRef,
    avatarUrl,
    handleAvatarClick,
    handleFileSelect,
    isLoading,
  };
}
