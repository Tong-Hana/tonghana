import LikeCard from "@/components/like/LikeCard";

const dummy = [
  {
    id: 1,
    imageUrl: "/jennie.jpg",
    name: "김철수",
    age: 24,
    address: "서울시 강남구",
    goal: "3년 안에 10억 모으기",
    ftti: "적극투자형",
  },
  {
    id: 2,
    imageUrl: "/jennie.jpg",
    name: "이영희",
    age: 29,
    address: "부산시 해운대구",
    goal: "5년 안에 자가 마련하기",
    ftti: "안정추구형",
  },
  {
    id: 3,
    imageUrl: "/jennie.jpg",
    name: "박지민",
    age: 31,
    address: "대전시 서구",
    goal: "40살까지 경제적 자유 달성",
    ftti: "위험중립형",
  },
  {
    id: 4,
    imageUrl: "/jennie.jpg",
    name: "최준호",
    age: 27,
    address: "인천시 연수구",
    goal: "30살까지 창업자금 5억 만들기",
    ftti: "적극투자형",
  },
  {
    id: 5,
    imageUrl: "/jennie.jpg",
    name: "정다은",
    age: 35,
    address: "서울시 마포구",
    goal: "은퇴 후 월세 수입 만들기",
    ftti: "안정형",
  },
  {
    id: 6,
    imageUrl: "/jennie.jpg",
    name: "한서준",
    age: 22,
    address: "경기도 수원시",
    goal: "10년 안에 세계 여행하기",
    ftti: "적극투자형",
  },
  {
    id: 7,
    imageUrl: "/jennie.jpg",
    name: "윤지후",
    age: 30,
    address: "대구시 수성구",
    goal: "내 집 마련하고 가족 여행 다니기",
    ftti: "위험중립형",
  },
  {
    id: 8,
    imageUrl: "/jennie.jpg",
    name: "강하늘",
    age: 26,
    address: "광주시 북구",
    goal: "연 1억 수익 만들기",
    ftti: "적극투자형",
  },
  {
    id: 9,
    imageUrl: "/jennie.jpg",
    name: "오유리",
    age: 33,
    address: "서울시 종로구",
    goal: "40세까지 퇴사하고 프리랜서 전향",
    ftti: "공격투자형",
  },
  {
    id: 10,
    imageUrl: "/jennie.jpg",
    name: "조민수",
    age: 28,
    address: "울산시 남구",
    goal: "부동산 수익으로 조기 은퇴",
    ftti: "적극투자형",
  },
];

export default function LikePage() {
  return (
    <div className="flex flex-col mb-5 w-full h-full mt-5 gap-5">
      {dummy.map((user) => (
        <LikeCard
          key={user.name}
          imageUrl={user.imageUrl}
          name={user.name}
          age={user.age}
          address={user.address}
          goal={user.goal}
          ftti={user.ftti}
        />
      ))}
    </div>
  );
}
