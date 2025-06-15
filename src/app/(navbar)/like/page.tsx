import LikeCard from "@/components/like/LikeCard";

const dummy = [
  {
    id: 1,
    imageUrl:
      "https://cdn.pixabay.com/photo/2019/09/16/20/21/cat-cat-4481997_640.jpg",
    name: "김철수",
    age: 24,
    address: "서울시 강남구",
    goal: "3년 안에 10억 모으기",
    ftti: "적극투자형",
  },
  {
    id: 2,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/06/03/18/01/urban-fashion-9639853_640.jpg",
    name: "이영희",
    age: 29,
    address: "부산시 해운대구",
    goal: "5년 안에 자가 마련하기",
    ftti: "안정추구형",
  },
  {
    id: 3,
    imageUrl:
      "https://cdn.pixabay.com/photo/2022/03/24/15/46/woman-7089304_640.jpg",
    name: "박지민",
    age: 31,
    address: "대전시 서구",
    goal: "40살까지 경제적 자유 달성",
    ftti: "위험중립형",
  },
  {
    id: 4,
    imageUrl:
      "https://cdn.pixabay.com/photo/2024/09/19/14/44/cat-9059025_640.jpg",
    name: "최준호",
    age: 27,
    address: "인천시 연수구",
    goal: "30살까지 창업자금 5억 만들기",
    ftti: "적극투자형",
  },
  {
    id: 5,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/05/21/15/34/snow-mountain-9614087_640.jpg",
    name: "정다은",
    age: 35,
    address: "서울시 마포구",
    goal: "은퇴 후 월세 수입 만들기",
    ftti: "안정형",
  },
  {
    id: 6,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/05/14/16/21/city-9599967_640.jpg",
    name: "한서준",
    age: 22,
    address: "경기도 수원시",
    goal: "10년 안에 세계 여행하기",
    ftti: "적극투자형",
  },
  {
    id: 7,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/05/12/14/26/white-cat-9595396_640.jpg",
    name: "윤지후",
    age: 30,
    address: "대구시 수성구",
    goal: "내 집 마련하고 가족 여행 다니기",
    ftti: "위험중립형",
  },
  {
    id: 8,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/03/06/17/45/duck-9451249_640.jpg",
    name: "강하늘",
    age: 26,
    address: "광주시 북구",
    goal: "연 1억 수익 만들기",
    ftti: "적극투자형",
  },
  {
    id: 9,
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_640.jpg",
    name: "오유리",
    age: 33,
    address: "서울시 종로구",
    goal: "40세까지 퇴사하고 프리랜서 전향",
    ftti: "공격투자형",
  },
  {
    id: 10,
    imageUrl:
      "https://cdn.pixabay.com/photo/2025/04/14/16/31/animals-9533774_640.jpg",
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
