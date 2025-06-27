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
      {" "}
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="rect"
        showGrid={false}
        objectFit="cover" // ⭐ 핵심: 정사각형 crop 영역을 이미지가 꽉 채움 (비율 유지)
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, areaPixels) => {
          setCroppedAreaPixels(areaPixels);
          onCropChange?.(areaPixels);
        }}
        style={{
          containerStyle: {
            width: "100%",
            height: "100%",
          },
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="rounded-full border-2 border-white shadow-lg"
            style={{
              width: "min(100%, 320px)",
              aspectRatio: "1 / 1",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)",
            }}
          />
        </div>
      </div>
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
