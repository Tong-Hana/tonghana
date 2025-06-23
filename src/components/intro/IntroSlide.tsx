import Image from "next/image";

type Props = {
  imageSrc: string;
  title: string;
  description: string;
};

export default function IntroSlide({ imageSrc, title, description }: Props) {
  return (
    <div className="flex flex-col justify-center items-center text-center px-6 min-h-full pb-6">
      <div className="relative mb-14" style={{ width: 240, height: 185 }}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <h2 className="text-3xl font-semibold text-text-primary">{title}</h2>
      <p className="text-base font-normal text-text-secondary mt-5 whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}
