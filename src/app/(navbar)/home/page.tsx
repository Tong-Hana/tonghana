"use client";
import ProfileCard from "@/components/profile/ProfileCard";

export default function HomePage() {
  return (
    <div className="frame-container space-y-8">
      <div className="flex flex-col">
        <ProfileCard
          name="별돌이"
          age={25}
          job="아티스트"
          location="서울시 서초구"
          description="서초에 살고 판교에서 일해요 😊"
          imageUrl="/jennie.jpg" // public 폴더에 있는 임시 이미지
          target="3년 안에 1억 모으기!"
          totalAsset="30억"
          carCost="1억"
          houseCost="10억"
        />
      </div>
    </div>
  );
}
