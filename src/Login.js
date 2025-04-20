// Refree.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Login.css";
import { encryptText } from "./util/encryptionUtils"; // 심판 전화번호 암호화
import { useSetRecoilState } from "recoil";
import { refreeNameState } from "./util/recoild";
import { useNavigate } from "react-router-dom";

const Refree = () => {
  const { api, to_cd } = useParams(); // 쿼리 요청을 보낼 대회 운영 pc 아이피와 대회 pk를 주소창 url에서 파라미터로 받아온다.
  const [phoneNumber, setPhoneNumber] = useState(""); // input창에 입력된 phoneNumber를 state로 관리
  const setRefreeName = useSetRecoilState(refreeNameState); // 심판명을 recoil에 저장하여 전역변수처럼 사용]
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // 로그인버튼 클릭시 db 조회
    setRefreeName("김한수"); // 심판명 저장
    let nextLink;
    if (phoneNumber === "0") {
      nextLink = `/${api}/${to_cd}/0`;
    } else {
      nextLink = `/${api}/${to_cd}/1`;
    }

    navigate(nextLink);
  };

  const handlePhoneNumberChange = (e) => {
    // input창에 숫자만 입력되게 필터링 후 phoeNumber에 저장
    const formattedPhoneNumber = e.target.value.replace(/\D/g, ""); //숫자만 입력 가능
    setPhoneNumber(formattedPhoneNumber);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">국학기공 심판 로그인</h2>
        <label htmlFor="phone">전화번호</label>
        <input type="tel" id="phone" value={phoneNumber} onChange={handlePhoneNumberChange} onKeyDown={(e) => e.key === "Enter" && handleLoginClick()} placeholder="01012345678" />
        <button type="button" onClick={handleLoginClick}>
          로그인
        </button>
        0 입력시 심사위원장 화면 <br></br> 그 외 입력시 일반 심사위원 화면
      </div>
    </div>
  );
};

export default Refree;
