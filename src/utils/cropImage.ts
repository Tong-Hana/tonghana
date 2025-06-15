import type { Area } from "react-easy-crop";

export default function getCroppedImg(
  imageSrc: string,
  crop: Area,
): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
}
