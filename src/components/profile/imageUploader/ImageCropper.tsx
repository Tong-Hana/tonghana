"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "@/utils/cropImage";
import type { Area } from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCropComplete?: (cropped: string) => void;
  onCropChange?: (area: Area) => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCropChange,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = async () => {
    if (!croppedAreaPixels || !onCropComplete) return;
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(croppedImage);
  };

  return (
    <div className="relative w-full aspect-square">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="round"
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, areaPixels) => {
          setCroppedAreaPixels(areaPixels);
          onCropChange?.(areaPixels);
        }}
      />
      {onCropComplete && (
        <button
          onClick={handleCropComplete}
          className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 text-sm text-hanagreen-normal underline"
        >
          완료
        </button>
      )}
    </div>
  );
}
