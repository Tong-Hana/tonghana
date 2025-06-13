import {
  AttentionStarBoy,
  AttentionStarGirl,
  InfoStarBoy,
  ThumbsUpStarGirl,
} from "@/assets/assets";
import { cx } from "class-variance-authority";

type Props = {
  content: string | React.ReactNode;
  imageType: ImageType;
  imagePosition?: ImagePosition;
};

type ImageType =
  | "attentionStarBoy"
  | "attentionStarGirl"
  | "infoStarBoy"
  | "thumbsUpStarGirl";
type ImagePosition = "left" | "right";

const infoImageSize = "w-20 h-20";
const imageMap: Record<ImageType, React.ReactNode> = {
  attentionStarBoy: <AttentionStarBoy className={cx(infoImageSize)} />,
  attentionStarGirl: <AttentionStarGirl className={cx(infoImageSize)} />,
  infoStarBoy: <InfoStarBoy className={cx(infoImageSize)} />,
  thumbsUpStarGirl: <ThumbsUpStarGirl className={cx(infoImageSize)} />,
};

export default function InfoCard({
  content,
  imageType,
  imagePosition = "right",
}: Props) {
  const image = <div className="w-20 h-20">{imageMap[imageType]}</div>;

  return (
    <div className="flex p-5 bg-white rounded-3xl items-center shadow-card-shadow">
      {imagePosition === "left" && image}
      <p className="text-base font-light text-text-primary">{content}</p>
      {imagePosition === "right" && image}
    </div>
  );
}
