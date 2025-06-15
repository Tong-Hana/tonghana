"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import ImageCropper from "./ImageCropper";
import getCroppedImg from "@/utils/cropImage";
import Button from "@/components/common/button/Button";
import type { Area } from "react-easy-crop";

interface ImageCropperModalProps {
  open: boolean;
  image: string;
  onClose: () => void;
  onComplete: (croppedDataUrl: string) => void;
}

export default function ImageCropperModal({
  open,
  image,
  onClose,
  onComplete,
}: ImageCropperModalProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleComplete = async () => {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    onComplete(cropped);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "500px",
          borderRadius: 2,
        },
      }}
    >
      <DialogContent>
        <ImageCropper image={image} onCropChange={setCroppedAreaPixels} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleComplete} intent="green" size="full">
          완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}
