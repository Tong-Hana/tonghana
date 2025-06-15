"use client";

import { useRef, useState } from "react";
import ImageCropperModal from "@/components/profile/imageUploader/ImageCropperModal";
import Image from "next/image";

interface ImageUploaderProps {
  imageUrl?: string;
  onChange: (file: File | null) => void;
}

export default function ImageUploader({
  imageUrl,
  onChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setModalOpen(true);
      setFile(selected);
    };
    reader.readAsDataURL(selected);
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setPreview(croppedDataUrl);
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="relative w-40 h-40 rounded-full bg-gray-100 border border-hanasilver flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {preview ? (
          <Image
            src={preview}
            alt="미리보기"
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <span className="text-3xl text-hanasilver">+</span> //임시
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {rawImage && (
        <ImageCropperModal
          open={modalOpen}
          image={rawImage}
          onClose={() => setModalOpen(false)}
          onComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
