// Refree.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Login.css";
import { encryptText } from "./util/encryptionUtils"; // 심판 전화번호 암호화
import { useSetRecoilState } from "recoil";
import { refreeNameState } from "./util/recoild";

const Refree = () => {
  const { api, to_cd } = useParams(); // 쿼리 요청을 보낼 대회 운영 pc 아이피와 대회 pk를 주소창 url에서 파라미터로 받아온다.
  const [phoneNumber, setPhoneNumber] = useState(""); // input창에 입력된 phoneNumber를 state로 관리
  const setRefreeName = useSetRecoilState(refreeNameState); // 심판명을 recoil에 저장하여 전역변수처럼 사용

  const fetchRefreeData = async () => {
    try {
      const checkJidResponse = await fetch(
        `http://${api}:4000/check-jid?phoneNumber=${phoneNumber}&to_cd=${to_cd}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // input에 입력한 전화번호와 같은 심판이 tour_refree에 존재하는지 체크
      // 없으면 jidMatch가 false, 여러명이면 duplicate, 1명이면 true

      const checkJidData = await checkJidResponse.json();
      if (checkJidData.jidMatch === "duplicate") {
        alert("같은 번호의 심판이 여러명 존재합니다.");
      } else if (!checkJidData.jidMatch) {
        alert("해당 경기에 심판으로 등록되어 있지 않습니다");
      } else {
        // 1명이면 통과
        setRefreeName(checkJidData.refreeNm); // 심판명 저장
        const nextLink = `/${api}/${to_cd}/${encryptText(phoneNumber)}`; //전화번호 암호화
        window.location.href = nextLink; // 경기 일정 화면으로 넘어감
      }
    } catch (error) {
      console.error("Error fetching referee data or checking JID:", error);
    }
  };

  const handleLoginClick = () => {
    // 로그인버튼 클릭시 db 조회
    fetchRefreeData();
  };

  const handlePhoneNumberChange = (e) => {
    // input창에 숫자만 입력되게 필터링 후 phoeNumber에 저장
    const formattedPhoneNumber = e.target.value.replace(/\D/g, ""); //숫자만 입력 가능
    setPhoneNumber(formattedPhoneNumber);
  };

  return (
    <div className="login-container">
      <h2>심판 로그인</h2>
      <label>
        비밀번호
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyDown={(e) => e.key === "Enter" && handleLoginClick()}
          placeholder="(숫자만 입력 가능합니다)"
        />
      </label>
      <button type="button" onClick={handleLoginClick}>
        로그인
      </button>
    </div>
  );
};

export default Refree;
