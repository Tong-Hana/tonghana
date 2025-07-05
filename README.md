# TongHana - 하나된 금융, 이어지는 인연  
### 🚀 배포 링크 : [‘통하나’ 바로가기](https://tonghana.site/)

‘통하나’는 MZ세대를 위한 금융 기반 소셜 매칭 서비스입니다.  
연애와 자산관리를 결합해 **비슷한 소비·투자 성향을 가진 또래와 매칭**하고, 자연스럽게 금융에 관심을 가질 수 있도록 돕습니다.  
연애를 핑계로 자산관리에 스며들게 하여, 어렵고 딱딱한 금융을 **재미있고 감성적인 경험**으로 전환합니다.

<details open>
  <summary><strong>&nbsp;📖&nbsp;목차</strong></summary>
  
  1. &nbsp;&nbsp;[📝 기능 설명](#-기능-설명)  
  2. &nbsp;&nbsp;[📸 시연 이미지](#-시연-이미지)  
  3. &nbsp;&nbsp;[🚀 성능 개선 및 보안](#-성능-개선-및-보안)  
  4. &nbsp;&nbsp;[🛠 Tech Stack](#-tech-stack)  
  5. &nbsp;&nbsp;[⚙️ System Architecture](#-system-architecture)  
  6. &nbsp;&nbsp;[🧑‍💻 Developers](#-developers)
     
</details>

<br/>

## 📝 기능 설명

### 🔑 회원가입, 로그인, 인증
- **회원가입**: 이메일, 비밀번호, 닉네임, 생년월일, 성별, 지역 정보 입력  
- **로그인**: JWT + HttpOnly 쿠키 기반 인증, 자동 리다이렉트 처리  
- **미들웨어**: 페이지별 접근 권한 관리, 보안 헤더 적용  

### 👨 사용자 정보 설정
- **프로필 설정**: 프로필 이미지, 직업, 목표 설정, 실물자산 정보 입력  
- **페어링북**: 데이트 예산, 선호 도시, 이상적 소득 범위 등 취향 정보 설정  
- **FTTI 설문**: 8문항 투자 성향 테스트 (안정형/안정추구형/위험중립형/적극투자형/공격투자형)  
- **결과 페이지**: 나의 투자 성향 결과 + 선호 상대 유형 설정  

### 🏦 금융 상품 정보
- **하나은행 상품 연동**: 정기예금, 적금, 펀드 등 실제 금융상품 정보 제공  
- **상품 퀴즈**: 일일 금융상품 퀴즈 (정답 시 매칭 카드 5장 추가 보상)  
- **광고 카드**: 랜덤 금융상품 광고 카드 표시  

### 🫂 매칭 시스템
- **유사도 기반 추천**: Weaviate 벡터 DB 기반 투자 성향 매칭  
- **상호 호감도 계산**: 나의 성향과 상대방 선호 유형 간 유사도 비교  
- **일일 추천 시스템**: 10장 + 배지 개수만큼 추가 카드 제공 + 퀴즈 보상  

### 💬 채팅 시스템
- **실시간 채팅**: Socket.IO 기반 1:1 실시간 메시지 전송  
- **자산 공유**: 채팅방 내 상호 동의 시 포트폴리오 정보 공유  
- **금칙어 필터링**: 금전 요구/욕설 등 금지어 설정
- **포트폴리오 간편비교 UI**: 나와 상대의 투자 포트폴리오 비교 기능 제공  

### 💖 좋아요 시스템
- **좋아요 보내기**: 상대방에게 호감 표현  
- **좋아요 받기**: 받은 좋아요 목록 확인  
- **매칭 처리**: 좋아요 수락/거절 → 매칭 여부 결정  

### 🏅 배지 시스템
- **하나러**: 하나은행 정기예금/적금 가입 시
- **성실러**: 하나은행 예금/적금 만기 시
- **분산투자러**: 하나은행에서 판매하는 예금/적금을 제외한 투자 상품 가입 시
- **절약러**: 최근 3개월 동안 소득 대비 소비 비율이 60% 이하

## 📸 시연 이미지
### 📹 ['통하나 시연영상'](https://youtu.be/9GARgnYUKrY?si=ugC8i10KO8Lb586g)
<table width="100%">
  <tr>
    <th align="center">페이지명</th>
    <th align="center">동작 화면</th>
    <th align="center">페이지명</th>
    <th align="center">동작 화면</th>
  </tr>
  <tr>
    <td align="center">회원가입/로그인</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/95b7eb3b-70c4-4af2-b04c-d39aa2fe39a8" width="300"/>
    </td>
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
    <td align="center">마이페이지</td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/351d2c11-96fb-442a-9178-403c94d3dd58" width="300"/>
    </td>
  </tr>
</table>

## 🚀 성능 개선 및 보안
<details>
  <summary>성능 개선</summary>
  <br>
  <img src="https://github.com/user-attachments/assets/79ca6192-7ef7-4646-8767-06ed7b853574" alt="성능 테스트 결과" width="80%"/>
</details>

- DB를 Master와 Replica로 분리해 다중화 진행  
- 채팅, 매칭 등 읽기 부하가 높은 기능에 Replica DB 사용  
- 부하 테스트 도구 k6 결과, **평균 응답속도 20%**, **중앙값 응답속도 32%** 개선 확인  

<details>
  <summary>보안</summary>
  <br>
  <img src="https://github.com/user-attachments/assets/0fb5e1d4-6338-48ef-889d-e7b84a8cc94f" alt="다층 보안 구조" width="50%"/>
</details>

- 클라이언트 요청은 AWS WAF, ALB, Middleware를 거쳐 애플리케이션에 도달
- **WAF**: DDoS 방어, 악성 IP 차단(IP Reputation), Geo-blocking
- **ALB**: HTTPS 처리
- **미들웨어**: 1분에 500회 요청 속도 제한, CSRF 보호 수행

## 🛠 Tech Stack

| 구분 | 내용 |
| :-- | :-- |
| **Frontend**   | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white) |
| **Backend**    | ![Next.js API](https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Weaviate](https://img.shields.io/badge/Weaviate-FFD700?style=for-the-badge&logo=databricks&logoColor=black) |
| **Chat**       | ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) |
| **인증**       | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![bcrypt](https://img.shields.io/badge/bcrypt-563D7C?style=for-the-badge) ![Next.js Middleware](https://img.shields.io/badge/Next.js_Middleware-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **데이터베이스**   | ![AWS RDS](https://img.shields.io/badge/AWS_RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| **스토리지**   | ![AWS S3](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white) |
| **상태관리**   | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zod&logoColor=white) ![Tanstack Query](https://img.shields.io/badge/Tanstack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) |
| **Deployment** | ![EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) |
| **협업**       | ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white) ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) ![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) |


## 🛠 System Architecture
![Group 133](https://github.com/user-attachments/assets/7ff78762-5714-4b09-8617-6583d709dfa5)

## 🧑‍💻 Developers
<table width="100%">
  <tr>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/ae4ad215-8465-42d2-8060-4b9da760e5ea" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/28669a5c-c7a1-4bad-8805-13aec6624e90" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/0a443363-1775-41e8-81fb-3543ec0dc9ef" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/15e57d2e-b780-4c92-8496-bcf00f54f93b" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/3ce06ab6-dffe-481e-b9a6-fd29a8252db6" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/e7957b6b-5a74-4558-8a23-9a25073c6c73" width="160"/>
    </td>
    <td width="14.28%" align="center">
      <img src="https://github.com/user-attachments/assets/4b512024-2e68-4853-86b5-97fd10356a08" width="160"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      송유림 (팀장)<br/>
      <a href="https://github.com/youlimsongs">@youlimsongs</a>
    </td>
    <td align="center">
      박승희<br/>
      <a href="https://github.com/seunghui-park">@seunghui-park</a>
    </td>
    <td align="center">
      박지환<br/>
      <a href="https://github.com/jhpark0888">@jhpark0888</a>
    </td>
    <td align="center">
      김대현<br/>
      <a href="https://github.com/daehyun03">@daehyun03</a>
    </td>
    <td align="center">
      김유림<br/>
      <a href="https://github.com/rladbflaz">@rladbflaz</a>
    </td>
    <td align="center">
      김지민<br/>
      <a href="https://github.com/zzimnii">@zzimnii</a>
    </td>
    <td align="center">
      정재희<br/>
      <a href="https://github.com/jaehejun">@jaehejun</a>
    </td>
  </tr>
  <tr>
    <td align="center">Frontend</td>
    <td align="center">Frontend</td>
    <td align="center">Frontend</td>
    <td align="center">Full Stack</td>
    <td align="center">Backend</td>
    <td align="center">Backend</td>
    <td align="center">Backend</td>
  </tr>
</table>


---
