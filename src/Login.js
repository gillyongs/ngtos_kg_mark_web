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
    const nextLink = `/${api}/${to_cd}/1`; //전화번호 암호화
    navigate(nextLink);
  };

  const handlePhoneNumberChange = (e) => {
    // input창에 숫자만 입력되게 필터링 후 phoeNumber에 저장
    const formattedPhoneNumber = e.target.value.replace(/\D/g, ""); //숫자만 입력 가능
    setPhoneNumber(formattedPhoneNumber);
  };

  return (
    <>
      <div className="login-container">
        <h2>심판 로그인</h2>
        <label>
          <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} onKeyDown={(e) => e.key === "Enter" && handleLoginClick()} placeholder="(전화번호를 입력해주세요)" />
        </label>
        <button type="button" onClick={handleLoginClick}>
          로그인
        </button>
      </div>
    </>
  );
};

export default Refree;
