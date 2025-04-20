// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import MatchSchedule from "./MatchSchedule"; //경기일정
import Player from "./Player"; //스타트리스트
import NsrResult from "./NsrResultNew"; //경기결과
import NsrResultKing from "./NsrResultNew"; //경기결과

function App() {
  return (
    <div className="App">
      <Router basename="ngtos_kg_mark_web">
        <Routes>
          <Route path="/" element={<Navigate to="/localhost/2024test/login" />} />
          <Route path="/:api/:to_cd/login" element={<Login />} />
          <Route path="/:api/:to_cd/:phone_number" element={<MatchSchedule />} />
          <Route path="/:api/:to_cd/:phone_number/:detail_class_cd/:rh_cd/:refree/:category" element={<Player />} />
          <Route path="/:api/:to_cd/:phone_number/:detail_class_cd/:rh_cd/:refree/:category/:index" element={<NsrResult />} />

          {/*
          api : 대회 운영 pc 로컬 아이피
          to_cd : 진행중인 대회 코드
          phone_number : 심판 전화번호 (암호화됨)
          detail_class_cd : 종별코드 (단체전/개인전 + 어른신부 청년부)
          rh_cd : 라운드 코드 (예선 1조 .. 결승)
          refree : 심판 직책 ( 1 = 심사위원장 / 2,3 = 기술 / 4,5 = 예술 / 6,7 = 완성도 채점 위원) 
          category: 채점 분야 (1 = 기술성 / 2 = 예술성 / 3 = 완성도)
          index : 스타트리스트 번호 (해당 경기의 n번째 참가 선수 or 팀)
           */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
