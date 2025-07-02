# TongHana - 하나된 금융, 이어지는 인연
![image](https://github.com/user-attachments/assets/3639ebbf-fed8-4cea-bce9-85265e7f19d0)
<br><br>

## ✨ Intro
‘통하나’는 MZ세대를 위한 금융 기반 소셜 매칭 서비스입니다.  

연애와 자산관리를 결합해 비슷한 소비·투자 성향을 가진 또래와 매칭하고, 자연스럽게 금융에 관심을 가질 수 있도록 돕습니다.  
연애를 핑계로 자산관리에 스며들게 하여, 어렵고 딱딱한 금융을 쉽고 재미있게 시작하는 새로운 방식을 제안합니다.
<br><br>

## 📝 기능 설명
### 🔑 회원가입, 로그인, 인증

- **회원가입**: 이메일, 비밀번호, 닉네임, 생년월일, 성별, 지역 정보 입력
- **로그인**: JWT + HttpOnly 쿠키 기반 인증, 자동 리다이렉트 처리
- **미들웨어**: 페이지별 접근 권한 관리, 보안 헤더 적용

### 👨 사용자 정보 설정

- **프로필 설정**: 프로필 이미지, 직업, 목표 설정, 실물자산 정보
- **페어링북**: 데이트 예산, 선호 도시, 이상적 소득 범위 등 취향 정보
- **FTTI 설문**: 8문항 투자 성향 테스트 (안정형~공격투자형)
- **결과 페이지**: 투자 성향 결과 및 상대방 선호 유형 선택

### 🏦 금융 상품 정보

- **하나은행 상품 연동**: 정기예금, 적금, 펀드 등 실제 금융상품 정보
- **상품 퀴즈**: 일일 금융상품 퀴즈 (정답 시 매칭 카드 5장 추가 보상)
- **광고 카드**: 랜덤 금융상품 광고 카드 표시

### 🫂 매칭 시스템

- **유사도 기반 추천**: Weaviate 벡터 DB를 활용한 투자 성향 매칭
- **상호 호감도**: 현재 투자 성향과 선호 투자 성향의 상호 유사도 계산
- **일일 추천**: 로그인 시 10장 + 배지 개수만큼 추가 카드 제공 + 퀴즈 맞출 경우 추가 5장 제공

### 💬 채팅 시스템

- **실시간 채팅**: Socket.IO 기반 1:1 실시간 메시지 전송
- **채팅방 관리**: 채팅방 생성, 입장, 나가기 기능
- **자산 공유**: 채팅방에서 상호 동의 시 자산 정보 공개
- **메시지 필터링**: 금칙어 필터링 시스템
- **포트폴리오 비교**: 상대방과 나의 포트폴리오 비교 UI 제공

### 💖 좋아요 시스템

- **좋아요 전송**: 상대방에게 좋아요 보내기
- **좋아요 수신**: 받은 좋아요 목록 확인
- **매칭 처리**: 좋아요 수락/거절 기능

### 🏅 배지 시스템

- **성실러**: 하나은행 예금/적금 만기 시
- **하나러**: 하나은행 정기예금/적금 가입
- **절약러**: 최근 3개월 소득 대비 소비 비율 60% 이하
- **분산투자러**: 하나은행 투자 상품 가입 시
- **보상 시스템**: 배지 개수에 따른 매칭 카드 추가 제공

### 👨 프로필 화면

- **상세 프로필**: 기본 정보, 투자 성향, 목표 설정
- **자산 현황**: 금융상품 포트폴리오, 실물자산 정보
- **소비 패턴**: 지난달 소비 내역 비율 차트
- **페어링북**: 데이트 취향, 선호 도시 등 상세 정보

  <table width="100%">
  <tr>
    <th align="center">페이지명</th>
    <th align="center">동작 화면</th>
  </tr>
  <tr>
    <td align="center">회원가입/로그인</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/95b7eb3b-70c4-4af2-b04c-d39aa2fe39a8" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">홈화면</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8842c6a5-0c15-4d3e-99cc-3a131c513879" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">퀴즈</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/bb14ca94-f1cb-4b67-90ab-6a7f2b16a0b5" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">받은 좋아요</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d737f35d-9a02-408e-b6fa-8f8cca11d343" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">채팅_포트폴리오비교</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/70c53094-469a-40d8-a0db-fab8d746ebb1" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">채팅_자산공유</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8c696e0f-4410-4299-89f8-1378d8998dc5" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">채팅_금지어_나가기</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1ef7d245-849f-4aac-b121-eee28f198061" width="300"/>
    </td>
  </tr>
  <tr>
    <td align="center">마이페이지</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/351d2c11-96fb-442a-9178-403c94d3dd58" width="300"/>
    </td>
  </tr>
</table>


<br><br>

## 🛠️ Tech Stack

| 구분 | 내용 |
| :-- | :-- |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, MUI |
| **Backend** | Next.js API Routes, Prisma ORM, MySQL, Weaviate 벡터 데이터베이스 |
| **Chat** | Socket.IO, Express |
| **인증** | JWT, bcrypt, Next.js middleware |
| **협업** | Notion, Slack, StoryBook, Swagger |
| **스토리지** | AWS S3 (이미지 업로드) |
| **상태관리** | Zustand, Tanstack Query |

<br><br>

## 🛠 System Architecture
![image](https://github.com/user-attachments/assets/c0c50b7e-1f1a-4fd1-a9b2-b5e471987ea7)

<br><br>

## 🗂 ERD
![image](https://github.com/user-attachments/assets/f2b09222-fa85-4fee-8957-7e0708d3f6ef)

<br><br>

## 🧑‍💻 Developers
### Front-End
<table width="100%">
  <tr>
    <th width="25%">김대현</th>
    <th width="25%">박승희</th>
    <th width="25%">박지환</th>
    <th width="25%">송유림</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/15e57d2e-b780-4c92-8496-bcf00f54f93b" width="180"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/28669a5c-c7a1-4bad-8805-13aec6624e90" width="180"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/0a443363-1775-41e8-81fb-3543ec0dc9ef" width="180"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ae4ad215-8465-42d2-8060-4b9da760e5ea" width="180"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/daehyun03">@daehyun03</a>
    </td>
    <td align="center">
      <a href="https://github.com/jhpark0888">@jhpark0888</a>
    </td>
    <td align="center">
      <a href="https://github.com/seunghui-park">@seunghui-park</a>
    </td>
    <td align="center">
      <a href="https://github.com/youlimsongs">@youlimsongs</a>
    </td>
  </tr>
  <tr>
    <td>
      - 퀴즈 페이지 구현<br/>
      - 금융 상품설명서 설명 페이지 구현
    </td>
    <td>
      - UI/UX 디자인, 일러스트 작업<br/>
      - 공통 컴포넌트, 유틸 함수 제작<br/>
      - 인트로 페이지 구현<br/>
      - 프로필 등록 페이지 구현<br/>
      - 페어링 페이지 구현<br/>
      - FTTI (체질)분류 페이지 구현<br/>
      - FTTI 결과 페이지 구현<br/>
      - 내 정보 수정하기 페이지 구현
    </td>
    <td>
      - UI/UX 디자인<br/>
      - 금융 컴포넌트 제작<br/>
      - 로그인, 회원가입 페이지 구현<br/>
      - 셋업 페이지 및 관련 기능 구현<br/>
      - 받은 좋아요 페이지 구현<br/>
      - 뱃지 기능 구현
    </td>
    <td>
      - UI/UX 디자인<br/>
      - 공통 컴포넌트 제작<br/>
      - 홈페이지 구현<br/>
      - 이메일페이지 구현<br/>
      - 카드 상세페이지 구현<br/>
      - 자산 데이터 시각화<br/>
      - 로그인/회원가입 구현
    </td>
  </tr>
</table>



### Back-End
<table width="100%">
  <tr>
    <th width="25%">김대현</th>
    <th width="25%">김유림</th>
    <th width="25%">김지민</th>
    <th width="25%">정재희</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/15e57d2e-b780-4c92-8496-bcf00f54f93b" width="160"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3ce06ab6-dffe-481e-b9a6-fd29a8252db6" width="160"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e7957b6b-5a74-4558-8a23-9a25073c6c73" width="160"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/4b512024-2e68-4853-86b5-97fd10356a08" width="160"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/daehyun03">@daehyun03</a>
    </td>
    <td align="center">
      <a href="https://github.com/rladbflaz">@rladbflaz</a>
    </td>
    <td align="center">
      <a href="https://github.com/zzimnii">@zzimnii</a>
    </td>
    <td align="center">
      <a href="https://github.com/jaehejun">@jaehejun</a>
    </td>
  </tr>
  <tr>
    <td>
      - ERD 설계<br/>
      - API 설계<br/>
      - 유저 더미데이터 생성<br/>
      - Webview DB 설계<br/>
      - 매칭 시스템 구현<br/>
      - 테스트 코드 작성
    </td>
    <td>
      - ERD 설계 & API 명세<br/>
      - 프로필, FTTI 설문, 페어링 답변 등록/수정/조회 API 구현<br/>
      - 매칭카드 리스트 조회/상세보기/삭제 API 구현<br/>
      - 로그아웃/회원 탈퇴 API 구현<br/>
      - 좋아요 전송/수락/거절/조회 API 구현<br/>
      - 테스트 코드 작성<br/>
    </td>
    <td>
      - ERD 설계<br/>
      - API 설계<br/>
      - 회원가입/로그인 API<br/>
      - 실시간 Socket.io 통신<br/>
      - 자산 공개 요청/수락/거절 API 구현<br/>
      - AWS 인프라 구축<br/>
      - DB Master-Replica 적용<br/>
      - CI/CD 파이프라인 구축 및 배포 자동화
    </td>
    <td>
      - ERD 설계<br/>
      - API 설계<br/>
      - 유저 데이터 생성<br/>
      - 국제표준/특허 API<br/>
      - 테스트코드 작성
    </td>
  </tr>
</table>


