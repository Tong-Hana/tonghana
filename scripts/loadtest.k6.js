import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 50, // 가상 사용자 50명
  duration: "30s", // 30초 동안 테스트
};

const BASE_URL = "http://localhost:3000";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwNCwiZW1haWwiOiJ0ZXN0MUBuYXZlci5jb20iLCJpYXQiOjE3NTA4MTM2MTIsImV4cCI6MTc1MDkwMDAxMn0.tHyViiCljDZOHPw2v747CbO0OgBa-QwIPOd9Dn5PUDw";

export default function () {
  const headers = {
    headers: {
      Cookie: `accessToken=${TOKEN}`,
      Accept: "application/json",
    },
  };

  http.get(`${BASE_URL}/api/profiles/me`, headers);
  // http.get(`${BASE_URL}/api/match-cards/user-summary/me`, headers);
  sleep(1);
}
